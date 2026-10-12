# Increment 04 — Gestion des risques et opportunités

## Statut
Développé sur `v0/increment-04-risks-opportunities`, sans migration distante. La persistance PostgreSQL Supabase n’est pas opérationnelle tant que `drizzle/0004_risks_opportunities.sql` n’est pas explicitement approuvée puis appliquée.

## Périmètre
Le registre distingue les risques et les opportunités, rattache facultativement un processus, conserve les causes, conséquences, mesures existantes, plan de traitement, responsable et échéance. Les liens exigences sont prévus. Les liens documentaires sont optionnels et ne sont pas nécessaires au fonctionnement du module.

## Cotation proposée
Probabilité et impact sont des entiers de 1 à 5. Le score initial et le score résiduel sont stockés séparément et calculés côté serveur : `score = probabilité × impact`. Seuils indicatifs : 1–5 faible, 6–11 modéré, 12–19 élevé, 20–25 critique. Cette matrice est une proposition de cadrage, pas une méthode SONAREP officiellement approuvée.

## Workflow
`IDENTIFIED → ASSESSED → TREATMENT_PLANNED → IN_TREATMENT → MONITORED → CLOSED`. `IDENTIFIED`, `ASSESSED` et `ACCEPTED` permettent aussi l’acceptation ou la clôture selon les règles serveur. Les transitions invalides sont refusées et journalisées lorsqu’elles sont valides.

## Migration préparée
`drizzle/0004_risks_opportunities.sql` crée les enums, tables, contraintes de score, index, relations d’exigences et de documents optionnelles, puis active RLS sans créer de politiques permissives. Elle n’a pas été exécutée sur Supabase.

## Sécurité et limites
Les écritures sont côté serveur et les entrées sont validées par Zod. L’origine est `UNVERIFIED_OPERATOR` car aucune identité fiable n’est encore disponible. Les contrôles d’accès par utilisateur/organisation et les politiques RLS doivent être conçus avant mise en service. Les documents confidentiels ne sont pas considérés comme protégés par ce module.

## Tests et validation
Les contrôles locaux à exécuter sont `pnpm typecheck`, `pnpm test`, `pnpm db:check` et `pnpm build`. Ils ne prouvent pas la persistance Supabase. La validation opérationnelle devra exécuter la migration, créer et relire un registre, vérifier les deux évaluations et l’audit, puis tester les relations et les transitions avec un rôle sécurisé.
