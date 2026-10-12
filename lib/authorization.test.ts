import { describe, expect, it } from 'vitest'
import { AuthorizationError, assertOrganizationAccess, requireClientRole } from './authorization'
import { hasPermission, type QmsRole } from './governance'

describe('moteur RBAC isolé', () => {
  it('sépare lecture, modification, validation et clôture', () => {
    expect(hasPermission('CONTRIBUTOR', 'documents.update')).toBe(true)
    expect(hasPermission('CONTRIBUTOR', 'documents.publish')).toBe(false)
    expect(hasPermission('QUALITY_OFFICER', 'actions.update')).toBe(true)
    expect(hasPermission('QUALITY_OFFICER', 'actions.verify')).toBe(true)
    expect(hasPermission('QUALITY_OFFICER', 'actions.close')).toBe(false)
  })

  it('refuse une permission inconnue et ne donne pas d’administration par défaut', () => {
    expect(hasPermission('VIEWER', 'administration.members.manage')).toBe(false)
    expect(hasPermission('VIEWER', 'permission.inventee')).toBe(false)
    expect(hasPermission('CONTRIBUTOR', 'administration.members.manage')).toBe(false)
  })

  it('distingue absence d’authentification et absence de permission', () => {
    expect(new AuthorizationError('UNAUTHENTICATED').code).toBe('UNAUTHENTICATED')
    expect(new AuthorizationError('FORBIDDEN').code).toBe('FORBIDDEN')
  })

  it('refuse une organisation différente', () => {
    const context = { userId: 'user-1', organizationId: 'org-a', roles: ['VIEWER' as QmsRole], permissions: [] as string[] }
    expect(() => assertOrganizationAccess(context, 'org-b')).toThrowError(AuthorizationError)
    expect(() => assertOrganizationAccess(context, 'org-a')).not.toThrow()
  })

  it('ne fait jamais confiance à un rôle fourni par le client', () => {
    expect(() => requireClientRole('ORG_ADMIN')).toThrowError(AuthorizationError)
  })
})
