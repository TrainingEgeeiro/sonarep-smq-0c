# SONAREP QMS 360 — Incrément 3.7
## Authentication Integration & Persistence Gate

**Branche de départ vérifiée :** `v0/increment-3-6-security`  
**Commit de départ vérifié :** `22987cd`  
**Date :** 12 octobre 2026

## Objet

Cet incrément prépare la validation réelle de Better Auth, de la persistance des sessions et des contrôles d’accès PostgreSQL/Neon. Il ne déclare pas l’authentification opérationnelle tant qu’un parcours E2E réel n’a pas été exécuté.

## État technique audité

- `lib/auth.ts` utilise Better Auth `1.7.7`, PostgreSQL via `pg.Pool`, `BETTER_AUTH_SECRET_3` et une URL non poolée prioritaire (`DATABASE_URL_UNPOOLED`, puis `DATABASE_URL`). La valeur du secret n’est jamais lue dans les scripts de contrôle.
- Le schéma TypeScript expose `user`, `session`, `account` et `verification`, ainsi que les tables QMS organisationnelles.
- `lib/authorization.ts` vérifie la session côté serveur, résout l’organisation et les rôles, puis applique les permissions.
- Les migrations Better Auth sont versionnées dans `drizzle/`; leur application reste explicitement bloquée tant que la cible isolée et son autorisation ne sont pas confirmées.
- L’intégration Neon est connectée et fournit les variables projet. Cela ne constitue pas une autorisation d’écriture.

## Porte de contrôle obligatoire

Aucune migration, création de compte, création de session ou autre écriture distante ne doit être lancée automatiquement. Le contrôle exige les éléments suivants, hors secrets :

1. Nom de cible explicite dans `INTEGRATION_TARGET_NAME`.
2. Confirmation formelle d’une cible isolée dans `INTEGRATION_TARGET_AUTHORIZED=true`.
3. `INTEGRATION_TARGET_ENV` différent de `production`.
4. `INTEGRATION_DATABASE_NAME` renseigné et vérifiable.
5. Identité PostgreSQL vérifiée par `current_database()` et `current_schema()`.
6. Tables Better Auth vérifiées sans sélectionner de données sensibles.
7. Migration manquante appliquée uniquement après validation humaine explicite de cette porte.

`DATABASE_URL` seul ne satisfait aucun contrôle d’autorisation. Les scripts doivent échouer fermement si la cible est absente, inconnue ou ambiguë.

## Commandes

Prévalidation locale, sans écriture distante :

```bash
pnpm integration:preflight
```

Contrôles du dépôt :

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

Les tests d’intégration réels et E2E ne sont exécutables qu’après ouverture formelle de la cible isolée et fourniture de comptes de test dédiés. Aucun compte de production ne doit être utilisé.

## Parcours réel à exécuter après autorisation

1. Ouvrir `/sign-in`.
2. Se connecter avec un compte de test dédié.
3. Vérifier l’accès à une ressource protégée.
4. Recharger et naviguer pour confirmer la persistance de session.
5. Se déconnecter puis vérifier la redirection vers `/sign-in`.
6. Vérifier le refus sans session.
7. Vérifier le refus d’un accès à une autre organisation avec deux jeux de données de test distincts.
8. Inspecter le cookie Better Auth et confirmer ses attributs sans exposer sa valeur.

## Résultats de ce jalon

- Branche et commit de départ : contrôlés.
- Protocole et garde-fou : préparés.
- Migrations distantes : non exécutées, conformément à la consigne.
- Comptes, sessions et accès protégés réels : non validés à ce stade, car la cible isolée autorisée n’est pas formellement ouverte.
- Tests unitaires et contrôles de build : à consigner après exécution dans le rapport de livraison.

## Reprise après autorisation

Renseigner les variables de ciblage dans un environnement isolé, relancer `pnpm integration:preflight`, examiner chaque contrôle, puis faire approuver explicitement l’application de la migration correspondante. Après migration, lancer uniquement le parcours E2E dédié et consigner l’environnement, l’identifiant de migration et le résultat sans enregistrer de secret, token, mot de passe ou donnée sensible.

## Critères de sortie

L’incrément est validé quand la porte est documentée, les tests sont prêts, les contrôles automatisés passent, aucune écriture distante non autorisée n’a été faite et le rapport distingue préparation technique et validation réelle. Le build seul ne suffit pas à déclarer la production prête.

---

## Compte rendu d’exécution

Les résultats des commandes sont ajoutés ici après exécution dans l’environnement courant. Un contrôle bloqué est conservé comme tel ; il n’est pas transformé en succès par une valeur par défaut.

- `pnpm integration:preflight` : **BLOQUÉ** — les quatre variables de ciblage et d’autorisation ne sont pas présentes dans l’environnement courant.
- `pnpm typecheck` : **RÉUSSI** — `tsc --noEmit` terminé avec le code 0.
- `pnpm lint` : **RÉUSSI** — `eslint .` terminé avec le code 0.
- `pnpm test` : **RÉUSSI** — 5 fichiers et 19 tests passés.
- `pnpm build` : **RÉUSSI** — Next.js 16.4.0 compilé et 17 pages générées ; avertissement SSL `pg` non bloquant.
- E2E Better Auth réel : préparé, non exécuté sans cible autorisée.

Aucune migration Neon ni écriture distante n’a été lancée dans cet incrément.

Mise à jour : 12 octobre 2026.

<a id="integration-gate"></a>

## Intégration réelle : statut de la porte

Le statut reste **BLOQUÉ — cible isolée non confirmée** tant que les variables de ciblage et l’autorisation formelle ne sont pas présentes. L’existence de Neon, de `DATABASE_URL` ou des tables attendues ne remplace pas cette confirmation.

Un futur compte rendu doit remplacer uniquement les mentions « en attente » après observation réelle, sans déclarer l’authentification opérationnelle sur la seule base de tests locaux.

Mise à jour : 12 octobre 2026.
