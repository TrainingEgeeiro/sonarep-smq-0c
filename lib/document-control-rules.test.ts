import { describe, expect, it } from 'vitest'
import { canTransitionDocumentRevision, requiredDocumentPermission } from './document-control-rules'

describe('document control workflow', () => {
  it('autorise uniquement la séquence de révision contrôlée', () => {
    expect(canTransitionDocumentRevision('DRAFT', 'IN_REVIEW')).toBe(true)
    expect(canTransitionDocumentRevision('IN_REVIEW', 'APPROVED')).toBe(true)
    expect(canTransitionDocumentRevision('APPROVED', 'PUBLISHED')).toBe(true)
    expect(canTransitionDocumentRevision('PUBLISHED', 'WITHDRAWN')).toBe(true)
    expect(canTransitionDocumentRevision('DRAFT', 'PUBLISHED')).toBe(false)
    expect(canTransitionDocumentRevision('WITHDRAWN', 'PUBLISHED')).toBe(false)
  })

  it('associe chaque transition à une permission serveur dédiée', () => {
    expect(requiredDocumentPermission('IN_REVIEW')).toBe('documents.review')
    expect(requiredDocumentPermission('APPROVED')).toBe('documents.approve')
    expect(requiredDocumentPermission('PUBLISHED')).toBe('documents.publish')
    expect(requiredDocumentPermission('WITHDRAWN')).toBe('documents.obsolete')
    expect(requiredDocumentPermission('UNKNOWN')).toBeNull()
  })
})
