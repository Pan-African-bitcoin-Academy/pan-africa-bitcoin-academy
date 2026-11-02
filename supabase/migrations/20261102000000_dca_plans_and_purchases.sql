CREATE TABLE IF NOT EXISTS public.dca_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
  contribution_amount numeric(18, 2) NOT NULL CHECK (contribution_amount > 0),
  frequency text NOT NULL CHECK (frequency IN ('daily', 'weekly', 'biweekly', 'monthly')),
  start_date date NOT NULL,
  end_date date NOT NULL,
  initial_contribution numeric(18, 2) NOT NULL DEFAULT 0 CHECK (initial_contribution >= 0),
  fee_percent numeric(6, 3) NOT NULL DEFAULT 0 CHECK (fee_percent >= 0 AND fee_percent <= 100),
  notes text NOT NULL DEFAULT '' CHECK (char_length(notes) <= 2000),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'archived')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (end_date >= start_date)
);

CREATE INDEX IF NOT EXISTS idx_dca_plans_user_status
  ON public.dca_plans (user_id, status, created_at DESC);

CREATE TABLE IF NOT EXISTS public.dca_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  purchase_date date NOT NULL,
  amount_usd numeric(18, 2) NOT NULL CHECK (amount_usd > 0),
  btc_price numeric(18, 2) NOT NULL CHECK (btc_price > 0),
  btc_received numeric(28, 12) NOT NULL CHECK (btc_received > 0),
  fees_usd numeric(18, 2) NOT NULL DEFAULT 0 CHECK (fees_usd >= 0),
  transaction_id text NOT NULL DEFAULT '' CHECK (char_length(transaction_id) <= 200),
  notes text NOT NULL DEFAULT '' CHECK (char_length(notes) <= 2000),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_dca_purchases_user_date
  ON public.dca_purchases (user_id, purchase_date DESC);

ALTER TABLE public.dca_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dca_purchases ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE public.dca_plans IS
  'Private educational DCA plans, managed through session-verified server APIs.';
COMMENT ON TABLE public.dca_purchases IS
  'Private user-entered purchase journal; records are not verified or held by PBA.';
