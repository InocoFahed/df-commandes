'use strict';

// Teste la fonction de validation de référence produit, quel que soit son nom.
//   npm run reference                          -> src/validation/reference.js
//   npm run reference -- src/validation/essai.js   -> un autre fichier

const path = require('node:path');

const FICHIER = process.argv[2] || 'src/validation/reference.js';

const CAS = [
  { reference: 'VIS-INOX-6X60', attendu: true, regle: 'trois segments valides' },
  { reference: 'PARP-20', attendu: true, regle: 'deux segments valides' },
  { reference: 'A-B', attendu: true, regle: 'deux segments, le minimum' },
  { reference: 'ABCDEFGHIJ-ABCDEFGHI', attendu: true, regle: '20 caractères, la limite' },
  { reference: 'VIS', attendu: false, regle: 'un seul segment' },
  { reference: 'A-B-C-D-E', attendu: false, regle: 'cinq segments' },
  { reference: 'vis-inox', attendu: false, regle: 'minuscules' },
  { reference: 'VIS--60', attendu: false, regle: 'segment vide' },
  { reference: 'ABCDEFGHIJ-ABCDEFGHIJ', attendu: false, regle: '21 caractères' },
];

function charger() {
  let module;
  try {
    module = require(path.resolve(__dirname, '..', FICHIER));
  } catch (erreur) {
    if (erreur.code !== 'MODULE_NOT_FOUND') throw erreur;
    console.log(`Fichier ${FICHIER} introuvable : créez-le, puis relancez.`);
    process.exit(1);
  }
  const noms = Object.keys(module).filter((nom) => typeof module[nom] === 'function');
  if (noms.length === 0) {
    console.log(`${FICHIER} n'exporte aucune fonction : ajoutez à la fin du fichier`);
    console.log('module.exports = { nomDeVotreFonction };');
    process.exit(1);
  }
  return { nom: noms[0], fonction: module[noms[0]] };
}

const { nom, fonction } = charger();

console.log(`Test de ${nom} (${FICHIER})`);
let erreurs = 0;
for (const { reference, attendu, regle } of CAS) {
  let obtenu;
  try {
    obtenu = fonction(reference);
  } catch (erreur) {
    obtenu = `erreur « ${erreur.message} »`;
  }
  const juste = obtenu === attendu;
  if (!juste) erreurs += 1;
  console.log(`  ${reference} (${regle}) -> ${obtenu}, attendu ${attendu} : ${juste ? 'juste' : 'FAUX'}`);
}
console.log(erreurs === 0
  ? `Bilan : les ${CAS.length} cas sont justes.`
  : `Bilan : ${erreurs} cas faux sur ${CAS.length}.`);
