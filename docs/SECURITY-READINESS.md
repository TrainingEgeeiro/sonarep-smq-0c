# Security Readiness — SMQ 360 SONAREP

## Décision actuelle

**Non prêt pour exposition publique ou usage opérationnel sensible.** L’application fonctionne comme socle et démonstrateur local sans authentification fiable documentée. Les données réelles ne doivent pas être exposées par les routes actuelles.

## Éléments vérifiés

- La cible déclarée est PostgreSQL/Supabase.
- L’historique Supabase identifié est `supabase_migrations.schema_migrations`.
- L’historique Drizzle distant n’a pas été trouvé.
- Les contrôles précédents ont signalé des privilèges étendus pour `anon` et `authenticated`; cette observation doit être confirmée par requêtes séparées avant correction.

## Éléments non vérifiés ou bloquants

- état `relrowsecurity` et `relforcerowsecurity` de chaque table;
- contenu complet des policies et leurs rôles;
- grants effectifs et hérités;
- rôle utilisé par le serveur applicatif;
- isolation par organisation;
- tests d’accès autorisé/refusé;
- invalidation de session et identité réelle;
- protection des routes sensibles.

## Règles avant exposition

1. Ne pas utiliser `user_metadata` pour autoriser une opération.
2. Ne pas confondre `TO authenticated` avec une autorisation métier.
3. Pour les mises à jour, prévoir `USING` et `WITH CHECK`.
4. Ne pas exposer `service_role` ou clé secrète au navigateur.
5. Activer RLS sur les tables du schéma exposé et vérifier les policies réelles.
6. Réduire les grants publics au minimum nécessaire.
7. Tester les parcours avec une identité réelle et des organisations distinctes.
8. Journaliser les transitions métier et les opérateurs vérifiés.

## Architecture applicative actuelle

Le shell informe explicitement de l’absence d’authentification fiable. Les modules utilisent des références fonctionnelles non nominatives et `UNVERIFIED_OPERATOR` lorsque prévu. Cette convention convient à un cadrage ou une démonstration contrôlée, pas à une mise en production.

## Mesures obligatoires

- choisir et documenter le fournisseur d’authentification;
- définir les rôles et le périmètre organisationnel;
- appliquer les policies sur une base isolée;
- réaliser une revue des privilèges;
- exécuter une matrice de tests RLS positifs et négatifs;
- faire valider la sécurité par un responsable habilité.

Aucune modification distante de sécurité n’a été réalisée pendant cette campagne.
