import { checkIntegrationGate, formatIntegrationGate } from '../lib/integration-gate'

const result = checkIntegrationGate()
process.stdout.write(`${formatIntegrationGate(result)}\n`)

if (!result.ok) process.exitCode = 1
