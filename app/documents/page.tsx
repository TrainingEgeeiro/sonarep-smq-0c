import { listDocumentOptions, listDocuments, listOrganizations } from "./actions"
import { DocumentsWorkspace } from "./workspace"

export const metadata = { title: "Documents contrôlés | SMQ-360", description: "Registre documentaire maîtrisé du système qualité." }

export default async function DocumentsPage() {
  try {
    const [{ rows, metrics }, organizations] = await Promise.all([listDocuments(), listOrganizations()])
    const organizationId = organizations[0]?.id ?? ""
    const options = organizationId ? await listDocumentOptions(organizationId) : { processOptions: [], requirementOptions: [] }
    return <DocumentsWorkspace initialRows={rows} metrics={metrics} organizations={organizations} options={options} />
  } catch {
    return <DocumentsWorkspace initialRows={[]} metrics={{ total: 0, published: 0, inReview: 0, overdue: 0 }} organizations={[]} options={{ processOptions: [], requirementOptions: [] }} databaseError />
  }
}
