const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Vol = require('./models/vol.model');
const volCppService = require('./services/volCppService');
const reservationService = require('./services/reservationService');
const reservationsRoutes = require('./routes/reservations');

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

// Middleware pour logger les requêtes
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    if (req.body && Object.keys(req.body).length > 0) {
        console.log('Body:', JSON.stringify(req.body, null, 2));
    }
    next();
});

// Routes pour les vols
app.post('/api/vols', async (req, res) => {
    try {
        console.log('Données reçues dans /api/vols:', req.body);
        const result = await volCppService.createVol(req.body);
        console.log('Vol créé avec succès:', result);
        res.json(result);
    } catch (error) {
        console.error('Erreur lors de la création du vol:', error);
        res.status(500).json({ 
            error: error.message,
            stack: error.stack 
        });
    }
});

app.get('/api/vols', async (req, res) => {
    try {
        const vols = await Vol.find({});
        console.log('Vols récupérés:', vols.length);
        res.json(vols);
    } catch (error) {
        console.error('Erreur lors de la récupération des vols:', error);
        res.status(500).json({ 
            error: error.message 
        });
    }
});

// Route pour obtenir un vol spécifique
app.get('/api/vols/:id', async (req, res) => {
    try {
        console.log('Récupération du vol avec ID:', req.params.id);
        
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            console.error('ID de vol invalide:', req.params.id);
            return res.status(400).json({ error: 'ID de vol invalide' });
        }

        const vol = await Vol.findById(req.params.id);
        console.log('Vol trouvé:', vol);

        if (!vol) {
            console.error('Aucun vol trouvé avec l\'ID:', req.params.id);
            return res.status(404).json({ error: 'Vol non trouvé' });
        }

        res.json(vol);
    } catch (error) {
        console.error('Erreur lors de la récupération du vol:', error);
        res.status(500).json({ 
            error: 'Erreur lors de la récupération du vol',
            details: error.message 
        });
    }
});

// Routes pour les réservations
app.use('/api/reservations', reservationsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
