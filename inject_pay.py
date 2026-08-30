#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""INJECTER LE BOUTON PAYER 79 EUR sur les 213 pages diag existantes.
01/09 : le lead qui lit son diag est a son pic d'achat. Sans bouton, il doit
repondre 'oui', attendre, discuter = friction = 0 euro. Avec le bouton, il
clique et paie pendant que l'emotion est la. Le recu PayPal arrive dans
contact@mahdi-design.com et la chaine de livraison existante prend le relais.
Regle Mahdi : zero tiret long, zero apostrophe typographique.
"""
import glob, io, os, re

BASE = os.path.dirname(os.path.abspath(__file__))
DIAG = os.path.join(BASE, "diag")
PAYPAL = "https://www.paypal.com/ncp/payment/FQYKP733699LQ"

BLOC_PAIEMENT = '''
<div style="margin-top:22px;background:#f0fdf4;border:2px solid #16a34a;border-radius:12px;padding:18px;">
<div style="font-weight:bold;color:#14532d;font-size:17px;">Version complete du diagnostic : 79 EUR</div>
<div style="color:#1f2937;font-size:15px;line-height:1.6;margin-top:6px;">
Votre site compare a 2 concurrents directs, le plan d'action chiffre en euros, et la liste exacte des corrections a faire.
Livraison immediate apres paiement, sans rendez-vous, sans appel.</div>
<a href="%s" style="display:inline-block;margin-top:14px;background:#16a34a;color:#ffffff;font-weight:bold;font-size:16px;padding:14px 26px;border-radius:10px;text-decoration:none;">
Payer 79 EUR et recevoir ma version complete</a>
<div style="color:#6b7280;font-size:13px;margin-top:10px;">Paiement securise PayPal. Vous pouvez aussi repondre "oui" a l'email pour la version gratuite.</div>
</div>
''' % PAYPAL

def main():
    n = 0
    for f in sorted(glob.glob(os.path.join(DIAG, "*.html"))):
        t = io.open(f, encoding="utf-8").read()
        if "paypal.com/ncp" in t:
            continue  # deja injecte
        # inserer juste avant la signature Mahdi
        idx = t.rfind("Mahdi · Designer de marque")
        if idx == -1:
            idx = t.rfind("</div></body>")
        if idx == -1:
            continue
        t2 = t[:idx] + BLOC_PAIEMENT + t[idx:]
        io.open(f, "w", encoding="utf-8", newline="").write(t2)
        n += 1
    print("pages mises a jour avec bouton 79 EUR:", n)

if __name__ == "__main__":
    main()
