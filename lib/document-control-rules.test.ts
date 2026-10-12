import { describe, expect, it } from 'vitest'
import { canTransitionDocumentRevision, requiredDocumentPermission } from './document-control-rules'

describe('document control workflow', () => {
  it('autorise uniquement la séquence de révision contrôlée', () => {
    expect(canTransitionDocumentRevision('DRAFT', 'IN_REVIEW')).toBe(true)
    expect(canTransitionDocumentRevision('IN_REVIEW', 'APPROVED')).toBe(true)
    expect(canTransitionDocumentRevision('APPROVED', 'PUBLISHED')).toBe(true)
    expect(canTransitionDocumentRevision('PUBLISHED', 'OBSOLETE')).toBe(true)
    expect(canTransitionDocumentRevision('DRAFT', 'PUBLISHED')).toBe(false)
    expect(canTransitionDocumentRevision('OBSOLETE', 'PUBLISHED')).toBe(false)
  })

  it('refuse les clés de stockage publiques et les fichiers non autorisés', async () => {
    const { evidenceAttachmentInput } = await import('./validation')
    expect(() => evidenceAttachmentInput.parse({ evidenceId: '00000000-0000-0000-0000-000000000000', fileName: 'x.exe', mediaType: 'application/octet-stream', byteSize: 10, storageKey: 'public/x.exe' })).toThrow()
    expect(() => evidenceAttachmentInput.parse({ evidenceId: '00000000-0000-0000-0000-000000000000', fileName: 'x.pdf', mediaType: 'application/pdf', byteSize: 10, storageKey: 'private/x.pdf' })).not.toThrow()
  })

  it('associe chaque transition à une permission serveur dédiée', () => {
    expect(requiredDocumentPermission('IN_REVIEW')).toBe('documents.review')
    expect(requiredDocumentPermission('APPROVED')).toBe('documents.approve')
    expect(requiredDocumentPermission('PUBLISHED')).toBe('documents.publish')
    expect(requiredDocumentPermission('OBSOLETE')).toBe('documents.obsolete')
    expect(requiredDocumentPermission('UNKNOWN')).toBeNull()
  })
})
