import { sql } from "drizzle-orm"
import { boolean, date, index, integer, jsonb, pgEnum, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core"

export const assessmentStatus = pgEnum("assessment_status", ["NOT_ASSESSED", "COMPLIANT", "PARTIALLY_COMPLIANT", "NON_COMPLIANT", "NOT_APPLICABLE"])
export const documentStatus = pgEnum("document_status", ["DRAFT", "SUBMITTED_FOR_VERIFICATION", "IN_VERIFICATION", "SUBMITTED_FOR_APPROVAL", "APPROVED", "PUBLISHED", "REPLACED", "OBSOLETE", "ARCHIVED"])
export const documentClassification = pgEnum("document_classification", ["PUBLIC", "INTERNAL", "CONFIDENTIAL"])
export const documentType = pgEnum("document_type", ["POLICY", "MANUAL", "PROCEDURE", "WORK_INSTRUCTION", "INSTRUCTION", "FORM", "QUALITY_RECORD", "EXTERNAL_REFERENCE", "OTHER"])
export const documentVersionStatus = pgEnum("document_version_status", ["DRAFT", "IN_REVIEW", "APPROVED", "PUBLISHED", "REPLACED", "OBSOLETE", "ARCHIVED"])
export const processStatus = pgEnum("process_status", ["ACTIVE", "INACTIVE"])
export const riskKind = pgEnum("risk_kind", ["RISK", "OPPORTUNITY"])
export const riskStatus = pgEnum("risk_status", ["IDENTIFIED", "ASSESSED", "TREATMENT_PLANNED", "IN_TREATMENT", "MONITORED", "CLOSED", "ACCEPTED"])
export const riskLevel = pgEnum("risk_level", ["LOW", "MEDIUM", "HIGH", "CRITICAL"])
export const riskAssessmentType = pgEnum("risk_assessment_type", ["INITIAL", "RESIDUAL"])
export const auditType = pgEnum("audit_type", ["INTERNAL", "INSPECTION", "SUPPLIER", "PROCESS", "COMPLIANCE", "FOLLOW_UP"])
export const auditStatus = pgEnum("audit_status", ["DRAFT", "PLANNED", "IN_PREPARATION", "IN_PROGRESS", "FINDINGS_TO_CONSOLIDATE", "REPORT_PREPARED", "COMPLETED", "CANCELLED"])
export const findingType = pgEnum("finding_type", ["CONFORMITY", "OBSERVATION", "IMPROVEMENT_OPPORTUNITY", "POTENTIAL_NONCONFORMITY", "CONFIRMED_NONCONFORMITY"])
export const findingSeverity = pgEnum("finding_severity", ["LOW", "MEDIUM", "HIGH", "CRITICAL"])
export const findingStatus = pgEnum("finding_status", ["OPEN", "UNDER_REVIEW", "ACCEPTED", "REFERRED_TO_ACTIONS", "CLOSED"])
export const auditReportStatus = pgEnum("audit_report_status", ["DRAFT", "IN_REVIEW", "VALIDATED"])
export const auditItemResult = pgEnum("audit_item_result", ["NOT_ASSESSED", "CONFORMING", "PARTIALLY_CONFORMING", "NON_CONFORMING", "NOT_APPLICABLE"])
export const nonconformityOrigin = pgEnum("nonconformity_origin", ["AUDIT", "INSPECTION", "PROCESS", "INCIDENT", "COMPLAINT", "OTHER"])
export const nonconformityClass = pgEnum("nonconformity_class", ["MINOR", "MAJOR", "CRITICAL"])
export const nonconformityStatus = pgEnum("nonconformity_status", ["DETECTED", "UNDER_EVALUATION", "IMMEDIATE_MEASURE", "ROOT_CAUSE_ANALYSIS", "ACTION_PLANNING", "ACTIONS_IN_PROGRESS", "EFFECTIVENESS_REVIEW", "CLOSED", "REOPENED"])
export const causeAnalysisStatus = pgEnum("cause_analysis_status", ["NOT_STARTED", "IN_PROGRESS", "COMPLETED"])
export const correctiveActionStatus = pgEnum("corrective_action_status", ["PLANNED", "IN_PROGRESS", "COMPLETED", "CANCELLED"])
export const actionPriority = pgEnum("action_priority", ["LOW", "MEDIUM", "HIGH", "URGENT"])
export const effectivenessResult = pgEnum("effectiveness_result", ["NOT_ASSESSED", "EFFECTIVE", "PARTIALLY_EFFECTIVE", "INEFFECTIVE"])
export const indicatorStatus = pgEnum("indicator_status", ["DRAFT", "ACTIVE", "SUSPENDED", "ARCHIVED"])
export const indicatorDirection = pgEnum("indicator_direction", ["HIGHER_IS_BETTER", "LOWER_IS_BETTER", "TARGET_RANGE"])
export const measurementFrequency = pgEnum("measurement_frequency", ["WEEKLY", "MONTHLY", "QUARTERLY", "SEMI_ANNUAL", "ANNUAL", "AD_HOC"])
export const measurementStatus = pgEnum("measurement_status", ["DRAFT", "SUBMITTED", "VALIDATED", "REJECTED"])
export const indicatorValueKind = pgEnum("indicator_value_kind", ["ENTERED", "CALCULATED"])
export const eventOrigin = pgEnum("event_origin", ["SYSTEM", "UNVERIFIED_OPERATOR"])

const auditColumns = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
}

