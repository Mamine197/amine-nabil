const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true
    },
    prenom: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    numeroTelephone: {
        type: String,
        required: true
    }
});

const reservationSchema = new mongoose.Schema({
    numeroReservation: {
        type: String,
        required: true,
        unique: true,
        default: function() {
            // Générer un numéro de réservation unique au format "RES-YYYYMMDD-XXX"
            const date = new Date();
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
            return `RES-${year}${month}${day}-${random}`;
        }
    },
    volId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vol',
        required: true
    },
    client: {
        type: clientSchema,
        required: true
    },
    classe: {
        type: String,
        enum: ['economique', 'affaires', 'premiere'],
        required: true
    },
    statut: {
        type: String,
        enum: ['Confirmé', 'Annulé', 'En attente'],
        default: 'En attente'
    },
    dateReservation: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Reservation', reservationSchema);
