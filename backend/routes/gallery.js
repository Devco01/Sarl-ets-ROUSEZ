const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const router = express.Router();

// Configuration de stockage pour multer
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../uploads/gallery');
        try {
            await fs.mkdir(uploadPath, { recursive: true });
            cb(null, uploadPath);
        } catch (error) {
            cb(error);
        }
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'gallery-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Filtres pour les fichiers
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Type de fichier non autorisé. Seules les images sont acceptées.'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB par défaut
    }
});

// Données de la galerie (en dur pour commencer, peut être une BDD plus tard)
let galleryData = [
    {
        id: 1,
        title: "Installation chauffage moderne",
        description: "Installation complète d'un système de chauffage moderne avec radiateurs design",
        image: "/uploads/gallery/img5.jpg",
        category: "chauffage",
        createdAt: new Date().toISOString()
    },
    {
        id: 2,
        title: "Rénovation salle de bain",
        description: "Rénovation complète d'une salle de bain avec installation sanitaire moderne",
        image: "/uploads/gallery/img6.jpg",
        category: "plomberie",
        createdAt: new Date().toISOString()
    },
    {
        id: 3,
        title: "Installation climatisation",
        description: "Installation d'un système de climatisation efficace pour une maison individuelle",
        image: "/uploads/gallery/img7.jpg",
        category: "climatisation",
        createdAt: new Date().toISOString()
    }
    // Les autres images seront ajoutées via l'API d'upload
];

// GET /api/gallery - Récupérer toutes les images de la galerie
router.get('/', (req, res) => {
    try {
        const { category, limit } = req.query;
        
        let filteredGallery = galleryData;
        
        // Filtrer par catégorie si spécifiée
        if (category && category !== 'all') {
            filteredGallery = galleryData.filter(item => 
                item.category.toLowerCase() === category.toLowerCase()
            );
        }
        
        // Limiter le nombre de résultats si spécifié
        if (limit) {
            filteredGallery = filteredGallery.slice(0, parseInt(limit));
        }
        
        // Trier par date de création (plus récent en premier)
        filteredGallery.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        res.json({
            success: true,
            count: filteredGallery.length,
            total: galleryData.length,
            data: filteredGallery
        });
        
    } catch (error) {
        console.error('Erreur récupération galerie:', error);
        res.status(500).json({
            error: 'Erreur lors de la récupération de la galerie'
        });
    }
});

// GET /api/gallery/:id - Récupérer une image spécifique
router.get('/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const item = galleryData.find(item => item.id === id);
        
        if (!item) {
            return res.status(404).json({
                error: 'Image non trouvée'
            });
        }
        
        res.json({
            success: true,
            data: item
        });
        
    } catch (error) {
        console.error('Erreur récupération image:', error);
        res.status(500).json({
            error: 'Erreur lors de la récupération de l\'image'
        });
    }
});

// POST /api/gallery - Ajouter une nouvelle image (avec upload)
router.post('/', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                error: 'Aucun fichier image fourni'
            });
        }

        const { title, description, category } = req.body;

        if (!title || !category) {
            return res.status(400).json({
                error: 'Le titre et la catégorie sont obligatoires'
            });
        }

        // Créer un nouvel item pour la galerie
        const newItem = {
            id: Math.max(...galleryData.map(item => item.id), 0) + 1,
            title,
            description: description || '',
            category: category.toLowerCase(),
            image: `/uploads/gallery/${req.file.filename}`,
            createdAt: new Date().toISOString()
        };

        galleryData.push(newItem);

        res.status(201).json({
            success: true,
            message: 'Image ajoutée avec succès',
            data: newItem
        });

    } catch (error) {
        console.error('Erreur upload image:', error);
        res.status(500).json({
            error: 'Erreur lors de l\'upload de l\'image'
        });
    }
});

// DELETE /api/gallery/:id - Supprimer une image
router.delete('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const itemIndex = galleryData.findIndex(item => item.id === id);
        
        if (itemIndex === -1) {
            return res.status(404).json({
                error: 'Image non trouvée'
            });
        }
        
        const item = galleryData[itemIndex];
        
        // Supprimer le fichier physique
        if (item.image && item.image.startsWith('/uploads/')) {
            const filePath = path.join(__dirname, '..', item.image);
            try {
                await fs.unlink(filePath);
            } catch (fileError) {
                console.warn('Impossible de supprimer le fichier:', fileError.message);
            }
        }
        
        // Supprimer de la liste
        galleryData.splice(itemIndex, 1);
        
        res.json({
            success: true,
            message: 'Image supprimée avec succès'
        });
        
    } catch (error) {
        console.error('Erreur suppression image:', error);
        res.status(500).json({
            error: 'Erreur lors de la suppression de l\'image'
        });
    }
});

// GET /api/gallery/categories - Récupérer les catégories disponibles
router.get('/meta/categories', (req, res) => {
    try {
        const categories = [...new Set(galleryData.map(item => item.category))];
        res.json({
            success: true,
            data: categories
        });
    } catch (error) {
        res.status(500).json({
            error: 'Erreur lors de la récupération des catégories'
        });
    }
});

module.exports = router;
