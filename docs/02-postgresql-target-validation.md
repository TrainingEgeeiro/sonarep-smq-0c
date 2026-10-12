# SMQ 360 – SONAREP — Validation préalable de la cible PostgreSQL

**Référence contrôlée :** commit `b8b0c61`  
**Date du contrôle :** 12 octobre 2026  
**Conclusion :** `CIBLE NON CONFIRMÉE — MIGRATIONS INTERDITES`.

## Identité non sensible

- **Fournisseur identifié :** Neon PostgreSQL.
- **Base :** `neondb`.
- **Version serveur observée :** PostgreSQL 18.6.
- **Branche Neon :** non identifiable avec les informations exposées par la connexion ; aucun paramètre de branche exploitable n'a été retourné.
- **Rôle de connexion observé :** `neondb_owner`.
- **Environnement visé :** non prouvé. La configuration ne permet pas d'établir que cette base est une base de développement isolée.

Les valeurs complètes de connexion, mots de passe, jetons et secrets ne sont pas reproduits dans ce rapport.

## Configuration effective

### Runtime applicatif

- Le runtime applicatif utilise `DATABASE_URL`.
- Cette cible est une connexion Neon poolée (`-pooler` dans le nom d'hôte), adaptée aux requêtes applicatives.

### Drizzle Kit

- `drizzle.config.ts` privilégie `DATABASE_URL_UNPOOLED`, puis utilise `DATABASE_URL` en repli.
- La cible de migration est donc la connexion Neon non poolée lorsqu'elle est disponible.
- Les deux variables pointent vers la même base logique (`neondb`) mais vers des hôtes distincts : poolé pour l'application, non poolé pour les migrations.
- Cette cohérence de transport est correcte, mais elle ne prouve pas l'isolation de l'environnement.

## État des migrations

Le contrôle a utilisé exclusivement des requêtes PostgreSQL de lecture, avec transaction en lecture seule :

- La table `drizzle.__drizzle_migrations` est absente.
- Le schéma `public` ne contient aucune table au moment du contrôle.
- Aucune preuve distante ne permet donc d'affirmer que `drizzle/0000_parallel_ironclad.sql` est appliquée.
- Aucune preuve distante ne permet d'affirmer que `drizzle/0001_simple_storm.sql` est appliquée.
- La migration corrective de l'Incrément 02 (`0002_quality_requirements_alignment.sql`) n'est pas appliquée ; plus précisément, aucune table ou table de suivi ne permet d'établir une application distante.
- Le journal local référence `0000_parallel_ironclad` et `0001_simple_storm`. Il ne référence pas la migration corrective `0002_quality_requirements_alignment`.

## Écarts de schéma

L'écart est bloquant : le schéma réel exposé ne contient aucune table publique, alors que le schéma attendu prévoit notamment `organizations`, `processes`, `requirements`, `requirement_assessments` et `audit_events`.

Le registre des exigences ne peut donc pas être considéré comme persistant sur cette cible. Aucun test d'écriture métier n'a été lancé.

## Opérations effectuées

- Lecture de la configuration runtime et de `drizzle.config.ts`.
- Comparaison non sensible de `DATABASE_URL` et `DATABASE_URL_UNPOOLED` : même base logique, hôtes poolé/non poolé différents.
- `SELECT` de l'identité PostgreSQL et de la version serveur.
- Lecture des métadonnées de migration via `information_schema`.
- Lecture de la liste des tables et colonnes via `information_schema`.
- Aucune écriture, migration distante, création ou suppression de table, modification de données, ni test du registre des exigences.

## Actions manuelles nécessaires

Avant toute migration ou écriture :

1. Confirmer manuellement que `neondb` correspond à une branche Neon de développement isolée et non à une cible partagée ou de production.
2. Fournir un identifiant de branche vérifiable, ou un autre élément indépendant du seul nom de base permettant de prouver cette isolation.
3. Après confirmation, contrôler à nouveau la cible avant d'autoriser l'exécution de Drizzle Kit.
4. Appliquer les migrations sur la cible confirmée, puis vérifier leur état et le schéma réel avant de lancer les tests de persistance.

`CIBLE NON CONFIRMÉE — MIGRATIONS INTERDITES`.

Le contrôle est volontairement arrêté à cette étape conformément aux consignes.
