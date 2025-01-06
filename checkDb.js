const mongoose = require('mongoose');
const Vol = require('../models/Vol');

console.log('Connexion à MongoDB...');

mongoose.connect('mongodb://127.0.0.1:27017/reservation-vols', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    console.log('✅ Connecté à MongoDB');
    
    try {
        // Compte le nombre de vols
        const count = await Vol.countDocuments();
        console.log(`Nombre total de vols dans la base : ${count}`);

        // Récupère tous les vols
        const vols = await Vol.find();
        console.log('\nListe des vols :');
        vols.forEach(vol => {
            console.log(`\n- Vol ${vol.numeroVol} :`);
            console.log(`  Destination: ${vol.destination}`);
            console.log(`  Date: ${vol.dateDepart}`);
            console.log(`  Prix: ${vol.prix}€`);
            console.log(`  Places: ${vol.nombrePlaces}`);
        });

        mongoose.connection.close();
    } catch (error) {
        console.error('Erreur lors de la lecture des vols:', error);
    }
}).catch(err => {
    console.error('Erreur de connexion à MongoDB:', err);
});
