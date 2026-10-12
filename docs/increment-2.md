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

## Validation PostgreSQL manuelle

Préparer une base PostgreSQL de développement isolée, nommée par exemple `sonarep_demo`, sans données utiles. Ne jamais réutiliser une base de production. Les variables nécessaires sont `DATABASE_URL`, `DEMO_DATABASE_NAME=sonarep_demo`, `DEMO_TARGET=isolated-demo`, `DEMO_MODE=true` et `DEMO_WRITE_ENABLED=true`. Les secrets restent dans l’environnement local ou Vercel ; ils ne doivent pas être transmis dans la conversation.

Appliquer ensuite, manuellement, les migrations puis le seed :

```bash
pnpm typecheck
pnpm exec eslint .
pnpm test
pnpm build
pnpm db:generate
pnpm db:migrate
pnpm db:seed
```

Le seed vérifie la présence de `DATABASE_URL`, la correspondance exacte entre le nom de base de l’URL et `DEMO_DATABASE_NAME`, la cible `isolated-demo`, l’absence de production et les deux interrupteurs de démonstration. Il n’écrit jamais sans ces contrôles. Il insère des références stables sous `SONAREP-DEMO`, dans une transaction, avec `onConflictDoNothing`, et ne supprime aucune donnée.

Pour vérifier la persistance, lire explicitement les références `SONAREP-DEMO`, `REQ-DEMO-*`, `DOC-DEMO-014`, `NC-DEMO-001`, `AC-DEMO-001` et `AUD-DEMO-001` après la première exécution, puis relancer `pnpm db:seed` et confirmer que les comptes restent identiques. Pour réinitialiser un environnement de test, supprimer et recréer uniquement la base isolée ou utiliser une branche/base jetable ; ne pas lancer de suppression sur une base partagée. La validation PostgreSQL réelle reste en attente tant qu’une base explicitement autorisée n’est pas disponible.

Le seed ne s’exécute jamais au build ni au démarrage.

## Limites

SSO, annuaire, stockage documentaire, hébergement définitif SONAREP, workflows d’approbation, migration de données réelles et systèmes industriels restent hors périmètre.
