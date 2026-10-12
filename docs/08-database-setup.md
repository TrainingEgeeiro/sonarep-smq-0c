# 08 — Configuration PostgreSQL

Neon est connecté au projet et fournit `DATABASE_URL` pour l'exécution applicative ainsi que `DATABASE_URL_UNPOOLED` pour les migrations. Le client Drizzle est serveur uniquement dans `lib/db/index.ts`.

## Commandes

```bash
pnpm db:generate
pnpm db:check
pnpm typecheck
pnpm test
pnpm build
```

Aucune migration distante n'est exécutée dans 01B. Une migration devra être revue puis appliquée explicitement avec l'URL directe, jamais au démarrage de l'application.

Sans `DATABASE_URL`, `getDatabase()` lève une erreur explicite et aucune donnée persistée fictive n'est affichée. Aucun seed n'est exécuté automatiquement.
