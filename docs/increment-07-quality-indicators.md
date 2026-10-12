# Increment 07 — Indicateurs qualité et performance

## Périmètre livré

- Route `/indicators` avec état vide explicite, catalogue et mesures périodiques.
- Création serveur d’indicateurs et de mesures, validation Zod et journalisation `audit_events`.
- Unicité d’une mesure par indicateur et période via contrainte PostgreSQL préparée.
- Interprétation centralisée des cibles : hausse favorable, baisse favorable; intervalle cible reste à préciser métier.
- Calcul de ratios protégé contre les dénominateurs nuls.

## Données et migration

`drizzle/0007_quality_indicators.sql` crée `quality_indicators`, `indicator_measurements`, les enums, index, contrainte d’unicité et active RLS sans ajouter de politique permissive. Elle dépend des migrations antérieures et n’a pas été appliquée à Supabase.

Les indicateurs ne contiennent aucune cible officielle préremplie. Le responsable est une référence fonctionnelle, jamais une identité inventée. Les valeurs saisies, calculées, validées et indisponibles sont distinguées dans le modèle et l’interface.

## Tests et limites

Tests unitaires ajoutés pour les ratios, dénominateurs nuls, interprétation des cibles et valeurs non numériques. Les tests locaux ne démontrent pas la persistance PostgreSQL réelle, les RLS effectives, ni un export PDF/Excel. La cible `TARGET_RANGE` devra être complétée par un format métier validé avant calcul automatique.

## Validation opérationnelle ultérieure

Après autorisation explicite : appliquer les migrations dans l’ordre, vérifier le schéma et RLS, créer un indicateur, créer une mesure, tenter un doublon de période, soumettre/valider/rejeter, puis contrôler les `audit_events` et les régressions des modules précédents.
