CREATE TABLE IF NOT EXISTS public.dca_wallet_sync_locks (
  lock_name text PRIMARY KEY,
  lock_token uuid NOT NULL,
  locked_until timestamptz NOT NULL
);

ALTER TABLE public.dca_wallet_sync_locks ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.dca_wallet_sync_locks FROM PUBLIC, anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.try_acquire_dca_wallet_sync_lock(
  p_lock_token uuid,
  p_lock_ttl_seconds integer
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  affected_rows integer;
BEGIN
  IF p_lock_ttl_seconds < 60 OR p_lock_ttl_seconds > 1800 THEN
    RAISE EXCEPTION 'Invalid lock lease duration.';
  END IF;

  INSERT INTO public.dca_wallet_sync_locks (lock_name, lock_token, locked_until)
  VALUES (
    'dca-wallet-sync',
    p_lock_token,
    pg_catalog.clock_timestamp() + pg_catalog.make_interval(secs => p_lock_ttl_seconds)
  )
  ON CONFLICT (lock_name) DO UPDATE
  SET lock_token = EXCLUDED.lock_token,
      locked_until = EXCLUDED.locked_until
  WHERE public.dca_wallet_sync_locks.locked_until <= pg_catalog.clock_timestamp();

  GET DIAGNOSTICS affected_rows = ROW_COUNT;
  RETURN affected_rows = 1;
END;
$$;

CREATE OR REPLACE FUNCTION public.release_dca_wallet_sync_lock(p_lock_token uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  affected_rows integer;
BEGIN
  DELETE FROM public.dca_wallet_sync_locks
  WHERE lock_name = 'dca-wallet-sync'
    AND lock_token = p_lock_token;

  GET DIAGNOSTICS affected_rows = ROW_COUNT;
  RETURN affected_rows = 1;
END;
$$;

REVOKE ALL ON FUNCTION public.try_acquire_dca_wallet_sync_lock(uuid, integer)
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.release_dca_wallet_sync_lock(uuid)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.try_acquire_dca_wallet_sync_lock(uuid, integer)
  TO service_role;
GRANT EXECUTE ON FUNCTION public.release_dca_wallet_sync_lock(uuid)
  TO service_role;
