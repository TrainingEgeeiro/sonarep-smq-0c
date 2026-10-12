# 09 — Stratégie de migrations

Drizzle Kit génère des migrations versionnées dans `drizzle/` depuis `lib/db/schema.ts`. `DATABASE_URL_UNPOOLED` est prioritaire pour éviter les limites d'une connexion poolée.

Ordre : générer (`pnpm db:generate`), inspecter le SQL, vérifier (`pnpm db:check`), tester sur une base isolée, puis obtenir une autorisation explicite avant toute application distante. Les migrations ne contiennent aucune donnée opérationnelle SONAREP.

Les seeds éventuels seront séparés des migrations et réservés aux tests. Toute migration destructive devra être signalée et revue ; le schéma ne supprime pas automatiquement les enregistrements qualité.
