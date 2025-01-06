const mongoose = require('mongoose');
const Vol = require('../models/Vol');

const volsTest = [
    {
        numeroVol: "AF123",
        destination: "Paris",
        dateDepart: new Date("2025-02-01"),
        nombrePlaces: 150,
        prix: 200,
        statut: "disponible"
    },
    {
        numeroVol: "AF456",
        destination: "Londres",
        dateDepart: new Date("2025-02-02"),
        nombrePlaces: 120,
        prix: 180,
        statut: "disponible"
    },
    {
        numeroVol: "AF789",
        destination: "New York",
        dateDepart: new Date("2025-02-03"),
        nombrePlaces: 200,
        prix: 500,
        statut: "disponible"
    }
];

mongoose.connect('mongodb://localhost:27017/reservation-vols', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    console.log('Connecté à MongoDB');
    
    try {
        // Supprime tous les vols existants
        await Vol.deleteMany({});
        console.log('Base de données nettoyée');

        // Ajoute les vols de test
        const vols = await Vol.insertMany(volsTest);
        console.log('Vols de test ajoutés:', vols);
        
        mongoose.connection.close();
    } catch (error) {
        console.error('Erreur lors de l\'ajout des vols de test:', error);
    }
}).catch(err => {
    console.error('Erreur de connexion à MongoDB:', err);
});