export const organizations = pgTable("organizations", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: text("code").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  ...auditColumns,
}, (table) => [uniqueIndex("organizations_code_unique").on(table.code)])

export const sites = pgTable("sites", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id),
  code: text("code").notNull(),
  name: text("name").notNull(),
  timezone: text("timezone").notNull().default("Europe/Paris"),
  ...auditColumns,
}, (table) => [uniqueIndex("sites_org_code_unique").on(table.organizationId, table.code), index("sites_organization_idx").on(table.organizationId)])

export const processes = pgTable("processes", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id),
  code: text("code").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull().default("PROCESS"),
  status: processStatus("status").notNull().default("ACTIVE"),
  ownerReference: text("owner_reference"),
  ...auditColumns,
}, (table) => [uniqueIndex("processes_org_code_unique").on(table.organizationId, table.code), index("processes_organization_idx").on(table.organizationId)])

export const requirementSources = pgTable("requirement_sources", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: text("code").notNull(),
  name: text("name").notNull(),
  publisher: text("publisher"),
  referenceVersion: text("reference_version"),
  ...auditColumns,
}, (table) => [uniqueIndex("requirement_sources_code_unique").on(table.code)])

export const requirements = pgTable("requirements", {
  id: uuid("id").defaultRandom().primaryKey(),
  sourceId: uuid("source_id").notNull().references(() => requirementSources.id),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id),
  code: text("code").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  referenceClause: text("reference_clause"),
  category: text("category").notNull(),
  domain: text("domain"),
  applicability: boolean("applicability").notNull().default(true),
  status: assessmentStatus("status").notNull().default("NOT_ASSESSED"),
  justification: text("justification"),
  lastEvaluatedAt: timestamp("last_evaluated_at", { withTimezone: true }),
  ...auditColumns,
}, (table) => [uniqueIndex("requirements_org_code_unique").on(table.organizationId, table.code), index("requirements_source_idx").on(table.sourceId), index("requirements_status_idx").on(table.status)])

export const requirementAssessments = pgTable("requirement_assessments", {
  id: uuid("id").defaultRandom().primaryKey(),
  requirementId: uuid("requirement_id").notNull().references(() => requirements.id),
  status: assessmentStatus("status").notNull(),
  justification: text("justification"),
  scopeReference: text("scope_reference"),
  evaluatedAt: timestamp("evaluated_at", { withTimezone: true }).notNull().defaultNow(),
  origin: eventOrigin("origin").notNull().default("UNVERIFIED_OPERATOR"),
}, (table) => [index("requirement_assessments_requirement_idx").on(table.requirementId), index("requirement_assessments_date_idx").on(table.evaluatedAt)])

