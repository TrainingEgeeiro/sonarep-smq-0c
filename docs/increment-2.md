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

## Incrément 2B — intégrité référentielle

### Matrice des relations

| Source | Colonne | Cible | Règle | Justification |
|---|---|---|---|---|
| `app_users` | `organization_id` | `organizations.id` | `RESTRICT` | Un utilisateur ne peut exister hors organisation. |
| `user_roles` | `user_id`, `role_id` | `app_users.id`, `roles.id` | `RESTRICT` | Évite les affectations orphelines ; unicité utilisateur/rôle. |
| tables qualité | `organization_id` | `organizations.id` | `RESTRICT` | Préserve l’historique métier d’une organisation. |
| `requirements.owner_id` | utilisateur | `app_users.id` | `SET NULL` | Le propriétaire est facultatif ; l’exigence est conservée. |
| `compliance_evaluations.requirement_id` | exigence | `requirements.id` | `RESTRICT` | Une évaluation ne doit pas perdre son exigence source. |
| `compliance_evaluations.assessor_id` | utilisateur | `app_users.id` | `SET NULL` | L’identité d’un évaluateur peut devenir indisponible sans supprimer l’évaluation. |
| `controlled_documents.previous_version_id` | version précédente | `controlled_documents.id` | `RESTRICT` | Préserve la chaîne historique des versions. |
| `nonconformities.requirement_id` | exigence | `requirements.id` | `RESTRICT` | Une NC liée conserve son référentiel. |
| `corrective_actions.nonconformity_id` | NC | `nonconformities.id` | `RESTRICT` | Une action corrective dépend de sa NC. |
| `audits.program_id` | programme | `audit_programs.id` | `SET NULL` | Le programme est facultatif ; l’audit reste historique. |
| `audit_findings.audit_id` | audit | `audits.id` | `RESTRICT` | Un constat ne peut être orphelin. |
| `audit_findings.nonconformity_id` | NC | `nonconformities.id` | `SET NULL` | Un constat peut rester lisible si le lien facultatif disparaît. |
| `audit_events.organization_id` | organisation | `organizations.id` | `RESTRICT` | Le journal d’audit est conservé. |
| colonnes d’acteur/propriétaire | utilisateur | `app_users.id` | `SET NULL` | Les événements et objets historiques restent disponibles. |

Les références polymorphes de `evidence.linked_entity_id` et `audit_events.entity_id` ne peuvent pas recevoir une FK SQL unique car leur cible dépend de `linked_entity_type`/`entity_type`. Elles restent contrôlées par validation applicative et devront être spécialisées si elles deviennent critiques.

### Contraintes et migration

Le schéma Drizzle ajoute les clés étrangères explicites ci-dessus, des index sur les colonnes de jointure et l’unicité `(user_id, role_id)`. Les suppressions métier sont bloquées par `RESTRICT`/`NO ACTION`, à l’exception des références facultatives documentées en `SET NULL`. La migration doit être générée par `pnpm db:generate`; aucune migration n’est appliquée automatiquement au build ou au déploiement.

### Validation isolée PostgreSQL

Avant toute écriture, l’opérateur doit configurer une base jetable et vérifier `DATABASE_URL`, `DEMO_MODE=true`, `DEMO_WRITE_ENABLED=true`, `DEMO_TARGET=isolated-demo` et `DEMO_DATABASE_NAME` égal au nom réellement retourné par PostgreSQL. En cas d’identité incertaine, interrompre. Ne jamais afficher l’URL ou ses secrets.

Commandes prévues, uniquement après configuration explicite :

```bash
pnpm db:generate
pnpm db:migrate
pnpm db:seed
pnpm db:seed
pnpm typecheck
pnpm exec eslint .
pnpm test
pnpm build
```

Les deux runs du seed doivent conserver les mêmes identifiants et compter une seule occurrence de chaque référence DEMO. Vérifier ensuite les liens exigence–évaluation, NC–action, programme–audit, audit–constat et les événements `DEMO_SEED`/métier. En cas d’échec, arrêter la procédure, conserver les logs sans secrets et réinitialiser uniquement la base isolée ; ne jamais lancer de suppression sur une base partagée.

### Résultat 2B

La base Neon n’est pas connectée dans cet environnement : les migrations et tests PostgreSQL réels restent donc non exécutés. Les tests unitaires et la génération de migration sont les seuls contrôles locaux autorisés tant qu’une cible isolée n’est pas disponible.

## Incrément 2D — sécurisation de l’environnement Neon

L’intégration Neon est connectée, mais le nom `neondb` ne constitue pas une preuve d’isolement organisationnel. Aucune migration ni aucun seed ne doit être exécuté tant qu’un administrateur n’a pas confirmé que la cible est exclusivement réservée à la démonstration SONAREP QMS 360. Aucune ressource distante n’est créée, modifiée ou supprimée automatiquement par cet incrément.

### Préparation par l’administrateur

1. Créer ou sélectionner une base Neon jetable exclusivement dédiée à la démonstration, sans données utiles ni production.
2. Confirmer son identité réelle avec `current_database()` et son schéma `public`.
3. Configurer les variables dans l’environnement de développement ou Vercel, sans transmettre `DATABASE_URL` dans le chat :

```text
DATABASE_URL=<secret géré par l’environnement>
DEMO_DATABASE_NAME=<nom exact retourné par PostgreSQL>
DEMO_TARGET=isolated-demo
DEMO_MODE=true
DEMO_WRITE_ENABLED=true
```

`DEMO_WRITE_ENABLED=true` est un interrupteur d’autorisation, pas une preuve d’isolement. La preuve minimale combine l’identité retournée par PostgreSQL, la confirmation explicite de l’administrateur et l’absence de cible de production.

### Prévalidation non destructive

Exécuter d’abord :

```bash
pnpm db:preflight
```

Cette commande vérifie la présence des quatre garde-fous, l’absence d’environnement de production, la connexion PostgreSQL, `current_database()` et `current_schema()`. Elle n’applique aucune migration, n’insère aucune donnée et n’affiche jamais l’URL de connexion. Elle s’arrête avec un résultat bloqué si la connexion, l’identité ou une variable est absente ou ambiguë.

La prévalidation technique ne peut pas déterminer seule l’isolement organisationnel chez le fournisseur. L’administrateur doit donc confirmer explicitement que la base est dédiée avant d’autoriser les écritures. Si cette confirmation manque, ne pas exécuter `pnpm db:migrate` ni `pnpm db:seed`.

### Séquence autorisée après confirmation

```bash
pnpm db:preflight
pnpm db:generate
pnpm db:migrate
pnpm db:seed
pnpm db:seed
```

Les contrôles de type, lint, tests et build peuvent être exécutés sans écriture distante :

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

En cas d’échec ou d’identité incertaine, conserver les logs sans secrets et arrêter la procédure. Toute réinitialisation éventuelle doit viser uniquement la base dédiée ; aucune suppression ne doit être lancée sur une base partagée.

### État de livraison 2D

- Contrôles documentés : garde-fous, identité PostgreSQL, schéma, production, procédure d’arrêt.
- Action locale ajoutée : `pnpm db:preflight` non destructive.
- Migrations et seed : non exécutés dans cet incrément.
- Confirmation administrateur de l’isolement : en attente.
- Configuration de production : inchangée.

## Limites

SSO, annuaire, stockage documentaire, hébergement définitif SONAREP, workflows d’approbation, migration de données réelles et systèmes industriels restent hors périmètre.
