# Journal des prompts

Une entrée par demande significative faite à Copilot pendant les TP. Ce journal fait partie du livrable : il montre comment vous avez guidé l’assistant et ce que vous avez corrigé.

| TP | Prompt envoyé (ou résumé fidèle) | Ce que Copilot a produit | Ce que j’ai gardé, corrigé ou refusé, et pourquoi |
|---|---|---|---|
| ch01 | « Écris une fonction JavaScript arrondirAuCentime(montant) qui arrondit un montant en euros au centime le plus proche... » | Math.round((montant + Number.EPSILON) * 100) / 100, présentée comme adaptée aux totaux TTC. npm run arrondi : 1 arrondi faux sur 3 (10,075 € donne 10,07 €) | Refusée : fausse sur 10,075 €. L’application a le même défaut : npm run arrondi:appli donne 3 arrondis faux sur 3 |
