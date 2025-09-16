// Vercel API Route pour le contact
const nodemailer = require('nodemailer');

// Simple rate limiting en mémoire (pour Vercel Functions)
const rateLimit = new Map();

function checkRateLimit(ip) {
    const now = Date.now();
    const windowMs = 15 * 60 * 1000; // 15 minutes
    const maxRequests = 3;
    
    const key = ip;
    const requests = rateLimit.get(key) || [];
    
    // Nettoyer les anciennes entrées
    const validRequests = requests.filter(time => now - time < windowMs);
    
    if (validRequests.length >= maxRequests) {
        return false;
    }
    
    validRequests.push(now);
    rateLimit.set(key, validRequests);
    return true;
}

// Configuration du transporteur email
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: process.env.EMAIL_PORT || 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Rate limiting
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (!checkRateLimit(clientIp)) {
        return res.status(429).json({
            error: 'Trop de demandes de contact. Veuillez réessayer dans 15 minutes.'
        });
    }

    if (req.method === 'POST') {
        try {
            const { nom, email, telephone, sujet, message } = req.body;

            // Validation des champs requis
            if (!nom || !email || !message) {
                return res.status(400).json({
                    error: 'Les champs nom, email et message sont obligatoires'
                });
            }

            // Validation de l'email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    error: 'Format d\'email invalide'
                });
            }

            const transporter = createTransporter();

            // 1. Email à l'entreprise (CLIENT REÇOIT LE MESSAGE)
            const businessMailOptions = {
                from: `"${nom}" <${process.env.EMAIL_USER}>`,
                to: 'etsrousez@gmail.com', // EMAIL DU CLIENT
                replyTo: email,
                subject: `🔔 Nouveau contact: ${sujet || 'Demande de contact'}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <div style="background: linear-gradient(135deg, #e74c3c, #3498db); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
                            <h1 style="color: white; margin: 0; font-size: 24px;">🔔 NOUVEAU MESSAGE DE CONTACT</h1>
                            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Site web - SARL Jérémie Arrivé</p>
                        </div>
                        
                        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #e74c3c;">
                                <h3 style="color: #2c3e50; margin-top: 0;">👤 Informations du client :</h3>
                                <p style="margin: 10px 0; color: #555;"><strong>Nom :</strong> ${nom}</p>
                                <p style="margin: 10px 0; color: #555;"><strong>Email :</strong> <a href="mailto:${email}" style="color: #3498db;">${email}</a></p>
                                ${telephone ? `<p style="margin: 10px 0; color: #555;"><strong>Téléphone :</strong> <a href="tel:${telephone}" style="color: #3498db;">${telephone}</a></p>` : ''}
                                <p style="margin: 10px 0; color: #555;"><strong>Service demandé :</strong> ${sujet || 'Non spécifié'}</p>
                            </div>
                            
                            <div style="background: #fff5f5; padding: 20px; border-radius: 8px; border-left: 4px solid #e74c3c;">
                                <h3 style="color: #2c3e50; margin-top: 0;">💬 Message :</h3>
                                <p style="line-height: 1.6; color: #555; font-size: 16px;">${message}</p>
                            </div>
                            
                            <div style="background: linear-gradient(135deg, #27ae60, #2ecc71); padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center;">
                                <h3 style="color: white; margin-top: 0;">🚀 Actions rapides :</h3>
                                <div style="margin: 15px 0;">
                                    <a href="mailto:${email}?subject=Re: ${sujet || 'Votre demande'}" style="background: rgba(255,255,255,0.2); color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 5px; display: inline-block;">✉️ Répondre par email</a>
                                    ${telephone ? `<a href="tel:${telephone}" style="background: rgba(255,255,255,0.2); color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 5px; display: inline-block;">📞 Appeler</a>` : ''}
                                </div>
                            </div>
                            
                            <div style="text-align: center; margin-top: 30px; padding: 15px; background: #fafafa; border-radius: 8px; font-size: 14px; color: #777;">
                                <p style="margin: 0;">📅 Reçu le ${new Date().toLocaleString('fr-FR')}</p>
                            </div>
                        </div>
                    </div>
                `
            };

            // 2. Email de confirmation automatique au client
            const clientMailOptions = {
                from: `"SARL Jérémie Arrivé - Ets ROUSEZ" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: `Confirmation de réception - ${sujet || 'Votre demande de contact'}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <div style="background: linear-gradient(135deg, #e74c3c, #3498db); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                            <h1 style="color: white; margin: 0; font-size: 24px;">SARL Jérémie Arrivé</h1>
                            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Ets ROUSEZ - Chauffage, Climatisation, Plomberie, Sanitaire</p>
                        </div>
                        
                        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                            <h2 style="color: #2c3e50; margin-top: 0;">Bonjour ${nom},</h2>
                            
                            <p style="color: #555; line-height: 1.6; font-size: 16px;">
                                Nous avons bien reçu votre demande de contact concernant : <strong>${sujet || 'votre demande'}</strong>
                            </p>
                            
                            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #3498db;">
                                <h3 style="color: #2c3e50; margin-top: 0; font-size: 18px;">📋 Récapitulatif de votre demande :</h3>
                                <p style="margin: 10px 0; color: #555;"><strong>Message :</strong><br>${message}</p>
                                ${telephone ? `<p style="margin: 10px 0; color: #555;"><strong>Téléphone :</strong> ${telephone}</p>` : ''}
                            </div>
                            
                            <div style="border-top: 2px solid #ecf0f1; padding-top: 25px; margin-top: 25px;">
                                <h3 style="color: #2c3e50; margin-top: 0; margin-bottom: 20px; text-align: center;">📞 Besoin d'une réponse urgente ?</h3>
                                
                                <table style="width: 100%; margin: 0 auto; border-collapse: collapse;">
                                    <tr>
                                        <td style="width: 50%; padding: 15px; text-align: center; vertical-align: top;">
                                            <div style="background: #fff5f5; padding: 20px; border-radius: 8px; border: 2px solid #e74c3c;">
                                                <div style="color: #e74c3c; font-size: 24px; margin-bottom: 10px;">📱</div>
                                                <strong style="color: #2c3e50; display: block; margin-bottom: 8px;">Téléphone</strong>
                                                <a href="tel:0546368283" style="color: #e74c3c; font-size: 18px; font-weight: bold; text-decoration: none;">05 46 36 82 83</a>
                                            </div>
                                        </td>
                                        <td style="width: 50%; padding: 15px; text-align: center; vertical-align: top;">
                                            <div style="background: #f0f8ff; padding: 20px; border-radius: 8px; border: 2px solid #3498db;">
                                                <div style="color: #3498db; font-size: 24px; margin-bottom: 10px;">✉️</div>
                                                <strong style="color: #2c3e50; display: block; margin-bottom: 8px;">Email</strong>
                                                <a href="mailto:etsrousez@gmail.com" style="color: #3498db; font-size: 16px; font-weight: bold; text-decoration: none;">etsrousez@gmail.com</a>
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                                
                                <div style="text-align: center; margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                                    <p style="margin: 0; color: #555; font-size: 14px;">
                                        <strong>Nous vous recontacterons sous 24h ouvrées</strong><br>
                                        Devis gratuit et sans engagement
                                    </p>
                                </div>
                            </div>
                            
                            <div style="text-align: center; margin-top: 30px; padding: 20px; background: #fafafa; border-radius: 8px;">
                                <p style="margin: 0; color: #7f8c8d; font-size: 14px;">
                                    <strong>SARL Jérémie Arrivé - Ets ROUSEZ</strong><br>
                                    4 Zac des Bregaudieres, 17390 La Tremblade<br>
                                    Plus de 13 ans d'expérience à votre service
                                </p>
                            </div>
                        </div>
                    </div>
                `
            };

            // Envoyer les deux emails en parallèle
            await Promise.all([
                transporter.sendMail(businessMailOptions), // Email pour le client
                transporter.sendMail(clientMailOptions)     // Email de confirmation au visiteur
            ]);

            res.json({
                success: true,
                message: 'Votre message a été envoyé avec succès. Un email de confirmation vous a été envoyé.'
            });

        } catch (error) {
            console.error('Erreur envoi email détaillée:', {
                message: error.message,
                code: error.code,
                command: error.command,
                response: error.response,
                stack: error.stack
            });
            
            // Logs de debug pour les variables d'environnement
            console.log('Variables d\'environnement disponibles:', {
                EMAIL_HOST: process.env.EMAIL_HOST ? 'Défini' : 'MANQUANT',
                EMAIL_PORT: process.env.EMAIL_PORT ? 'Défini' : 'MANQUANT', 
                EMAIL_USER: process.env.EMAIL_USER ? 'Défini' : 'MANQUANT',
                EMAIL_PASS: process.env.EMAIL_PASS ? 'Défini' : 'MANQUANT'
            });
            
            res.status(500).json({
                error: 'Erreur lors de l\'envoi du message. Veuillez réessayer plus tard.',
                details: error.message,
                debugInfo: {
                    errorCode: error.code,
                    hasEmailConfig: !!(process.env.EMAIL_USER && process.env.EMAIL_PASS)
                }
            });
        }
    } else if (req.method === 'GET') {
        // Test de configuration email
        try {
            console.log('Test de configuration email...');
            console.log('Variables d\'environnement:', {
                EMAIL_HOST: process.env.EMAIL_HOST,
                EMAIL_PORT: process.env.EMAIL_PORT,
                EMAIL_USER: process.env.EMAIL_USER ? 'Défini' : 'MANQUANT',
                EMAIL_PASS: process.env.EMAIL_PASS ? 'Défini' : 'MANQUANT'
            });
            
            const transporter = createTransporter();
            await transporter.verify();
            res.json({ 
                success: true, 
                message: 'Configuration email fonctionnelle',
                config: {
                    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
                    port: process.env.EMAIL_PORT || 587,
                    hasAuth: !!(process.env.EMAIL_USER && process.env.EMAIL_PASS)
                }
            });
        } catch (error) {
            console.error('Erreur test configuration email:', error);
            res.status(500).json({ 
                error: 'Erreur de configuration email',
                details: error.message,
                code: error.code
            });
        }
    } else {
        res.setHeader('Allow', ['POST', 'GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}