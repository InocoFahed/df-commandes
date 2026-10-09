'use strict';

const assert = require('node:assert/strict');
const { test } = require('node:test');
const { conditionsPaiement } = require('../../src/paiement/conditions');

test('refuse un total TTC nul, négatif ou non numérique', () => {
	for (const total of [0, -1, '100', NaN]) {
		assert.throws(() => conditionsPaiement({}, total), {
			message: 'Total TTC invalide',
		});
	}
});

test('ne demande pas d’acompte sous le seuil', () => {
	assert.deepEqual(conditionsPaiement({}, 999.99), {
		acompte: 0,
		solde: 999.99,
		delaiSoldeJours: 30,
	});
});

test('applique 30 % d’acompte dès 1 000 € inclus', () => {
	assert.deepEqual(conditionsPaiement({}, 1000), {
		acompte: 300,
		solde: 700,
		delaiSoldeJours: 30,
	});
});

test('arrondit l’acompte au centime et conserve le total', () => {
	const conditions = conditionsPaiement({}, 1000.05);

	assert.equal(conditions.acompte, 300.02);
	assert.equal(conditions.solde, 700.03);
	assert.equal(conditions.acompte + conditions.solde, 1000.05);
});

test('les grands comptes ne paient pas d’acompte et disposent de 45 jours', () => {
	assert.deepEqual(conditionsPaiement({ grand_compte: true }, 2500), {
		acompte: 0,
		solde: 2500,
		delaiSoldeJours: 45,
	});
});
