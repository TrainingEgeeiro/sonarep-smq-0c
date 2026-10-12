import type { DemoRole } from './db/schema'

export const demoIdentity = { id: '00000000-0000-0000-0000-000000000001', displayName: 'Direction démo', role: 'EXECUTIVE_VIEWER' as DemoRole, isRealAuthentication: false }
export const permissionsByRole: Record<DemoRole, string[]> = {
  QMS_ADMIN: ['dashboard.read', 'requirements.read', 'requirements.write', 'compliance.write', 'nonconformities.write', 'actions.write', 'audits.write', 'reports.read', 'demo.admin'],
  QUALITY_MANAGER: ['dashboard.read', 'requirements.read', 'compliance.write', 'nonconformities.write', 'actions.write', 'audits.write', 'reports.read'],
  COMPLIANCE_OWNER: ['dashboard.read', 'requirements.read', 'compliance.write', 'reports.read'],
  PRODUCTION_MANAGER: ['dashboard.read', 'nonconformities.read', 'actions.read', 'operations.read'],
  ASSESSOR: ['dashboard.read', 'requirements.read', 'compliance.write'],
  ACTION_OWNER: ['dashboard.read', 'nonconformities.read', 'actions.write'],
  INTERNAL_AUDITOR: ['dashboard.read', 'requirements.read', 'compliance.read', 'audits.write', 'reports.read'],
  EXECUTIVE_VIEWER: ['dashboard.read', 'reports.read'],
  IT_SUPPORT: ['dashboard.read', 'demo.admin'],
}
export function hasPermission(role: DemoRole, permission: string) { return permissionsByRole[role]?.includes(permission) ?? false }
export function assertPermission(role: DemoRole, permission: string) { if (!hasPermission(role, permission)) throw new Error('Permission insuffisante pour cette opération.') }

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

