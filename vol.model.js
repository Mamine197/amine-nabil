const mongoose = require('mongoose');

const aeroportSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true
    },
    ville: {
        type: String,
        required: true
    },
    pays: {
        type: String,
        required: true
    }
});

const volSchema = new mongoose.Schema({
    numeroVol: {
        type: String,
        required: true,
        unique: true,
        default: function() {
            const date = new Date();
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
            return `FL-${year}${month}${day}-${random}`;
        }
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
    depart: {
        type: aeroportSchema,
        required: true
    },
    destination: {
        type: aeroportSchema,
        required: true
    },
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

module.exports = mongoose.model('Vol', volSchema);
