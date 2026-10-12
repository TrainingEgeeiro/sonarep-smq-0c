# Incrément 03 — Document Control

## Périmètre livré

Le registre `/documents` permet de créer et consulter des documents contrôlés, de créer une nouvelle version, de rattacher le document à des processus et exigences du même périmètre organisationnel, et d'exécuter le circuit serveur suivant : brouillon → vérification → approbation → publication → archivage/obsolescence.

Les indicateurs sont calculés depuis PostgreSQL : total des documents actifs, documents publiés, documents dans le circuit et documents dont la date de revue est dépassée.

## Modèle de données

Les tables existantes `documents`, `document_revisions`, `document_processes`, `document_requirements` et `audit_events` sont réutilisées et étendues. Les enums `document_type` et `document_version_status` sont ajoutés. Un document possède une version initiale ; une révision crée toujours une nouvelle ligne et ne modifie pas une version publiée.

## Workflow et versionnement

Transitions contrôlées côté serveur : `DRAFT → SUBMITTED_FOR_VERIFICATION → IN_VERIFICATION → SUBMITTED_FOR_APPROVAL → APPROVED → PUBLISHED`. Une publication exige une version courante approuvée. Une nouvelle version revient en brouillon. Les versions approuvées/publiées ne sont pas modifiables par le service métier. Les approbations sont journalisées sous `UNVERIFIED_OPERATOR`, sans inventer une identité humaine.

## Relations et sécurité

Les processus et exigences liés sont vérifiés avant écriture et doivent appartenir à la même organisation. RLS reste activé sur les 12 tables existantes ; aucune politique permissive n'a été ajoutée. L'accès à PostgreSQL reste serveur uniquement. Une authentification fiable et des politiques RLS métier sont des prérequis avant exposition opérationnelle.

## Fichiers

Aucun fichier binaire n'est stocké dans PostgreSQL et aucun téléchargement n'est simulé. `storage_key` est seulement une référence facultative. Supabase Storage privé devra être évalué séparément avant activation de fichiers confidentiels.

## Migration

`drizzle/0003_document_control.sql` est préparée mais non appliquée à distance dans cet incrément. Elle est non destructive : extension d'enums, colonnes, index. L'application nécessite une approbation explicite et une vérification de l'environnement de développement.

## Tests et contrôles

Tests ajoutés/couverts par `lib/validation.test.ts` pour les statuts et règles d'obsolescence. À exécuter : `pnpm typecheck`, `pnpm test`, `pnpm db:check`, `pnpm build`, puis contrôle navigateur de `/documents`. La persistance PostgreSQL ne peut être déclarée validée avant application de la migration et test d'intégration sur l'environnement cible.

## Limites connues

La fiche détaillée expose le workflow et la création de version ; l'historique complet est servi par `getDocumentDetail` et journalisé dans `audit_events`. L'interface n'authentifie pas les opérateurs. Les fichiers confidentiels et approbations attribuées à des personnes réelles restent bloqués par conception.

## Déploiement et critères de clôture

Appliquer la migration préparée après approbation, exécuter les quatre commandes de contrôle, puis vérifier dans `/documents` la création, la relecture, une nouvelle version, une transition interdite, les relations et l'historique. L'incrément est **PARTIELLEMENT TERMINÉ** tant que la migration distante, les tests d'intégration PostgreSQL et le parcours navigateur n'ont pas été exécutés dans l'environnement cible.
