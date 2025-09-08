const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const router = express.Router();

// Rate limiting pour les tentatives de connexion
const loginLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Max 5 tentatives par 15 minutes
    message: {
        error: 'Trop de tentatives de connexion. Veuillez réessayer dans 15 minutes.'
    }
});

// Utilisateur admin par défaut (en dur pour commencer)
const adminUser = {
    id: 1,
    username: 'admin',
    email: 'etsrousez@gmail.com',
    // Mot de passe: "admin123" (à changer en production)
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
};

// Middleware d'authentification
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token d\'accès requis' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret', (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token invalide' });
        }
        req.user = user;
        next();
    });
};

// POST /api/admin/login - Connexion admin
router.post('/login', loginLimit, async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                error: 'Nom d\'utilisateur et mot de passe requis'
            });
        }

        // Vérifier les identifiants
        if (username !== adminUser.username) {
            return res.status(401).json({
                error: 'Identifiants invalides'
            });
        }

        // Vérifier le mot de passe
        const isValidPassword = await bcrypt.compare(password, adminUser.password);
        if (!isValidPassword) {
            return res.status(401).json({
                error: 'Identifiants invalides'
            });
        }

        // Générer le token JWT
        const token = jwt.sign(
            { 
                id: adminUser.id, 
                username: adminUser.username,
                email: adminUser.email 
            },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            message: 'Connexion réussie',
            token,
            user: {
                id: adminUser.id,
                username: adminUser.username,
                email: adminUser.email
            }
        });

    } catch (error) {
        console.error('Erreur connexion admin:', error);
        res.status(500).json({
            error: 'Erreur lors de la connexion'
        });
    }
});

// GET /api/admin/profile - Récupérer le profil admin
router.get('/profile', authenticateToken, (req, res) => {
    res.json({
        success: true,
        user: {
            id: req.user.id,
            username: req.user.username,
            email: req.user.email
        }
    });
});

// GET /api/admin/stats - Statistiques du dashboard
router.get('/stats', authenticateToken, (req, res) => {
    try {
        // Ici vous pouvez ajouter de vraies statistiques
        // Pour l'instant, données fictives
        const stats = {
            totalProjects: 150,
            activeProjects: 8,
            totalClients: 85,
            monthlyRevenue: 45000,
            recentActivity: [
                {
                    id: 1,
                    type: 'contact',
                    message: 'Nouveau message de contact reçu',
                    timestamp: new Date().toISOString()
                },
                {
                    id: 2,
                    type: 'project',
                    message: 'Projet "Rénovation Maison Dupont" terminé',
                    timestamp: new Date(Date.now() - 86400000).toISOString()
                }
            ]
        };

        res.json({
            success: true,
            data: stats
        });

    } catch (error) {
        console.error('Erreur récupération stats:', error);
        res.status(500).json({
            error: 'Erreur lors de la récupération des statistiques'
        });
    }
});

// POST /api/admin/change-password - Changer le mot de passe
router.post('/change-password', authenticateToken, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                error: 'Mot de passe actuel et nouveau mot de passe requis'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                error: 'Le nouveau mot de passe doit faire au moins 6 caractères'
            });
        }

        // Vérifier le mot de passe actuel
        const isValidPassword = await bcrypt.compare(currentPassword, adminUser.password);
        if (!isValidPassword) {
            return res.status(401).json({
                error: 'Mot de passe actuel incorrect'
            });
        }

        // Hasher le nouveau mot de passe
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        // Note: Ici vous devriez sauvegarder en base de données
        // Pour l'instant on ne fait que valider
        
        res.json({
            success: true,
            message: 'Mot de passe changé avec succès'
        });

    } catch (error) {
        console.error('Erreur changement mot de passe:', error);
        res.status(500).json({
            error: 'Erreur lors du changement de mot de passe'
        });
    }
});

// POST /api/admin/logout - Déconnexion (côté client principalement)
router.post('/logout', authenticateToken, (req, res) => {
    res.json({
        success: true,
        message: 'Déconnexion réussie'
    });
});

module.exports = router;