export const requirementProcesses = pgTable("requirement_processes", {
  requirementId: uuid("requirement_id").notNull().references(() => requirements.id),
  processId: uuid("process_id").notNull().references(() => processes.id),
}, (table) => [uniqueIndex("requirement_process_unique").on(table.requirementId, table.processId)])

export const documents = pgTable("documents", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id),
  code: text("code").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  type: documentType("type").notNull().default("OTHER"),
  processOwnerId: uuid("process_owner_id").references(() => processes.id),
  functionalOwnerReference: text("functional_owner_reference"),
  classification: documentClassification("classification").notNull().default("INTERNAL"),
  status: documentStatus("status").notNull().default("DRAFT"),
  currentRevisionId: uuid("current_revision_id"),
  nextReviewOn: date("next_review_on"),
  lastRevisedAt: timestamp("last_revised_at", { withTimezone: true }),
  archivedAt: timestamp("archived_at", { withTimezone: true }),
  obsoleteReason: text("obsolete_reason"),
  createdOn: date("created_on").notNull().default(sql`CURRENT_DATE`),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  obsoleteAt: timestamp("obsolete_at", { withTimezone: true }),
  ...auditColumns,
}, (table) => [uniqueIndex("documents_org_code_unique").on(table.organizationId, table.code), index("documents_status_idx").on(table.status)])

export const documentRevisions = pgTable("document_revisions", {
  id: uuid("id").defaultRandom().primaryKey(),
  documentId: uuid("document_id").notNull().references(() => documents.id),
  revisionNumber: integer("revision_number").notNull(),
  changeSummary: text("change_summary"),
  status: documentVersionStatus("status").notNull().default("DRAFT"),
  storageKey: text("storage_key"),
  checksum: text("checksum"),
  origin: eventOrigin("origin").notNull().default("UNVERIFIED_OPERATOR"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
  approvedAt: timestamp("approved_at", { withTimezone: true }),
  publishedAt: timestamp("published_at", { withTimezone: true }),
}, (table) => [uniqueIndex("document_revision_unique").on(table.documentId, table.revisionNumber), index("document_revisions_document_idx").on(table.documentId)])

export const documentProcesses = pgTable("document_processes", {
  documentId: uuid("document_id").notNull().references(() => documents.id),
  processId: uuid("process_id").notNull().references(() => processes.id),
}, (table) => [uniqueIndex("document_process_unique").on(table.documentId, table.processId)])

export const documentRequirements = pgTable("document_requirements", {
  documentId: uuid("document_id").notNull().references(() => documents.id),
  requirementId: uuid("requirement_id").notNull().references(() => requirements.id),
}, (table) => [uniqueIndex("document_requirement_unique").on(table.documentId, table.requirementId)])

export const risks = pgTable("risks", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id),
  processId: uuid("process_id").references(() => processes.id),
  kind: riskKind("kind").notNull().default("RISK"),
  code: text("code").notNull(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  source: text("source").notNull(),
  description: text("description").notNull(),
  consequences: text("consequences"),
  causes: text("causes"),
  existingControls: text("existing_controls"),
  treatmentPlan: text("treatment_plan"),
  ownerReference: text("owner_reference"),
  treatmentDueOn: date("treatment_due_on"),
  status: riskStatus("status").notNull().default("IDENTIFIED"),
  initialProbability: integer("initial_probability").notNull(),
  initialImpact: integer("initial_impact").notNull(),
  initialScore: integer("initial_score").notNull(),
  initialLevel: riskLevel("initial_level").notNull(),
  residualProbability: integer("residual_probability"),
  residualImpact: integer("residual_impact"),
  residualScore: integer("residual_score"),
  residualLevel: riskLevel("residual_level"),
  ...auditColumns,
}, (table) => [uniqueIndex("risks_org_code_unique").on(table.organizationId, table.code), index("risks_status_idx").on(table.status), index("risks_process_idx").on(table.processId), index("risks_initial_level_idx").on(table.initialLevel)])

