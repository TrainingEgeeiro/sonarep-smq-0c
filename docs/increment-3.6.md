# SONAREP QMS 360 — Incrément 3.6

## Objet

Couverture complémentaire des contrôles de sécurité des services métier existants, sans migration ni écriture distante sur Neon.

## Composants inspectés

- `lib/authorization.ts` : session serveur Better Auth, résolution des rôles depuis l’organisation, permissions connues et contrôle d’organisation.
- `lib/governance.ts` : catalogue RBAC et séparation des responsabilités.
- `lib/services.ts` : création d’évaluation de conformité et transitions d’actions correctives.
- `lib/validation.ts` : validation Zod des entrées métier.
- `lib/db/schema.ts` : appartenance organisationnelle, identifiants d’acteur, vérificateur et journaux d’audit.
- `lib/authorization.test.ts` et tests Vitest existants.

## Contrôles ajoutés ou renforcés

- Toute opération métier commence par `requirePermission`, qui résout l’identité côté serveur et refuse l’absence de session.
- Les évaluations de conformité recherchent l’exigence avec l’identifiant d’organisation issu de la session, jamais avec une organisation fournie par le client.
- Les transitions d’actions correctives recherchent et mettent à jour la ressource dans l’organisation de la session.
- Les transitions `EFFECTIVENESS_VERIFIED` et `CLOSED` exigent respectivement `actions.verify` et `actions.close`; elles ne sont plus couvertes par la seule permission générique de modification.
- Le propriétaire d’une action ne peut pas vérifier lui-même son efficacité.
- La mise à jour est protégée contre une modification concurrente par le statut courant et l’organisation; une absence de ligne mise à jour est refusée.
- Les événements de création et de changement de statut sont journalisés dans `audit_events` avec organisation, acteur, entité, résultat et résumé.
- Les transitions et données entrantes restent contraintes par Zod et la table d’état autorisée.

## Tests et contrôles exécutés

- `pnpm typecheck` — réussi (`tsc --noEmit`).
- `pnpm lint` — réussi (`eslint .`).
- `pnpm test` — réussi : 4 fichiers, 16 tests.
- `pnpm build` — à exécuter dans la phase de validation finale.

Les tests unitaires couvrent notamment l’absence d’authentification, le refus d’une permission inconnue, l’organisation étrangère, le rôle fourni par le client et la séparation des responsabilités RBAC.

## Limites et tests non exécutés

- Aucun test d’intégration Better Auth/Neon n’a été simulé.
- Aucun accès distant, migration ou écriture Neon n’a été exécuté pour cet incrément.
- Le parcours E2E connexion, session persistante, accès protégé et déconnexion reste à exécuter sur une cible de démonstration isolée disposant des tables Better Auth.
- Les routes API ou Server Actions supplémentaires ne sont pas présentes dans le dépôt inspecté; les services réellement présents sont les deux opérations couvertes ci-dessus.

## Risques résiduels

- La couverture d’intégration dépend de la présence réelle des tables `user`, `session`, `account` et `verification` dans la cible Neon autorisée.
- Les contrôles organisationnels sont appliqués aux services existants; toute nouvelle opération doit réutiliser `requirePermission` et un filtre explicite `organizationId`.
- L’interface ne constitue pas une frontière de sécurité; les contrôles restent côté serveur.

## Fichiers modifiés

- `lib/services.ts`
- `docs/increment-3.6.md`

## Prochain incrément recommandé

Mettre en place les tests d’intégration et E2E reproductibles sur une base Neon de démonstration isolée explicitement autorisée, puis étendre les services métier avec les mêmes contrôles avant toute ouverture de données opérationnelles.

Cet incrément ne constitue pas une déclaration de préparation à la production.
