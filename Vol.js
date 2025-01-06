const mongoose = require('mongoose');

const aeroport = {
    ville: {
        type: String,
        required: true
    },
    pays: {
        type: String,
        required: true
    },
    nomAeroport: {
        type: String,
        required: true
    }
};

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
        type: String,
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
    depart: aeroport,
    destination: aeroport,
    prix: {
        type: Number,
        required: true
    },
    placesDisponibles: {
        type: Number,
        required: true,
        min: 0
    }
});

module.exports = mongoose.model('Vol', volSchema);
