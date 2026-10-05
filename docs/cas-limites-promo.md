# Cas limites du code promo PRINTEMPS
## Ma liste
| Valeur testée | Résultat attendu |
|---|---|
| Code PRINTEMPS, le **28 février**, 150 € HT, 1re utilisation | refusé |
| Code PRINTEMPS, le **1er mars**, 150 € HT, 1re utilisation | accepté |
| Code PRINTEMPS, le **31 mars**, 150 € HT, 1re utilisation | accepté |
| Code PRINTEMPS, le **1er avril**, 150 € HT, 1re utilisation | refusé |
| Code PRINTEMPS, le 15 mars, **99,99 € HT**, 1re utilisation | refusé |
| Code PRINTEMPS, le 15 mars, **100,00 € HT**, 1re utilisation | accepté |
| Code PRINTEMPS, le 15 mars, 150 € HT, **2e utilisation** | refusé |
| Code **vide**, le 15 mars, 150 € HT, 1re utilisation | refusé |
| Code **« printemps »** (minuscules), le 15 mars, 150 € HT, 1re utilisation | ? (à demander au métier) |

## Liste de Copilot

| Valeur testée | Résultat attendu |
|---|---|
| Commande le 28 février, juste avant le début de validité | Refusé |
| Commande le 1er mars, premier jour de validité | Accepté |
| Commande le 2 mars, juste après le début de validité | Accepté |
| Commande le 30 mars, juste avant la fin de validité | Accepté |
| Commande le 31 mars, dernier jour de validité | Accepté |
| Commande le 1er avril, juste après la fin de validité | Refusé |
| Commande à 99,99 € HT, juste sous le minimum | Refusé |
| Commande à 100,00 € HT, au minimum | Accepté |
| Commande à 100,01 € HT, juste au-dessus du minimum | Accepté |
| Première utilisation du code par le client | Accepté |
| Deuxième utilisation du code par le même client | Refusé |

## Comparaison
- Trouvé par Copilot, pas par moi : les valeurs juste après la frontière (2 mars, 30 mars, 100,01 € HT).
- Trouvé par moi, pas par Copilot : le code saisi vide et le code écrit en minuscules (« printemps ») ; et chacun de mes cas précise toutes les conditions (date, montant, utilisation) en n'en changeant qu'une, alors que les cas de Copilot ne disent rien des autres conditions.
- Question que la règle ne tranche pas : le code saisi en minuscules est-il accepté ? Et le 31 mars, jusqu'à quelle heure (23 h 59 ? dans quel fuseau horaire) ?

