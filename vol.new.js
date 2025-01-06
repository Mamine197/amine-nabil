const mongoose = require('mongoose');

const aeroportSchema = new mongoose.Schema({
    nom: String,
    ville: String,
    pays: String
});

const volSchema = new mongoose.Schema({
    numeroVol: {
        type: String,
        required: true,
        unique: true
    },
    compagnieAerienne: {
        type: String,
        required: true
    },
    dateDepart: {
        type: Date,
        required: true
    },
    heureDepart: {
        type: String,
        required: true
    },
    heureArrivee: {
        type: String,
        required: true
    },
    depart: aeroportSchema,
    destination: aeroportSchema,
    prix: {
        type: Number,
        required: true,
        min: 0
    },
    placesDisponibles: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    timestamps: true
});

// Créer le modèle seulement s'il n'existe pas déjà
module.exports = mongoose.models.Vol || mongoose.model('Vol', volSchema);
