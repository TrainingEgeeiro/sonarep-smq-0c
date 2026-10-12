import { boolean, date, foreignKey, index, integer, jsonb, pgEnum, pgTable, text, timestamp, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core'

const timestamps = { createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(), updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull() }

export const userRoleEnum = pgEnum('user_role', ['QMS_ADMIN', 'QUALITY_MANAGER', 'COMPLIANCE_OWNER', 'PRODUCTION_MANAGER', 'ASSESSOR', 'ACTION_OWNER', 'INTERNAL_AUDITOR', 'EXECUTIVE_VIEWER', 'IT_SUPPORT'])

// Better Auth 1.7.7 default PostgreSQL model. These tables intentionally stay separate from the QMS app_users model.
export const authUser = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  emailVerified: boolean('emailVerified').default(false).notNull(),
  image: text('image'),
  createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', { withTimezone: true }).defaultNow().notNull(),
}, (t) => [uniqueIndex('user_email_unique').on(t.email)])

export const authSession = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt', { withTimezone: true }).notNull(),
  token: text('token').notNull(),
  createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', { withTimezone: true }).defaultNow().notNull(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId').notNull(),
}, (t) => [uniqueIndex('session_token_unique').on(t.token), index('session_user_idx').on(t.userId)])

export const authAccount = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId').notNull(),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt', { withTimezone: true }),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt', { withTimezone: true }),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', { withTimezone: true }).defaultNow().notNull(),
}, (t) => [index('account_user_idx').on(t.userId), uniqueIndex('account_provider_account_unique').on(t.providerId, t.accountId)])

export const authVerification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt', { withTimezone: true }).notNull(),
  createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', { withTimezone: true }).defaultNow().notNull(),
}, (t) => [index('verification_identifier_idx').on(t.identifier)])

export const betterAuthTables = { authUser, authSession, authAccount, authVerification }

