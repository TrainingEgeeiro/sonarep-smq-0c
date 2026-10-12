# Checklist de configuration sécurisée — Incrément 3.8.2

## Statut

Préparation uniquement. La porte reste fermée. Ce document ne contient aucune valeur secrète et aucune commande d’écriture n’a été exécutée.

## 1. Variables de ciblage

| Variable | Format et contraintes | Comment déterminer la valeur réelle |
|---|---|---|
| `INTEGRATION_TARGET_NAME` | Chaîne non vide. Identifiant lisible de la cible isolée. | Le propriétaire de l’environnement nomme explicitement la base/branche Preview isolée. Ne pas déduire ce nom de la connexion Neon ou de `DATABASE_URL`. |
| `INTEGRATION_TARGET_AUTHORIZED` | Valeur littérale `true`. Toute autre valeur ferme la porte. | À renseigner uniquement après autorisation explicite de la cible par le propriétaire du projet. |
| `INTEGRATION_TARGET_ENV` | Chaîne non vide, strictement différente de `production`. `development` est recommandé. | Vérifier l’environnement Vercel réellement ciblé. Ne jamais utiliser `production` pour ce protocole. |
| `INTEGRATION_DATABASE_NAME` | Chaîne non vide correspondant exactement au nom de la base autorisée. | Confirmer le nom dans le contexte Neon isolé autorisé. La présence d’une connexion Neon ne suffit pas. |

Le code actuel vérifie ces quatre variables dans `lib/integration-gate.ts`. Il ne vérifie pas que `INTEGRATION_DATABASE_NAME` correspond automatiquement à `PGDATABASE` ou à `DATABASE_URL`; cette correspondance doit être confirmée séparément avant ouverture.

### Secret de cible requis par le bootstrap

- `INTEGRATION_TARGET_SECRET` : secret d’au moins 32 caractères, jamais placé dans Git, les logs ou le chat.
- Il doit être strictement identique à `ADMIN_BOOTSTRAP_SECRET`.
- Il autorise le bootstrap, mais ne remplace pas la confirmation humaine de la cible.

## 2. Variables `ADMIN_BOOTSTRAP_*`

| Variable | Nature | Format / contrôle |
|---|---|---|
| `ADMIN_BOOTSTRAP_EMAIL` | Identifiant, non secret | Non vide; le script le normalise en minuscules. Vérifier qu’il appartient au compte administrateur prévu. |
| `ADMIN_BOOTSTRAP_NAME` | Donnée d’identité, non secret | Nom affiché non vide. |
| `ADMIN_BOOTSTRAP_ORGANIZATION_ID` | Identifiant vérifié, non secret mais sensible | UUID existant dans `public.organizations`; le script ne crée pas l’organisation. Vérifier qu’il appartient à la cible isolée et à l’organisation prévue. |
| `ADMIN_BOOTSTRAP_PASSWORD` | Secret | Non vide, au moins 12 caractères, nouveau et unique. Ne jamais l’afficher, le committer ou le recopier dans le chat. |
| `ADMIN_BOOTSTRAP_SECRET` | Secret de contrôle | Au moins 32 caractères et strictement égal à `INTEGRATION_TARGET_SECRET`. Ne jamais l’afficher. |

Le script exige aussi les cinq variables de bootstrap, refuse un compte Better Auth déjà présent, exige le rôle existant `QMS_ADMIN` et rattache le sujet Better Auth à `app_users`, puis à `user_roles`. En cas d’échec du rattachement métier après création Better Auth, il s’arrête et demande une inspection contrôlée; il ne réinitialise pas le mot de passe.

## 3. Configuration dans Vercel

Configurer les variables dans **Settings → Vars** du projet, uniquement pour l’environnement **Preview** correspondant à la cible isolée. Ne pas les mettre en Production et ne pas utiliser une variable partagée avec une autre base.

