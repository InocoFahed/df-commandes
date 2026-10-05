'use strict';

const { arrondirAuCentime } = require('./arrondi');

function formaterPrix(montant) {
	if (!Number.isFinite(montant)) {
		throw new TypeError('Le montant doit être un nombre fini');
	}

	const prixArrondi = arrondirAuCentime(montant);

	return new Intl.NumberFormat('fr-FR', {
		style: 'currency',
		currency: 'EUR',
		useGrouping: true,
	}).format(prixArrondi);
}

module.exports = { formaterPrix };