export const riskAssessments = pgTable("risk_assessments", {
  id: uuid("id").defaultRandom().primaryKey(),
  riskId: uuid("risk_id").notNull().references(() => risks.id),
  assessmentType: riskAssessmentType("assessment_type").notNull(),
  probability: integer("probability").notNull(),
  impact: integer("impact").notNull(),
  score: integer("score").notNull(),
  level: riskLevel("level").notNull(),
  rationale: text("rationale"),
  assessedAt: timestamp("assessed_at", { withTimezone: true }).notNull().defaultNow(),
  origin: eventOrigin("origin").notNull().default("UNVERIFIED_OPERATOR"),
}, (table) => [index("risk_assessments_risk_idx").on(table.riskId), index("risk_assessments_date_idx").on(table.assessedAt)])

export const riskRequirements = pgTable("risk_requirements", {
  riskId: uuid("risk_id").notNull().references(() => risks.id),
  requirementId: uuid("requirement_id").notNull().references(() => requirements.id),
}, (table) => [uniqueIndex("risk_requirement_unique").on(table.riskId, table.requirementId)])

export const riskDocuments = pgTable("risk_documents", {
  riskId: uuid("risk_id").notNull().references(() => risks.id),
  documentId: uuid("document_id").notNull().references(() => documents.id),
}, (table) => [uniqueIndex("risk_document_unique").on(table.riskId, table.documentId)])

export const auditPrograms = pgTable("audit_programs", {
  id: uuid("id").defaultRandom().primaryKey(), organizationId: uuid("organization_id").notNull().references(() => organizations.id), code: text("code").notNull(), name: text("name").notNull(), periodStart: date("period_start").notNull(), periodEnd: date("period_end").notNull(), objectives: text("objectives").notNull(), frequencyRationale: text("frequency_rationale"), coordinatorReference: text("coordinator_reference"), status: text("status").notNull().default("DRAFT"), ...auditColumns,
}, (table) => [uniqueIndex("audit_programs_org_code_unique").on(table.organizationId, table.code), index("audit_programs_period_idx").on(table.periodStart, table.periodEnd)])

export const audits = pgTable("audits", {
  id: uuid("id").defaultRandom().primaryKey(), programId: uuid("program_id").references(() => auditPrograms.id), organizationId: uuid("organization_id").notNull().references(() => organizations.id), processId: uuid("process_id").references(() => processes.id), reference: text("reference").notNull(), title: text("title").notNull(), type: auditType("type").notNull(), objectives: text("objectives").notNull(), scope: text("scope").notNull(), criteria: text("criteria").notNull(), plannedStart: date("planned_start").notNull(), plannedEnd: date("planned_end").notNull(), actualStart: date("actual_start"), actualEnd: date("actual_end"), teamReferences: text("team_references"), status: auditStatus("status").notNull().default("DRAFT"), notes: text("notes"), conclusion: text("conclusion"), ...auditColumns,
}, (table) => [uniqueIndex("audits_org_reference_unique").on(table.organizationId, table.reference), index("audits_status_idx").on(table.status), index("audits_period_idx").on(table.plannedStart, table.plannedEnd)])

export const auditProcesses = pgTable("audit_processes", { auditId: uuid("audit_id").notNull().references(() => audits.id), processId: uuid("process_id").notNull().references(() => processes.id) }, (table) => [uniqueIndex("audit_process_unique").on(table.auditId, table.processId)])
export const auditRequirements = pgTable("audit_requirements", { auditId: uuid("audit_id").notNull().references(() => audits.id), requirementId: uuid("requirement_id").notNull().references(() => requirements.id) }, (table) => [uniqueIndex("audit_requirement_unique").on(table.auditId, table.requirementId)])

export const auditItems = pgTable("audit_items", {
  id: uuid("id").defaultRandom().primaryKey(), auditId: uuid("audit_id").notNull().references(() => audits.id), code: text("code").notNull(), domain: text("domain").notNull(), question: text("question").notNull(), criteria: text("criteria").notNull(), processId: uuid("process_id").references(() => processes.id), requirementId: uuid("requirement_id").references(() => requirements.id), ownerReference: text("owner_reference"), result: auditItemResult("result").notNull().default("NOT_ASSESSED"), observation: text("observation"), ...auditColumns,
}, (table) => [uniqueIndex("audit_items_audit_code_unique").on(table.auditId, table.code), index("audit_items_audit_idx").on(table.auditId)])

