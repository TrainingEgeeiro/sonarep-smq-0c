ALTER TABLE "requirements" ADD COLUMN IF NOT EXISTS "description" text;
ALTER TABLE "requirements" ADD COLUMN IF NOT EXISTS "reference_clause" text;
ALTER TABLE "processes" ADD COLUMN IF NOT EXISTS "category" text DEFAULT 'PROCESS' NOT NULL;
CREATE TABLE IF NOT EXISTS "requirement_assessments" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "requirement_id" uuid NOT NULL REFERENCES "requirements"("id"),
  "status" "assessment_status" NOT NULL,
  "justification" text,
  "scope_reference" text,
  "evaluated_at" timestamp with time zone DEFAULT now() NOT NULL,
  "origin" "event_origin" DEFAULT 'UNVERIFIED_OPERATOR' NOT NULL
);
CREATE INDEX IF NOT EXISTS "requirement_assessments_requirement_idx" ON "requirement_assessments" USING btree ("requirement_id");
CREATE INDEX IF NOT EXISTS "requirement_assessments_date_idx" ON "requirement_assessments" USING btree ("evaluated_at");
