-- Migration: Email-Free Cryptographic Accounts for PBA DCA Platform
-- Supports browser-side asymmetric keypairs (ECDSA P-256) and challenge-response authentication.

CREATE TABLE IF NOT EXISTS public.crypto_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id text NOT NULL UNIQUE CHECK (account_id LIKE 'pba_acc_%'),
  public_key text NOT NULL,
  algorithm text NOT NULL DEFAULT 'ECDSA-P256',
  profile_id uuid UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_crypto_accounts_id
  ON public.crypto_accounts (account_id);

CREATE TABLE IF NOT EXISTS public.crypto_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id text NOT NULL,
  challenge text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL DEFAULT (now() + INTERVAL '60 seconds'),
  used boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_crypto_challenges_lookup
  ON public.crypto_challenges (challenge, account_id, used, expires_at);

-- DCA Plans & Purchases crypto account linkage
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dca_plans' AND column_name = 'crypto_account_id'
  ) THEN
    ALTER TABLE public.dca_plans ADD COLUMN crypto_account_id text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dca_purchases' AND column_name = 'crypto_account_id'
  ) THEN
    ALTER TABLE public.dca_purchases ADD COLUMN crypto_account_id text;
  END IF;
END $$;

ALTER TABLE public.crypto_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crypto_challenges ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE public.crypto_accounts IS
  'Cryptographic account identities for email-free DCA access. Does not store private keys.';
COMMENT ON TABLE public.crypto_challenges IS
  'Single-use authentication challenges with 60-second TTL for challenge-response signing.';
