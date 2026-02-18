# App Screens

Editeur visuel pour creer des screenshots Google Play Store (1080x1920).

## Fonctionnalites

- **Mockup telephone** Samsung S25 en CSS pur
- **Drag & drop** libre des elements avec compensation du scale
- **Texte personnalisable** : 20 Google Fonts, taille, poids, italique, couleur, fond, padding, border-radius, alignement
- **Images** : import, opacite, ajustement (contain/cover/fill)
- **Fond** : couleur unie ou degrade avec angle reglable
- **3 layouts predefinies** : texte+telephone, telephone plein+overlay, telephone decale+texte lateral
- **Resize** avec verrouillage du ratio pour les telephones
- **Z-index** : premier plan / arriere plan
- **Export PNG** en 1080x1920 via html2canvas-pro

## Stack

- Angular 19 (standalone components, signals)
- html2canvas-pro (export PNG)
- Google Fonts

## Lancer le projet

```bash
npm install
ng serve
```

Ouvrir http://localhost:4200

## Build

```bash
ng build
```

Les fichiers de production sont generes dans `dist/`.

## Structure

```
src/app/
  models/          # Interfaces (CanvasElement, TextElement, etc.)
  services/        # State management (signals) + export PNG
  layouts/         # Templates de layout predefinies
  editor/          # Layout principal (toolbar + canvas + properties)
  canvas/          # Zone de rendu 1080x1920 avec drag & drop
  toolbar/         # Ajout d'elements, fond, layouts, export
  properties-panel/# Edition des proprietes de l'element selectionne
  phone-mockup/    # Composant mockup telephone Samsung S25
```
