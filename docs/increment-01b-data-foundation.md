# Incrément 01B — Data Architecture & Persistence Foundation

## Périmètre livré

- Schéma Drizzle PostgreSQL versionné dans `lib/db/schema.ts`.
- Client serveur lazy dans `lib/db/index.ts` avec erreur explicite si `DATABASE_URL` manque.
- Validations Zod des statuts et justifications dans `lib/validation.ts`.
- Configuration Drizzle Kit et scripts de génération/vérification.
- Documentation du modèle, de la configuration et de la stratégie de migration.

## État PostgreSQL

Neon est connecté et expose les variables de connexion. Le schéma distant observé contient uniquement les tables `neon_auth` préexistantes ; aucune table 01B n'a été créée à distance. Aucune migration distante n'a été exécutée.

## Limites

Aucune authentification, aucun compte, aucune page de connexion et aucun workflow métier persistant ne sont introduits. Les règles d'approbation, le stockage privé des fichiers et les autorisations métier sont réservés aux incréments suivants.

## Validation et suite

Les commandes réellement exécutées et leur résultat final doivent être reportés dans `docs/00-verification-report.md`. Proposition 01C : référentiels initiaux et premier accès serveur en lecture, après revue explicite du modèle et autorisation de migration isolée. Ne pas démarrer 01C automatiquement.
