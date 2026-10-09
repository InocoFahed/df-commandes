// Export comptable des commandes, lancé chaque nuit par le cabinet comptable.
// Ne pas toucher : ça marche. (JM, 2021)
const TVA = 0.2;

function requete(db, sql, params, cb) {
  setImmediate(function () {
    let resultat;
    try {
      const stmt = db.prepare(sql);
      resultat = stmt.all.apply(stmt, params);
    } catch (e) {
      cb(e);
      return;
    }
    cb(null, resultat);
  });
}

function trouverClient(clients, clientId) {
  for (const client of clients) {
    if (client.id === clientId) {
      return client;
    }
  }
  return null;
}

function totalCommande(commandeId, lignes) {
  let nombre = 0;
  let total = 0;
  for (const ligne of lignes) {
    if (ligne.commande_id === commandeId) {
      nombre += 1;
      total += ligne.quantite * ligne.prix_unitaire;
    }
  }
  return { nombre, total };
}

function formaterMontant(montant) {
  let texte = String(montant);
  if (texte.indexOf('.') === -1) {
    texte += ',00';
  } else {
    const parties = texte.split('.');
    if (parties[1].length === 1) {
      parties[1] += '0';
    }
    texte = parties[0] + ',' + parties[1];
  }
  return texte;
}

function formaterCommande(commande, clients, lignes) {
  const client = trouverClient(clients, commande.client_id);
  const { nombre, total } = totalCommande(commande.id, lignes);
  const ht = Math.round(total * 100) / 100;
  const ttc = Math.round(total * (1 + TVA) * 100) / 100;
  let nom = client ? client.nom : 'INCONNU';
  if (nom.indexOf(';') !== -1) {
    nom = nom.replace(/;/g, ',');
  }
  let ville = client ? client.ville : '';
  if (ville.indexOf(';') !== -1) {
    ville = ville.replace(/;/g, ',');
  }
  return commande.id + ';' + commande.date + ';' + nom + ';' + ville + ';'
    + nombre + ';' + formaterMontant(ht) + ';' + formaterMontant(ttc) + '\n';
}

function exporterCommandes(db, depuis, callback) {
  let csv = 'numero;date;client;ville;nb_lignes;total_ht;total_ttc\n';
  requete(db, 'SELECT * FROM commandes WHERE date >= ? ORDER BY date, id', [depuis], function (err, commandes) {
    if (err) {
      callback(err);
      return;
    }
    requete(db, 'SELECT * FROM lignes_commande', [], function (err2, lignes) {
      if (err2) {
        callback(err2);
        return;
      }
      requete(db, 'SELECT * FROM clients', [], function (err3, clients) {
        if (err3) {
          callback(err3);
          return;
        }
        const actifs = [];
        for (const commande of commandes) {
          if (commande.statut === 'annulee') {
            continue;
          }
          csv += formaterCommande(commande, clients, lignes);
          if (!actifs.includes(commande.client_id)) {
            actifs.push(commande.client_id);
          }
        }
        csv = csv + '# clients actifs;' + actifs.length + '\n';
        callback(null, csv);
      });
    });
  });
}

module.exports = { exporterCommandes: exporterCommandes };
