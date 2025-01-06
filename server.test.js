const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const volsRoutes = require('./routes/vols');
const reservationCppService = require('./services/reservationCppService');

// Fonction pour générer un numéro de vol unique
const generateNumeroVol = () => {
    const date = new Date();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `FL-${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}-${random}`;
};

// Fonction pour générer un numéro de réservation unique
const generateNumeroReservation = () => {
    const date = new Date();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `RES-${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}-${random}`;
};

// Définition du schéma Vol
const volSchema = new mongoose.Schema({
    numeroVol: { 
        type: String, 
        required: true,
        unique: true,
        default: generateNumeroVol
    },
    compagnieAerienne: { type: String, required: true },
    dateDepart: { type: String, required: true },
    heureDepart: { type: String, required: true },
    heureArrivee: { type: String, required: true },
    prix: { type: Number, required: true },
    placesDisponibles: { type: Number, required: true },
    depart: {
        nomAeroport: String,
        ville: String,
        pays: String
    },
    destination: {
        nomAeroport: String,
        ville: String,
        pays: String
    },
    escale: {
        heureDepartEscale: String,
        heureFinEscale: String
    }
}, { timestamps: true });

// Définition du schéma Réservation
const reservationSchema = new mongoose.Schema({
    numeroReservation: {
        type: String,
        required: true,
        unique: true,
        default: generateNumeroReservation
    },
    vol: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vol',
        required: true
    },
    client: {
        nom: { type: String, required: true },
        prenom: { type: String, required: true },
        email: { type: String, required: true },
        telephone: { type: String, required: true }
    },
    classe: {
        type: String,
        enum: ['economique', 'affaires', 'premiere'],
        required: true
    },
    statut: {
        type: String,
        enum: ['confirmee', 'en_attente', 'annulee'],
        default: 'en_attente'
    },
    prix: { type: Number, required: true }
}, { timestamps: true });

// Création des modèles
const Vol = mongoose.model('Vol', volSchema);
const Reservation = mongoose.model('Reservation', reservationSchema);

const app = express();

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:4000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Connexion à MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/reservation-vols', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erreur de connexion à MongoDB:'));
db.once('open', () => {
    console.log('Connecté à MongoDB');
});

// Monter les routes
app.use('/api/vols', volsRoutes);

// Routes pour les réservations
app.post('/api/reservations', async (req, res) => {
    try {
        const { volId, client, classe } = req.body;
        
        // Vérifier si le vol existe
        const vol = await Vol.findById(volId);
        if (!vol) {
            return res.status(404).json({ error: 'Vol non trouvé' });
        }
        
        // Vérifier s'il y a des places disponibles
        if (vol.placesDisponibles <= 0) {
            return res.status(400).json({ error: 'Plus de places disponibles pour ce vol' });
        }
        
        // Calculer le prix en fonction de la classe
        let prixBase = vol.prix;
        switch (classe) {
            case 'affaires':
                prixBase *= 2;
                break;
            case 'premiere':
                prixBase *= 3;
                break;
        }
        
        // Créer la réservation
        const reservation = new Reservation({
            vol: volId,
            client,
            classe,
            prix: prixBase,
            numeroReservation: generateNumeroReservation()
        });
        
        // Sauvegarder la réservation
        const savedReservation = await reservation.save();
        
        // Mettre à jour le nombre de places disponibles
        vol.placesDisponibles -= 1;
        await vol.save();
        
        // Retourner la réservation avec les détails du vol
        const reservationComplete = await Reservation.findById(savedReservation._id).populate('vol');
        
        res.status(201).json(reservationComplete);
    } catch (error) {
        console.error('Erreur lors de la création de la réservation:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/reservations/cpp', async (req, res) => {
    try {
        // Vérifier si le vol existe et a des places disponibles
        const vol = await Vol.findById(req.body.volId);
        if (!vol) {
            return res.status(404).json({ error: 'Vol non trouvé' });
        }
        
        if (vol.placesDisponibles <= 0) {
            return res.status(400).json({ error: 'Plus de places disponibles pour ce vol' });
        }

        // Créer la réservation avec le programme C++
        const reservation = await reservationCppService.createReservation(req.body);

        // Mettre à jour le nombre de places disponibles
        vol.placesDisponibles -= 1;
        await vol.save();

        // Retourner la réservation
        res.status(201).json(reservation);
    } catch (error) {
        console.error('Erreur lors de la création de la réservation:', error);
        res.status(500).json({ error: error.message });
    }
});

// Route pour obtenir les réservations d'un client
app.get('/api/reservations/client/:email', async (req, res) => {
    try {
        const reservations = await Reservation.find({
            'client.email': req.params.email
        }).populate('vol').sort({ createdAt: -1 });
        
        res.json(reservations);
    } catch (error) {
        console.error('Erreur lors de la récupération des réservations:', error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
