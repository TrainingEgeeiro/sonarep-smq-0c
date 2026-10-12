import 'dotenv/config'
import { eq } from 'drizzle-orm'
import { checkIntegrationGate, formatIntegrationGate } from '../lib/integration-gate'
import { getDb } from '../lib/db'
import { appUsers, authUser, roles, userRoles } from '../lib/db/schema'

async function main() {
  const gate = checkIntegrationGate(process.env)
  if (!gate.ok) {
    console.error(formatIntegrationGate(gate))
    process.exitCode = 1
    return
  }

  const email = process.env.ADMIN_BOOTSTRAP_EMAIL?.trim().toLowerCase()
  const password = process.env.ADMIN_BOOTSTRAP_PASSWORD
  const name = process.env.ADMIN_BOOTSTRAP_NAME?.trim()
  const organizationId = process.env.ADMIN_BOOTSTRAP_ORGANIZATION_ID?.trim()
  const initSecret = process.env.ADMIN_BOOTSTRAP_SECRET?.trim()

  if (!email || !password || !name || !organizationId || !initSecret) throw new Error('ADMIN_BOOTSTRAP_EMAIL, ADMIN_BOOTSTRAP_PASSWORD, ADMIN_BOOTSTRAP_NAME, ADMIN_BOOTSTRAP_ORGANIZATION_ID et ADMIN_BOOTSTRAP_SECRET sont requis.')
  if (password.length < 12) throw new Error('ADMIN_BOOTSTRAP_PASSWORD doit contenir au moins 12 caractères.')
  if (initSecret.length < 32) throw new Error('ADMIN_BOOTSTRAP_SECRET doit contenir au moins 32 caractères.')
  if (initSecret !== process.env.INTEGRATION_TARGET_SECRET) throw new Error('Le secret de bootstrap ne correspond pas au secret de la cible autorisée.')

  const db = getDb()
  const [existingAuthUser] = await db.select({ id: authUser.id }).from(authUser).where(eq(authUser.email, email)).limit(1)
  if (existingAuthUser) throw new Error('Un compte Better Auth existe déjà pour cette adresse ; aucun mot de passe n’a été réinitialisé.')

  const { auth } = await import('../lib/auth')
  const result = await auth.api.signUpEmail({ body: { email, password, name } })
  if (!result?.user?.id) throw new Error('La création Better Auth n’a pas retourné d’utilisateur.')

  try {
    await db.transaction(async (tx) => {
      const [applicationUser] = await tx.insert(appUsers).values({ organizationId, externalSubject: result.user.id, displayName: name, email }).returning({ id: appUsers.id })
      if (!applicationUser) throw new Error('Le rattachement au modèle métier a échoué.')
      const [adminRole] = await tx.select({ id: roles.id }).from(roles).where(eq(roles.code, 'QMS_ADMIN')).limit(1)
      if (!adminRole) throw new Error('Le rôle QMS_ADMIN n’existe pas dans la cible.')
      await tx.insert(userRoles).values({ userId: applicationUser.id, roleId: adminRole.id })
    })
  } catch (error) {
    console.error('Le compte Better Auth a été créé, mais le rattachement métier a échoué. Ne relancez pas le script sans inspection contrôlée.', error instanceof Error ? error.message : 'erreur inconnue')
    process.exitCode = 1
    return
  }

  console.log(`Compte administrateur créé et rattaché à l’organisation ${organizationId}.`)
  console.log('Le mot de passe n’est jamais affiché, journalisé ni stocké par ce script.')
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : 'Échec du bootstrap administrateur.')
  process.exitCode = 1
})
