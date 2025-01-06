import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AjouterVol = () => {
    const navigate = useNavigate();
    const [volData, setVolData] = useState({
        compagnieAerienne: '',
        dateDepart: '',
        heureDepart: '',
        heureArrivee: '',
        prix: '',
        placesDisponibles: '',
        depart: {
            nom: '',
            ville: '',
            pays: ''
        },
        destination: {
            nom: '',
            ville: '',
            pays: ''
        }
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('Envoi des données:', volData);
            const response = await axios.post('http://localhost:3000/api/vols', volData);
            console.log('Réponse du serveur:', response.data);
            
            if (response.data) {
                alert('Vol ajouté avec succès!');
                // Réinitialiser le formulaire
                setVolData({
                    compagnieAerienne: '',
                    dateDepart: '',
                    heureDepart: '',
                    heureArrivee: '',
                    prix: '',
                    placesDisponibles: '',
                    depart: {
                        nom: '',
                        ville: '',
                        pays: ''
                    },
                    destination: {
                        nom: '',
                        ville: '',
                        pays: ''
                    }
                });
                // Rediriger vers la liste des vols
                navigate('/admin/liste-vols');
            }
        } catch (error) {
            console.error('Erreur lors de l\'ajout du vol:', error);
            alert('Erreur lors de l\'ajout du vol: ' + (error.response?.data?.error || error.message));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setVolData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setVolData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                <Typography variant="h5" component="h1" gutterBottom>
                    Ajouter un nouveau vol
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                    <TextField
                        fullWidth
                        label="Compagnie Aérienne"
                        name="compagnieAerienne"
                        value={volData.compagnieAerienne}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        type="date"
                        label="Date de départ"
                        name="dateDepart"
                        value={volData.dateDepart}
                        onChange={handleChange}
                        margin="normal"
                        required
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        fullWidth
                        type="time"
                        label="Heure de départ"
                        name="heureDepart"
                        value={volData.heureDepart}
                        onChange={handleChange}
                        margin="normal"
                        required
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        fullWidth
                        type="time"
                        label="Heure d'arrivée"
                        name="heureArrivee"
                        value={volData.heureArrivee}
                        onChange={handleChange}
                        margin="normal"
                        required
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        fullWidth
                        type="number"
                        label="Prix"
                        name="prix"
                        value={volData.prix}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        type="number"
                        label="Places disponibles"
                        name="placesDisponibles"
                        value={volData.placesDisponibles}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    
                    <Typography variant="h6" sx={{ mt: 2 }}>Aéroport de départ</Typography>
                    <TextField
                        fullWidth
                        label="Nom de l'aéroport"
                        name="depart.nom"
                        value={volData.depart.nom}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Ville"
                        name="depart.ville"
                        value={volData.depart.ville}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Pays"
                        name="depart.pays"
                        value={volData.depart.pays}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    
                    <Typography variant="h6" sx={{ mt: 2 }}>Aéroport de destination</Typography>
                    <TextField
                        fullWidth
                        label="Nom de l'aéroport"
                        name="destination.nom"
                        value={volData.destination.nom}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Ville"
                        name="destination.ville"
                        value={volData.destination.ville}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Pays"
                        name="destination.pays"
                        value={volData.destination.pays}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 3 }}
                    >
                        Ajouter le vol
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default AjouterVol;
