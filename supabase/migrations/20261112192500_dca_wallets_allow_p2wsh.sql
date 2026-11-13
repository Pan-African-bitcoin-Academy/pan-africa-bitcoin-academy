ALTER TABLE public.dca_wallets
  DROP CONSTRAINT IF EXISTS dca_wallets_format_check;

ALTER TABLE public.dca_wallets
  ADD CONSTRAINT dca_wallets_format_check
  CHECK (
    format IN (
      'p2pkh',
      'p2sh',
      'p2wpkh',
      'p2wsh',
      'p2tr',
      'bip44',
      'bip49',
      'bip84',
      'bip86',
      'descriptor',
      'unknown'
    )
  );
