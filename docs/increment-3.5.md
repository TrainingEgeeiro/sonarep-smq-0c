# SONAREP QMS 360 — Incrément 3.5

## Objectif

Étendre la couverture des autorisations métier et des contrôles de sécurité sans présenter les tests unitaires comme une validation d'intégration PostgreSQL ou E2E.

## Changements

- Les contrôles restent côté serveur dans `lib/authorization.ts`.
- La session Better Auth est la source de l'identité ; une identité d'interface ou un rôle transmis par le client ne peut pas autoriser une opération.
- L'utilisateur applicatif est recherché par `externalSubject`, puis ses rôles sont résolus via `user_roles` et `roles`.
- L'organisation résolue côté serveur est obligatoire pour le périmètre des données.
- Les tests couvrent la séparation lecture / modification / validation / clôture, le refus des permissions inconnues, l'absence d'administration par défaut, l'absence d'escalade de rôle et l'isolation d'organisation.

## Contrôles réalisés indépendamment de Neon

- Matrice des rôles historiques et métier vérifiée contre une permission inconnue.
- `VIEWER` ne peut pas créer, publier ou administrer.
- `QMS_MANAGER` peut publier mais ne gère pas les membres.
- `ORG_ADMIN` gère les membres.
- `QUALITY_OFFICER` ne clôture pas les actions.
- `QUALITY_MANAGER` peut clôturer les actions selon la matrice historique.
- Une organisation différente est refusée.

## Non couvert par cet incrément

Les tests ci-dessus ne prouvent pas la disponibilité des tables Better Auth, la validité d'une connexion Neon, la persistance de sessions, le cookie dans le preview, les droits PostgreSQL, le stockage de fichiers ou le parcours E2E. Ces contrôles seront réalisés sur une cible explicitement autorisée.

## Blocage d'intégration connu

Si la base connectée ne contient pas `user`, `session`, `account` et `verification`, Better Auth échoue au démarrage. Aucune migration ni écriture distante n'est exécutée par cet incrément sans confirmation formelle de la cible. La procédure est décrite dans `docs/environments.md`.

## Critères d'acceptation

- Toute opération sensible passe par un contrôle de session et permission côté serveur.
- Les requêtes qui touchent des données d'organisation utilisent le périmètre serveur.
- Les tests unitaires échouent en cas d'escalade ou de permission implicite.
- Les résultats de typecheck, lint, tests et build sont reportés sans confondre vérification locale et validation d'exploitation.

Statut : couverture RBAC indépendante renforcée ; intégration réelle et production non validées.
Date : 12 octobre 2026.
