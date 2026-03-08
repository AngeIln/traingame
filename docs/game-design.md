# Game Design — Simulation ferroviaire

## Boucle cœur du gameplay

1. **Construire des rails** pour relier villes, zones industrielles et hubs logistiques.
2. **Acheter des trains** adaptés au type de trafic (passagers, fret, mixte).
3. **Ouvrir des lignes** avec horaires, arrêts et priorités.
4. **Transporter passagers/fret** pour générer des revenus réguliers.
5. **Réinvestir les profits** dans le réseau, le matériel et les services.
6. **Étendre l’empire ferroviaire** vers de nouvelles régions plus rentables et complexes.

---

## Objectifs de jeu

### 1) Campagne (missions)
- Scénarios narratifs avec contraintes de départ (budget, carte, politique locale).
- Objectifs à paliers (ex: desservir 3 villes en 5 ans, atteindre 80% de satisfaction passagers).
- Récompenses de mission : bonus de cash, réputation, accès technologique anticipé.

### 2) Mode bac à sable
- Carte libre avec options de personnalisation (taille map, densité urbaine, demande de fret).
- Conditions de victoire facultatives (ou désactivables).
- Outil principal pour l’optimisation réseau et l’expérimentation de stratégies.

### 3) Défis hebdomadaires
- Seed commune à tous les joueurs.
- Contraintes spéciales (prix du carburant x2, météo sévère, dettes élevées).
- Classement basé sur score composite (profit, ponctualité, réputation, croissance).

---

## Ressources et systèmes économiques

- **Cash** : liquidité immédiate pour construction, achats, salaires, carburant.
- **Réputation** : influe sur fréquentation, subventions publiques et tolérance aux incidents.
- **Dette** : permet d’accélérer l’expansion mais augmente le risque via intérêts et échéances.
- **Maintenance** : coût récurrent indispensable pour limiter usure, pannes et accidents.

---

## Recherche & Développement (R&D)

### Axes de recherche
1. **Locomotives**
   - Meilleure vitesse, traction, consommation et fiabilité.
2. **Signalisation**
   - Densité de trafic améliorée, moins de conflits de voies, sécurité accrue.
3. **Automatisation**
   - Optimisation des horaires, dispatch intelligent, réduction des coûts opérationnels.

### Impact design
- La R&D débloque des paliers technologiques qui modifient la rentabilité long terme.
- Les technologies avancées coûtent cher mais réduisent l’usure et la fréquence des pannes.

---

## Phases de difficulté

### Early game (0–5 ans)
- Capital limité, couverture partielle du territoire.
- Priorité : lignes courtes rentables, équilibre trésorerie/dette.
- Risque principal : surinvestissement précoce.

### Mid game (5–15 ans)
- Multiplication des lignes et des flux inter-villes.
- Priorité : fiabiliser le réseau (maintenance + signalisation).
- Risque principal : congestion, retards, baisse de réputation.

### Late game (15+ ans)
- Réseau massif, optimisation fine des correspondances.
- Priorité : automatisation, spécialisation des lignes, résilience aux crises.
- Risque principal : dette structurelle, incidents majeurs coûteux.

---

## Conditions de victoire / défaite

### Victoire
- **Objectifs de campagne atteints** (scénario complété).
- **Objectifs de ville/région** atteints (croissance population desservie, couverture minimale, émissions réduites).
- En bac à sable : victoire optionnelle via seuils configurables (valeur réseau, bénéfice annuel, réputation).

### Défaite
- **Faillite** : cash négatif durable + incapacité de rembourser les échéances.
- **Réputation critique** maintenue trop longtemps (perte de confiance publique/autorités).
- **Non-respect d’objectifs obligatoires** d’un scénario dans le temps imparti.
