// Vercel API Route pour la galerie
// Note: Upload de fichiers simplifié pour Vercel (pas de stockage fichier physique)

// Données de la galerie (en dur pour commencer, peut être une BDD plus tard)
let galleryData = [
    {
        id: 1,
        title: "Installation chauffage moderne",
        description: "Installation complète d'un système de chauffage moderne avec radiateurs design",
        image: "/assets/images/img5.jpg",
        category: "chauffage",
        createdAt: new Date().toISOString()
    },
    {
        id: 2,
        title: "Rénovation salle de bain",
        description: "Rénovation complète d'une salle de bain avec installation sanitaire moderne",
        image: "/assets/images/img6.JPG",
        category: "sanitaire",
        createdAt: new Date().toISOString()
    },
    {
        id: 3,
        title: "Installation climatisation",
        description: "Installation d'un système de climatisation efficace pour une maison individuelle",
        image: "/assets/images/img7.jpg",
        category: "climatisation",
        createdAt: new Date().toISOString()
    },
    {
        id: 4,
        title: "Plomberie moderne",
        description: "Installation de plomberie moderne avec équipements de qualité",
        image: "/assets/images/img8.JPG",
        category: "plomberie",
        createdAt: new Date().toISOString()
    },
    {
        id: 5,
        title: "Système de chauffage",
        description: "Mise en place d'un système de chauffage économique et performant",
        image: "/assets/images/img9.JPG",
        category: "chauffage",
        createdAt: new Date().toISOString()
    },
    {
        id: 6,
        title: "Équipements sanitaires",
        description: "Installation d'équipements sanitaires modernes et accessibles",
        image: "/assets/images/img10.jpg",
        category: "sanitaire",
        createdAt: new Date().toISOString()
    },
    {
        id: 7,
        title: "Climatisation bureau",
        description: "Installation de climatisation pour espaces professionnels",
        image: "/assets/images/img11.jpg",
        category: "climatisation",
        createdAt: new Date().toISOString()
    },
    {
        id: 8,
        title: "Travaux plomberie",
        description: "Réparation et installation de nouvelles canalisations",
        image: "/assets/images/img12.jpg",
        category: "plomberie",
        createdAt: new Date().toISOString()
    }
];

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
    const pathSegments = urlQuery.gallery || [];

    try {
        if (req.method === 'GET') {
            // GET /api/gallery/categories
            if (pathSegments[0] === 'categories') {
                const categories = [...new Set(galleryData.map(item => item.category))];
                return res.json({
                    success: true,
                    data: categories
                });
            }

            // GET /api/gallery/:id
            if (pathSegments[0] && pathSegments[0] !== 'categories') {
                const id = parseInt(pathSegments[0]);
                const item = galleryData.find(item => item.id === id);
                
                if (!item) {
                    return res.status(404).json({
                        error: 'Image non trouvée'
                    });
                }
                
                return res.json({
                    success: true,
                    data: item
                });
            }

            // GET /api/gallery - Récupérer toutes les images
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
            
            return res.json({
                success: true,
                count: filteredGallery.length,
                total: galleryData.length,
                data: filteredGallery
            });

        } else if (req.method === 'POST') {
            // Pour Vercel, nous utilisons des URLs d'images externes ou base64
            // L'upload de fichiers nécessiterait un service externe (Cloudinary, etc.)
            const { title, description, category, imageUrl } = req.body;

            if (!title || !category) {
                return res.status(400).json({
                    error: 'Le titre et la catégorie sont obligatoires'
                });
            }

            if (!imageUrl) {
                return res.status(400).json({
                    error: 'URL de l\'image requise (utiliser un service externe comme Cloudinary)'
                });
            }

            // Créer un nouvel item pour la galerie
            const newItem = {
                id: Math.max(...galleryData.map(item => item.id), 0) + 1,
                title,
                description: description || '',
                category: category.toLowerCase(),
                image: imageUrl,
                createdAt: new Date().toISOString()
            };

            galleryData.push(newItem);

            return res.status(201).json({
                success: true,
                message: 'Image ajoutée avec succès',
                data: newItem
            });

        } else if (req.method === 'DELETE') {
            // DELETE /api/gallery/:id
            const id = parseInt(pathSegments[0]);
            const itemIndex = galleryData.findIndex(item => item.id === id);
            
            if (itemIndex === -1) {
                return res.status(404).json({
                    error: 'Image non trouvée'
                });
            }
            
            // Supprimer de la liste
            galleryData.splice(itemIndex, 1);
            
            return res.json({
                success: true,
                message: 'Image supprimée avec succès'
            });

        } else {
            res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
        }

    } catch (error) {
        console.error('Erreur API Gallery:', error);
        res.status(500).json({
            error: 'Erreur interne du serveur'
        });
    }
}