export const requirementStatusEnum = pgEnum('requirement_status', ['ACTIVE', 'ARCHIVED'])
export const complianceStatusEnum = pgEnum('compliance_status', ['NOT_ASSESSED', 'COMPLIANT', 'PARTIALLY_COMPLIANT', 'NON_COMPLIANT', 'NOT_APPLICABLE'])
export const documentStatusEnum = pgEnum('document_status', ['DRAFT', 'IN_REVIEW', 'APPROVED', 'PUBLISHED', 'OBSOLETE'])
export const availabilityEnum = pgEnum('availability', ['REFERENCE_ONLY', 'AVAILABLE', 'UNAVAILABLE'])
export const ncStatusEnum = pgEnum('nc_status', ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'ARCHIVED'])
export const severityEnum = pgEnum('severity', ['MINOR', 'MAJOR', 'CRITICAL'])
export const actionStatusEnum = pgEnum('action_status', ['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'EFFECTIVENESS_VERIFIED', 'CLOSED'])
export const auditStatusEnum = pgEnum('audit_status', ['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])

export const organizations = pgTable('organizations', { id: uuid('id').defaultRandom().primaryKey(), code: varchar('code', { length: 64 }).notNull().unique(), name: text('name').notNull(), isDemo: boolean('is_demo').default(false).notNull(), ...timestamps })
export const appUsers = pgTable('app_users', { id: uuid('id').defaultRandom().primaryKey(), organizationId: uuid('organization_id').notNull(), externalSubject: text('external_subject'), displayName: text('display_name').notNull(), email: text('email'), isActive: boolean('is_active').default(true).notNull(), ...timestamps }, (t) => [uniqueIndex('app_users_org_subject_idx').on(t.organizationId, t.externalSubject), index('app_users_organization_idx').on(t.organizationId), foreignKey({ columns: [t.organizationId], foreignColumns: [organizations.id], name: 'app_users_organization_fk' }).onDelete('restrict')])
export const roles = pgTable('roles', { id: uuid('id').defaultRandom().primaryKey(), code: userRoleEnum('code').notNull().unique(), label: text('label').notNull() })
export const permissions = pgTable('permissions', { id: uuid('id').defaultRandom().primaryKey(), code: varchar('code', { length: 100 }).notNull().unique(), label: text('label').notNull() })
export const userRoles = pgTable('user_roles', { userId: uuid('user_id').notNull(), roleId: uuid('role_id').notNull(), ...timestamps }, (t) => [uniqueIndex('user_roles_user_role_idx').on(t.userId, t.roleId), foreignKey({ columns: [t.userId], foreignColumns: [appUsers.id], name: 'user_roles_user_fk' }).onDelete('restrict'), foreignKey({ columns: [t.roleId], foreignColumns: [roles.id], name: 'user_roles_role_fk' }).onDelete('restrict')])

const ownership = { createdBy: uuid('created_by'), updatedBy: uuid('updated_by') }
export const requirements = pgTable('requirements', { id: uuid('id').defaultRandom().primaryKey(), organizationId: uuid('organization_id').notNull(), reference: varchar('reference', { length: 64 }).notNull(), source: text('source').notNull(), sourceVersion: text('source_version'), title: text('title').notNull(), summary: text('summary').notNull(), domain: text('domain').notNull(), ownerId: uuid('owner_id'), applicability: text('applicability').notNull(), status: requirementStatusEnum('status').default('ACTIVE').notNull(), ...timestamps, ...ownership }, (t) => [uniqueIndex('requirements_org_reference_idx').on(t.organizationId, t.reference), index('requirements_organization_idx').on(t.organizationId), index('requirements_owner_idx').on(t.ownerId), foreignKey({ columns: [t.organizationId], foreignColumns: [organizations.id], name: 'requirements_organization_fk' }).onDelete('restrict'), foreignKey({ columns: [t.ownerId], foreignColumns: [appUsers.id], name: 'requirements_owner_fk' }).onDelete('set null')])
export const complianceEvaluations = pgTable('compliance_evaluations', { id: uuid('id').defaultRandom().primaryKey(), organizationId: uuid('organization_id').notNull(), requirementId: uuid('requirement_id').notNull(), scope: text('scope').notNull(), evaluatedOn: date('evaluated_on').notNull(), assessorId: uuid('assessor_id'), status: complianceStatusEnum('status').notNull(), justification: text('justification').notNull(), evidenceReference: text('evidence_reference'), ...timestamps, ...ownership }, (t) => [index('evaluations_organization_idx').on(t.organizationId), index('evaluations_requirement_idx').on(t.requirementId), foreignKey({ columns: [t.organizationId], foreignColumns: [organizations.id], name: 'evaluations_organization_fk' }).onDelete('restrict'), foreignKey({ columns: [t.requirementId], foreignColumns: [requirements.id], name: 'evaluations_requirement_fk' }).onDelete('restrict'), foreignKey({ columns: [t.assessorId], foreignColumns: [appUsers.id], name: 'evaluations_assessor_fk' }).onDelete('set null')])
export const controlledDocuments = pgTable('controlled_documents', { id: uuid('id').defaultRandom().primaryKey(), organizationId: uuid('organization_id').notNull(), reference: varchar('reference', { length: 64 }).notNull(), title: text('title').notNull(), type: text('type').notNull(), ownerId: uuid('owner_id'), version: text('version').notNull(), status: documentStatusEnum('status').notNull(), effectiveDate: date('effective_date'), nextReviewDate: date('next_review_date'), sourceReference: text('source_reference'), previousVersionId: uuid('previous_version_id'), ...timestamps, ...ownership }, (t) => [uniqueIndex('documents_org_reference_idx').on(t.organizationId, t.reference), index('documents_organization_idx').on(t.organizationId), index('documents_owner_idx').on(t.ownerId), foreignKey({ columns: [t.organizationId], foreignColumns: [organizations.id], name: 'documents_organization_fk' }).onDelete('restrict'), foreignKey({ columns: [t.ownerId], foreignColumns: [appUsers.id], name: 'documents_owner_fk' }).onDelete('set null'), foreignKey({ columns: [t.previousVersionId], foreignColumns: [t.id], name: 'documents_previous_version_fk' }).onDelete('restrict')])
export const evidence = pgTable('evidence', { id: uuid('id').defaultRandom().primaryKey(), organizationId: uuid('organization_id').notNull(), reference: varchar('reference', { length: 64 }).notNull(), title: text('title').notNull(), type: text('type').notNull(), ownerId: uuid('owner_id'), evidenceDate: date('evidence_date'), origin: text('origin').notNull(), linkedEntityType: text('linked_entity_type').notNull(), linkedEntityId: uuid('linked_entity_id'), externalReference: text('external_reference'), availability: availabilityEnum('availability').notNull(), ...timestamps, ...ownership }, (t) => [uniqueIndex('evidence_org_reference_idx').on(t.organizationId, t.reference), index('evidence_organization_idx').on(t.organizationId), index('evidence_owner_idx').on(t.ownerId), index('evidence_linked_entity_idx').on(t.linkedEntityType, t.linkedEntityId), foreignKey({ columns: [t.organizationId], foreignColumns: [organizations.id], name: 'evidence_organization_fk' }).onDelete('restrict'), foreignKey({ columns: [t.ownerId], foreignColumns: [appUsers.id], name: 'evidence_owner_fk' }).onDelete('set null')])
export const nonconformities = pgTable('nonconformities', { id: uuid('id').defaultRandom().primaryKey(), organizationId: uuid('organization_id').notNull(), reference: varchar('reference', { length: 64 }).notNull(), title: text('title').notNull(), factualDescription: text('factual_description').notNull(), origin: text('origin').notNull(), severity: severityEnum('severity').notNull(), detectedOn: date('detected_on').notNull(), ownerId: uuid('owner_id'), dueDate: date('due_date'), status: ncStatusEnum('status').notNull(), requirementId: uuid('requirement_id'), ...timestamps, ...ownership }, (t) => [uniqueIndex('nc_org_reference_idx').on(t.organizationId, t.reference), index('nc_organization_idx').on(t.organizationId), index('nc_owner_idx').on(t.ownerId), index('nc_requirement_idx').on(t.requirementId), foreignKey({ columns: [t.organizationId], foreignColumns: [organizations.id], name: 'nc_organization_fk' }).onDelete('restrict'), foreignKey({ columns: [t.ownerId], foreignColumns: [appUsers.id], name: 'nc_owner_fk' }).onDelete('set null'), foreignKey({ columns: [t.requirementId], foreignColumns: [requirements.id], name: 'nc_requirement_fk' }).onDelete('restrict')])
export const correctiveActions = pgTable('corrective_actions', { id: uuid('id').defaultRandom().primaryKey(), organizationId: uuid('organization_id').notNull(), reference: varchar('reference', { length: 64 }).notNull(), action: text('action').notNull(), nonconformityId: uuid('nonconformity_id').notNull(), ownerId: uuid('owner_id'), dueDate: date('due_date'), status: actionStatusEnum('status').notNull(), completionEvidenceReference: text('completion_evidence_reference'), effectivenessResult: text('effectiveness_result'), verifierId: uuid('verifier_id'), verifiedOn: date('verified_on'), ...timestamps, ...ownership }, (t) => [uniqueIndex('actions_org_reference_idx').on(t.organizationId, t.reference), index('actions_organization_idx').on(t.organizationId), index('actions_nc_idx').on(t.nonconformityId), index('actions_owner_idx').on(t.ownerId), foreignKey({ columns: [t.organizationId], foreignColumns: [organizations.id], name: 'actions_organization_fk' }).onDelete('restrict'), foreignKey({ columns: [t.nonconformityId], foreignColumns: [nonconformities.id], name: 'actions_nc_fk' }).onDelete('restrict'), foreignKey({ columns: [t.ownerId], foreignColumns: [appUsers.id], name: 'actions_owner_fk' }).onDelete('set null'), foreignKey({ columns: [t.verifierId], foreignColumns: [appUsers.id], name: 'actions_verifier_fk' }).onDelete('set null')])
export const auditPrograms = pgTable('audit_programs', { id: uuid('id').defaultRandom().primaryKey(), organizationId: uuid('organization_id').notNull(), reference: varchar('reference', { length: 64 }).notNull(), title: text('title').notNull(), year: integer('year').notNull(), ...timestamps, ...ownership }, (t) => [uniqueIndex('audit_programs_org_reference_idx').on(t.organizationId, t.reference), index('audit_programs_organization_idx').on(t.organizationId), foreignKey({ columns: [t.organizationId], foreignColumns: [organizations.id], name: 'audit_programs_organization_fk' }).onDelete('restrict')])
export const audits = pgTable('audits', { id: uuid('id').defaultRandom().primaryKey(), organizationId: uuid('organization_id').notNull(), programId: uuid('program_id'), reference: varchar('reference', { length: 64 }).notNull(), scope: text('scope').notNull(), criteria: text('criteria').notNull(), auditorId: uuid('auditor_id'), plannedStart: date('planned_start'), plannedEnd: date('planned_end'), actualStart: date('actual_start'), actualEnd: date('actual_end'), status: auditStatusEnum('status').notNull(), ...timestamps, ...ownership }, (t) => [uniqueIndex('audits_org_reference_idx').on(t.organizationId, t.reference), index('audits_organization_idx').on(t.organizationId), index('audits_program_idx').on(t.programId), index('audits_auditor_idx').on(t.auditorId), foreignKey({ columns: [t.organizationId], foreignColumns: [organizations.id], name: 'audits_organization_fk' }).onDelete('restrict'), foreignKey({ columns: [t.programId], foreignColumns: [auditPrograms.id], name: 'audits_program_fk' }).onDelete('set null'), foreignKey({ columns: [t.auditorId], foreignColumns: [appUsers.id], name: 'audits_auditor_fk' }).onDelete('set null')])
export const auditFindings = pgTable('audit_findings', { id: uuid('id').defaultRandom().primaryKey(), auditId: uuid('audit_id').notNull(), title: text('title').notNull(), description: text('description').notNull(), evidenceReference: text('evidence_reference'), nonconformityId: uuid('nonconformity_id'), ...timestamps, ...ownership }, (t) => [index('audit_findings_audit_idx').on(t.auditId), index('audit_findings_nc_idx').on(t.nonconformityId), foreignKey({ columns: [t.auditId], foreignColumns: [audits.id], name: 'audit_findings_audit_fk' }).onDelete('restrict'), foreignKey({ columns: [t.nonconformityId], foreignColumns: [nonconformities.id], name: 'audit_findings_nc_fk' }).onDelete('set null')])
export const auditEvents = pgTable('audit_events', { id: uuid('id').defaultRandom().primaryKey(), organizationId: uuid('organization_id').notNull(), eventType: varchar('event_type', { length: 100 }).notNull(), entityType: varchar('entity_type', { length: 100 }).notNull(), entityId: uuid('entity_id'), actorId: uuid('actor_id'), occurredAt: timestamp('occurred_at', { withTimezone: true }).defaultNow().notNull(), result: varchar('result', { length: 32 }).notNull(), summary: text('summary').notNull(), correlationId: text('correlation_id'), metadata: jsonb('metadata') }, (t) => [index('audit_events_organization_idx').on(t.organizationId), index('audit_events_entity_idx').on(t.entityType, t.entityId), index('audit_events_actor_idx').on(t.actorId), foreignKey({ columns: [t.organizationId], foreignColumns: [organizations.id], name: 'audit_events_organization_fk' }).onDelete('restrict'), foreignKey({ columns: [t.actorId], foreignColumns: [appUsers.id], name: 'audit_events_actor_fk' }).onDelete('set null')])

export const tableNames = { organizations, appUsers, roles, permissions, userRoles, requirements, complianceEvaluations, controlledDocuments, evidence, nonconformities, correctiveActions, auditPrograms, audits, auditFindings, auditEvents }
export type DemoRole = (typeof userRoleEnum.enumValues)[number]
export type ComplianceStatus = (typeof complianceStatusEnum.enumValues)[number]
export type ActionStatus = (typeof actionStatusEnum.enumValues)[number]
