import { listAudits } from "./actions"
import { AuditsWorkspace } from "./workspace"

export default async function AuditsPage() {
  const data = await listAudits()
  return <AuditsWorkspace data={data} />
}
