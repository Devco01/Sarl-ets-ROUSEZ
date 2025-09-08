# Site Vitrine - Ets ROUSEZ / SARL Jérémie Arrivé

## Description
Site vitrine moderne pour l'entreprise Ets ROUSEZ - SARL Jérémie Arrivé, spécialisée dans :
- Chauffage
- Climatisation  
- Plomberie
- Sanitaire

## Fonctionnalités
- ✨ Design moderne et responsive
- 🎭 Sliders dynamiques sur la page d'accueil
- 📱 Navigation mobile optimisée
- 🎨 Animations au scroll
- 📬 Formulaire de contact
- 🖼️ Galerie de réalisations
- 🚀 Performance optimisée

## Structure du projet
```
├── index.html              # Page principale
├── assets/
│   ├── css/
│   │   ├── style.css       # Styles principaux
│   │   └── animations.css  # Animations avancées
│   ├── js/
│   │   └── main.js         # JavaScript principal
│   └── images/
│       ├── logo.png        # Logo de l'entreprise
│       ├── hero-bg-*.jpg   # Images de fond du slider
│       ├── about-image.jpg # Image section à propos
│       └── gallery-*.jpg   # Images de la galerie
└── README.md
```

## Technologies utilisées
- HTML5 sémantique
- CSS3 avec Flexbox et Grid
- JavaScript vanilla (ES6+)
- Font Awesome pour les icônes
- Google Fonts (Inter)

## Installation et démarrage
1. Cloner le repository
```bash
git clone https://github.com/Devco01/Sarl-ets-ROUSEZ.git
cd Sarl-ets-ROUSEZ
```

2. Ouvrir index.html dans un navigateur ou utiliser un serveur local
```bash
# Avec Python
python -m http.server 8000

# Avec Node.js (http-server)
npx http-server

# Avec Live Server (VSCode extension)
```

3. Le site sera accessible sur http://localhost:8000

## Images à ajouter
Pour finaliser le site, ajoutez les images suivantes dans le dossier `assets/images/` :

### Obligatoires :
- `logo.png` - Logo de l'entreprise (déjà fourni)

### Recommandées :
- `hero-bg-1.jpg` - Image de fond slider 1 (chauffage/climatisation)
- `hero-bg-2.jpg` - Image de fond slider 2 (plomberie/sanitaire)  
- `hero-bg-3.jpg` - Image de fond slider 3 (équipe/expertise)
- `about-image.jpg` - Image section à propos
- `gallery-1.jpg` - Réalisation chauffage
- `gallery-2.jpg` - Réalisation climatisation
- `gallery-3.jpg` - Réalisation sanitaire
- `gallery-4.jpg` - Réalisation plomberie

## Personnalisation
### Couleurs
Les couleurs principales sont définies dans `style.css` :
- Rouge : #e74c3c (couleur brand)
- Bleu : #3498db (couleur secondaire)
- Texte : #2c3e50

### Contenu
- Modifier les textes dans `index.html`
- Mettre à jour les informations de contact
- Ajouter/modifier les services dans la section correspondante

## Fonctionnalités avancées
- **Slider automatique** : Change toutes les 5 secondes
- **Navigation tactile** : Support swipe sur mobile
- **Animations au scroll** : Intersection Observer API
- **Formulaire de contact** : Validation et feedback utilisateur
- **Lightbox** : Galerie d'images en popup
- **Performance** : Images préchargées, animations optimisées

## SEO et Accessibilité
- Meta tags optimisés
- Structure HTML sémantique
- Alt text sur toutes les images
- Navigation clavier
- Contraste respecté (WCAG)

## Responsive Design
- Mobile First approach
- Breakpoints : 480px, 768px, 1200px
- Menu hamburger sur mobile
- Images adaptatives

## Prochaines étapes (Backend)
1. Serveur Node.js/Express
2. Base de données (MongoDB/PostgreSQL)
3. API REST pour le formulaire de contact
4. Panel d'administration
5. CMS pour gérer le contenu

## Contact
Pour toute question concernant ce projet, contactez l'équipe de développement.
