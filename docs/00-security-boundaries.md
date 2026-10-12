# SONAREP QMS 360 — Limites de sécurité du Prompt 00

**Version :** 0.1 — 12/10/2026  
**Statut :** fondation — aucune authentification applicative

## Décision d'accès

Le socle s'ouvre directement sur le tableau de bord. Il n'implémente ni connexion, ni session, ni compte artificiel, ni Better Auth, Auth.js ou autre fournisseur d'identité.

Cette décision est volontaire et limitée au Prompt 00. Elle ne signifie pas que l'application est prête à recevoir des données réelles ou à être exposée publiquement.

## Limites connues

- L'application ne peut pas identifier avec fiabilité l'auteur d'une action.
- Aucun contrôle de rôle ou de permission exécutable n'est encore disponible.
- L'isolation par utilisateur, entité ou organisation ne peut pas être garantie.
- Les actions métier, les fichiers sensibles et les données réelles sont hors périmètre.
- Un déploiement public de ce socle ne doit pas être considéré comme sécurisé pour la production.

## Mesures obligatoires avant données réelles

1. Définir une source d'identité approuvée et un périmètre réseau adapté.
2. Résoudre côté serveur l'identité, l'organisation et les permissions.
3. Refuser par défaut les mutations non autorisées.
4. Valider toutes les entrées côté serveur et journaliser les mutations.
5. Protéger les preuves par stockage privé et URLs temporaires.
6. Vérifier les en-têtes, secrets, sauvegardes, rétention et logs avant production.

## Ce qui n'est pas simulé

Aucun utilisateur, rôle, permission ou statut de sécurité n'est affiché comme réel. Les indicateurs éventuels du socle sont des éléments de cadrage explicitement fictifs.

## Traçabilité

- Charte : `docs/00-product-charter.md`
- Architecture : `docs/00-architecture-baseline.md`
- Vérification : `docs/00-verification-report.md`
- Rapport final : `docs/00-final-report.md`

**Conclusion :** le socle est navigable pour revue, mais non autorisé à traiter des données opérationnelles.

---

**Fin du document.**
