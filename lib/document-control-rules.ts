export const documentRevisionTransitions = {
  DRAFT: ['IN_REVIEW'],
  IN_REVIEW: ['APPROVED'],
  APPROVED: ['PUBLISHED'],
  PUBLISHED: ['WITHDRAWN'],
  WITHDRAWN: [],
} as const

export type DocumentRevisionStatus = keyof typeof documentRevisionTransitions
export type DocumentRevisionNextStatus = (typeof documentRevisionTransitions)[DocumentRevisionStatus][number]

export function canTransitionDocumentRevision(status: string, nextStatus: string) {
  return (documentRevisionTransitions[status as DocumentRevisionStatus] ?? []).includes(nextStatus as never)
}

export function requiredDocumentPermission(nextStatus: string) {
  if (nextStatus === 'IN_REVIEW') return 'documents.review'
  if (nextStatus === 'APPROVED') return 'documents.approve'
  if (nextStatus === 'PUBLISHED') return 'documents.publish'
  if (nextStatus === 'WITHDRAWN') return 'documents.obsolete'
  return null
}
