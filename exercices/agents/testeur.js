'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { conditionsPaiement } = require('../../src/paiement/conditions');

test('§ 1 refuse un total nul, négatif ou qui n’est pas un nombre', () => {
	for (const totalTTC of [0, -0.01, '1000', NaN, null]) {
		assert.throws(() => conditionsPaiement({}, totalTTC), /Total TTC invalide/);
	}
});

test('§ 2 ne demande pas d’acompte juste avant 1 000 €', () => {
	assert.deepEqual(conditionsPaiement({}, 999.99), {
		acompte: 0,
		solde: 999.99,
		delaiSoldeJours: 30,
	});
});

test('§ 2 demande un acompte de 30 % au seuil inclus de 1 000 €', () => {
	assert.deepEqual(conditionsPaiement({}, 1000), {
		acompte: 300,
		solde: 700,
		delaiSoldeJours: 30,
	});
});

test('§ 2 demande un acompte de 30 % juste après 1 000 €', () => {
	assert.deepEqual(conditionsPaiement({}, 1000.01), {
		acompte: 300,
		solde: 700.01,
		delaiSoldeJours: 30,
	});
});

test('§ 3 un grand compte ne verse jamais d’acompte, quel que soit le montant', () => {
	for (const totalTTC of [999.99, 1000, 1000.01, 5000]) {
		assert.equal(conditionsPaiement({ grand_compte: true }, totalTTC).acompte, 0);
	}
});

test('§ 4 le solde standard est payable 30 jours après la livraison', () => {
	assert.equal(conditionsPaiement({}, 1000.01).delaiSoldeJours, 30);
});

test('§ 4 le solde grand compte est payable 45 jours après la livraison', () => {
	assert.equal(conditionsPaiement({ grand_compte: true }, 1000.01).delaiSoldeJours, 45);
});

test('§ 5 arrondit l’acompte au centime et conserve exactement le total', () => {
	const conditions = conditionsPaiement({}, 1000.05);

	assert.equal(conditions.acompte, 300.02);
	assert.equal(conditions.solde, 700.03);
	assert.equal(conditions.acompte + conditions.solde, 1000.05);
});
