# SONAREP QMS 360 — Architecture technique de référence

**Version :** 0.1 — 12/10/2026  
**Statut :** proposition de socle — à valider avant l'Incrément 01

## 1. Principes

- Application monolithique modulaire avec Next.js App Router, TypeScript et Tailwind CSS.
- Les composants d'interface restent séparés des contrats, des services métier et de l'accès aux données.
- Les mutations futures passent par le serveur, sont validées par schéma, contrôlées par autorisation et journalisées.
- Les données de démonstration sont toujours identifiées comme fictives.
- Les normes sont stockées sous forme de références et d'exigences reformulées, jamais comme reproduction de texte protégé.

## 2. Couches et responsabilités

| Couche | Responsabilité | Interdit |
|---|---|---|
| `app/` | Routes, layouts, pages serveur et handlers HTTP | Accès direct non contrôlé aux tables depuis les composants visuels |
| `components/` | Présentation, navigation, formulaires et états d'interface | Décider seule d'une permission ou d'un statut métier |
| `lib/contracts/` | Types et schémas Zod partagés | Contenir des secrets ou des règles d'accès implicites |
| `lib/domain/` | Règles métier, transitions d'état et services applicatifs | Dépendre du navigateur |
| `lib/db/` | Client Drizzle, schéma et requêtes paramétrées | Exposer `DATABASE_URL` au client |
| `lib/authz/` | Autorisation serveur future, indépendante de l'interface | Simuler un utilisateur dans le Prompt 00 |
| `lib/audit/` | Écriture des événements d'audit et contexte de traçabilité | Être contourné par une mutation métier |
| `db/migrations/` | Migrations SQL versionnées et reproductibles | Modifier la base manuellement sans migration |
| `tests/` | Tests unitaires, intégration et E2E | Transformer un test en preuve de sécurité réelle |
| stockage privé | Preuves et fichiers, URL temporaires et métadonnées | Fichiers publics ou binaires dans PostgreSQL |

Les répertoires peuvent être introduits progressivement. Leur absence dans le socle actuel est volontaire : l'Incrément 01 devra les créer avec leurs contrats.

## 3. Cible de données

PostgreSQL managé sur Neon est la cible. Drizzle ORM fournit le typage et la définition du schéma ; les migrations générées et relues sont la seule voie de changement de structure. Les tables devront prévoir les identifiants, timestamps, états, références organisationnelles et champs d'audit nécessaires. Chaque requête touchant des données métier devra être bornée par le contexte organisationnel et l'autorisation serveur.

Les fichiers de preuve ne sont pas enregistrés dans PostgreSQL. La base conserve leurs métadonnées, leur empreinte, leur type, leur taille, leur propriétaire métier et leur clé de stockage. Le fournisseur exact de stockage privé reste une décision en attente.

## 4. Flux métier cible

1. La page ou le client appelle une action serveur ou un route handler.
2. Le serveur valide l'entrée avec un contrat Zod.
3. Le contexte d'identité et d'organisation est résolu par la couche d'accès future.
4. Le service de domaine vérifie la transition et les règles métier.
5. Drizzle exécute une transaction paramétrée.
6. L'événement d'audit est écrit dans la même transaction lorsque cela est nécessaire.
7. La réponse expose un état explicite : succès, erreur métier, erreur de validation ou indisponibilité.

## 5. Déploiement et environnements

- **Développement :** variables locales non commitées, base de développement isolée.
- **Préproduction :** données fictives, migrations appliquées dans l'ordre, contrôles de sécurité.
- **Production :** accès réseau et identité validés, stockage privé configuré, sauvegardes et rétention approuvées.
- **Vercel :** hébergement Next.js ; aucune donnée sensible dans le bundle client.

## 6. Décisions différées

La stratégie multi-entités, le fournisseur de stockage, le modèle d'identité, les propriétaires fonctionnels et les éditions normatives doivent être validés avant les modules qui manipulent des données réelles.

## 7. Critères d'acceptation du socle

Le socle est acceptable lorsque les responsabilités ci-dessus sont matérialisées par les conventions de l'Incrément 01, qu'un schéma de données versionné est validé dans l'Incrément 02 et qu'aucune page ne présente une fonctionnalité non reliée comme opérationnelle.

## Traçabilité

- Charte : `docs/00-product-charter.md`
- Sécurité : `docs/00-security-boundaries.md`
- Vérification : `docs/00-verification-report.md`
- Rapport final : `docs/00-final-report.md`

---

Document de fondation du Prompt 00. Aucun workflow métier n'est implémenté ici.

---

**Rapport de remise :** ce document formalise les responsabilités et limites techniques sans démarrer l'Incrément 01.

---

**Fin du document.**
