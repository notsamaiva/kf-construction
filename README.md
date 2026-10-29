# KF Construction — générateur de devis Jerry

`src/index.html` est la copie exacte de la production du 30 octobre 2026 (SHA1 bf9fb2de29f7afae932265fb1b6d748c98412f65). `public/index.html` doit rester identique : le site public n'est pas redessiné. Le générateur séparé est accessible à `/generer-devis`.

## Déploiement

Installer avec `npm ci`. Déployer uniquement en Preview jusqu'à validation du propriétaire. Les fonctions Node sont à la racine `api/`, la sortie statique dans `public/`.

Secrets Vercel, côté serveur uniquement :
- `KF_JERRY_HASH` : `salt:scryptHex`, scrypt Node, longueur 64 octets.
- `KF_SESSION_SECRET` : secret aléatoire de 32 octets minimum.

Pas d'inscription publique : un seul compte Jerry. Cookie Secure, HttpOnly, SameSite=Strict ; contrôle d'origine des POST, expiration à 8 heures, signatures HMAC et authentification de chaque opération PDF. Le mot de passe initial doit être aléatoire et fort. La limitation locale des tentatives n'est pas un compteur partagé entre instances ; pour des identifiants choisis par l'utilisateur ou une exposition plus large, ajouter une limite WAF/durable et une authentification MFA gérée.

## Devis

Calculs et validation répétés côté serveur ; prix et forfait en FCFA entiers, quantités décimales. Les totaux de lignes sont arrondis au FCFA. Numéro date + identifiant aléatoire (pas une séquence comptable). Après validation, le document est signé et ne peut plus être modifié sans invalider la signature. Le brouillon et le document signé sont conservés dans sessionStorage de l'onglet uniquement. Pas d'archivage central : télécharger le PDF avant de fermer l'onglet. L'envoi WhatsApp est manuel.

Logo fourni : « Logo K&F Construction doré et vert.png ». Polices DejaVu Sans embarquées avec leur licence.

Tests : `npm test`. Vérification end-to-end sur le déploiement de prévisualisation requise avant promotion. Aucune promotion automatique.