- Saisir les valeurs directement dans le formulaire sécurisé Vercel.
- Ne pas les ajouter à `.env`, `.env.example`, un fichier versionné, un script ou une capture d’écran.
- Ne pas les imprimer avec `env`, `printenv`, `console.log` ou une commande de diagnostic.
- Si le mécanisme effectivement utilisé est un autre coffre sécurisé de l’équipe, conserver le même périmètre Preview isolé et documenter son nom sans révéler les valeurs.
- Après configuration, relancer uniquement le préflight en lecture seule; ne pas lancer `auth:bootstrap` automatiquement.

## 4. Vérification Neon avant toute écriture

1. Confirmer que la cible est une base/branche Neon isolée, non productive, explicitement autorisée pour ce test.
2. Confirmer que `INTEGRATION_DATABASE_NAME` correspond exactement à cette cible; ne pas considérer la simple disponibilité de `DATABASE_URL` comme une autorisation.
3. Vérifier le schéma Better Auth dans `neon_auth` : `user`, `session`, `account`, `verification`, avec les identifiants camelCase attendus par Better Auth.
4. Vérifier le schéma QMS dans `public` : `organizations`, `app_users`, `roles`, `user_roles` et les colonnes utilisées par le bootstrap.
5. Vérifier que `ADMIN_BOOTSTRAP_ORGANIZATION_ID` est un UUID existant dans `public.organizations` et qu’il appartient à cette cible.
6. Vérifier que le rôle `QMS_ADMIN` existe dans `public.roles`.
7. Ne pas sélectionner ni afficher de tokens de session, mots de passe ou hashes; toute inspection doit limiter les colonnes aux métadonnées nécessaires.

La connexion Neon et le schéma live ne constituent pas une autorisation d’écriture.

## 5. Migration historique

`drizzle/0002_better_auth_schema.sql` crée les tables Better Auth dans `public`. Le runtime Better Auth utilise `search_path=neon_auth`; cette migration historique ne doit donc pas être appliquée telle quelle à `neon_auth` ni exécutée par le préflight. Aucune migration n’est requise pour cette checklist et aucune migration n’a été modifiée.

## 6. Checklist pré-exécution

- [ ] Cible Neon isolée, non productive et explicitement autorisée.
- [ ] `INTEGRATION_TARGET_NAME` renseigné avec le nom confirmé.
- [ ] `INTEGRATION_TARGET_AUTHORIZED=true` renseigné littéralement.
- [ ] `INTEGRATION_TARGET_ENV` renseigné avec une valeur non productive.
- [ ] `INTEGRATION_DATABASE_NAME` confirmé contre la cible réelle.
- [ ] `INTEGRATION_TARGET_SECRET` généré et conservé uniquement dans Vercel Preview.
- [ ] Email et nom administrateur vérifiés.
- [ ] `ADMIN_BOOTSTRAP_ORGANIZATION_ID` vérifié dans `public.organizations`.
- [ ] `ADMIN_BOOTSTRAP_PASSWORD` généré, unique et conservé uniquement dans Vercel Preview.
- [ ] `ADMIN_BOOTSTRAP_SECRET` identique au secret de cible, sans révéler sa valeur.
- [ ] Aucun secret dans Git, le chat ou les logs.
- [ ] Migration `0002` explicitement non exécutée.
- [ ] Aucun bootstrap, compte, insertion ou modification lancé avant le préflight vert.

## 7. Commande de préflight en lecture seule

Après configuration, relancer uniquement :

```bash
pnpm integration:preflight
```

Résultat attendu avant toute opération : `Porte d’intégration : OUVERTE`, avec les quatre contrôles `Cible identifiée`, `Cible explicitement autorisée`, `Environnement non productif` et `Base identifiée` en `OK`. Ce résultat ne confirme pas à lui seul la cohérence Neon ni l’autorisation humaine; ces vérifications restent nécessaires.

## Limites explicitement non confirmées

- Les valeurs réelles des variables ne sont pas connues et ne sont pas déduites.
- La correspondance automatique entre `INTEGRATION_DATABASE_NAME` et la connexion runtime n’est pas implémentée.
- La présence exacte de l’organisation et du rôle doit être vérifiée sur la cible autorisée avant bootstrap.
- Aucun accès administrateur n’est rétabli et le jalon 3.9 ne commence pas avec cette checklist.
