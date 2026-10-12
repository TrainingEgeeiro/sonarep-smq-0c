# Incrément 01C — Référentiel des processus

## Statut
Implémentation livrée sur la branche de travail issue du socle 01A/01B. Le commit et la branche doivent être complétés dans le rapport de synchronisation final.

## Fonctionnalités livrées
- Route `/processes` avec lecture PostgreSQL réelle via Drizzle.
- Recherche par code, intitulé et catégorie.
- Création et modification validées par Zod côté serveur.
- Activation/désactivation contrôlée et archivage logique.
- Messages d'erreur explicites pour absence de configuration, erreurs de connexion et identifiants inconnus.
- Journalisation des créations, modifications, changements de statut et archivages dans `audit_events`, avec origine `UNVERIFIED_OPERATOR`.
- Les états vides n'affichent aucune donnée inventée.

## Modèle et migration
Le modèle `processes` existait déjà. Il a été complété par `category`, avec contrainte unique `(organization_id, code)`. Une migration Drizzle doit être générée et revue ; elle n'est pas exécutée sur Neon dans cet incrément sans autorisation explicite.

## Sécurité et limites
Aucune authentification n'est ajoutée. Les responsables sont des références déclaratives, pas des identités vérifiées. La route ne doit donc pas être considérée comme opérationnelle en production tant qu'un contrôle d'accès et un contexte organisationnel authentifié ne sont pas définis.

## Tests et validation
Les tests unitaires de validation existants restent applicables. À exécuter avant clôture : `pnpm typecheck`, `pnpm test`, `pnpm build`, et `pnpm lint` si le script est ajouté au projet. Les tests PostgreSQL d'intégration nécessitent une base de développement explicitement confirmée ; aucun résultat d'intégration n'est déclaré ici sans connexion réelle.

## Limites restantes
- Pas de pagination, justifiée par l'absence de volumétrie démontrée dans le démonstrateur.
- La fiche détaillée est représentée par la vue complète de la ligne ; une route dédiée peut venir après validation du workflow.
- Aucun seed fictif n'est exécuté.
- La migration reste à appliquer uniquement après accord explicite sur sa cible.
