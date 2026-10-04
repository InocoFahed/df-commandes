'use strict';

// Teste une fonction d'arrondi au centime sur trois montants délicats.
//   npm run arrondi         -> arrondirAuCentime, dans src/utils/arrondi.js
//   npm run arrondi:appli   -> arrondir, la fonction de l'application (src/devis/calcul.js)

const path = require('node:path');

const CAS = [
  { montant: 1.005, attendu: 1.01 },
  { montant: 1.255, attendu: 1.26 },
  { montant: 10.075, attendu: 10.08 },
];

function euros(valeur) {
  return `${String(valeur).replace('.', ',')} €`;
}

function charger(appli) {
  const fichier = appli ? 'src/devis/calcul.js' : 'src/utils/arrondi.js';
  const nom = appli ? 'arrondir' : 'arrondirAuCentime';
  let module;
  try {
    module = require(path.join(__dirname, '..', fichier));
  } catch (erreur) {
    if (erreur.code !== 'MODULE_NOT_FOUND') throw erreur;
    console.log(`Fichier ${fichier} introuvable : créez-le, puis relancez.`);
    process.exit(1);
  }
  if (typeof module[nom] !== 'function') {
    console.log(`${fichier} n'exporte pas ${nom} : ajoutez à la fin du fichier`);
    console.log(`module.exports = { ${nom} };`);
    process.exit(1);
  }
  return { fichier, nom, fonction: module[nom] };
}

const appli = process.argv[2] === 'appli';
const { fichier, nom, fonction } = charger(appli);

console.log(`Test de ${nom} (${fichier})`);
let erreurs = 0;
for (const { montant, attendu } of CAS) {
  const obtenu = fonction(montant);
  const juste = obtenu === attendu;
  if (!juste) erreurs += 1;
  console.log(`  ${euros(montant)} -> ${euros(obtenu)}, attendu ${euros(attendu)} : ${juste ? 'juste' : 'FAUX'}`);
}
console.log(erreurs === 0 ? 'Bilan : les 3 arrondis sont justes.' : `Bilan : ${erreurs} arrondi(s) faux sur 3.`);
