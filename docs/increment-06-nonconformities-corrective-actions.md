# Increment 06 — Non-conformités et actions correctives

## Statut
PARTIELLEMENT TERMINÉ : le code, la migration locale et les contrôles locaux sont livrés. Aucune migration distante ni écriture Supabase n'a été effectuée.

## Modèle
`nonconformities` porte la référence organisationnelle, l'origine, la description factuelle, la criticité, les liens facultatifs, le responsable de traitement et l'échéance. `cause_analyses`, `corrective_actions` et `effectiveness_reviews` distinguent respectivement l'analyse, le traitement des causes et la preuve d'efficacité.

## Workflow
Détectée → En évaluation → Mesure immédiate → Analyse des causes → Plan d'action → Actions en cours → Vérification d'efficacité → Clôturée. Une réouverture est possible depuis la clôture ou après une inefficacité. La clôture serveur exige une analyse enregistrée, aucune action planifiée/en cours et une revue d'efficacité `EFFECTIVE`.

## Dépendances et migration
`drizzle/0006_nonconformities_corrective_actions.sql` doit être appliquée après les tables de base, `0004_risks_opportunities.sql` et `0005_internal_audits.sql`. Elle est non destructive, crée seulement des types/tables/index et active RLS sans politique permissive. Les liens audit, constat et risque restent facultatifs dans le modèle applicatif, mais la migration suppose les tables correspondantes pour créer les clés étrangères.

## Sécurité
Accès base côté serveur, validation Zod, contrôle du processus dans l'organisation, origine `UNVERIFIED_OPERATOR` pour les événements. Aucune identité réelle ni approbation humaine n'est revendiquée. Les fichiers de preuve et les politiques RLS restent hors périmètre opérationnel tant que l'authentification n'est pas validée.

## Tests et limites
Tests unitaires de validation, transitions et scoring ajoutés; `pnpm typecheck`, `pnpm test`, `pnpm db:check` et `pnpm build` doivent être exécutés. Aucun test d'intégration PostgreSQL n'est déclaré réussi tant que les migrations précédentes et celle-ci ne sont pas appliquées à Supabase. `/nonconformities` et les routes précédentes doivent être vérifiées dans le navigateur.

## Critères de clôture
Appliquer explicitement les migrations, créer/lire une non-conformité, persister analyse/actions/revue, tester transitions et clôture, vérifier l'historique, RLS, régressions et documentation. Ne pas commencer l'Increment 07 avant ces preuves.
