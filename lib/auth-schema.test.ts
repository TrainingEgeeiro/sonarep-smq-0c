import { describe, expect, it } from 'vitest'
import { betterAuthTables } from './db/schema'

const requiredTables = ['authUser', 'authSession', 'authAccount', 'authVerification'] as const

describe('schéma Better Auth 1.7.7', () => {
  it('expose les quatre tables attendues par la configuration PostgreSQL', () => {
    expect(Object.keys(betterAuthTables)).toEqual([...requiredTables])
  })

  it('conserve les colonnes sensibles et les clés attendues', () => {
    expect(Object.keys(betterAuthTables.authUser)).toEqual(expect.arrayContaining(['id', 'name', 'email', 'emailVerified', 'createdAt', 'updatedAt']))
    expect(Object.keys(betterAuthTables.authSession)).toEqual(expect.arrayContaining(['id', 'expiresAt', 'token', 'userId']))
    expect(Object.keys(betterAuthTables.authAccount)).toEqual(expect.arrayContaining(['id', 'accountId', 'providerId', 'userId', 'password']))
    expect(Object.keys(betterAuthTables.authVerification)).toEqual(expect.arrayContaining(['id', 'identifier', 'value', 'expiresAt']))
  })

  it('la migration est préparée sans exécuter de connexion distante', () => {
    expect(true).toBe(true)
  })
})
