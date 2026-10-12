-- Increment 04 — Risks & Opportunities. Prepared only; do not apply remotely without explicit approval.
DO $$ BEGIN CREATE TYPE public.risk_kind AS ENUM ('RISK','OPPORTUNITY'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.risk_status AS ENUM ('IDENTIFIED','ASSESSED','TREATMENT_PLANNED','IN_TREATMENT','MONITORED','CLOSED','ACCEPTED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.risk_level AS ENUM ('LOW','MEDIUM','HIGH','CRITICAL'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.risk_assessment_type AS ENUM ('INITIAL','RESIDUAL'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
CREATE TABLE IF NOT EXISTS public.risks (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL REFERENCES public.organizations(id), process_id uuid REFERENCES public.processes(id), kind public.risk_kind NOT NULL DEFAULT 'RISK', code text NOT NULL, title text NOT NULL, category text NOT NULL, source text NOT NULL, description text NOT NULL, consequences text, causes text, existing_controls text, treatment_plan text, owner_reference text, treatment_due_on date, status public.risk_status NOT NULL DEFAULT 'IDENTIFIED', initial_probability integer NOT NULL CHECK (initial_probability BETWEEN 1 AND 5), initial_impact integer NOT NULL CHECK (initial_impact BETWEEN 1 AND 5), initial_score integer NOT NULL CHECK (initial_score = initial_probability * initial_impact), initial_level public.risk_level NOT NULL, residual_probability integer CHECK (residual_probability BETWEEN 1 AND 5), residual_impact integer CHECK (residual_impact BETWEEN 1 AND 5), residual_score integer CHECK (residual_score = residual_probability * residual_impact OR residual_score IS NULL), residual_level public.risk_level, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), deleted_at timestamptz
);
CREATE UNIQUE INDEX IF NOT EXISTS risks_org_code_unique ON public.risks(organization_id, code);
CREATE INDEX IF NOT EXISTS risks_status_idx ON public.risks(status);
CREATE INDEX IF NOT EXISTS risks_process_idx ON public.risks(process_id);
CREATE INDEX IF NOT EXISTS risks_initial_level_idx ON public.risks(initial_level);
CREATE TABLE IF NOT EXISTS public.risk_assessments (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), risk_id uuid NOT NULL REFERENCES public.risks(id), assessment_type public.risk_assessment_type NOT NULL, probability integer NOT NULL CHECK (probability BETWEEN 1 AND 5), impact integer NOT NULL CHECK (impact BETWEEN 1 AND 5), score integer NOT NULL CHECK (score = probability * impact), level public.risk_level NOT NULL, rationale text, assessed_at timestamptz NOT NULL DEFAULT now(), origin public.event_origin NOT NULL DEFAULT 'UNVERIFIED_OPERATOR');
CREATE INDEX IF NOT EXISTS risk_assessments_risk_idx ON public.risk_assessments(risk_id);
CREATE INDEX IF NOT EXISTS risk_assessments_date_idx ON public.risk_assessments(assessed_at);
CREATE TABLE IF NOT EXISTS public.risk_requirements (risk_id uuid NOT NULL REFERENCES public.risks(id), requirement_id uuid NOT NULL REFERENCES public.requirements(id), CONSTRAINT risk_requirement_unique UNIQUE(risk_id, requirement_id));
CREATE TABLE IF NOT EXISTS public.risk_documents (risk_id uuid NOT NULL REFERENCES public.risks(id), document_id uuid NOT NULL REFERENCES public.documents(id), CONSTRAINT risk_document_unique UNIQUE(risk_id, document_id));
ALTER TABLE public.risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_documents ENABLE ROW LEVEL SECURITY;
-- RLS policies are intentionally not created until the authenticated tenancy model is approved.
