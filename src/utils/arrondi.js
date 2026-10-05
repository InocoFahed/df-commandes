function arrondirAuCentime(montant) {
  if (!Number.isFinite(montant)) {
    throw new TypeError('Le montant doit être un nombre fini');
  }

  if (Math.abs(montant) > Number.MAX_SAFE_INTEGER / 100) {
    throw new RangeError('Le montant est trop élevé pour un arrondi précis au centime');
  }

  const valeur = Math.abs(montant).toString().toLowerCase();
  const [coefficient, exposantTexte = '0'] = valeur.split('e');
  const exposant = Number(exposantTexte);
  const [entier, fraction = ''] = coefficient.split('.');
  const chiffres = BigInt(entier + fraction);
  const decalage = 2 - fraction.length + exposant;

  let centimes;
  if (decalage >= 0) {
    centimes = chiffres * 10n ** BigInt(decalage);
  } else {
    const diviseur = 10n ** BigInt(-decalage);
    centimes = chiffres / diviseur;
    if ((chiffres % diviseur) * 2n >= diviseur) centimes += 1n;
  }

  return (montant < 0 ? -1 : 1) * Number(centimes) / 100;
}

module.exports = { arrondirAuCentime };