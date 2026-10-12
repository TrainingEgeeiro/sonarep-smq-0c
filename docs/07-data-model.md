# 07 — Modèle de données

Le modèle 01B prépare un SMQ multi-entités sans créer de comptes utilisateurs. Les identifiants sont des UUID et les dates sont stockées avec fuseau horaire.

## Tables

- `organizations` : entités de gestion ; `sites` et `processes` y sont rattachés.
- `sites` : unités opérationnelles, code unique par organisation.
- `processes` : processus métier, statut actif/inactif et référence fonctionnelle du responsable.
- `requirement_sources` : sources normatives sans reproduction de texte protégé.
- `requirements` : exigences, applicabilité, statut d'évaluation et justification.
- `requirement_processes` : relation N:N exigences/processus.
- `documents` : métadonnées et cycle documentaire ; le contenu binaire n'est pas stocké ici.
- `document_revisions` : révisions et référence vers un stockage privé futur (`storage_key`).
- `document_processes` et `document_requirements` : relations N:N.
- `audit_events` : journal technique/métier sans auteur humain inventé.

## Intégrité

Les codes sont uniques dans leur périmètre, les relations utilisent des clés étrangères, les relations N:N ont des contraintes uniques et les tables principales ont des index de recherche. La suppression logique est disponible via `deleted_at` pour préserver l'historique qualité.

`NOT_APPLICABLE` exige une justification ; `OBSOLETE` exige un motif d'obsolescence. Leur approbation reste une règle métier à implémenter.
