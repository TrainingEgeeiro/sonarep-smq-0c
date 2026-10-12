import { getIndicatorWorkspace } from "./actions"
import { IndicatorWorkspace } from "./workspace"

export default async function IndicatorsPage() {
  const data = await getIndicatorWorkspace()
  return <IndicatorWorkspace initialData={data} />
}
