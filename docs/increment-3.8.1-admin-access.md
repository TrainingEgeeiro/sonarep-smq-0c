# Incrément 3.8.1 — Accès développeur/admin

## Diagnostic

Le blocage vient de deux causes vérifiables dans le projet :

1. `lib/auth.ts` utilisait uniquement `BETTER_AUTH_SECRET_3` alors que la variable canonique Better Auth est `BETTER_AUTH_SECRET`. La configuration préfère désormais `BETTER_AUTH_SECRET` lorsqu’il est valide et conserve `BETTER_AUTH_SECRET_3` comme repli de compatibilité temporaire ; aucune valeur n’est affichée.
2. L’accès dépend des tables Better Auth dans le schéma `neon_auth` et du rattachement séparé dans `public.app_users`, `public.user_roles` et `public.roles`. La présence d’une variable ou d’une page `/sign-in` ne prouve pas que ces tables et données existent.

La migration `drizzle/0002_better_auth_schema.sql` est préparée pour un schéma public historique, mais elle n’est pas exécutée automatiquement et ne doit pas être appliquée à une cible non confirmée. Le préflight d’intégration reste la porte obligatoire.

## Procédure contrôlée

Le script `pnpm auth:bootstrap` exige :

- `INTEGRATION_TARGET_NAME`, `INTEGRATION_TARGET_AUTHORIZED=true`, `INTEGRATION_TARGET_ENV=development` et `INTEGRATION_DATABASE_NAME` correspondant à une cible isolée ;
- `INTEGRATION_TARGET_SECRET` et `ADMIN_BOOTSTRAP_SECRET` identiques, longs d’au moins 32 caractères ;
- `ADMIN_BOOTSTRAP_EMAIL`, `ADMIN_BOOTSTRAP_NAME`, `ADMIN_BOOTSTRAP_ORGANIZATION_ID` ;
- `ADMIN_BOOTSTRAP_PASSWORD` fourni uniquement par l’environnement d’exécution, jamais dans Git, un prompt, un log ou un fichier versionné.

Le script vérifie d’abord l’existence du compte par email. Un compte existant est refusé et son mot de passe n’est pas réinitialisé. Pour un compte absent, il appelle `auth.api.signUpEmail`, afin que Better Auth hache le mot de passe. Il crée ensuite un `app_users` dans l’organisation fournie et lui attribue le rôle existant `QMS_ADMIN`. Il ne crée ni organisation ni rôle et ne donne aucun accès transverse.

## Sécurité

- Aucun mot de passe en clair n’est écrit en base ou journalisé.
- Aucun secret n’est affiché.
- Le script est refusé hors cible explicitement autorisée.
- Les approbations qualité restent soumises aux permissions dédiées et à la séparation des responsabilités.
- Une création Better Auth suivie d’un échec de rattachement métier est signalée comme état partiel ; le script ne réinitialise pas et ne relance pas silencieusement.

## État de validation

- `pnpm typecheck` : à exécuter après configuration de la cible.
- `pnpm lint` : à exécuter après configuration de la cible.
- `pnpm test` : à exécuter après configuration de la cible.
- `pnpm build` : à exécuter avec l’environnement projet chargé.
- `pnpm integration:preflight` : bloqué tant que la cible isolée n’est pas explicitement autorisée.
- Parcours navigateur sign-in, session persistante, reload, sign-out et refus post-déconnexion : non déclaré tant que le compte et les tables réels ne sont pas disponibles.

Aucune migration, création de compte ou écriture distante n’est exécutée par cette préparation.
