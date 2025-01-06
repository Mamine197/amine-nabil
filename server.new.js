const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Vol = require('./models/vol.new');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connexion à MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/reservation-vols', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connecté à MongoDB'))
.catch(err => console.error('Erreur de connexion à MongoDB:', err));

// Routes pour les vols
app.post('/api/vols', async (req, res) => {
    try {
        const vol = new Vol(req.body);
        const savedVol = await vol.save();
        res.status(201).json(savedVol);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/vols', async (req, res) => {
    try {
        const vols = await Vol.find();
        res.json(vols);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Routes pour les réservations
app.post('/api/reservations', async (req, res) => {
    try {
        const { volId, client, classe } = req.body;
        
        // Vérifier si le vol existe
        const vol = await Vol.findById(volId);
        if (!vol) {
            return res.status(404).json({ message: 'Vol non trouvé' });
        }
        
        // Vérifier s'il y a des places disponibles
        if (vol.placesDisponibles <= 0) {
            return res.status(400).json({ message: 'Plus de places disponibles' });
        }
        
        // Créer la réservation
        const reservation = new Reservation({
            volId,
            client,
            classe,
            statut: 'En attente'
        });
        
        // Sauvegarder la réservation
        const savedReservation = await reservation.save();
        
        // Mettre à jour le nombre de places disponibles
        vol.placesDisponibles -= 1;
        await vol.save();
        
        res.status(201).json(savedReservation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
