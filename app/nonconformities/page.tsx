import { listNonconformities } from "./actions"
import { NonconformitiesWorkspace } from "./workspace"

export default async function NonconformitiesPage() {
  const data = await listNonconformities()
  return <NonconformitiesWorkspace data={data} />
}
