# 🏗️ SARL Jérémie Arrivé - Site Vitrine Moderne

Site vitrine moderne avec architecture Frontend/Backend séparée pour l'entreprise **SARL Jérémie Arrivé / Ets ROUSEZ** spécialisée dans la plomberie, le chauffage et la climatisation à La Tremblade.

## 📁 Architecture du Projet

```
SARL-Jeremie-arrive/
├── 📱 frontend/          # Application React TypeScript
│   ├── public/           # Fichiers statiques
│   ├── src/
│   │   ├── components/   # Composants réutilisables
│   │   ├── pages/        # Pages de l'application
│   │   ├── services/     # Appels API
│   │   ├── assets/       # Images, styles
│   │   └── types/        # Types TypeScript
│   └── package.json
│
├── 🚀 backend/           # API Node.js Express
│   ├── routes/           # Routes API
│   │   ├── contact.js    # Gestion formulaires contact
│   │   ├── gallery.js    # Gestion galerie photos
│   │   └── admin.js      # Authentification admin
│   ├── uploads/          # Images uploadées
│   ├── server.js         # Serveur principal
│   └── package.json
│
├── 📂 old-static-site/   # Ancien site HTML/CSS/JS (sauvegarde)
├── 🔧 shared/            # Code partagé (utilitaires, types)
└── 📋 package.json       # Scripts globaux
```

## 🚀 Technologies Utilisées

### Frontend
- **React 18** avec **TypeScript**
- **CSS Modules / Styled Components**
- **Axios** pour les appels API
- **React Router** pour la navigation
- **React Hook Form** pour les formulaires

### Backend
- **Node.js** + **Express.js**
- **Nodemailer** pour l'envoi d'emails
- **Multer** pour l'upload de fichiers
- **JWT** pour l'authentification
- **bcryptjs** pour le hachage des mots de passe
- **Rate limiting** pour la sécurité

## 🏃‍♂️ Démarrage Rapide

### 1. Installation des dépendances
```bash
# Installer toutes les dépendances (frontend + backend)
npm run install
```

### 2. Configuration
```bash
# Copier et configurer les variables d'environnement
cd backend
copy .env.example .env
# Éditer .env avec vos vraies valeurs
```

### 3. Développement
```bash
# Lancer frontend + backend simultanément
npm run dev

# Ou séparément :
npm run dev:frontend  # React sur http://localhost:3000
npm run dev:backend   # API sur http://localhost:5000
```

### 4. Production
```bash
# Build du frontend
npm run build

# Démarrer le backend en production
npm run start:backend
```

## 📡 API Endpoints

### 🔧 Contact
- `POST /api/contact` - Envoyer un message de contact
- `GET /api/contact/test` - Tester la config email

### 🖼️ Galerie
- `GET /api/gallery` - Récupérer les images
- `GET /api/gallery/:id` - Image spécifique
- `POST /api/gallery` - Ajouter une image (upload)
- `DELETE /api/gallery/:id` - Supprimer une image
- `GET /api/gallery/meta/categories` - Catégories disponibles

### 👤 Administration
- `POST /api/admin/login` - Connexion admin
- `GET /api/admin/profile` - Profil utilisateur
- `GET /api/admin/stats` - Statistiques dashboard
- `POST /api/admin/change-password` - Changer mot de passe

## 🔐 Authentification Admin

**Identifiants par défaut :**
- Username: `admin`
- Password: `admin123`

⚠️ **Important :** Changez ces identifiants en production !

## 📧 Configuration Email

Configurez dans `backend/.env` :
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=etsrousez@gmail.com
EMAIL_PASS=your_app_password_here
```

## 🌐 Fonctionnalités

### ✅ Déjà Implémentées
- 📱 Site responsive (mobile-first)
- 📧 Formulaire de contact avec envoi email
- 🖼️ Galerie photos dynamique
- 🔐 Interface d'administration
- 📤 Upload d'images
- ⚡ Rate limiting pour la sécurité
- 🚀 Architecture moderne et scalable

### 🔄 À Venir
- 💾 Base de données (SQLite/PostgreSQL)
- 📊 Dashboard admin complet
- 🎨 CMS pour le contenu
- 📈 Analytics et statistiques
- 🔄 Système de cache
- 📱 App mobile (React Native)

## 👨‍💻 Développement

### Structure des Composants React
```
src/
├── components/
│   ├── Header/
│   ├── Hero/
│   ├── Services/
│   ├── Gallery/
│   ├── Contact/
│   └── Footer/
├── pages/
│   ├── Home.tsx
│   ├── About.tsx
│   └── Admin/
└── services/
    └── api.ts
```

### Commandes Utiles
```bash
# Tests
npm test

# Linting
npm run lint

# Format code
npm run format

# Analyze bundle
npm run analyze
```

## 📞 Contact

**SARL Jérémie Arrivé / Ets ROUSEZ**
- 📍 4 Zac des bregaudieres, 17390 La Tremblade
- 📞 05 46 36 82 83
- ✉️ etsrousez@gmail.com
- 🌐 SIRET: 75387618400015
- 🏢 NAF: 4322A

---

*Développé avec ❤️ pour une entreprise locale de qualité*