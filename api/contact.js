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
    return nodemailer.createTransporter({
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

            // Email de confirmation automatique au client uniquement
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
                            
                            <div style="background: linear-gradient(135deg, #27ae60, #2ecc71); padding: 20px; border-radius: 8px; margin: 25px 0;">
                                <h3 style="color: white; margin-top: 0; font-size: 18px;">🚀 Prochaines étapes :</h3>
                                <ul style="color: white; margin: 0; padding-left: 20px;">
                                    <li style="margin-bottom: 8px;">Nous étudions votre demande</li>
                                    <li style="margin-bottom: 8px;">Nous vous recontactons sous 24h ouvrées</li>
                                    <li style="margin-bottom: 8px;">Devis gratuit et sans engagement</li>
                                </ul>
                            </div>
                            
                            <div style="border-top: 2px solid #ecf0f1; padding-top: 25px; margin-top: 25px;">
                                <h3 style="color: #2c3e50; margin-top: 0;">📞 Besoin d'une réponse urgente ?</h3>
                                <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
                                    <div style="margin: 10px 0;">
                                        <strong style="color: #e74c3c;">📱 Téléphone :</strong><br>
                                        <span style="color: #2c3e50; font-size: 18px;">05 46 36 82 83</span>
                                    </div>
                                    <div style="margin: 10px 0;">
                                        <strong style="color: #e74c3c;">✉️ Email :</strong><br>
                                        <span style="color: #2c3e50;">etsrousez@gmail.com</span>
                                    </div>
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

            // Envoyer l'email de confirmation au client
            await transporter.sendMail(clientMailOptions);

            res.json({
                success: true,
                message: 'Votre message a été envoyé avec succès. Un email de confirmation vous a été envoyé.'
            });

        } catch (error) {
            console.error('Erreur envoi email:', error);
            res.status(500).json({
                error: 'Erreur lors de l\'envoi du message. Veuillez réessayer plus tard.'
            });
        }
    } else if (req.method === 'GET') {
        // Test de configuration email
        try {
            const transporter = createTransporter();
            await transporter.verify();
            res.json({ 
                success: true, 
                message: 'Configuration email fonctionnelle' 
            });
        } catch (error) {
            res.status(500).json({ 
                error: 'Erreur de configuration email',
                details: error.message 
            });
        }
    } else {
        res.setHeader('Allow', ['POST', 'GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
