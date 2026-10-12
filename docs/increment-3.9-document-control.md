# SONAREP QMS 360 — Incrément 3.9

## Fonctionnalités livrées

- Registre des documents contrôlés accessible sur `/documents`, avec filtrage par statut, référence, propriétaire, version et prochaine revue.
- Modèle versionné `controlled_document_revisions` : une révision est créée sans écraser l’historique.
- Workflow serveur `DRAFT → IN_REVIEW → APPROVED → PUBLISHED → OBSOLETE`, avec motif de décision obligatoire.
- Permissions dédiées pour revue, approbation, publication et obsolescence.
- Séparation des rôles : l’auteur d’une révision ne peut pas l’approuver lui-même.
- Modèle de preuves enrichi par `evidence_attachments` et `evidence_links`, avec rattachement organisationnel, contrôle de taille/type et clés de stockage obligatoirement privées (`private/`). Les liens couvrent audits, exigences, constats et actions correctives.
- Journalisation des créations, transitions et enregistrements de pièces jointes dans `audit_events`.

## Fichiers modifiés

- `lib/db/schema.ts`
- `drizzle/0003_document_control.sql` — migration proposée, non exécutée
- `lib/validation.ts`
- `lib/governance.ts`
- `lib/document-control-rules.ts`
- `lib/document-control.ts`
- `components/qms-views.tsx`
- `app/[...slug]/page.tsx`
- `lib/document-control-rules.test.ts`
- `lib/evidence-control.ts` — liens de preuves avec contrôle organisationnel et audit
- `lib/demo-mode.test.ts` et `lib/demo-mode.ts` — mode démo déjà contrôlé par flag


## Schéma et sécurité

La migration ajoute une table de révisions, une table de métadonnées de pièces jointes et une table de liens génériques vers les objets QMS. Toutes les tables sont scindées par `organization_id` et les services vérifient cette organisation avant toute lecture ou écriture. Les clés de stockage sont des métadonnées privées : aucune URL publique permanente n’est produite.

La migration `drizzle/0002_better_auth_schema.sql` n’a pas été modifiée ni exécutée et ne doit pas être appliquée au schéma `neon_auth`. La migration 0003 est uniquement versionnée dans le dépôt ; son application exige une cible Neon explicitement identifiée et autorisée.

Les fichiers autorisés pour les pièces jointes sont PDF, PNG, JPEG et CSV, avec une limite de 25 MiB. L’intégration Vercel Blob privée n’est pas encore connectée : le stockage binaire réel reste un prérequis de déploiement et n’est pas remplacé par des mocks.

## Validation

- `pnpm typecheck` : réussi.
- `pnpm lint` : réussi.
- `pnpm test` : réussi — 7 fichiers, 26 tests, dont les transitions `OBSOLETE`, les permissions associées et la validation des pièces privées.
- `pnpm build` : compilation et TypeScript réussis, collecte Next.js bloquée par `BETTER_AUTH_SECRET` absent/non exploitable dans l’environnement de build.
- Vérification navigateur : route `/documents` redirige correctement vers `/sign-in` sans session ; aucune connexion réelle n’a été tentée.

## Mode de démonstration sans authentification

Le mode sans connexion est contrôlé exclusivement par `QMS_DEMO_NO_AUTH=true`. Sur Vercel, il est accepté uniquement avec `VERCEL_ENV=preview` et refusé avec `VERCEL_ENV=production`, même si `NODE_ENV=production` est également présent dans les deux déploiements. En local, il est accepté uniquement avec `NODE_ENV=development` et sans `VERCEL_ENV`. Toute combinaison inconnue ou incohérente désactive le mode par défaut. Lorsque le flag est actif dans une Preview autorisée ou en développement local, les pages métier sont accessibles sans session et l’écran de connexion redirige vers le tableau de bord.

Configuration Vercel Preview :

```text
QMS_DEMO_NO_AUTH=true
VERCEL_ENV=preview
```

Ne pas créer `NEXT_PUBLIC_QMS_DEMO_NO_AUTH` : ce contrôle reste strictement serveur. Ne pas activer ces variables dans l’environnement Vercel Production.

Les services serveur continuent d’exiger Better Auth et leurs permissions pour toute écriture métier : le mode démo ne crée aucune identité, ne confère aucun rôle QMS et n’expose aucun contournement API. Les fonctions de mutation restent donc indisponibles sans session réelle. Les contrôles de validation, de cohérence, d’organisation et de journalisation restent présents pour la réactivation future.

### Validation de l’incrément

- `pnpm typecheck` : réussi.
- `pnpm lint` : réussi.
- `pnpm test` : réussi — 7 fichiers, 25 tests, dont les tests d’activation explicite et de refus impératif en production.
- `QMS_DEMO_NO_AUTH=true pnpm build` : réussi.
- Vérification navigateur du serveur flagué : non concluante dans cette session, car le routage du navigateur a renvoyé vers le serveur déjà actif sur le port 3000 au lieu du serveur de vérification sur port 3001. Les tests unitaires et le build couvrent le comportement de configuration ; aucune conclusion de production n’en est déduite.

Aucune migration ni écriture Neon n’a été exécutée.

## Réactivation future de Better Auth

Supprimer ou désactiver `QMS_DEMO_NO_AUTH` dans l’environnement concerné, vérifier que `NODE_ENV` n’est pas utilisé pour contourner le contrôle, puis redéployer. Les pages repasseront par `auth.api.getSession`; les mutations continueront à passer par `requirePermission`. Aucun schéma ou rôle n’a besoin d’être recréé.

## Limites restantes

La migration 0003 n’est pas appliquée à une base réelle. Le stockage Blob privé n’est pas connecté : `lib/evidence-control.ts` fournit le contrat serveur, mais aucun upload ni téléchargement n’est simulé. Le formulaire visible du registre reste une surface de préparation tant qu’une cible autorisée et un stockage privé ne sont pas disponibles. L’accès administrateur de l’incrément 3.8.2 reste séparément bloqué ; il ne constitue pas un contournement pour le contrôle documentaire. L’incrément 3.10 n’est pas commencé.
