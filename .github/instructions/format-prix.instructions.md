---
applyTo: "src/utils/**/*.js"
description: "Conventions pour l’arrondi et le formatage des prix en euros."
---

- Respecter les exports CommonJS du projet.
- Réutiliser `arrondirAuCentime` depuis `./arrondi` au lieu d’implémenter un autre arrondi.
- Rejeter les montants non finis avec une `TypeError`. Les chaînes, même numériques, ne sont pas des montants valides.
- Formater les prix avec `Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', useGrouping: true })`.
- Laisser le formatteur ajouter le symbole euro et les séparateurs français; ne pas ajouter `€` manuellement.
- Préserver le format à deux décimales et le groupement des milliers.
- Tester les montants positifs, nuls, négatifs, avec milliers, ainsi que les entrées invalides.
- Tenir compte des espaces insécables produits par `Intl.NumberFormat` dans les assertions.