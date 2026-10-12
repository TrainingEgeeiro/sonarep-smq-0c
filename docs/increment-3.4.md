# SONAREP QMS 360 — Incrément 3.4

## État

Le socle RBAC est implémenté et testé indépendamment de Neon. Aucun seed, aucune migration et aucune écriture distante n'ont été exécutés dans cet incrément.

## Matrice initiale

Les rôles métier retenus sont `ORG_ADMIN`, `QMS_MANAGER`, `QUALITY_OFFICER`, `AUDITOR`, `DOCUMENT_CONTROLLER`, `CONTRIBUTOR` et `VIEWER`. Les rôles historiques du démonstrateur (`QMS_ADMIN`, `QUALITY_MANAGER`, etc.) restent acceptés pour compatibilité jusqu'à migration formelle.

Les permissions sont atomiques : `read`, `create`, `update`, `validate`, `publish`, `verify` et `close` sont distinctes. Une permission d'écriture ne confère pas automatiquement validation ou clôture.

| Domaine | Permissions |
| --- | --- |
| Pilotage | `dashboard.read`, `reports.read` |
| Exigences / conformité | `requirements.read/create/update/validate`, `compliance.read/create/validate` |
| Documents / preuves | `documents.read/create/update/publish`, `evidence.read/create` |
| Non-conformités | `nonconformities.read/create/update/close` |
| Actions | `actions.read/create/update/verify/close` |
| Audits | `audits.read/create/update/validate` |
| Risques | `risks.read/update` |
| Administration | `administration.read`, `administration.members.manage` |

`VIEWER` est en lecture seule. `ORG_ADMIN` est le seul rôle métier initial à gérer les membres. Aucun nouvel utilisateur n'obtient un rôle automatiquement.

## Protection serveur

`lib/authorization.ts` est le point d'entrée centralisé :

- Better Auth fournit la session réelle via `auth.api.getSession`.
- L'utilisateur applicatif est retrouvé par `externalSubject` ; l'absence de correspondance est refusée.
- Les rôles sont résolus depuis `user_roles` et `roles`, jamais depuis le navigateur ou une valeur client.
- `requirePermission` distingue `UNAUTHENTICATED` et `FORBIDDEN` avec des messages génériques.
- Le périmètre d'organisation provient de la session et non d'un identifiant transmis par le client.

Les services de conformité et d'actions correctives refusent désormais l'absence de session réelle et utilisent l'organisation et l'acteur résolus côté serveur.

## Compatibilité et migration différée

Le schéma actuel conserve l'enum historique `user_role`. L'ajout des sept codes métier dans cet enum, ainsi que le remplissage contrôlé des tables `roles`, `permissions` et `user_roles`, devra faire l'objet d'une migration dédiée après confirmation formelle de la cible Neon isolée. Cette migration n'est pas exécutée ici.

## Contrôles

- `pnpm typecheck` : réussi.
- Tests unitaires RBAC : ajoutés dans `lib/authorization.test.ts`, sans connexion Neon.
- Authentification réelle, persistance des sessions et isolation organisationnelle en base : non validées tant que les tables Better Auth et les affectations d'organisation ne sont pas disponibles sur une cible autorisée.
