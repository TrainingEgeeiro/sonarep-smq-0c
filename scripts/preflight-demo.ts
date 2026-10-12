import 'dotenv/config'
import { formatDemoPreflight, runDemoPreflight } from '../lib/demo-preflight'

async function main() {
  const result = await runDemoPreflight()
  console.log(formatDemoPreflight(result))
  if (!result.ok) process.exitCode = 1
}

void main()
