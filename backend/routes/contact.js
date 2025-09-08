const express = require('express');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const router = express.Router();

// Rate limiting pour les emails
const contactLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // Max 3 emails par 15 minutes
    message: {
        error: 'Trop de demandes de contact. Veuillez réessayer dans 15 minutes.'
    }
});

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

// POST /api/contact - Envoyer un email de contact
router.post('/', contactLimit, async (req, res) => {
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

        // Email à envoyer à l'entreprise
        const mailOptions = {
            from: `"${nom}" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            subject: `Nouveau contact: ${sujet || 'Demande de contact'}`,
            replyTo: email,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">
                        Nouveau message de contact
                    </h2>
                    
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
                        <p><strong>Nom:</strong> ${nom}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        ${telephone ? `<p><strong>Téléphone:</strong> ${telephone}</p>` : ''}
                        <p><strong>Sujet:</strong> ${sujet || 'Non spécifié'}</p>
                    </div>
                    
                    <div style="background: white; padding: 20px; border-left: 4px solid #3498db;">
                        <h3 style="color: #2c3e50; margin-top: 0;">Message:</h3>
                        <p style="line-height: 1.6; color: #555;">${message}</p>
                    </div>
                    
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #777;">
                        <p>Email envoyé depuis le site web de SARL Jérémie Arrivé</p>
                        <p>Date: ${new Date().toLocaleString('fr-FR')}</p>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        res.json({
            success: true,
            message: 'Votre message a été envoyé avec succès. Nous vous recontacterons rapidement.'
        });

    } catch (error) {
        console.error('Erreur envoi email:', error);
        res.status(500).json({
            error: 'Erreur lors de l\'envoi du message. Veuillez réessayer plus tard.'
        });
    }
});

// GET /api/contact/test - Tester la configuration email
router.get('/test', async (req, res) => {
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
});

module.exports = router;
