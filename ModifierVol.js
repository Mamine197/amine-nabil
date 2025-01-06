import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Box,
    Alert,
    CircularProgress,
    IconButton,
    Grid
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const ModifierVol = () => {
    const { volId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [volData, setVolData] = useState({
        numeroVol: '',
        compagnieAerienne: '',
        dateDepart: '',
        heureDepart: '',
        heureArrivee: '',
        prix: '',
        placesDisponibles: '',
        depart: {
            ville: '',
            pays: '',
            nomAeroport: ''
        },
        destination: {
            ville: '',
            pays: '',
            nomAeroport: ''
        }
    });

    useEffect(() => {
        const fetchVolDetails = async () => {
            try {
                console.log('Tentative de récupération du vol avec ID:', volId);
                const response = await axios.get(`${API_URL}/vols/${volId}`);
                
                // Formatage de la date pour l'input date
                const vol = response.data;
                const date = new Date(vol.dateDepart);
                const formattedDate = date.toISOString().split('T')[0];
                
                setVolData({
                    ...vol,
                    dateDepart: formattedDate
                });
                setLoading(false);
            } catch (error) {
                console.error('Erreur lors de la récupération des détails du vol:', error);
                if (error.response) {
                    setError(`Erreur: ${error.response.data.message || 'Impossible de récupérer les détails du vol'}`);
                } else if (error.request) {
                    setError('Impossible de contacter le serveur');
                } else {
                    setError(`Erreur: ${error.message}`);
                }
                setLoading(false);
            }
        };

        if (volId) {
            fetchVolDetails();
        }
    }, [volId]);

    const handleInputChange = (e) => {
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`${API_URL}/vols/${volId}`, volData);
            setSuccess('Vol modifié avec succès !');
            setTimeout(() => {
                navigate('/admin/liste-vols');
            }, 2000);
        } catch (error) {
            console.error('Erreur lors de la modification du vol:', error);
            if (error.response) {
                setError(`Erreur: ${error.response.data.message || 'Impossible de modifier le vol'}`);
            } else if (error.request) {
                setError('Impossible de contacter le serveur');
            } else {
                setError(`Erreur: ${error.message}`);
            }
        }
    };

    if (loading) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container maxWidth="lg">
            <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                    <IconButton onClick={() => navigate('/admin/liste-vols')} sx={{ mr: 2 }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h4">
                        Modifier le Vol
                    </Typography>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {success}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Numéro de vol"
                                name="numeroVol"
                                value={volData.numeroVol}
                                onChange={handleInputChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Compagnie aérienne"
                                name="compagnieAerienne"
                                value={volData.compagnieAerienne}
                                onChange={handleInputChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Date de départ"
                                name="dateDepart"
                                value={volData.dateDepart}
                                onChange={handleInputChange}
                                required
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                type="time"
                                label="Heure de départ"
                                name="heureDepart"
                                value={volData.heureDepart}
                                onChange={handleInputChange}
                                required
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                type="time"
                                label="Heure d'arrivée"
                                name="heureArrivee"
                                value={volData.heureArrivee}
                                onChange={handleInputChange}
                                required
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>

                        {/* Départ */}
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                                Départ
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Ville de départ"
                                name="depart.ville"
                                value={volData.depart.ville}
                                onChange={handleInputChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Pays de départ"
                                name="depart.pays"
                                value={volData.depart.pays}
                                onChange={handleInputChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Aéroport de départ"
                                name="depart.nomAeroport"
                                value={volData.depart.nomAeroport}
                                onChange={handleInputChange}
                                required
                            />
                        </Grid>

                        {/* Destination */}
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                                Destination
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Ville de destination"
                                name="destination.ville"
                                value={volData.destination.ville}
                                onChange={handleInputChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Pays de destination"
                                name="destination.pays"
                                value={volData.destination.pays}
                                onChange={handleInputChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Aéroport de destination"
                                name="destination.nomAeroport"
                                value={volData.destination.nomAeroport}
                                onChange={handleInputChange}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Prix"
                                name="prix"
                                value={volData.prix}
                                onChange={handleInputChange}
                                required
                                InputProps={{
                                    endAdornment: '€'
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Places disponibles"
                                name="placesDisponibles"
                                value={volData.placesDisponibles}
                                onChange={handleInputChange}
                                required
                            />
                        </Grid>
                    </Grid>

                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button
                            variant="outlined"
                            onClick={() => navigate('/admin/liste-vols')}
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                        >
                            Modifier le vol
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default ModifierVol;
