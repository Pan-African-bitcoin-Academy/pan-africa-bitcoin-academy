-- Migration: Watch-Only Bitcoin Wallet Integration for PBA DCA Platform
-- Supports Bitcoin addresses and extended public keys (xpub/ypub/zpub).
-- Strictly watch-only: No private keys or seed phrases stored.
-- Additive migration preserving all existing DCA data.

CREATE TABLE IF NOT EXISTS public.dca_wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  label text NOT NULL CHECK (char_length(label) BETWEEN 1 AND 100),
  wallet_type text NOT NULL CHECK (wallet_type IN ('address', 'xpub', 'descriptor')),
  format text NOT NULL DEFAULT 'unknown' CHECK (format IN ('p2pkh', 'p2sh', 'p2wpkh', 'p2tr', 'bip44', 'bip49', 'bip84', 'bip86', 'descriptor', 'unknown')),
  watch_data_encrypted text NOT NULL CHECK (char_length(watch_data_encrypted) BETWEEN 10 AND 3000),
  derivation_path text DEFAULT NULL CHECK (derivation_path IS NULL OR char_length(derivation_path) <= 100),
  balance_sats bigint NOT NULL DEFAULT 0 CHECK (balance_sats >= 0),
  unconfirmed_balance_sats bigint NOT NULL DEFAULT 0,
  sync_status text NOT NULL DEFAULT 'synced' CHECK (sync_status IN ('idle', 'syncing', 'synced', 'error')),
  sync_error text DEFAULT NULL CHECK (sync_error IS NULL OR char_length(sync_error) <= 1000),
  last_synced_at timestamptz DEFAULT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_dca_wallets_user_id
  ON public.dca_wallets (user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.dca_wallet_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id uuid NOT NULL REFERENCES public.dca_wallets(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  txid text NOT NULL CHECK (char_length(txid) <= 128),
  tx_type text NOT NULL CHECK (tx_type IN ('incoming', 'outgoing')),
  amount_sats bigint NOT NULL CHECK (amount_sats >= 0),
  fee_sats bigint DEFAULT NULL,
  confirmed boolean NOT NULL DEFAULT true,
  confirmations integer NOT NULL DEFAULT 0 CHECK (confirmations >= 0),
  block_height bigint DEFAULT NULL,
  block_time timestamptz DEFAULT NULL,
  is_dca_purchase boolean NOT NULL DEFAULT false,
  linked_purchase_id uuid REFERENCES public.dca_purchases(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_wallet_txid UNIQUE (wallet_id, txid)
);

CREATE INDEX IF NOT EXISTS idx_dca_wallet_txs_user_wallet
  ON public.dca_wallet_transactions (user_id, wallet_id, block_time DESC NULLS LAST);

CREATE TABLE IF NOT EXISTS public.dca_wallet_balance_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id uuid NOT NULL REFERENCES public.dca_wallets(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  balance_sats bigint NOT NULL,
  recorded_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_dca_wallet_snapshots_user_wallet
  ON public.dca_wallet_balance_snapshots (user_id, wallet_id, recorded_at DESC);

-- Additive columns to existing dca_purchases table for double-counting avoidance
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dca_purchases' AND column_name = 'deposited_to_wallet_id'
  ) THEN
    ALTER TABLE public.dca_purchases
      ADD COLUMN deposited_to_wallet_id uuid REFERENCES public.dca_wallets(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dca_purchases' AND column_name = 'is_in_wallet'
  ) THEN
    ALTER TABLE public.dca_purchases
      ADD COLUMN is_in_wallet boolean NOT NULL DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dca_purchases' AND column_name = 'wallet_transfer_date'
  ) THEN
    ALTER TABLE public.dca_purchases
      ADD COLUMN wallet_transfer_date date DEFAULT NULL;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'dca_purchases_wallet_attribution_check'
      AND conrelid = 'public.dca_purchases'::regclass
  ) THEN
    ALTER TABLE public.dca_purchases
      ADD CONSTRAINT dca_purchases_wallet_attribution_check
      CHECK (
        NOT is_in_wallet OR
        (deposited_to_wallet_id IS NOT NULL AND wallet_transfer_date IS NOT NULL)
      );
  END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE public.dca_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dca_wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dca_wallet_balance_snapshots ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can view their own wallets" ON public.dca_wallets;
CREATE POLICY "Users can view their own wallets"
  ON public.dca_wallets FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own wallets" ON public.dca_wallets;
CREATE POLICY "Users can insert their own wallets"
  ON public.dca_wallets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own wallets" ON public.dca_wallets;
CREATE POLICY "Users can update their own wallets"
  ON public.dca_wallets FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own wallets" ON public.dca_wallets;
CREATE POLICY "Users can delete their own wallets"
  ON public.dca_wallets FOR DELETE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own wallet transactions" ON public.dca_wallet_transactions;
CREATE POLICY "Users can view their own wallet transactions"
  ON public.dca_wallet_transactions FOR SELECT
  USING (
    auth.uid() = user_id AND EXISTS (
      SELECT 1 FROM public.dca_wallets
      WHERE id = wallet_id AND user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can manage their own wallet transactions" ON public.dca_wallet_transactions;
CREATE POLICY "Users can manage their own wallet transactions"
  ON public.dca_wallet_transactions FOR ALL
  USING (
    auth.uid() = user_id AND EXISTS (
      SELECT 1 FROM public.dca_wallets
      WHERE id = wallet_id AND user_id = auth.uid()
    )
  )
  WITH CHECK (
    auth.uid() = user_id AND EXISTS (
      SELECT 1 FROM public.dca_wallets
      WHERE id = wallet_id AND user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can view their own balance snapshots" ON public.dca_wallet_balance_snapshots;
CREATE POLICY "Users can view their own balance snapshots"
  ON public.dca_wallet_balance_snapshots FOR SELECT
  USING (
    auth.uid() = user_id AND EXISTS (
      SELECT 1 FROM public.dca_wallets
      WHERE id = wallet_id AND user_id = auth.uid()
    )
  );

COMMENT ON TABLE public.dca_wallets IS
  'Watch-only Bitcoin wallets connected to student DCA profiles for read-only portfolio updates.';
COMMENT ON TABLE public.dca_wallet_transactions IS
  'On-chain transactions fetched for connected watch-only Bitcoin wallets.';
