'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const {
  arrondir,
  tauxRemiseQuantite,
  calculerLigne,
  calculerDevis,
} = require('../../src/devis/calcul');

test('arrondir arrondit au centime le plus proche', () => {
  assert.equal(arrondir(12.344), 12.34);
  assert.equal(arrondir(12.345), 12.35);
});

test('la remise quantitative respecte les seuils inclusifs', () => {
  for (const [quantite, taux] of [
    [1, 0],
    [9, 0],
    [10, 0.05],
    [49, 0.05],
    [50, 0.08],
    [99, 0.08],
    [100, 0.12],
  ]) {
    assert.equal(tauxRemiseQuantite(quantite), taux, `quantité ${quantite}`);
  }
});

test('calculerLigne calcule le brut et la remise sur quantité de la ligne', () => {
  assert.deepEqual(calculerLigne({ reference: 'A-1', prix_ht: 10 }, 10), {
    reference: 'A-1',
    quantite: 10,
    prixUnitaire: 10,
    brut: 100,
    remise: 5,
    net: 95,
  });
});

test('une quantité non entière ou non positive est refusée', () => {
  for (const quantite of [0, -1, 1.5, '2', NaN]) {
    assert.throws(
      () => calculerLigne({ reference: 'A-1', prix_ht: 10 }, quantite),
      { message: 'Quantité invalide' },
    );
  }
});

test('un devis sans ligne est refusé', () => {
  for (const lignes of [[], null, undefined]) {
    assert.throws(
      () => calculerDevis({ grand_compte: false }, lignes),
      { message: 'Un devis contient au moins une ligne' },
    );
  }
});

test('la remise grand compte est calculée après la remise sur quantité', () => {
  const devis = calculerDevis({ grand_compte: true }, [
    { produit: { reference: 'A-1', prix_ht: 10 }, quantite: 50 },
  ]);

  assert.equal(devis.totalBrut, 500);
  assert.equal(devis.lignes[0].remise, 40);
  assert.equal(devis.remiseClient, 23);
  assert.equal(devis.port, 25);
  assert.equal(devis.totalHT, 462);
});

test('la remise totale est plafonnée à 15 % du total brut', () => {
  const devis = calculerDevis({ grand_compte: true }, [
    { produit: { reference: 'A-1', prix_ht: 10 }, quantite: 100 },
  ]);

  assert.equal(devis.totalBrut, 1000);
  assert.equal(devis.lignes[0].remise, 120);
  assert.equal(devis.remiseClient, 30);
  assert.equal(devis.port, 0);
  assert.equal(devis.totalHT, 850);
});

test('les frais de port sont offerts dès que le total remisé atteint 500 euros', () => {
  const devis = calculerDevis({ grand_compte: false }, [
    { produit: { reference: 'A-1', prix_ht: 100 }, quantite: 5 },
  ]);

  assert.equal(devis.port, 0);
  assert.equal(devis.totalHT, 500);
});

test('les frais de port sont facturés sous le seuil et inclus dans la TVA', () => {
  const devis = calculerDevis({ grand_compte: false }, [
    { produit: { reference: 'A-1', prix_ht: 0.01 }, quantite: 1 },
  ]);

  assert.equal(devis.port, 25);
  assert.equal(devis.totalHT, 25.01);
  assert.equal(devis.tva, 5);
  assert.equal(devis.totalTTC, 30.01);
});

test('la TVA porte sur le HT arrondi et le TTC additionne les montants arrondis', () => {
  const devis = calculerDevis({ grand_compte: true }, [
    { produit: { reference: 'A-1', prix_ht: 10 }, quantite: 10 },
  ]);

  assert.equal(devis.totalHT, 115.25);
  assert.equal(devis.tva, 23.05);
  assert.equal(devis.totalTTC, 138.3);
});
