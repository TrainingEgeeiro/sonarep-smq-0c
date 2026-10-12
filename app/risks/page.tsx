import { listRisks } from "./actions"
import { RisksWorkspace } from "./workspace"

export default async function RisksPage() {
  const data = await listRisks()
  return <RisksWorkspace data={data} />
}
