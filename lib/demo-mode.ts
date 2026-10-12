const ENABLED_VALUE = 'true'

function isAllowedNonProductionEnvironment(env: NodeJS.ProcessEnv) {
  if (env.VERCEL_ENV === 'production') return false
  if (env.VERCEL_ENV === 'preview') return true
  if (env.VERCEL_ENV === undefined && env.NODE_ENV === 'development') return true
  return false
}

export function isUnauthenticatedDemoMode(env: NodeJS.ProcessEnv = process.env) {
  return env.QMS_DEMO_NO_AUTH === ENABLED_VALUE && isAllowedNonProductionEnvironment(env)
}

export function demoModeStatus(env: NodeJS.ProcessEnv = process.env) {
  return {
    enabled: isUnauthenticatedDemoMode(env),
    requested: env.QMS_DEMO_NO_AUTH === ENABLED_VALUE,
    productionRefused: env.VERCEL_ENV === 'production',
    environmentUnknown: env.VERCEL_ENV !== 'preview' && env.VERCEL_ENV !== 'production' && env.NODE_ENV !== 'development',
  }
}
