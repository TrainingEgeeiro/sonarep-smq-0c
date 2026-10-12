import { and, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { auth } from './auth'
import { appUsers, roles, userRoles } from './db/schema'
import { getDb } from './db'
import { hasPermission, type QmsPermission, type QmsRole } from './governance'

export class AuthorizationError extends Error {
  readonly code: 'UNAUTHENTICATED' | 'FORBIDDEN'

  constructor(code: 'UNAUTHENTICATED' | 'FORBIDDEN') {
    super(code === 'UNAUTHENTICATED' ? 'Authentification requise.' : 'Permission insuffisante pour cette opération.')
    this.name = 'AuthorizationError'
    this.code = code
  }
}

export type AuthorizationContext = {
  userId: string
  organizationId: string
  roles: QmsRole[]
  permissions: QmsPermission[]
}

export async function getAuthorizationContext(requestHeaders?: Headers): Promise<AuthorizationContext | null> {
  const session = await auth.api.getSession({ headers: requestHeaders ?? (await headers()) })
  if (!session?.user) return null

  const db = getDb()
  const [user] = await db.select({ id: appUsers.id, organizationId: appUsers.organizationId }).from(appUsers).where(eq(appUsers.externalSubject, session.user.id)).limit(1)
  if (!user) return null

  const assignments = await db.select({ role: roles.code })
    .from(userRoles)
    .innerJoin(roles, eq(userRoles.roleId, roles.id))
    .where(eq(userRoles.userId, user.id))

  const resolvedRoles = assignments.map((assignment) => assignment.role).filter(Boolean) as QmsRole[]
  const resolvedPermissions = new Set<QmsPermission>()
  for (const role of resolvedRoles) {
    for (const permission of getPermissionsForRole(role)) resolvedPermissions.add(permission)
  }
  return { userId: user.id, organizationId: user.organizationId, roles: resolvedRoles, permissions: [...resolvedPermissions] }
}

function getPermissionsForRole(role: QmsRole): QmsPermission[] {
  return Object.keys(permissionCatalog).filter((permission) => hasPermission(role, permission as QmsPermission)) as QmsPermission[]
}

export async function requirePermission(permission: QmsPermission, requestHeaders?: Headers) {
  const context = await getAuthorizationContext(requestHeaders)
  if (!context) throw new AuthorizationError('UNAUTHENTICATED')
  if (!context.permissions.includes(permission)) throw new AuthorizationError('FORBIDDEN')
  return context
}

export function assertOrganizationAccess(context: AuthorizationContext, organizationId: string) {
  if (context.organizationId !== organizationId) throw new AuthorizationError('FORBIDDEN')
}

export const permissionCatalog = {
  'dashboard.read': 'Consulter le tableau de bord et les indicateurs',
  'requirements.read': 'Consulter le référentiel des exigences',
  'requirements.create': 'Créer une exigence',
  'requirements.update': 'Modifier une exigence',
  'requirements.validate': 'Valider une exigence',
  'compliance.read': 'Consulter les évaluations de conformité',
  'compliance.create': 'Créer une évaluation de conformité',
  'compliance.validate': 'Valider une évaluation de conformité',
  'documents.read': 'Consulter les documents contrôlés',
  'documents.create': 'Créer un document contrôlé',
  'documents.update': 'Modifier un document contrôlé',
  'documents.publish': 'Publier un document contrôlé',
  'evidence.read': 'Consulter les preuves',
  'evidence.create': 'Déposer une preuve',
  'nonconformities.read': 'Consulter les non-conformités',
  'nonconformities.create': 'Créer une non-conformité',
  'nonconformities.update': 'Modifier une non-conformité',
  'nonconformities.close': 'Clôturer une non-conformité',
  'actions.read': 'Consulter les actions correctives',
  'actions.create': 'Créer une action corrective',
  'actions.update': 'Modifier une action corrective',
  'actions.verify': 'Vérifier l’efficacité d’une action',
  'actions.close': 'Clôturer une action corrective',
  'audits.read': 'Consulter les audits',
  'audits.create': 'Créer un programme ou un audit',
  'audits.update': 'Modifier un audit',
  'audits.validate': 'Valider un constat d’audit',
  'risks.read': 'Consulter les risques',
  'risks.update': 'Modifier les risques',
  'administration.read': 'Consulter l’administration',
  'administration.members.manage': 'Gérer les membres et leurs rôles',
} as const

export type PermissionCatalog = typeof permissionCatalog

export function isKnownPermission(value: string): value is QmsPermission {
  return value in permissionCatalog
}

export function requireClientRole(_role: unknown): never {
  throw new AuthorizationError('FORBIDDEN')
}
