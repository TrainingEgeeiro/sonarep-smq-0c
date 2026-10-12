# Incrément 3.2 — Schéma Better Auth préparé

## État

La version installée est Better Auth `1.7.7`. `lib/auth.ts` utilise un `pg.Pool` PostgreSQL direct, sans adaptateur Drizzle explicite ; les tables doivent donc respecter les noms et colonnes par défaut Better Auth.

La configuration `neon_auth` observée précédemment est considérée comme distincte. La migration préparée cible le schéma `public`, ne supprime, ne renomme et ne réinitialise aucune table existante.

## Schéma attendu

- `user`: `id`, `name`, `email`, `emailVerified`, `image`, `createdAt`, `updatedAt`, email unique.
- `session`: `id`, `expiresAt`, `token`, `createdAt`, `updatedAt`, `ipAddress`, `userAgent`, `userId`, token unique et FK vers `user` avec cascade.
- `account`: `id`, `accountId`, `providerId`, `userId`, jetons OAuth éventuels, `scope`, `password`, timestamps, contrainte unique `(providerId, accountId)` et FK vers `user` avec cascade.
- `verification`: `id`, `identifier`, `value`, `expiresAt`, timestamps.

Les identifiants camelCase sont conservés volontairement : Better Auth les attend avec la configuration actuelle.

## Migration préparée

`drizzle/0002_better_auth_schema.sql` est versionnée après `0000` et `0001`. Elle est préparée mais n'a pas été exécutée. L'ordre prévu est :

1. vérifier la cible isolée et son schéma réel ;
2. vérifier l'absence de collision des tables `public.user`, `public.session`, `public.account`, `public.verification` ;
3. appliquer `0000`, `0001`, puis `0002` avec le mécanisme de migration retenu ;
4. vérifier les colonnes, contraintes et index sur cette même cible ;
5. seulement ensuite exécuter un test de parcours inscription/connexion/rechargement/déconnexion.

Le journal Drizzle est géré par l'outil de migration et n'est pas écrit directement dans ce fichier SQL. L'application de ce fichier reste interdite avant confirmation formelle de la cible isolée.

## Contrôles

`lib/auth-schema.test.ts` vérifie automatiquement la présence des quatre tables et des colonnes critiques. Il ne constitue pas une vérification PostgreSQL réelle. La vérification réelle reste à faire après confirmation de la base isolée ; aucune connexion d'écriture, migration ou seed Neon n'a été exécuté pour cet incrément.

Les garde-fous de secret Better Auth et le préflight de démonstration sont inchangés.