export const auditFindings = pgTable("audit_findings", {
  id: uuid("id").defaultRandom().primaryKey(), auditId: uuid("audit_id").notNull().references(() => audits.id), reference: text("reference").notNull(), type: findingType("type").notNull(), description: text("description").notNull(), criterion: text("criterion"), evidenceReference: text("evidence_reference"), severity: findingSeverity("severity").notNull(), processId: uuid("process_id").references(() => processes.id), requirementId: uuid("requirement_id").references(() => requirements.id), riskId: uuid("risk_id").references(() => risks.id), status: findingStatus("status").notNull().default("OPEN"), recommendation: text("recommendation"), correctiveActionReference: text("corrective_action_reference"), ...auditColumns,
}, (table) => [uniqueIndex("audit_findings_audit_reference_unique").on(table.auditId, table.reference), index("audit_findings_status_idx").on(table.status)])

export const auditReports = pgTable("audit_reports", {
  id: uuid("id").defaultRandom().primaryKey(), auditId: uuid("audit_id").notNull().references(() => audits.id), summary: text("summary").notNull(), performedScope: text("performed_scope").notNull(), method: text("method").notNull(), findingsSummary: text("findings_summary").notNull(), conclusion: text("conclusion").notNull(), recommendations: text("recommendations"), finalizedAt: timestamp("finalized_at", { withTimezone: true }), status: auditReportStatus("status").notNull().default("DRAFT"), validationReference: text("validation_reference"), ...auditColumns,
}, (table) => [uniqueIndex("audit_reports_audit_unique").on(table.auditId)])

export const nonconformities = pgTable("nonconformities", {
  id: uuid("id").defaultRandom().primaryKey(), organizationId: uuid("organization_id").notNull().references(() => organizations.id), reference: text("reference").notNull(), title: text("title").notNull(), description: text("description").notNull(), origin: nonconformityOrigin("origin").notNull(), auditId: uuid("audit_id").references(() => audits.id), findingId: uuid("finding_id").references(() => auditFindings.id), processId: uuid("process_id").references(() => processes.id), requirementId: uuid("requirement_id").references(() => requirements.id), riskId: uuid("risk_id").references(() => risks.id), detectedOn: date("detected_on").notNull(), classification: nonconformityClass("classification").notNull(), ownerReference: text("owner_reference"), immediateMeasures: text("immediate_measures"), dueOn: date("due_on"), status: nonconformityStatus("status").notNull().default("DETECTED"), ...auditColumns,
}, (table) => [uniqueIndex("nonconformities_org_reference_unique").on(table.organizationId, table.reference), index("nonconformities_status_idx").on(table.status), index("nonconformities_due_idx").on(table.dueOn)])

export const causeAnalyses = pgTable("cause_analyses", {
  id: uuid("id").defaultRandom().primaryKey(), nonconformityId: uuid("nonconformity_id").notNull().references(() => nonconformities.id), immediateCauses: text("immediate_causes"), rootCauses: text("root_causes"), method: text("method").notNull(), factualBasis: text("factual_basis").notNull(), retainedCauses: text("retained_causes").notNull(), rationale: text("rationale").notNull(), analyzedOn: date("analyzed_on").notNull(), status: causeAnalysisStatus("status").notNull().default("NOT_STARTED"), origin: eventOrigin("origin").notNull().default("UNVERIFIED_OPERATOR"), ...auditColumns,
}, (table) => [uniqueIndex("cause_analyses_nc_unique").on(table.nonconformityId)])

