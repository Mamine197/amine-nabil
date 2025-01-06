const Vol = require('../models/Vol');
const volCppService = require('../services/volCppService');

// Obtenir tous les vols
exports.getVols = async (req, res) => {
    try {
        console.log('📥 Récupération de tous les vols');
        const vols = await Vol.find();
        console.log(`✅ ${vols.length} vols trouvés`);
        res.json(vols);
    } catch (error) {
        console.error('❌ Erreur lors de la récupération des vols:', error);
        res.status(500).json({ message: error.message });
    }
};

// Créer un nouveau vol
exports.createVol = async (req, res) => {
    try {
        console.log('📥 Création d\'un nouveau vol');
        console.log('Données reçues:', req.body);

        // Créer le vol avec le programme C++
        const volCpp = await volCppService.createVol(req.body);
        
        // Sauvegarder dans MongoDB
        const vol = new Vol({
            compagnieAerienne: volCpp.compagnieAerienne,
            dateDepart: new Date(volCpp.dateDepart),
            heureDepart: volCpp.heureDepart,
            heureArrivee: volCpp.heureArrivee,
            prix: volCpp.prix,
            placesDisponibles: volCpp.placesDisponibles,
            depart: {
                nom: volCpp.depart.nom,
                ville: volCpp.depart.ville,
                pays: volCpp.depart.pays
            },
            destination: {
                nom: volCpp.destination.nom,
                ville: volCpp.destination.ville,
                pays: volCpp.destination.pays
            }
        });

        const nouveauVol = await vol.save();
        console.log('✅ Vol créé avec succès');
        res.status(201).json(nouveauVol);
    } catch (error) {
        console.error('❌ Erreur lors de la création du vol:', error);
        res.status(400).json({ message: error.message });
    }
};

// Obtenir un vol spécifique
exports.getVol = async (req, res) => {
    console.log(`📥 GET /api/vols/${req.params.id} - Début de la requête`);
    try {
        console.log('🔍 Recherche du vol...');
        const vol = await Vol.findById(req.params.id);
        if (vol) {
            console.log('✅ Vol trouvé:', vol);
            res.json(vol);
        } else {
            console.log('❌ Vol non trouvé');
            res.status(404).json({ message: 'Vol non trouvé' });
        }
    } catch (error) {
        console.error('❌ Erreur lors de la récupération du vol:', error);
        res.status(500).json({ 
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// Mettre à jour un vol
exports.updateVol = async (req, res) => {
    console.log(`📥 PUT /api/vols/${req.params.id} - Début de la requête:`, req.body);
    try {
        console.log('🔍 Recherche du vol à mettre à jour...');
        const vol = await Vol.findById(req.params.id);
        if (vol) {
            console.log('✅ Vol trouvé, mise à jour...');
            Object.assign(vol, req.body);
            const volMisAJour = await vol.save();
            console.log('✅ Vol mis à jour:', volMisAJour);
            res.json(volMisAJour);
        } else {
            console.log('❌ Vol non trouvé');
            res.status(404).json({ message: 'Vol non trouvé' });
        }
    } catch (error) {
        console.error('❌ Erreur lors de la mise à jour du vol:', error);
        res.status(400).json({ 
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// Supprimer un vol
exports.deleteVol = async (req, res) => {
    console.log(`📥 DELETE /api/vols/${req.params.id} - Début de la requête`);
    try {
        console.log('🔍 Recherche du vol à supprimer...');
        const vol = await Vol.findById(req.params.id);
        if (vol) {
            console.log('✅ Vol trouvé, suppression...');
            await vol.remove();
            console.log('✅ Vol supprimé');
            res.json({ message: 'Vol supprimé' });
        } else {
            console.log('❌ Vol non trouvé');
            res.status(404).json({ message: 'Vol non trouvé' });
        }
    } catch (error) {
        console.error('❌ Erreur lors de la suppression du vol:', error);
        res.status(500).json({ 
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};
