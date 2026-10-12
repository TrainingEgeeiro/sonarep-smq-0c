# Stratégie des environnements — SONAREP QMS 360

## Principes

Chaque environnement possède une base, des secrets, des accès et des critères de validation distincts. La présence d'une base de développement isolée ne vaut pas autorisation de production.

| Environnement | Données | Écritures | Contrôle obligatoire |
| --- | --- | --- | --- |
| Développement | Fixtures ou données de développement | Autorisées uniquement sur cible identifiée | `DEMO_TARGET`, nom de base et absence de production |
| Tests automatisés | Données éphémères ou base de test | Réinitialisables | Tests indépendants puis intégration PostgreSQL |
| Préproduction | Jeu représentatif non sensible | Contrôlées | Secrets distincts, migrations et E2E |
| Production | Données réelles SONAREP | Opérationnelles | Autorisation formelle, sauvegarde, supervision et rollback |

## Garde-fous

`assertDemoSeedAllowed` et `runDemoPreflight` protègent uniquement le seed de développement. Ils exigent une cible nommée, `DEMO_TARGET=isolated-demo`, les drapeaux d'écriture explicites et refusent `NODE_ENV` ou `VERCEL_ENV` de production. Ces garde-fous ne sont pas une autorisation implicite pour la production et ne doivent pas être retirés avant la mise en place d'un contrôle équivalent.

Les variables `DEMO_MODE`, `DEMO_WRITE_ENABLED`, `DEMO_TARGET` et `DEMO_DATABASE_NAME` sont interdites comme mécanisme de pilotage du runtime métier en production. Les identités et données de `lib/demo-data.ts` sont des fixtures, jamais des comptes réels.

## Procédure PostgreSQL autorisée

1. Identifier la cible par son projet, son environnement et son nom de base.
2. Obtenir l'autorisation formelle de la cible et de l'opération.
3. Vérifier `current_database()`, `current_schema()` et les tables attendues sans exposer de secrets ou de données sensibles.
4. Appliquer une migration versionnée, une instruction à la fois si elle est exécutée via MCP.
5. Vérifier les tables et contraintes après migration.
6. Tester connexion, création de session, session après rechargement, déconnexion et permissions.
7. Conserver le résultat, l'identifiant de migration, l'environnement et l'acteur dans le journal de changement.

Aucune écriture distante ou migration ne doit être exécutée si l'identité de la cible ou l'autorisation n'est pas établie. Le blocage Better Auth « tables user, session, account, verification absentes » doit être résolu sur une cible explicitement autorisée, sans modifier le schéma par défaut au hasard.

## Déploiement et exploitation

Les secrets sont fournis par l'environnement de déploiement et ne sont jamais committés, affichés ou journalisés. `BETTER_AUTH_SECRET` doit contenir au moins 32 caractères et rester distinct entre environnements.

Chaque déploiement doit avoir : migration/rollback documentés, contrôle de santé, supervision des erreurs, sauvegarde et test de restauration, gestion des incidents, accès nominatif et revue des permissions.

## État de validation

Le code dispose de contrôles unitaires indépendants de Neon. L'intégration PostgreSQL, les sessions réelles, le stockage de fichiers, les sauvegardes et les tests E2E restent à valider dans les environnements correspondants.

Ce document ne donne aucune autorisation d'hébergement ; il décrit les prérequis à obtenir avant exploitation réelle.

Mise à jour : 12 octobre 2026.
