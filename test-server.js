const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

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

// Route de test
app.get('/api/test', (req, res) => {
    res.json({ message: 'Le serveur fonctionne!' });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
