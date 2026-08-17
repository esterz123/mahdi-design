# Séquence post-diagnostic : 5 emails sur 14 jours

**Cible** : toute personne qui a payé le diagnostic 79 €.
**Objectif** : transformer le diag en refonte (2900 €) OU en pack sécurité (69 €/mois récurrent).
**Ton** : direct, pas de bullshit, preuves, urgence douce.

---

## EMAIL 1 — J+0 (immédiat après paiement)

**Sujet** : Diagnostic confirmé — voici ce qui se passe maintenant
**Pré-header** : 48h, votre rapport arrive. En attendant, un truc à faire.

```
Bonjour [Prénom],

Paiement confirmé. Merci.

Voilà comment ça se passe :

1. Vous allez recevoir un email séparé dans les prochaines heures avec un lien sécurisé pour m'envoyer l'accès à votre site (URL + identifiants). Ça prend 30 secondes.

2. Je commence l'audit dès que j'ai accès. Vous recevez le rapport complet sous 48h ouvrées.

3. On fait le point ensemble par téléphone ou visio (30 min offertes), je vous explique les priorités et je réponds à vos questions.

Une chose pendant que vous attendez : regardez votre site sur votre téléphone. Pas sur un écran d'ordi. Sur un téléphone.
9 visiteurs sur 10 qui découvrent votre site le font sur mobile. Si ça paraît lent, moche, ou illisible sur votre propre téléphone, c'est exactement le type de problème que je vais identifier dans le rapport.

À très vite,
Mahdi
```

---

## EMAIL 2 — J+2 (rappel envoi accès)

**Sujet** : [Prénom], je n'ai pas encore reçu l'accès à votre site
**Pré-header** : Sans accès, pas de rapport. Voici comment faire en 30 secondes.

```
Bonjour [Prénom],

Petit message rapide : je n'ai pas encore reçu l'accès à votre site pour démarrer le diagnostic.

Pas de souci si vous avez été pris, voici le lien pour me l'envoyer en 30 secondes :
[LIEN_ACCES]

Si vous préférez, vous pouvez simplement répondre à cet email avec :
- L'URL de votre site
- Les identifiants de connexion (ou "admin" via le lien magique WordPress)

Dès que j'ai accès, je démarre dans l'heure et vous avez votre rapport sous 48h.

Mahdi
```

---

## EMAIL 3 — J+5 (cas client + valeur)

**Sujet** : Ce que j'ai trouvé chez un client similaire (étude de cas)
**Pré-header** : Une faiblesse que 80% des PME ont. Coût : des clients.

```
Bonjour [Prénom],

Pendant que je finalise votre rapport, voici une étude de cas rapide.

Un client dans le secteur [SECTEUR_SIMILAIRE] est venu avec un site qui "allait bien". Voici ce que j'ai trouvé dans le diagnostic :

❌ Le site mettait 6,2 secondes à charger sur mobile (Google recommande 2,5s max)
→ Perte estimée : 35% des visiteurs mobiles partaient avant de voir la page

❌ Le logo datait de 2014 et ne passait pas en monochrome (impossible sur des supports sombres)
→ Impossible de l'utiliser sur certains supports marketing

❌ Aucune preuve sociale visible (pas d'avis clients, pas de logos de clients)
→ Le prospect ne savait pas si l'entreprise était sérieuse

Résultat après la refonte :
✅ Temps de chargement : 1,8s
✅ Identité refaite, déclinable partout
✅ 3 nouveaux devis signés en 30 jours

Votre rapport va probablement identifier des faiblesses similaires. La vraie question c'est : qu'est-ce que vous voulez faire après ?

Si vous voulez aller plus loin, l'offre de rentrée est ouverte jusqu'au 31 août :
3 projets complets de marque et site à 2 900 € au lieu de 3 900 €.
[LIEN_OFFRE]

Mahdi
```

---

## EMAIL 4 — J+10 (dernier jour rapport + upsell)

**Sujet** : Votre rapport est prêt. Une dernière chose.
**Pré-header** : Avant qu'on en parle au téléphone, jetez un œil à ça.

```
Bonjour [Prénom],

Votre rapport est prêt. Vous l'avez reçu (ou vous le recevez dans l'heure).

Je voulais vous partager une chose avant notre échange téléphonique de 30 minutes.

Quand j'audite un site, je classe les faiblesses en 3 catégories :

🟢 **Facile à corriger soi-même** (couleurs, typos, retouches mineures)
→ Vous pouvez le faire, ça ne nécessite pas de me payer

🟡 **Nécessite un pro** (refonte logo, restructuration, site)
→ C'est là que j'interviens

🔴 **Stratégique** (positionnement, message, offre)
→ Le plus impactant, mais demande du temps et de la réflexion

Le rapport que vous allez recevoir contient les 3 catégories. Les verts, vous pouvez les faire vous-même si vous voulez. Les jaunes et rouges, c'est là qu'un studio comme le mien apporte de la valeur.

Si vous voulez qu'on regarde ensemble comment aller plus loin, je vous propose un créneau de 30 min offert :
[LIEN_CALENDLY]

Ou si vous préférez, regardez directement l'offre de rentrée (jusqu'au 31 août, 3 places restantes) :
[LIEN_OFFRE]

À tout de suite,
Mahdi
```

---

## EMAIL 5 — J+14 (urgence + porte ouverte)

**Sujet** : Dernière ligne droite avant la fin de l'offre de rentrée
**Pré-header** : 31 août. Après, le tarif repasse à 3 900 €.

```
Bonjour [Prénom],

Petit mot rapide.

L'offre de rentrée se termine le 31 août. Après, le tarif des 3 projets complets repasse à 3 900 €.

Je ne vous relance pas pour vous forcer. Le diagnostic que vous avez acheté vous appartient, vous en faites ce que vous voulez — y compris le confier à quelqu'un d'autre.

Mais si on a travaillé ensemble sur l'audit et que vous voyez les choses à corriger, autant continuer tant que l'offre est ouverte.

3 places sur 10 ce mois-ci.
[LIEN_OFFRE]

Si vous n'êtes pas prêt ou pas intéressé, pas de souci, ignorez ce message. Je continuerai à travailler avec plaisir sur les rapports de diagnostic et à vous envoyer de temps en temps des études de cas utiles.

Bonne continuation,
Mahdi

---
Pour ne plus recevoir ces emails : [LIEN_DESABONNEMENT]
```

---

## NOTES TECHNIQUES

**Tracking minimal à mettre en place** :
- UTM sur tous les liens vers `refonte.html`
- Pixel de conversion sur la page `refonte.html` (savoir d'où viennent les conversions)
- Compteur diag/mois dans le dashboard

**Personnalisation** :
- Les champs entre [CROCHETS] sont à remplacer automatiquement
- Le secteur similaire (email 3) peut être laissé générique si on n'a pas l'info

**Délivrabilité** :
- Depuis `contact@mahdi-design.com` (Zoho)
- Pas plus d'1 email tous les 2 jours
- Toujours un lien de désabonnement
