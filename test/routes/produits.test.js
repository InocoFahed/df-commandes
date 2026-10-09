'use strict';

const assert = require('node:assert/strict');
const { after, before, test } = require('node:test');
const express = require('express');
const { DatabaseSync } = require('node:sqlite');
const routesProduits = require('../../src/routes/produits');

let db;
let server;
let baseUrl;

before(async () => {
  db = new DatabaseSync(':memory:');
  db.exec(`
    CREATE TABLE produits (
      id INTEGER PRIMARY KEY,
      reference TEXT NOT NULL UNIQUE,
      libelle TEXT NOT NULL,
      categorie TEXT NOT NULL,
      prix_ht REAL NOT NULL
    );
  `);
  const inserer = db.prepare(
    'INSERT INTO produits (reference, libelle, categorie, prix_ht) VALUES (?, ?, ?, ?)');
  inserer.run('VIS-INOX-6X60', 'Vis inox 6x60, boîte de 100', 'quincaillerie', 18.9);
  inserer.run('CABLE-R2V-3G25', 'Câble électrique 3G2,5', 'électricité', 89);
  inserer.run('VIS-BOIS-4X40', 'Vis à bois', 'bois', 5);
  inserer.run('PCT_%_01', 'Produit spécial', 'quincaillerie', 1);

  const app = express();
  app.use('/produits', routesProduits(db));
  server = app.listen(0, '127.0.0.1');
  await new Promise((resolve, reject) => {
    server.once('listening', resolve);
    server.once('error', reject);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}/produits`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
  });
  db.close();
});

async function rechercher(params = '') {
  const response = await fetch(`${baseUrl}${params}`);
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /application\/json/);
  return response.json();
}

test('GET /produits retourne le catalogue trié par référence', async () => {
  const produits = await rechercher();

  assert.deepEqual(produits.map(({ reference }) => reference), [
    'CABLE-R2V-3G25',
    'PCT_%_01',
    'VIS-BOIS-4X40',
    'VIS-INOX-6X60',
  ]);
});

test('q recherche partiellement dans la référence et le libellé sans tenir compte de la casse', async () => {
  const parReference = await rechercher('?q=vis-inox');
  const parLibelle = await rechercher('?q=BO%C3%8ETE');

  assert.deepEqual(parReference.map(({ reference }) => reference), ['VIS-INOX-6X60']);
  assert.deepEqual(parLibelle.map(({ reference }) => reference), ['VIS-INOX-6X60']);
});

test('q ignore les accents', async () => {
  const produits = await rechercher('?q=cable%20electrique');

  assert.deepEqual(produits.map(({ reference }) => reference), ['CABLE-R2V-3G25']);
});

test('q se combine avec categorie', async () => {
  const produits = await rechercher('?q=vis&categorie=bois');

  assert.deepEqual(produits.map(({ reference }) => reference), ['VIS-BOIS-4X40']);
});

test('les caractères % et _ de q sont recherchés littéralement', async () => {
  const combinaison = await rechercher('?q=%25_');
  const pourcent = await rechercher('?q=%25');
  const soulignement = await rechercher('?q=_');

  assert.deepEqual(combinaison.map(({ reference }) => reference), ['PCT_%_01']);
  assert.deepEqual(pourcent.map(({ reference }) => reference), ['PCT_%_01']);
  assert.deepEqual(soulignement.map(({ reference }) => reference), ['PCT_%_01']);
});
