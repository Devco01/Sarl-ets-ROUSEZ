// Vercel API Route pour l'administration
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Simple rate limiting en mémoire
const loginAttempts = new Map();

function checkLoginRateLimit(ip) {
    const now = Date.now();
    const windowMs = 15 * 60 * 1000; // 15 minutes
    const maxAttempts = 5;
    
    const attempts = loginAttempts.get(ip) || [];
    const validAttempts = attempts.filter(time => now - time < windowMs);
    
    if (validAttempts.length >= maxAttempts) {
        return false;
    }
    
    validAttempts.push(now);
    loginAttempts.set(ip, validAttempts);
    return true;
}

// Utilisateur admin par défaut (en dur pour commencer)
const adminUser = {
    id: 1,
    username: process.env.ADMIN_USERNAME || 'admin',
    email: process.env.ADMIN_EMAIL || 'etsrousez@gmail.com',
    // Mot de passe: "admin123" (à changer en production via les variables d'environnement)
    password: process.env.ADMIN_PASSWORD_HASH || '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
};

// Middleware d'authentification
function authenticateToken(token) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        return decoded;
    } catch (error) {
        return null;
    }
}

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { query: urlQuery } = req;
    const pathSegments = urlQuery.admin || [];
    const action = pathSegments[0];

    try {
        if (req.method === 'POST' && action === 'login') {
            // Rate limiting pour les tentatives de connexion
            const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            if (!checkLoginRateLimit(clientIp)) {
                return res.status(429).json({
                    error: 'Trop de tentatives de connexion. Veuillez réessayer dans 15 minutes.'
                });
            }

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

            return res.json({
                success: true,
                message: 'Connexion réussie',
                token,
                user: {
                    id: adminUser.id,
                    username: adminUser.username,
                    email: adminUser.email
                }
            });

        } else if (req.method === 'GET' && action === 'profile') {
            // Authentification requise
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];

            if (!token) {
                return res.status(401).json({ error: 'Token d\'accès requis' });
            }

            const user = authenticateToken(token);
            if (!user) {
                return res.status(403).json({ error: 'Token invalide' });
            }

            return res.json({
                success: true,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email
                }
            });

        } else if (req.method === 'GET' && action === 'stats') {
            // Authentification requise
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];

            if (!token) {
                return res.status(401).json({ error: 'Token d\'accès requis' });
            }

            const user = authenticateToken(token);
            if (!user) {
                return res.status(403).json({ error: 'Token invalide' });
            }

            // Statistiques du dashboard
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

            return res.json({
                success: true,
                data: stats
            });

        } else if (req.method === 'POST' && action === 'change-password') {
            // Authentification requise
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];

            if (!token) {
                return res.status(401).json({ error: 'Token d\'accès requis' });
            }

            const user = authenticateToken(token);
            if (!user) {
                return res.status(403).json({ error: 'Token invalide' });
            }

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
            
            // Note: Pour Vercel Functions, vous devriez utiliser une base de données
            // Pour l'instant on ne fait que valider
            console.log('Nouveau hash à utiliser:', hashedPassword);
            
            return res.json({
                success: true,
                message: 'Mot de passe changé avec succès. Utilisez le hash généré dans les variables d\'environnement.'
            });

        } else if (req.method === 'POST' && action === 'logout') {
            // Authentification requise
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];

            if (!token) {
                return res.status(401).json({ error: 'Token d\'accès requis' });
            }

            const user = authenticateToken(token);
            if (!user) {
                return res.status(403).json({ error: 'Token invalide' });
            }

            return res.json({
                success: true,
                message: 'Déconnexion réussie'
            });

        } else {
            res.setHeader('Allow', ['POST', 'GET']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
        }

    } catch (error) {
        console.error('Erreur API Admin:', error);
        res.status(500).json({
            error: 'Erreur interne du serveur'
        });
    }
}
