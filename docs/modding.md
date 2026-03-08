# Guide modding

Ce document décrit les points d'extension pour faire évoluer le jeu sans casser les systèmes existants.

## 1) Ajouter un nouveau type de sauvegarde
Fichier: `src/systems/saveSystem.ts`
- Étendre `SaveType`.
- Mettre à jour `pruneByPolicy` si la politique de slots diffère.
- Ajouter les libellés i18n associés.

## 2) Étendre le tutoriel
Fichier: `src/systems/tutorial.ts`
- Ajouter une entrée à `firstProfitableLineTutorial`.
- Définir une `completionCondition` branchée côté gameplay.
- Ajouter les clés de traduction dans FR/EN.

## 3) Ajouter une aide contextuelle
Fichier: `src/systems/helpSystem.ts`
- Créer un tooltip dans `contextualTooltips`.
- Ajouter, si besoin, une entrée dans `glossaryEntries`.
- Fournir les traductions correspondantes.

## 4) Étendre l'accessibilité
Fichier: `src/systems/accessibility.ts`
- Ajouter une option dans `AccessibilityOptions`.
- Étendre `accessibilityClassMap` pour garder une correspondance UI claire.
- Prévoir le style CSS/Theme côté client.

## 5) Localisation
Fichiers: `src/i18n/fr.json`, `src/i18n/en.json`
- Toute nouvelle clé doit exister dans les deux langues.
- Conserver une nomenclature stable (`feature.section.item`).
- Prévoir une étape CI qui vérifie la parité des clés.

## 6) Recommandations techniques
- Préférer des structures de données déclaratives (tableaux d'objets) pour limiter le couplage.
- Éviter les IDs implicites: préférer des IDs explicites et stables.
- Versionner les sauvegardes avec `gameVersion` pour les migrations futures.
