# SONAREP QMS 360 — Charte produit

**Version :** 0.1 — 12/10/2026  
**Statut :** fondation validée pour l'Incrément 01  
**Organisation :** SONAREP, filiale du groupe SNPC, République du Congo  
**Fuseau de référence :** Africa/Brazzaville  
**Langue d'interface :** français

## Finalité

SONAREP QMS 360 est un ERP de pilotage du système de management de la qualité pour les activités de recherche, de production et d'opérations pétrolières. Le produit doit permettre de structurer les exigences applicables, les processus, les documents, les preuves, les risques, les écarts, les actions et les audits.

Le produit est conçu comme un logiciel industrialisable. Une interface, une donnée fictive ou un bouton non relié ne doit jamais être présenté comme une fonctionnalité opérationnelle.

## Utilisateurs métier cibles

Direction Générale, Direction Qualité, responsables de processus, responsables opérationnels, auditeurs, pilotes d'actions et collaborateurs habilités.

## Décision d'accès

Le produit s'ouvre directement sur le tableau de bord. Aucun écran de connexion, aucun compte artificiel et aucune dépendance à Better Auth, Auth.js ou un autre système de session ne sont introduits dans ce socle.

Cette décision ne constitue pas une autorisation d'exposition publique. Tant qu'une identité fiable n'est pas fournie par une couche réseau, proxy ou hébergement, le produit ne peut pas prouver qui effectue une opération.

## Principes fonctionnels

- Les référentiels, statuts, rôles métier et paramètres doivent rester configurables.
- Les opérations métier futures devront être persistées, validées côté serveur et journalisées.
- Les écrans doivent exposer les états vides, les erreurs, les chargements et l'origine des données.
- Les normes sont référencées par métadonnées et exigences reformulées, sans reproduire leur texte protégé.
- L'ERP ne confère aucune certification ISO.

## Périmètre cible

1. Tableau de bord exécutif
2. Référentiel qualité et exigences applicables
3. Cartographie des processus
4. Maîtrise documentaire
5. Preuves et enregistrements
6. Risques et opportunités
7. Non-conformités
8. Actions correctives et préventives
9. Audits
10. Rapports et indicateurs
11. Journal d'audit
12. Administration et paramètres

## Hors périmètre du Prompt 00

Les workflows CRUD, la persistance métier, le stockage de fichiers, les permissions exécutables et les données de démonstration sont réservés aux incréments suivants. Le Prompt 00 établit le cadre ; il ne prétend pas livrer ces fonctionnalités.

## Critères de sortie

Le socle doit compiler, s'ouvrir sans authentification, documenter ses limites de sécurité et fournir une architecture traçable avant tout développement de workflow.

> Les données visibles dans le socle sont explicitement des indicateurs de cadrage et non des mesures opérationnelles SONAREP.

---

## Historique des décisions

| Date | Décision | Justification |
|---|---|---|
| 12/10/2026 | Pas d'authentification dans le produit | Exigence fonctionnelle du référentiel projet |
| 12/10/2026 | Architecture monolithique modulaire Next.js | Simplicité, maintenabilité et déploiement Vercel |
| 12/10/2026 | PostgreSQL/Neon + Drizzle comme cible | Transactions, contraintes et migrations versionnées |
| 12/10/2026 | Stockage privé séparé pour les preuves | Ne pas placer les pièces jointes dans PostgreSQL ou dans le navigateur |
| 12/10/2026 | Interface française | Contexte d'exploitation SONAREP |

## Décisions en attente

- Confirmation du périmètre organisationnel initial et de la stratégie multi-entités.
- Validation du fournisseur de stockage privé des preuves et de sa politique de rétention.
- Validation des éditions et amendements normatifs applicables au périmètre SONAREP.
- Choix du mécanisme d'accès réseau avant toute exposition à des données réelles.
- Confirmation des propriétaires métier de chaque module.
- Définition de la stratégie d'identité future, sans l'introduire dans le Prompt 00.

## Risques initiaux

| Risque | Impact | Réponse prévue |
|---|---|---|
| Accès public sans identité fiable | Critique | Réseau privé/proxy/SSO à définir avant production |
| Données fictives confondues avec des données réelles | Élevé | Étiquetage systématique et suppression avant mise en service |
| Références normatives obsolètes | Élevé | Revue de conformité avant le module concerné |
| Permissions non vérifiables sans identité | Critique | Ne pas simuler une permission ; préparer une couche d'autorisation indépendante |
| Croissance non maîtrisée du périmètre | Moyen | Découpage par incréments et critères de sortie |
| Fichiers sensibles mal protégés | Critique | Stockage privé, URL temporaires, contrôle serveur et journalisation |

## Feuille de route

- **Incrément 01 — Fondation technique et Master UI :** shell navigable, conventions, composants, états et contrats de données.
- **Incrément 02 — Données, migrations et journalisation :** Neon, Drizzle, schéma initial, migrations, audit technique.
- **Incrément 03 — Exigences et conformité :** référentiel, applicabilité, preuves et statut.
- **Incrément 04 — Écarts et actions :** non-conformités, causes, actions correctives/préventives et échéances.
- **Incrément 05 — Documents, audits et pilotage :** maîtrise documentaire, audits, indicateurs et rapports.
- **Incrément 06 — QA, données de démonstration et sécurité :** tests E2E, jeux de données explicitement fictifs, durcissement et déploiement.

L'Incrément 01 ne doit commencer qu'après revue et acceptation de ce rapport.

## Tests exécutés

Les commandes réellement exécutées et leur résultat sont consignés dans `docs/00-verification-report.md`.

## Traçabilité

- Architecture : `docs/00-architecture-baseline.md`
- Sécurité : `docs/00-security-boundaries.md`
- Vérification : `docs/00-verification-report.md`
- Rapport de remise : `docs/00-final-report.md`

---

Fondations validées. Document créé avec succès.
