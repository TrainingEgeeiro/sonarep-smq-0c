ALTER TABLE "app_users" ADD CONSTRAINT "app_users_organization_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_events" ADD CONSTRAINT "audit_events_organization_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_events" ADD CONSTRAINT "audit_events_actor_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."app_users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_findings" ADD CONSTRAINT "audit_findings_audit_fk" FOREIGN KEY ("audit_id") REFERENCES "public"."audits"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_findings" ADD CONSTRAINT "audit_findings_nc_fk" FOREIGN KEY ("nonconformity_id") REFERENCES "public"."nonconformities"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_programs" ADD CONSTRAINT "audit_programs_organization_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audits" ADD CONSTRAINT "audits_organization_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audits" ADD CONSTRAINT "audits_program_fk" FOREIGN KEY ("program_id") REFERENCES "public"."audit_programs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audits" ADD CONSTRAINT "audits_auditor_fk" FOREIGN KEY ("auditor_id") REFERENCES "public"."app_users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "compliance_evaluations" ADD CONSTRAINT "evaluations_organization_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "compliance_evaluations" ADD CONSTRAINT "evaluations_requirement_fk" FOREIGN KEY ("requirement_id") REFERENCES "public"."requirements"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "compliance_evaluations" ADD CONSTRAINT "evaluations_assessor_fk" FOREIGN KEY ("assessor_id") REFERENCES "public"."app_users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "controlled_documents" ADD CONSTRAINT "documents_organization_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "controlled_documents" ADD CONSTRAINT "documents_owner_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."app_users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "controlled_documents" ADD CONSTRAINT "documents_previous_version_fk" FOREIGN KEY ("previous_version_id") REFERENCES "public"."controlled_documents"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "corrective_actions" ADD CONSTRAINT "actions_organization_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "corrective_actions" ADD CONSTRAINT "actions_nc_fk" FOREIGN KEY ("nonconformity_id") REFERENCES "public"."nonconformities"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "corrective_actions" ADD CONSTRAINT "actions_owner_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."app_users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "corrective_actions" ADD CONSTRAINT "actions_verifier_fk" FOREIGN KEY ("verifier_id") REFERENCES "public"."app_users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidence" ADD CONSTRAINT "evidence_organization_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidence" ADD CONSTRAINT "evidence_owner_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."app_users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nonconformities" ADD CONSTRAINT "nc_organization_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nonconformities" ADD CONSTRAINT "nc_owner_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."app_users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nonconformities" ADD CONSTRAINT "nc_requirement_fk" FOREIGN KEY ("requirement_id") REFERENCES "public"."requirements"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "requirements" ADD CONSTRAINT "requirements_organization_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "requirements" ADD CONSTRAINT "requirements_owner_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."app_users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_fk" FOREIGN KEY ("user_id") REFERENCES "public"."app_users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "app_users_organization_idx" ON "app_users" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "audit_events_organization_idx" ON "audit_events" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "audit_events_entity_idx" ON "audit_events" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "audit_events_actor_idx" ON "audit_events" USING btree ("actor_id");--> statement-breakpoint
CREATE INDEX "audit_findings_audit_idx" ON "audit_findings" USING btree ("audit_id");--> statement-breakpoint
CREATE INDEX "audit_findings_nc_idx" ON "audit_findings" USING btree ("nonconformity_id");--> statement-breakpoint
CREATE UNIQUE INDEX "audit_programs_org_reference_idx" ON "audit_programs" USING btree ("organization_id","reference");--> statement-breakpoint
CREATE INDEX "audit_programs_organization_idx" ON "audit_programs" USING btree ("organization_id");--> statement-breakpoint
CREATE UNIQUE INDEX "audits_org_reference_idx" ON "audits" USING btree ("organization_id","reference");--> statement-breakpoint
CREATE INDEX "audits_organization_idx" ON "audits" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "audits_program_idx" ON "audits" USING btree ("program_id");--> statement-breakpoint
CREATE INDEX "audits_auditor_idx" ON "audits" USING btree ("auditor_id");--> statement-breakpoint
CREATE INDEX "evaluations_organization_idx" ON "compliance_evaluations" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "evaluations_requirement_idx" ON "compliance_evaluations" USING btree ("requirement_id");--> statement-breakpoint
CREATE INDEX "documents_organization_idx" ON "controlled_documents" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "documents_owner_idx" ON "controlled_documents" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "actions_organization_idx" ON "corrective_actions" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "actions_nc_idx" ON "corrective_actions" USING btree ("nonconformity_id");--> statement-breakpoint
CREATE INDEX "actions_owner_idx" ON "corrective_actions" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "evidence_organization_idx" ON "evidence" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "evidence_owner_idx" ON "evidence" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "evidence_linked_entity_idx" ON "evidence" USING btree ("linked_entity_type","linked_entity_id");--> statement-breakpoint
CREATE INDEX "nc_organization_idx" ON "nonconformities" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "nc_owner_idx" ON "nonconformities" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "nc_requirement_idx" ON "nonconformities" USING btree ("requirement_id");--> statement-breakpoint
CREATE INDEX "requirements_organization_idx" ON "requirements" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "requirements_owner_idx" ON "requirements" USING btree ("owner_id");--> statement-breakpoint
CREATE UNIQUE INDEX "user_roles_user_role_idx" ON "user_roles" USING btree ("user_id","role_id");