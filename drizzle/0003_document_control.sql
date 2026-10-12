-- Increment 03 — Document Control. Prepared only; apply remotely after explicit approval.
ALTER TYPE public.document_status ADD VALUE IF NOT EXISTS 'SUBMITTED_FOR_VERIFICATION';
ALTER TYPE public.document_status ADD VALUE IF NOT EXISTS 'IN_VERIFICATION';
ALTER TYPE public.document_status ADD VALUE IF NOT EXISTS 'SUBMITTED_FOR_APPROVAL';
ALTER TYPE public.document_status ADD VALUE IF NOT EXISTS 'REPLACED';
ALTER TYPE public.document_status ADD VALUE IF NOT EXISTS 'ARCHIVED';
DO $$ BEGIN CREATE TYPE public.document_type AS ENUM ('POLICY','MANUAL','PROCEDURE','WORK_INSTRUCTION','INSTRUCTION','FORM','QUALITY_RECORD','EXTERNAL_REFERENCE','OTHER'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.document_version_status AS ENUM ('DRAFT','IN_REVIEW','APPROVED','PUBLISHED','REPLACED','OBSOLETE','ARCHIVED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS type public.document_type NOT NULL DEFAULT 'OTHER';
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS process_owner_id uuid REFERENCES public.processes(id);
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS functional_owner_reference text;
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS next_review_on date;
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS last_revised_at timestamptz;
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS archived_at timestamptz;
ALTER TABLE public.document_revisions ADD COLUMN IF NOT EXISTS status public.document_version_status NOT NULL DEFAULT 'DRAFT';
ALTER TABLE public.document_revisions ADD COLUMN IF NOT EXISTS origin public.event_origin NOT NULL DEFAULT 'UNVERIFIED_OPERATOR';
ALTER TABLE public.document_revisions ADD COLUMN IF NOT EXISTS approved_at timestamptz;
ALTER TABLE public.document_revisions ADD COLUMN IF NOT EXISTS published_at timestamptz;
CREATE INDEX IF NOT EXISTS documents_review_date_idx ON public.documents(next_review_on);
CREATE INDEX IF NOT EXISTS document_revisions_status_idx ON public.document_revisions(status);
-- Version immutability is enforced by the server workflow until authenticated DB roles/RLS are introduced.
-- No remote migration is executed by this increment.
