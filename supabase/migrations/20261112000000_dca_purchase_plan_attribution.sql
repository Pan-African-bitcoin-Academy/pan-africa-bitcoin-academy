ALTER TABLE public.dca_purchases
  ADD COLUMN IF NOT EXISTS plan_id uuid
  REFERENCES public.dca_plans(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_dca_purchases_user_plan_date
  ON public.dca_purchases (user_id, plan_id, purchase_date DESC);
