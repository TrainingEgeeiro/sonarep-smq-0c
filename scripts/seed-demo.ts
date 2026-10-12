import 'dotenv/config'
import { sql } from 'drizzle-orm'
import { getDb } from '../lib/db'
import { assertDemoSeedAllowed } from '../lib/governance'
import { appUsers, auditEvents, auditFindings, auditPrograms, audits, complianceEvaluations, controlledDocuments, correctiveActions, evidence, nonconformities, organizations, requirements } from '../lib/db/schema'

const ids = {
  organization: '00000000-0000-0000-0000-000000000100',
  user: '00000000-0000-0000-0000-000000000101',
  requirement1: '00000000-0000-0000-0000-000000000201',
  requirement2: '00000000-0000-0000-0000-000000000202',
  evaluation1: '00000000-0000-0000-0000-000000000301',
  evaluation2: '00000000-0000-0000-0000-000000000302',
  document: '00000000-0000-0000-0000-000000000401',
  evidence: '00000000-0000-0000-0000-000000000501',
  nc: '00000000-0000-0000-0000-000000000601',
  action: '00000000-0000-0000-0000-000000000701',
  program: '00000000-0000-0000-0000-000000000801',
  audit: '00000000-0000-0000-0000-000000000901',
  finding: '00000000-0000-0000-0000-000000001001',
} as const

export const demoSeedPlan = { organizationCode: 'SONAREP-DEMO', references: ['REQ-DEMO-001', 'REQ-DEMO-002', 'DOC-DEMO-014', 'EVD-DEMO-001', 'NC-DEMO-001', 'AC-DEMO-001', 'AUD-DEMO-001'] }

export async function seedDemo() {
  assertDemoSeedAllowed(process.env)
  const db = getDb()
  await db.execute(sql`select 1`)
  await db.transaction(async (tx) => {
    await tx.insert(organizations).values({ id: ids.organization, code: 'SONAREP-DEMO', name: 'SONAREP — environnement de démonstration', isDemo: true }).onConflictDoNothing({ target: organizations.code })
    await tx.insert(appUsers).values({ id: ids.user, organizationId: ids.organization, externalSubject: 'demo-direction', displayName: 'Direction démo', email: 'direction.demo@example.invalid', isActive: true }).onConflictDoNothing({ target: appUsers.id })
    await tx.insert(requirements).values([
      { id: ids.requirement1, organizationId: ids.organization, reference: 'REQ-DEMO-001', source: 'ISO 9001', sourceVersion: '2015', title: 'Maîtrise des informations documentées', summary: 'Les informations documentées nécessaires au SMQ sont maîtrisées.', domain: 'Documentation', applicability: 'Applicable', ownerId: ids.user, status: 'ACTIVE' },
      { id: ids.requirement2, organizationId: ids.organization, reference: 'REQ-DEMO-002', source: 'ISO 9001', sourceVersion: '2015', title: 'Évaluation de la conformité', summary: 'La conformité des processus est évaluée sur un périmètre défini.', domain: 'Pilotage', applicability: 'Applicable', ownerId: ids.user, status: 'ACTIVE' },
    ]).onConflictDoNothing()
    await tx.insert(complianceEvaluations).values([
      { id: ids.evaluation1, organizationId: ids.organization, requirementId: ids.requirement1, scope: 'Périmètre démonstration', evaluatedOn: '2026-10-12', assessorId: ids.user, status: 'COMPLIANT', justification: 'Procédure et enregistrements disponibles dans le périmètre de démonstration.', evidenceReference: 'EVD-DEMO-001', createdBy: ids.user },
      { id: ids.evaluation2, organizationId: ids.organization, requirementId: ids.requirement2, scope: 'Périmètre démonstration', evaluatedOn: '2026-10-12', assessorId: ids.user, status: 'PARTIALLY_COMPLIANT', justification: 'Le suivi est en place ; la formalisation de la revue reste à compléter.', createdBy: ids.user },
    ]).onConflictDoNothing()
    await tx.insert(controlledDocuments).values({ id: ids.document, organizationId: ids.organization, reference: 'DOC-DEMO-014', title: 'Procédure de réception — démonstration', type: 'Procédure', ownerId: ids.user, version: '1.0', status: 'PUBLISHED', effectiveDate: '2026-09-01', nextReviewDate: '2027-09-01', sourceReference: 'REQ-DEMO-001', createdBy: ids.user }).onConflictDoNothing()
    await tx.insert(evidence).values({ id: ids.evidence, organizationId: ids.organization, reference: 'EVD-DEMO-001', title: 'Registre de revue documentaire — démonstration', type: 'Enregistrement', ownerId: ids.user, evidenceDate: '2026-10-10', origin: 'Donnée fictive générée pour démonstration', linkedEntityType: 'REQUIREMENT', linkedEntityId: ids.requirement1, externalReference: 'DEMO-ONLY', availability: 'REFERENCE_ONLY', createdBy: ids.user }).onConflictDoNothing()
    await tx.insert(nonconformities).values({ id: ids.nc, organizationId: ids.organization, reference: 'NC-DEMO-001', title: 'Habilitation à renouveler', factualDescription: 'Une habilitation fictive arrive à échéance dans le périmètre de démonstration.', origin: 'Audit interne de démonstration', severity: 'MAJOR', detectedOn: '2026-10-08', ownerId: ids.user, dueDate: '2026-11-08', status: 'OPEN', requirementId: ids.requirement2, createdBy: ids.user }).onConflictDoNothing()
    await tx.insert(correctiveActions).values({ id: ids.action, organizationId: ids.organization, reference: 'AC-DEMO-001', action: 'Renouveler les habilitations et archiver la preuve de revue.', nonconformityId: ids.nc, ownerId: ids.user, dueDate: '2026-10-25', status: 'IN_PROGRESS', completionEvidenceReference: null, createdBy: ids.user }).onConflictDoNothing()
    await tx.insert(auditPrograms).values({ id: ids.program, organizationId: ids.organization, reference: 'PG-AUD-DEMO-2026', title: 'Programme d’audits internes — démonstration', year: 2026, createdBy: ids.user }).onConflictDoNothing()
    await tx.insert(audits).values({ id: ids.audit, organizationId: ids.organization, programId: ids.program, reference: 'AUD-DEMO-001', scope: 'Documentation et habilitations', criteria: 'ISO 9001:2015 — périmètre de démonstration', auditorId: ids.user, plannedStart: '2026-10-15', plannedEnd: '2026-10-16', status: 'PLANNED', createdBy: ids.user }).onConflictDoNothing()
    await tx.insert(auditFindings).values({ id: ids.finding, auditId: ids.audit, title: 'Point de vigilance documentaire', description: 'La preuve de revue doit être associée au dossier de démonstration.', evidenceReference: 'EVD-DEMO-001', nonconformityId: ids.nc, createdBy: ids.user }).onConflictDoNothing()
    await tx.insert(auditEvents).values({ organizationId: ids.organization, eventType: 'DEMO_SEED', entityType: 'ORGANIZATION', entityId: ids.organization, actorId: ids.user, result: 'SUCCESS', summary: 'Jeu de données fictives de démonstration inséré ou déjà présent.', correlationId: 'seed-sonarep-demo-v1', metadata: { demoOnly: true } }).onConflictDoNothing()
  })
  return { organizationId: ids.organization, references: demoSeedPlan.references }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedDemo().then((result) => console.log(`Seed démo terminé: ${result.references.length} références stables.`)).catch((error) => { console.error(error instanceof Error ? error.message : 'Erreur seed'); process.exitCode = 1 })
}

export { ids as demoSeedIds }
