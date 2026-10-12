const ENABLED_VALUE = 'true'

export function isUnauthenticatedDemoMode(env: NodeJS.ProcessEnv = process.env) {
  return env.QMS_DEMO_NO_AUTH === ENABLED_VALUE && env.NODE_ENV !== 'production'
}

export function demoModeStatus(env: NodeJS.ProcessEnv = process.env) {
  return {
    enabled: isUnauthenticatedDemoMode(env),
    requested: env.QMS_DEMO_NO_AUTH === ENABLED_VALUE,
    productionRefused: env.NODE_ENV === 'production' && env.QMS_DEMO_NO_AUTH === ENABLED_VALUE,
  }
}
