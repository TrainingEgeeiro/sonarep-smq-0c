# Guide de démonstration contrôlée

## Positionnement

SMQ 360 — SONAREP est présenté comme un démonstrateur fonctionnel et non comme une base opérationnelle validée. Toute donnée de présentation doit être fictive, identifiée comme telle et séparée de la base métier réelle.

## Parcours recommandé — 10 à 15 minutes

1. Ouvrir le tableau de bord et rappeler l’état de disponibilité des données.
2. Parcourir `/processes` pour montrer la cartographie et les pilotes fonctionnels.
3. Ouvrir `/quality-requirements` et montrer le référentiel des exigences.
4. Ouvrir `/documents` et montrer le principe de maîtrise documentaire et d’historique.
5. Ouvrir `/risks` pour illustrer l’évaluation initiale et résiduelle.
6. Ouvrir `/audits` et montrer programme, checklist, constats et rapport.
7. Ouvrir `/nonconformities` pour suivre déclaration, causes et actions correctives.
8. Ouvrir `/indicators` pour montrer catalogue, périodes, cibles et état de mesure.
9. Revenir au tableau de bord et expliquer les relations entre processus, exigences, risques, audits, écarts et performance.
10. Conclure sur la feuille de route de mise en conformité de la base.

## Règles de présentation

- annoncer explicitement « démonstration contrôlée »;
- ne jamais présenter une valeur vide ou non configurée comme un résultat SONAREP;
- distinguer développé, testé localement et validé sur PostgreSQL réel;
- ne pas afficher de données personnelles ou de vrais opérateurs;
- expliquer que les migrations 0003 à 0007 restent en attente de réconciliation et d’autorisation;
- ne pas présenter l’accès direct comme une sécurité suffisante.

## État de l’environnement

Les routes applicatives et validations locales sont disponibles dans le dépôt. Les tables métier des incréments 04 à 07 ont été signalées absentes de Supabase lors des contrôles précédents. L’environnement réel n’est donc pas la source de données de la démonstration tant que la campagne de migration n’est pas autorisée et validée.

## Données de démonstration

Si des données sont nécessaires, les fournir via un mécanisme isolé et explicitement nommé `DEMO`. Ne pas les insérer dans Supabase opérationnel sans autorisation. Les objectifs, seuils, responsables et résultats sont des exemples et ne constituent pas une politique officielle SONAREP.

## Limites à annoncer

- authentification fiable non intégrée dans cette campagne;
- RLS et privilèges à vérifier avant exposition;
- persistance Supabase non validée;
- historique exact des migrations à compléter;
- sauvegarde/restauration non exécutée;
- modules de navigation futurs visibles dans le shell mais non livrés comme fonctions métier.

## Critère de fin

La présentation est réussie si le public comprend le modèle de pilotage qualité, voit des parcours cohérents et connaît précisément les prérequis restant avant mise en service.
