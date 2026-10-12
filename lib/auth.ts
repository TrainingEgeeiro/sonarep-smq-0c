import { betterAuth } from 'better-auth'
import { Pool } from 'pg'

const secret = process.env.BETTER_AUTH_SECRET_3?.trim()
if (!secret) throw new Error('BETTER_AUTH_SECRET_3 est requis pour démarrer l’authentification.')
if (secret.length < 32) throw new Error('BETTER_AUTH_SECRET_3 doit contenir au moins 32 caractères.')

const authDatabaseUrl = process.env.DATABASE_URL_UNPOOLED?.trim() || process.env.DATABASE_URL?.trim()
if (!authDatabaseUrl) throw new Error('DATABASE_URL ou DATABASE_URL_UNPOOLED est requis pour démarrer l’authentification.')

const authPool = new Pool({
  connectionString: authDatabaseUrl,
  max: 3,
  options: '-c search_path=neon_auth',
})
const baseURL = process.env.BETTER_AUTH_URL ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : process.env.V0_RUNTIME_URL)

const developmentOrigins = ['http://localhost:3000', ...['V0_RUNTIME_URL', 'V0_DEV_APP_URL', 'V0_BUILD_URL', 'V0_SANDBOX_URL'].map((key) => process.env[key]).filter((value): value is string => Boolean(value))]
const productionOrigins = [process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`, process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`].filter((value): value is string => Boolean(value))

export const auth = betterAuth({
  database: authPool,
  baseURL,
  secret,
  emailAndPassword: { enabled: true, autoSignIn: true },
  trustedOrigins: process.env.NODE_ENV === 'development' ? developmentOrigins : productionOrigins,
  session: { expiresIn: 60 * 60 * 24 * 7, updateAge: 60 * 60 * 24 },
  ...(process.env.NODE_ENV === 'development' ? { advanced: { defaultCookieAttributes: { sameSite: 'none' as const, secure: true } } } : {}),
})

export async function getServerSession(requestHeaders: Headers) {
  return auth.api.getSession({ headers: requestHeaders })
}