export const correctiveActions = pgTable("corrective_actions", {
  id: uuid("id").defaultRandom().primaryKey(), nonconformityId: uuid("nonconformity_id").notNull().references(() => nonconformities.id), reference: text("reference").notNull(), plannedAction: text("planned_action").notNull(), ownerReference: text("owner_reference").notNull(), dueOn: date("due_on").notNull(), priority: actionPriority("priority").notNull().default("MEDIUM"), resources: text("resources"), status: correctiveActionStatus("status").notNull().default("PLANNED"), completionEvidence: text("completion_evidence"), executedOn: date("executed_on"), verificationResult: text("verification_result"), ...auditColumns,
}, (table) => [uniqueIndex("corrective_actions_nc_reference_unique").on(table.nonconformityId, table.reference), index("corrective_actions_status_idx").on(table.status), index("corrective_actions_due_idx").on(table.dueOn)])

export const effectivenessReviews = pgTable("effectiveness_reviews", {
  id: uuid("id").defaultRandom().primaryKey(), nonconformityId: uuid("nonconformity_id").notNull().references(() => nonconformities.id), method: text("method").notNull(), criteria: text("criteria").notNull(), observations: text("observations").notNull(), evidenceReference: text("evidence_reference"), result: effectivenessResult("result").notNull(), recurrenceRisk: text("recurrence_risk"), closureDecision: text("closure_decision").notNull(), decidedOn: date("decided_on").notNull(), origin: eventOrigin("origin").notNull().default("UNVERIFIED_OPERATOR"), ...auditColumns,
}, (table) => [index("effectiveness_reviews_nc_idx").on(table.nonconformityId), index("effectiveness_reviews_result_idx").on(table.result)])

export const qualityIndicators = pgTable("quality_indicators", {
  id: uuid("id").defaultRandom().primaryKey(), organizationId: uuid("organization_id").notNull().references(() => organizations.id), processId: uuid("process_id").references(() => processes.id), code: text("code").notNull(), title: text("title").notNull(), description: text("description").notNull(), definition: text("definition").notNull(), formula: text("formula").notNull(), unit: text("unit").notNull(), direction: indicatorDirection("direction").notNull(), targetValue: text("target_value"), alertThreshold: text("alert_threshold"), frequency: measurementFrequency("frequency").notNull(), sourceDescription: text("source_description").notNull(), ownerReference: text("owner_reference"), status: indicatorStatus("status").notNull().default("DRAFT"), ...auditColumns,
}, (table) => [uniqueIndex("quality_indicators_org_code_unique").on(table.organizationId, table.code), index("quality_indicators_status_idx").on(table.status), index("quality_indicators_process_idx").on(table.processId)])

export const indicatorMeasurements = pgTable("indicator_measurements", {
  id: uuid("id").defaultRandom().primaryKey(), indicatorId: uuid("indicator_id").notNull().references(() => qualityIndicators.id), periodStart: date("period_start").notNull(), periodEnd: date("period_end").notNull(), observedValue: text("observed_value").notNull(), targetValue: text("target_value"), valueKind: indicatorValueKind("value_kind").notNull().default("ENTERED"), sourceReference: text("source_reference"), comment: text("comment"), status: measurementStatus("status").notNull().default("DRAFT"), submittedAt: timestamp("submitted_at", { withTimezone: true }), validatedAt: timestamp("validated_at", { withTimezone: true }), origin: eventOrigin("origin").notNull().default("UNVERIFIED_OPERATOR"), ...auditColumns,
}, (table) => [uniqueIndex("indicator_measurements_period_unique").on(table.indicatorId, table.periodStart, table.periodEnd), index("indicator_measurements_indicator_idx").on(table.indicatorId), index("indicator_measurements_status_idx").on(table.status)])

export const auditEvents = pgTable("audit_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  eventType: text("event_type").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: uuid("entity_id"),
  origin: eventOrigin("origin").notNull().default("SYSTEM"),
  occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull().defaultNow(),
  correlationId: text("correlation_id"),
  context: jsonb("context").$type<Record<string, unknown>>(),
}, (table) => [index("audit_events_entity_idx").on(table.entityType, table.entityId), index("audit_events_occurred_idx").on(table.occurredAt)])

export type Organization = typeof organizations.$inferSelect
export type Requirement = typeof requirements.$inferSelect
export type Document = typeof documents.$inferSelect
export type AuditEvent = typeof auditEvents.$inferSelect
