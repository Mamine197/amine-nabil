const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware pour logger toutes les requêtes
app.use((req, res, next) => {
    console.log(`📥 ${req.method} ${req.url}`);
    next();
});

// Middleware
app.use(cors()); // Accepter toutes les origines pendant le développement

// Middleware pour parser le JSON
app.use(express.json());

// Route de test simple
app.get('/', (req, res) => {
    console.log('📥 GET / - Route de test');
    res.json({ message: 'API de réservation de vols' });
});

// Routes
const volsRouter = require('./routes/vols');
app.use('/api/vols', volsRouter);
console.log('✅ Routes montées sur /api/vols');

// Middleware pour gérer les routes non trouvées
app.use((req, res) => {
    console.log(`❌ Route non trouvée: ${req.method} ${req.url}`);
    res.status(404).json({ message: 'Route non trouvée' });
});

// MongoDB Connection
console.log('🔄 Tentative de connexion à MongoDB...');
mongoose.connect('mongodb://127.0.0.1:27017/reservation-vols', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('✅ Connecté à MongoDB avec succès');
}).catch(err => {
    console.error('❌ Erreur de connexion à MongoDB:', err);
    process.exit(1);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});
