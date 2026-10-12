# Increment 05 — Audits internes et inspections

## Statut
PARTIELLEMENT TERMINÉ. Le module et la migration locale sont développés et testés localement. Aucune migration distante, donnée Supabase ou politique RLS n'a été modifiée.

## Périmètre livré
- `/audits` : indicateurs persistés, registre filtrable/recherchable et création d'un audit.
- Programme, fiche d'audit, points de contrôle, constats et rapport.
- Relations optionnelles processus/exigences ; risque facultatif sur un constat.
- Journalisation des créations, transitions et constats.
- Statuts serveur : brouillon, planifié, préparation, en cours, consolidation, rapport préparé, terminé, annulé.
- Rapport obligatoire et validé avant passage à `COMPLETED`.
- Les validations restent des références système non attribuées à une personne réelle.

## Migration
`drizzle/0005_internal_audits.sql` doit être appliquée après `0003_document_control.sql` et `0004_risks_opportunities.sql`, car les constats peuvent référencer `risks` et les audits référencent processus/exigences. La migration crée sept enums, sept tables, index et RLS sans politique permissive. Elle est non destructive pour les tables existantes mais échouera si les dépendances précédentes ne sont pas présentes.

## Classification des constats
Conformité, observation, opportunité d'amélioration, non-conformité potentielle ou confirmée. Gravité : faible, moyenne, haute ou critique. Un constat peut référencer une exigence, un processus, un risque ou une preuve textuelle ; aucune action corrective persistée n'est simulée avant le module dédié.

## Tests et limites
Tests unitaires de validation et transitions, `pnpm typecheck`, `pnpm test`, `pnpm db:check`, `pnpm build` et vérification navigateur `/audits` sont requis avant clôture. La persistance PostgreSQL réelle, l'application de la migration, les RLS effectives, les versions documentaires et l'identité des approbateurs restent à démontrer sur Supabase.

## Critères de clôture
Appliquer explicitement la migration dans l'ordre requis, créer et relire un programme/audit, ajouter un point de contrôle et un constat, préparer puis valider un rapport, vérifier les transitions et l'audit log PostgreSQL, exécuter les régressions et confirmer la documentation. Ne pas commencer l'Increment 06 avant ces preuves.
