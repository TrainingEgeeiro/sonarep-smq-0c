import { sql } from "drizzle-orm"
import { boolean, date, index, integer, jsonb, pgEnum, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core"

export const assessmentStatus = pgEnum("assessment_status", ["NOT_ASSESSED", "COMPLIANT", "PARTIALLY_COMPLIANT", "NON_COMPLIANT", "NOT_APPLICABLE"])
export const documentStatus = pgEnum("document_status", ["DRAFT", "IN_REVIEW", "APPROVED", "PUBLISHED", "OBSOLETE"])
export const documentClassification = pgEnum("document_classification", ["PUBLIC", "INTERNAL", "CONFIDENTIAL"])
export const processStatus = pgEnum("process_status", ["ACTIVE", "INACTIVE"])
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
  category: text("category").notNull(),
  domain: text("domain"),
  applicability: boolean("applicability").notNull().default(true),
  status: assessmentStatus("status").notNull().default("NOT_ASSESSED"),
  justification: text("justification"),
  lastEvaluatedAt: timestamp("last_evaluated_at", { withTimezone: true }),
  ...auditColumns,
}, (table) => [uniqueIndex("requirements_org_code_unique").on(table.organizationId, table.code), index("requirements_source_idx").on(table.sourceId), index("requirements_status_idx").on(table.status)])

export const requirementProcesses = pgTable("requirement_processes", {
  requirementId: uuid("requirement_id").notNull().references(() => requirements.id),
  processId: uuid("process_id").notNull().references(() => processes.id),
}, (table) => [uniqueIndex("requirement_process_unique").on(table.requirementId, table.processId)])

export const documents = pgTable("documents", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id),
  code: text("code").notNull(),
  title: text("title").notNull(),
  classification: documentClassification("classification").notNull().default("INTERNAL"),
  status: documentStatus("status").notNull().default("DRAFT"),
  currentRevisionId: uuid("current_revision_id"),
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
  storageKey: text("storage_key"),
  checksum: text("checksum"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
}, (table) => [uniqueIndex("document_revision_unique").on(table.documentId, table.revisionNumber), index("document_revisions_document_idx").on(table.documentId)])

export const documentProcesses = pgTable("document_processes", {
  documentId: uuid("document_id").notNull().references(() => documents.id),
  processId: uuid("process_id").notNull().references(() => processes.id),
}, (table) => [uniqueIndex("document_process_unique").on(table.documentId, table.processId)])

export const documentRequirements = pgTable("document_requirements", {
  documentId: uuid("document_id").notNull().references(() => documents.id),
  requirementId: uuid("requirement_id").notNull().references(() => requirements.id),
}, (table) => [uniqueIndex("document_requirement_unique").on(table.documentId, table.requirementId)])

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
