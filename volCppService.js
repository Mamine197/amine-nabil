const mongoose = require('mongoose');
const Vol = require('../models/vol.model');

class VolCppService {
    constructor() {
        this.connectToMongoDB();
    }

    async connectToMongoDB() {
        try {
            await mongoose.connect('mongodb://localhost:27017/reservation-vols', {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            console.log('Connecté à MongoDB');
        } catch (error) {
            console.error('Erreur de connexion à MongoDB:', error);
        }
    }

    async createVol(volData) {
        try {
            console.log('Création d\'un nouveau vol avec les données:', volData);
            const vol = new Vol(volData);
            const savedVol = await vol.save();
            console.log('Vol créé avec succès:', savedVol);
            return savedVol;
        } catch (error) {
            console.error('Erreur lors de la création du vol:', error);
            throw error;
        }
    }

    async getAllVols() {
        try {
            console.log('Récupération de tous les vols');
            const vols = await Vol.find({}).exec();
            console.log(`${vols.length} vols trouvés`);
            return vols;
        } catch (error) {
            console.error('Erreur lors de la récupération des vols:', error);
            throw error;
        }
    }

    async getVolById(id) {
        try {
            console.log('Recherche du vol avec ID:', id);
            
            if (!mongoose.Types.ObjectId.isValid(id)) {
                console.error('ID de vol invalide:', id);
                throw new Error('ID de vol invalide');
            }

            const vol = await Vol.findById(id).exec();
            console.log('Résultat de la recherche:', vol);

            if (!vol) {
                console.error('Aucun vol trouvé avec l\'ID:', id);
                throw new Error('Vol non trouvé');
            }

            return vol;
        } catch (error) {
            console.error('Erreur lors de la récupération du vol:', error);
            if (error.message === 'ID de vol invalide' || error.message === 'Vol non trouvé') {
                throw error;
            }
            throw new Error('Erreur lors de la récupération du vol');
        }
    }

    async updateVol(id, updateData) {
        try {
            console.log('Mise à jour du vol:', id, 'avec les données:', updateData);
            
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error('ID de vol invalide');
            }

            const vol = await Vol.findByIdAndUpdate(id, updateData, { 
                new: true,
                runValidators: true 
            });

            if (!vol) {
                throw new Error('Vol non trouvé');
            }

            console.log('Vol mis à jour avec succès:', vol);
            return vol;
        } catch (error) {
            console.error('Erreur lors de la mise à jour du vol:', error);
            throw error;
        }
    }

    async deleteVol(id) {
        try {
            console.log('Suppression du vol:', id);
            
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error('ID de vol invalide');
            }

            const vol = await Vol.findByIdAndDelete(id);
            
            if (!vol) {
                throw new Error('Vol non trouvé');
            }

            console.log('Vol supprimé avec succès');
            return { message: 'Vol supprimé avec succès' };
        } catch (error) {
            console.error('Erreur lors de la suppression du vol:', error);
            throw error;
        }
    }
}

module.exports = new VolCppService();
