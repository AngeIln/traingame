# Tableaux d’équilibrage initiaux

Ces valeurs servent de base de tuning pour un premier prototype. Elles sont conçues pour être modifiées après tests de simulation.

## 1) Coûts (construction & exploitation)

| Élément | Coût initial | Coût récurrent | Notes |
|---|---:|---:|---|
| Rail standard (par km) | 120 000 | 1 200 / an | Terrain plat |
| Rail montagne (par km) | 260 000 | 2 600 / an | Inclut ouvrages |
| Gare locale | 350 000 | 24 000 / an | Petite capacité |
| Gare centrale | 1 200 000 | 90 000 / an | Hub régional |
| Locomotive passagers (Tier 1) | 480 000 | 55 000 / an | Vitesse moyenne |
| Locomotive fret (Tier 1) | 520 000 | 62 000 / an | Forte traction |
| Wagon passagers | 90 000 | 8 000 / an | Capacité 80 |
| Wagon fret | 110 000 | 10 000 / an | Capacité 60 t |

## 2) Revenus (base avant modificateurs)

| Flux | Revenu unitaire | Fréquence type | Notes |
|---|---:|---|---|
| Passager local | 18 / trajet | Élevée | Sensible à la ponctualité |
| Passager inter-ville | 42 / trajet | Moyenne | Bonus confort |
| Fret vrac (tonne-km) | 1.8 | Continue | Marge stable |
| Fret industriel (tonne-km) | 2.6 | Moyenne | Sensible aux délais |
| Courrier express (lot) | 120 | Faible | Forte prime de rapidité |

## 3) Usure (dégradation par cycle)

| Actif | Usure par trajet | Seuil maintenance préventive | Impact si dépassé |
|---|---:|---:|---|
| Locomotive Tier 1 | 0.45% | 65% | +20% conso, -10% vitesse |
| Locomotive Tier 2 | 0.30% | 60% | +12% conso, -6% vitesse |
| Wagon passagers | 0.25% | 70% | -8% confort |
| Wagon fret | 0.28% | 70% | -6% capacité utile |
| Segment de rail standard | 0.08% / train | 75% | Limitation vitesse locale |

## 4) Fréquence de pannes (probabilité mensuelle)

| Condition | Locomotive Tier 1 | Locomotive Tier 2 | Infrastructure voie |
|---|---:|---:|---:|
| État excellent (0–30% usure) | 0.6% | 0.3% | 0.2% |
| État correct (31–60% usure) | 1.8% | 0.9% | 0.7% |
| État dégradé (61–80% usure) | 4.2% | 2.4% | 1.9% |
| État critique (81–100% usure) | 9.5% | 5.7% | 4.8% |

## 5) Modificateurs globaux recommandés (prototype)

| Modificateur | Valeur | Effet |
|---|---:|---|
| Bonus réputation élevée | +12% revenus passagers | À partir de 80 réputation |
| Malus réputation faible | -18% revenus passagers | Sous 35 réputation |
| Intérêt dette standard | 6.5% / an | Emprunt principal |
| Inflation maintenance | +1.5% / an | Croissance coût d’entretien |
| Subvention écologique | 150 000 / palier | Débloquée via objectif CO₂ |
