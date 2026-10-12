# Incrément 3.8.2 — Activation admin et E2E Better Auth

## Décision

**BLOQUÉ avant toute écriture.** La porte d’intégration n’est pas ouverte.

## Cible identifiée

- Intégration Neon : connectée.
- Schéma live retourné : `neon_auth` avec les tables Better Auth `user`, `session`, `account` et `verification`, ainsi que `organization` et `member`.
- Cible applicative autorisée : non confirmée.
- Nom de base applicatif attendu : non fourni.
- Aucune valeur secrète, URL de connexion, jeton ou donnée sensible n’est incluse dans ce rapport.

La présence de Neon et du schéma live ne vaut pas autorisation d’écriture. Le préflight exige une cible non productive explicitement désignée.

## Contrôles exécutés

- Vérification de présence des variables requises : **10/10 absentes** ; aucune valeur n’a été affichée.
- `pnpm integration:preflight` : **BLOQUÉ** avec les quatre contrôles suivants :
  - Cible identifiée : **BLOQUÉ** — `INTEGRATION_TARGET_NAME` est requis.
  - Cible explicitement autorisée : **BLOQUÉ** — `INTEGRATION_TARGET_AUTHORIZED=true` est requis.
  - Environnement non productif : **BLOQUÉ** — un environnement non productif est requis ; aucun environnement n’a été détecté.
  - Base identifiée : **BLOQUÉ** — `INTEGRATION_DATABASE_NAME` est requis.
- Nom logique de la cible : **non détecté**.
- Environnement détecté : **non détecté**.
- Cohérence de la base : **non évaluable** sans nom de base autorisé.
- Bootstrap admin : **NON EXÉCUTÉ**.
- Migration Better Auth : **NON EXÉCUTÉE**.
- Parcours navigateur sign-in/session/reload/sign-out : **NON EXÉCUTÉ**.

## Garde-fous manquants et formats attendus

Les variables suivantes doivent être configurées dans l’environnement sécurisé correspondant à la cible isolée. Leurs valeurs ne doivent pas être communiquées dans le chat.

### Porte de lecture seule et d’écriture contrôlée

- `INTEGRATION_TARGET_NAME` : chaîne non vide identifiant explicitement la cible isolée ; aucune valeur n’est déduite de Neon.
- `INTEGRATION_TARGET_AUTHORIZED` : valeur littérale `true` ; toute autre valeur ferme la porte.
- `INTEGRATION_TARGET_ENV` : chaîne non vide différente de `production` ; `development` est recommandé.
- `INTEGRATION_DATABASE_NAME` : chaîne non vide correspondant exactement au nom de la base autorisée.
- `INTEGRATION_TARGET_SECRET` : chaîne secrète d’au moins 32 caractères ; elle ne sert qu’à l’autorisation de la cible.

### Bootstrap administrateur

- `ADMIN_BOOTSTRAP_EMAIL` : adresse email non vide, normalisée en minuscules par le script.
- `ADMIN_BOOTSTRAP_NAME` : nom affiché non vide.
- `ADMIN_BOOTSTRAP_ORGANIZATION_ID` : UUID existant d’une organisation dans `public.organizations`; le script ne crée pas l’organisation.
- `ADMIN_BOOTSTRAP_PASSWORD` : mot de passe non vide d’au moins 12 caractères, nouveau et unique ; il reste uniquement dans l’environnement d’exécution.
- `ADMIN_BOOTSTRAP_SECRET` : chaîne d’au moins 32 caractères, strictement identique à `INTEGRATION_TARGET_SECRET`.

Le script exige d’abord les quatre variables de porte. Il refuse une cible de production, un compte Better Auth déjà existant, un rôle `QMS_ADMIN` absent et un rattachement métier incomplet. Aucun secret, mot de passe ou paramètre sensible n’a été affiché, journalisé ou écrit dans Git.

## Cohérence schéma et migrations

- Better Auth runtime est configuré avec `search_path=neon_auth`; les tables live `user`, `session`, `account` et `verification` sont donc attendues dans `neon_auth`, avec leurs colonnes camelCase.
- Les tables QMS `organizations`, `app_users`, `roles` et `user_roles` appartiennent au schéma `public` dans le modèle Drizzle.
- `app_users.external_subject` reçoit l’identifiant Better Auth et `app_users.organization_id` reçoit `ADMIN_BOOTSTRAP_ORGANIZATION_ID`; `user_roles.user_id` référence ensuite l’identifiant QMS de `app_users`, pas l’identifiant Better Auth.
- `drizzle/0002_better_auth_schema.sql` crée des tables Better Auth dans `public`; elle ne doit donc pas être appliquée telle quelle à cette cible `neon_auth`. Les tables live existantes doivent être utilisées après confirmation de leur structure réelle.
- Aucune migration destructive, `DROP`, reset ou réinitialisation n’est autorisée par ce protocole.

## Action humaine nécessaire

Configurer ces variables dans l’environnement Preview/Development correspondant à une base Neon isolée explicitement autorisée, puis relancer `pnpm integration:preflight`. Ne pas appliquer la migration publique historique, ne pas lancer `pnpm auth:bootstrap` et ne pas tester un compte réel avant que la porte soit ouverte.

## État final

Aucun nom logique de cible, environnement non productif ou nom de base n’a été détecté. La cible ne peut donc pas être confirmée comme explicitement autorisée et la cohérence de base ne peut pas être validée. Correction nécessaire : renseigner dans l’environnement sécurisé les quatre variables `INTEGRATION_TARGET_NAME`, `INTEGRATION_TARGET_AUTHORIZED=true`, `INTEGRATION_TARGET_ENV` non productif et `INTEGRATION_DATABASE_NAME`, puis relancer uniquement `pnpm integration:preflight`.

Aucun compte administrateur n’a été créé. Aucune migration, insertion, modification, réinitialisation de mot de passe ou autre écriture Neon n’a été effectuée. La migration historique `drizzle/0002_better_auth_schema.sql` n’a pas été appliquée et ne sera pas appliquée au schéma `neon_auth` par ce protocole. Le critère de sortie de l’incrément 3.8.2 n’est donc pas atteint ; le blocage est volontaire et conforme aux garde-fous du protocole.
