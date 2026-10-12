import type { DemoRole } from './db/schema'

export const qmsRoles = ['ORG_ADMIN', 'QMS_MANAGER', 'QUALITY_OFFICER', 'AUDITOR', 'DOCUMENT_CONTROLLER', 'CONTRIBUTOR', 'VIEWER'] as const
export type QmsRole = DemoRole | (typeof qmsRoles)[number]
export type QmsPermission = string

export const demoIdentity = { id: '00000000-0000-0000-0000-000000000001', displayName: 'Direction démo', role: 'EXECUTIVE_VIEWER' as DemoRole, isRealAuthentication: false }

const readOnly: QmsPermission[] = ['dashboard.read', 'reports.read', 'requirements.read', 'compliance.read', 'documents.read', 'evidence.read', 'nonconformities.read', 'actions.read', 'audits.read', 'risks.read']
export const permissionsByRole: Record<QmsRole, QmsPermission[]> = {
  ORG_ADMIN: [...readOnly, 'administration.read', 'administration.members.manage'],
  QMS_MANAGER: [...readOnly, 'requirements.create', 'requirements.update', 'requirements.validate', 'compliance.create', 'compliance.validate', 'documents.create', 'documents.update', 'documents.publish', 'evidence.create', 'nonconformities.create', 'nonconformities.update', 'nonconformities.close', 'actions.create', 'actions.update', 'actions.verify', 'actions.close', 'audits.create', 'audits.update', 'audits.validate', 'risks.update'],
  QUALITY_OFFICER: [...readOnly, 'requirements.update', 'compliance.create', 'compliance.validate', 'evidence.create', 'nonconformities.create', 'nonconformities.update', 'nonconformities.close', 'actions.create', 'actions.update', 'actions.verify', 'audits.read'],
  AUDITOR: [...readOnly, 'audits.create', 'audits.update', 'audits.validate', 'evidence.create', 'nonconformities.create'],
  DOCUMENT_CONTROLLER: [...readOnly, 'documents.create', 'documents.update', 'documents.publish', 'evidence.create'],
  CONTRIBUTOR: ['dashboard.read', 'requirements.read', 'documents.read', 'documents.update', 'evidence.read', 'evidence.create', 'nonconformities.read', 'nonconformities.create', 'actions.read', 'actions.update', 'audits.read', 'risks.read'],
  VIEWER: readOnly,
  QMS_ADMIN: [...readOnly, 'requirements.create', 'requirements.update', 'requirements.validate', 'compliance.create', 'compliance.validate', 'documents.create', 'documents.update', 'documents.publish', 'evidence.create', 'nonconformities.create', 'nonconformities.update', 'nonconformities.close', 'actions.create', 'actions.update', 'actions.verify', 'actions.close', 'audits.create', 'audits.update', 'audits.validate', 'risks.update', 'administration.read', 'administration.members.manage'],
  QUALITY_MANAGER: [...readOnly, 'requirements.create', 'requirements.update', 'requirements.validate', 'compliance.create', 'compliance.validate', 'compliance.write', 'documents.update', 'evidence.create', 'nonconformities.create', 'nonconformities.update', 'nonconformities.close', 'actions.create', 'actions.update', 'actions.verify', 'actions.close', 'actions.write', 'audits.create', 'audits.update', 'audits.validate', 'audits.write', 'risks.update'],
  COMPLIANCE_OWNER: [...readOnly, 'requirements.update', 'compliance.create', 'compliance.validate', 'evidence.create'],
  PRODUCTION_MANAGER: ['dashboard.read', 'nonconformities.read', 'actions.read', 'actions.update', 'operations.read'],
  ASSESSOR: ['dashboard.read', 'requirements.read', 'compliance.read', 'compliance.create'],
  ACTION_OWNER: ['dashboard.read', 'nonconformities.read', 'actions.read', 'actions.update'],
  INTERNAL_AUDITOR: [...readOnly, 'audits.create', 'audits.update', 'audits.validate', 'evidence.create'],
  EXECUTIVE_VIEWER: ['dashboard.read', 'reports.read'],
  IT_SUPPORT: ['dashboard.read'],
}
export function hasPermission(role: QmsRole, permission: string) { return permissionsByRole[role]?.includes(permission) ?? false }
export function assertPermission(role: QmsRole, permission: string) { if (!hasPermission(role, permission)) throw new Error('Permission insuffisante pour cette opération.') }

export function assertDemoSeedAllowed(env: NodeJS.ProcessEnv) {
  if (!env.DATABASE_URL?.trim()) throw new Error('Seed refusé : DATABASE_URL est absente.')
  if (env.DEMO_MODE !== 'true' || env.DEMO_WRITE_ENABLED !== 'true') throw new Error('Seed refusé : DEMO_MODE=true et DEMO_WRITE_ENABLED=true sont requis.')
  if (env.DEMO_TARGET !== 'isolated-demo') throw new Error('Seed refusé : DEMO_TARGET=isolated-demo est requis pour prouver une cible isolée.')
  if (env.NODE_ENV === 'production' || env.VERCEL_ENV === 'production') throw new Error('Seed refusé : une cible de production est explicitement détectée.')
  const databaseName = env.DEMO_DATABASE_NAME?.trim()
  if (!databaseName) throw new Error('Seed refusé : DEMO_DATABASE_NAME doit identifier explicitement la base de démonstration.')
  try {
    const parsed = new URL(env.DATABASE_URL)
    if (parsed.pathname.slice(1) !== databaseName) throw new Error('nom différent')
  } catch (error) {
    if (error instanceof Error && error.message.includes('nom différent')) throw new Error('Seed refusé : DATABASE_URL ne cible pas DEMO_DATABASE_NAME.')
    throw new Error('Seed refusé : DATABASE_URL est invalide ou sa cible ne peut pas être contrôlée.')
  }
}

