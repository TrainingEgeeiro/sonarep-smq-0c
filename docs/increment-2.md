# SONAREP QMS 360 — Incrément 2

## État réel

Le socle PostgreSQL est préparé avec Drizzle, mais aucune intégration PostgreSQL n’est connectée dans cet environnement et `DATABASE_URL` n’est pas configurée. L’interface de l’Incrément 1 reste donc la source fictive visible. Aucune migration ni seed n’est exécuté automatiquement.

## Architecture

- `lib/db/schema.ts` : enums et tables relationnelles.
- `lib/db/index.ts` : accès serveur centralisé, statut de configuration et vérification `select 1`.
- `lib/validation.ts` : validation Zod des écritures.
- `lib/governance.ts` : identité de démonstration et permissions centralisées.
- `lib/services.ts` : écritures métier transactionnelles et événement d’audit atomique.
- `drizzle.config.ts` : configuration Drizzle Kit.
- `scripts/seed-demo.ts` : garde-fou de seed, sans exécution automatique.

Relations principales : organisation → utilisateurs/rôles et objets qualité ; exigence → évaluations ; non-conformité → actions correctives ; programme → audits → constats ; toutes les opérations significatives → événements d’audit.

## Tables

`organizations`, `app_users`, `roles`, `permissions`, `user_roles`, `requirements`, `compliance_evaluations`, `controlled_documents`, `evidence`, `nonconformities`, `corrective_actions`, `audit_programs`, `audits`, `audit_findings`, `audit_events`.

Les références métier doivent utiliser les préfixes `REQ-DEMO`, `DOC-DEMO`, `NC-DEMO`, `CA-DEMO`, `AUDIT-DEMO`. Les données sont fictives et ne reproduisent aucune norme protégée.

## Gouvernance

L’identité démo n’est pas une authentification réelle. Le rôle ne doit jamais provenir d’une valeur navigateur non vérifiée. Les services serveur vérifient la permission avant l’écriture. L’audit applicatif n’est pas un journal immuable ni une preuve cryptographique et ne protège pas contre un administrateur PostgreSQL.

Les écritures distantes restent désactivées par défaut. `DEMO_WRITE_ENABLED=true` ne doit être activé que dans un environnement de démonstration contrôlé.

## Commandes

```bash
pnpm typecheck
pnpm exec eslint .
pnpm build
pnpm db:generate
pnpm db:migrate
pnpm db:seed
```

Configurer d’abord `DATABASE_URL`, puis exécuter les migrations explicitement. Le seed exige `DEMO_MODE=true` et `DEMO_WRITE_ENABLED=true`; il ne s’exécute jamais au build ni au démarrage.

## Limites

SSO, annuaire, stockage documentaire, hébergement définitif SONAREP, workflows d’approbation, migration de données réelles et systèmes industriels restent hors périmètre.
