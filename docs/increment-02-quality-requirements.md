# Incrément 02 — Quality Requirements

## État
**PARTIELLEMENT TERMINÉ** — la route, les validations et la migration corrective sont préparées. La persistance réelle dépend de l’application autorisée de la migration sur une base de développement isolée.

## Livré
- Route App Router `/quality-requirements` et interface française sans données fictives.
- Synthèse, recherche, création, modification et évaluation historisée.
- États base absente, erreur, vide et succès.
- Validation Zod côté serveur, dont justification obligatoire pour `NOT_APPLICABLE`, `PARTIALLY_COMPLIANT` et `NON_COMPLIANT`.
- Rattachement processus contrôlé par organisation commune.
- Indicateur : conformes / exigences applicables, avec `NOT_APPLICABLE` exclu du dénominateur.

## Schéma et migration
Le schéma Drizzle contient `requirements.description`, `requirements.reference_clause`, `processes.category` et `requirement_assessments`; la migration initiale ne les contenait pas tous. `drizzle/0002_quality_requirements_alignment.sql` prépare une correction non destructive. **Migration préparée, non appliquée**; aucune base distante n’a été modifiée.

## Vérifications
À exécuter sur la branche de livraison : `pnpm typecheck`, `pnpm test`, `pnpm db:check`, `pnpm build`, puis une vérification navigateur de `/quality-requirements`. Les tests de persistance et le parcours création/évaluation restent non confirmés tant que la base de développement n’est pas migrée.

## Sécurité et limites
Aucune authentification n’a été introduite. Les écritures sont marquées `UNVERIFIED_OPERATOR`; l’absence d’identité fiable et d’isolation utilisateur reste une limite documentée. Les organisations existantes sont utilisées pour vérifier les relations, sans inventer de modèle multi-tenant.

## Critères de clôture
Clôturer uniquement après migration de développement autorisée, exécution des quatre commandes, test E2E réel et confirmation que `/quality-requirements` ne renvoie pas 404.

Ne pas commencer l’Incrément 03 avant validation explicite.
