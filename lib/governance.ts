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
