-- Migration: PBA Dual Authentication Support
-- Extends crypto_accounts to track backup confirmation and linking timestamps,
-- and ensures indexes for fast lookups by profile_id and account_id.

DO $$
BEGIN
  -- Add backup_confirmed column to crypto_accounts
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'crypto_accounts' AND column_name = 'backup_confirmed'
  ) THEN
    ALTER TABLE public.crypto_accounts ADD COLUMN backup_confirmed boolean NOT NULL DEFAULT false;
  END IF;

  -- Add linked_at column to crypto_accounts
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'crypto_accounts' AND column_name = 'linked_at'
  ) THEN
    ALTER TABLE public.crypto_accounts ADD COLUMN linked_at timestamptz NOT NULL DEFAULT now();
  END IF;
END $$;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_crypto_accounts_profile_id
  ON public.crypto_accounts (profile_id);

CREATE INDEX IF NOT EXISTS idx_crypto_challenges_expires_at
  ON public.crypto_challenges (expires_at);

-- Backfill: For existing profiles with password_hash starting with 'CRYPTO:',
-- insert them into crypto_accounts if not already present.
INSERT INTO public.crypto_accounts (account_id, public_key, algorithm, profile_id, status, backup_confirmed)
SELECT
  student_id,
  SPLIT_PART(password_hash, ':', 3) AS public_key,
  COALESCE(NULLIF(SPLIT_PART(password_hash, ':', 2), ''), 'ECDSA-P256') AS algorithm,
  id AS profile_id,
  'active' AS status,
  true AS backup_confirmed
FROM public.profiles
WHERE password_hash LIKE 'CRYPTO:%'
  AND student_id IS NOT NULL
  AND student_id LIKE 'pba_acc_%'
  AND NOT EXISTS (
    SELECT 1 FROM public.crypto_accounts ca WHERE ca.profile_id = profiles.id
  )
ON CONFLICT (account_id) DO NOTHING;
