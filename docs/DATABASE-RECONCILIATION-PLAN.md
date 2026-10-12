# Plan de réconciliation PostgreSQL/Supabase

## Statut

Document préparatoire uniquement. Aucune écriture distante n’est autorisée par ce plan.

## État initial

Le code local contient les migrations Drizzle `0000` à `0007`. Les migrations `0003` à `0007` couvrent respectivement documents, risques, audits, non-conformités/actions correctives et indicateurs. Les contrôles précédents ont observé les tables de base dans `public`, mais pas les tables métier attendues de `0004` à `0007`.

L’historique Supabase identifié est `supabase_migrations.schema_migrations`; l’historique `drizzle.__drizzle_migrations` n’a pas été trouvé. Les lignes de l’historique doivent être lues avant toute décision.

## Dépendances et ordre proposé

L’ordre proposé est strictement séquentiel et doit être confirmé par les `CREATE TABLE`, enums et clés étrangères :

1. migrations fondatrices `0000` et `0001`;
2. alignement exigences `0002`;
3. maîtrise documentaire `0003`;
4. risques et opportunités `0004`, dépendant des organisations, processus, exigences et documents;
5. audits internes `0005`, dépendant des processus, exigences et risques;
6. non-conformités/actions `0006`, dépendant des audits, constats, processus, exigences et risques;
7. indicateurs `0007`, dépendant des organisations et processus.

Aucune migration ne doit être marquée manuellement comme appliquée. Une migration partiellement appliquée doit être traitée par inspection objet par objet et correction compensatoire versionnée.

## Préconditions obligatoires

- sauvegarde vérifiable et restauration testée sur environnement isolé;
- fenêtre d’intervention et responsable approuvés;
- export de l’historique de migration et inventaire des objets;
- contrôle des dépendances, extensions, enums, contraintes et index;
- absence d’écriture applicative concurrente ou procédure de maintenance approuvée;
- plan de retour arrière approuvé.

## Procédure de sauvegarde et restauration à approuver

La commande et le stockage de sauvegarde doivent être choisis par l’administrateur Supabase. La sauvegarde doit être chiffrée, horodatée, conservée selon la politique SONAREP et restaurée sur un projet/base isolé avant l’intervention. Le résultat attendu est une restauration lisible avec comptages, schéma et contrôles d’intégrité identiques à la source.

Aucune sauvegarde distante n’a été déclenchée par v0.

## Contrôles après chaque migration

Après chaque étape :

- vérifier l’existence des enums, tables, colonnes, contraintes et index attendus;
- vérifier les clés étrangères et les types;
- vérifier l’absence d’erreur dans l’historique Supabase;
- exécuter un test de lecture ciblé;
- arrêter la campagne si l’écart n’est pas explicable;
- consigner la preuve, l’horodatage et l’opérateur réel.

## Tests de persistance après autorisation

Pour chaque module : création/relecture, modification/relecture, contrainte d’unicité, transition valide et invalide, lien inter-module, audit event, données nulles/limites et comportement en cas d’erreur. Les tests doivent utiliser des références de test identifiables et être exécutés sur une base isolée avant toute donnée opérationnelle.

## Critères d’arrêt

Arrêt immédiat si : migration non idempotente inattendue, dépendance absente, erreur de type, perte ou modification inattendue de données, verrou prolongé, privilège public non prévu, RLS absente ou policy insuffisante, historique incohérent, ou restauration impossible.

## Retour arrière

Préférer la restauration approuvée sur environnement isolé lorsque le schéma a été modifié. Pour une erreur applicative sans changement de schéma, utiliser une correction versionnée. Ne jamais supprimer manuellement des tables ou réécrire l’historique pour simuler un rollback.

## Plan sécurité

Avant exposition : activer RLS sur les tables exposées, définir les policies selon l’organisation et l’identité réelle, contrôler `USING` et `WITH CHECK`, réduire les privilèges `anon`/`authenticated`, vérifier les grants hérités et tester un accès autorisé puis refusé. L’absence d’authentification fiable actuelle est bloquante pour les données sensibles.

## Autorisation requise

Une autorisation distincte est nécessaire pour toute sauvegarde, restauration, application de migration, écriture, modification de privilège ou changement RLS.
