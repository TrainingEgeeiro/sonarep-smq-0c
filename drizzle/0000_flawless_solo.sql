CREATE TYPE "public"."action_status" AS ENUM('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'EFFECTIVENESS_VERIFIED', 'CLOSED');--> statement-breakpoint
CREATE TYPE "public"."audit_status" AS ENUM('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."availability" AS ENUM('REFERENCE_ONLY', 'AVAILABLE', 'UNAVAILABLE');--> statement-breakpoint
CREATE TYPE "public"."compliance_status" AS ENUM('NOT_ASSESSED', 'COMPLIANT', 'PARTIALLY_COMPLIANT', 'NON_COMPLIANT', 'NOT_APPLICABLE');--> statement-breakpoint
CREATE TYPE "public"."document_status" AS ENUM('DRAFT', 'IN_REVIEW', 'APPROVED', 'PUBLISHED', 'OBSOLETE');--> statement-breakpoint
CREATE TYPE "public"."nc_status" AS ENUM('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'ARCHIVED');--> statement-breakpoint
CREATE TYPE "public"."requirement_status" AS ENUM('ACTIVE', 'ARCHIVED');--> statement-breakpoint
CREATE TYPE "public"."severity" AS ENUM('MINOR', 'MAJOR', 'CRITICAL');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('QMS_ADMIN', 'QUALITY_MANAGER', 'COMPLIANCE_OWNER', 'PRODUCTION_MANAGER', 'ASSESSOR', 'ACTION_OWNER', 'INTERNAL_AUDITOR', 'EXECUTIVE_VIEWER', 'IT_SUPPORT');--> statement-breakpoint
CREATE TABLE "app_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"external_subject" text,
	"display_name" text NOT NULL,
	"email" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"event_type" varchar(100) NOT NULL,
	"entity_type" varchar(100) NOT NULL,
	"entity_id" uuid,
	"actor_id" uuid,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL,
	"result" varchar(32) NOT NULL,
	"summary" text NOT NULL,
	"correlation_id" text,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "audit_findings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"audit_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"evidence_reference" text,
	"nonconformity_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "audit_programs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"reference" varchar(64) NOT NULL,
	"title" text NOT NULL,
	"year" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "audits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"program_id" uuid,
	"reference" varchar(64) NOT NULL,
	"scope" text NOT NULL,
	"criteria" text NOT NULL,
	"auditor_id" uuid,
	"planned_start" date,
	"planned_end" date,
	"actual_start" date,
	"actual_end" date,
	"status" "audit_status" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "compliance_evaluations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"requirement_id" uuid NOT NULL,
	"scope" text NOT NULL,
	"evaluated_on" date NOT NULL,
	"assessor_id" uuid,
	"status" "compliance_status" NOT NULL,
	"justification" text NOT NULL,
	"evidence_reference" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "controlled_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"reference" varchar(64) NOT NULL,
	"title" text NOT NULL,
	"type" text NOT NULL,
	"owner_id" uuid,
	"version" text NOT NULL,
	"status" "document_status" NOT NULL,
	"effective_date" date,
	"next_review_date" date,
	"source_reference" text,
	"previous_version_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "corrective_actions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"reference" varchar(64) NOT NULL,
	"action" text NOT NULL,
	"nonconformity_id" uuid NOT NULL,
	"owner_id" uuid,
	"due_date" date,
	"status" "action_status" NOT NULL,
	"completion_evidence_reference" text,
	"effectiveness_result" text,
	"verifier_id" uuid,
	"verified_on" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "evidence" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"reference" varchar(64) NOT NULL,
	"title" text NOT NULL,
	"type" text NOT NULL,
	"owner_id" uuid,
	"evidence_date" date,
	"origin" text NOT NULL,
	"linked_entity_type" text NOT NULL,
	"linked_entity_id" uuid,
	"external_reference" text,
	"availability" "availability" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "nonconformities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"reference" varchar(64) NOT NULL,
	"title" text NOT NULL,
	"factual_description" text NOT NULL,
	"origin" text NOT NULL,
	"severity" "severity" NOT NULL,
	"detected_on" date NOT NULL,
	"owner_id" uuid,
	"due_date" date,
	"status" "nc_status" NOT NULL,
	"requirement_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "organizations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(64) NOT NULL,
	"name" text NOT NULL,
	"is_demo" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "organizations_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "permissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(100) NOT NULL,
	"label" text NOT NULL,
	CONSTRAINT "permissions_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "requirements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"reference" varchar(64) NOT NULL,
	"source" text NOT NULL,
	"source_version" text,
	"title" text NOT NULL,
	"summary" text NOT NULL,
	"domain" text NOT NULL,
	"owner_id" uuid,
	"applicability" text NOT NULL,
	"status" "requirement_status" DEFAULT 'ACTIVE' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" "user_role" NOT NULL,
	"label" text NOT NULL,
	CONSTRAINT "roles_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "user_roles" (
	"user_id" uuid NOT NULL,
	"role_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "app_users_org_subject_idx" ON "app_users" USING btree ("organization_id","external_subject");--> statement-breakpoint
CREATE UNIQUE INDEX "documents_org_reference_idx" ON "controlled_documents" USING btree ("organization_id","reference");--> statement-breakpoint
CREATE UNIQUE INDEX "actions_org_reference_idx" ON "corrective_actions" USING btree ("organization_id","reference");--> statement-breakpoint
CREATE UNIQUE INDEX "evidence_org_reference_idx" ON "evidence" USING btree ("organization_id","reference");--> statement-breakpoint
CREATE UNIQUE INDEX "nc_org_reference_idx" ON "nonconformities" USING btree ("organization_id","reference");--> statement-breakpoint
CREATE UNIQUE INDEX "requirements_org_reference_idx" ON "requirements" USING btree ("organization_id","reference");