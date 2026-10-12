# SONAREP QMS 360 — Référentiel produit

## Positionnement

SONAREP QMS 360 est un ERP professionnel de management de la qualité destiné à une utilisation opérationnelle réelle. Les écrans actuels peuvent présenter des données fictives pour valider le parcours, mais le produit et ses contrats métier ne sont pas définis comme une démonstration.

## Périmètre fonctionnel

Le produit couvre le pilotage, le référentiel d'exigences, les évaluations de conformité, les documents contrôlés, les preuves, les non-conformités, les actions correctives/préventives, les audits, les risques, les indicateurs et l'administration.

Toute opération sensible doit être authentifiée, autorisée côté serveur, limitée à l'organisation de l'utilisateur, validée par Zod ou une règle métier équivalente, persistée dans PostgreSQL et journalisée avec l'acteur, l'organisation, l'entité et le résultat.

## Classification actuelle

- **Socle présent** : navigation QMS, contrat de permissions atomiques, résolution serveur de session et d'organisation, contrôles d'entrée, journalisation des services préparés, migrations versionnées dans le dépôt.
- **Partiel** : couverture des services métier, affectation des rôles applicatifs, séparation complète des périmètres, gestion documentaire et preuves réelles, observabilité et procédures de sauvegarde/restauration.
- **Non validé** : authentification de bout en bout sur une cible PostgreSQL autorisée, sessions persistées, déconnexion, tests E2E, stockage de fichiers, exploitation production et reprise après incident.

Une fonctionnalité ne peut être déclarée opérationnelle qu'après un test correspondant à son chemin réel. Les données de `lib/demo-data.ts` et l'identité `demoIdentity` sont des fixtures de parcours et ne représentent aucun utilisateur SONAREP.

## Critères de mise en production

1. Cible PostgreSQL et schéma autorisés, migrations appliquées et vérifiées.
2. Secret Better Auth valide, sessions et cookies vérifiés dans le domaine de déploiement.
3. RBAC et isolation organisationnelle testés sur chaque mutation sensible.
4. Journal d'audit, rétention, sauvegarde, restauration et supervision définis.
5. Tests unitaires, intégration PostgreSQL et E2E verts dans l'environnement correspondant.
6. Procédure de déploiement, rollback, gestion des incidents et responsabilité d'exploitation approuvées.

L'état du projet reste « non prêt pour la production » tant que cette liste n'est pas satisfaite.

## Cartographie des mécanismes de démonstration

| Élément | Fonction | Décision |
| --- | --- | --- |
| `lib/demo-data.ts` | Fixtures d'interface | Conserver comme données de test explicitement étiquetées |
| `demoIdentity` | Identité simulée historique | Ne jamais utiliser pour autoriser une requête réelle |
| `DEMO_MODE` / `DEMO_WRITE_ENABLED` | Garde-fous du seed | Conserver et limiter au seed contrôlé |
| `DEMO_TARGET` / `DEMO_DATABASE_NAME` | Identification de cible | Exiger une cible non-production vérifiable |
| `scripts/preflight-demo.ts` | Prévalidation de seed | Utiliser uniquement pour les environnements de développement isolés |

Aucun de ces mécanismes ne constitue une autorisation d'écriture en production.

## Prérequis réels

La cible Neon connectée doit être formellement identifiée avant toute migration ou écriture distante. L'absence des tables Better Auth est un blocage d'intégration à traiter par procédure contrôlée, pas une limitation du produit cible.

Les autorisations d'hébergement, les domaines, la politique de secrets et la responsabilité d'exploitation SONAREP restent à confirmer.

## Références

- `docs/environments.md` — stratégie des environnements et déploiements
- `docs/increment-3.5.md` — couverture RBAC et contrôles de sécurité
- `lib/governance.ts` — garde-fous de seed et matrice historique
- `lib/authorization.ts` — autorisation serveur

La date de validation et la cible utilisée doivent être ajoutées au compte rendu de chaque déploiement.

## Statut

Référentiel produit mis à jour le 12 octobre 2026. Ce document décrit les exigences et l'état vérifiable du code ; il ne constitue pas une déclaration de disponibilité production.

## Données et fonctions non connectées

Les interfaces qui affichent encore des fixtures doivent porter un marquage explicite d'environnement et ne doivent pas proposer une écriture présentée comme persistée. Toute fonction non connectée doit être affichée comme non validée ou prérequis, jamais comme opérationnelle.

## Environnements et déploiements

Le développement et les tests peuvent utiliser des cibles dédiées et réinitialisables. La préproduction doit utiliser une base séparée avec des secrets distincts. La production doit être une cible explicitement autorisée, avec migration contrôlée, sauvegarde vérifiée et accès nominatif.

Les variables `DEMO_*` ne doivent jamais être requises par le runtime métier ni activées en production.

## Prérequis de mise en production

- cible PostgreSQL autorisée et identifiée ;
- migrations versionnées appliquées et contrôlées ;
- secret Better Auth >= 32 caractères et rotation documentée ;
- RBAC, isolation organisationnelle et audit validés ;
- stockage documentaire, sauvegarde, restauration et supervision disponibles ;
- tests unitaires, intégration et E2E réussis ;
- procédure de rollback et d'incident approuvée.

Le projet reste non prêt pour la production tant que ces éléments ne sont pas vérifiés.
