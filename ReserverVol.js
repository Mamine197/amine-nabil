import React, { useState, useEffect } from 'react';
import { 
    Container, 
    Paper, 
    Typography, 
    TextField, 
    Button, 
    Stepper, 
    Step, 
    StepLabel,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Alert,
    CircularProgress
} from '@mui/material';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const ReserverVol = () => {
    const navigate = useNavigate();
    const { volId } = useParams();
    const [vol, setVol] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeStep, setActiveStep] = useState(0);
    const [clientInfo, setClientInfo] = useState({
        nom: '',
        prenom: '',
        email: '',
        numeroTelephone: ''
    });
    const [classe, setClasse] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchVolDetails = async () => {
            try {
                console.log('Tentative de récupération des détails du vol avec ID:', volId);
                if (!volId) {
                    throw new Error('ID du vol manquant');
                }

                const response = await axios.get(`http://localhost:3000/api/vols/${volId}`);
                console.log('Réponse reçue:', response);

                if (!response.data) {
                    throw new Error('Aucune donnée reçue du serveur');
                }

                console.log('Détails du vol récupérés:', response.data);
                setVol(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Erreur lors de la récupération des détails du vol:', error);
                if (error.response) {
                    console.error('Réponse d\'erreur:', error.response);
                    setError(`Erreur serveur: ${error.response.data?.error || error.response.statusText}`);
                } else if (error.request) {
                    console.error('Pas de réponse reçue:', error.request);
                    setError('Impossible de contacter le serveur');
                } else {
                    console.error('Erreur de configuration:', error.message);
                    setError(`Erreur: ${error.message}`);
                }
                setLoading(false);
            }
        };

        fetchVolDetails();
    }, [volId]);

    const steps = ['Authentification', 'Choix de la classe', 'Confirmation'];

    const handleClientInfoChange = (e) => {
        const { name, value } = e.target;
        console.log('Mise à jour des informations client:', name, value);
        setClientInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleClasseChange = (e) => {
        console.log('Sélection de la classe:', e.target.value);
        setClasse(e.target.value);
    };

    const handleNext = () => {
        setActiveStep(prevStep => prevStep + 1);
    };

    const handleBack = () => {
        setActiveStep(prevStep => prevStep - 1);
    };

    const handleSubmit = async () => {
        try {
            console.log('Tentative de soumission de la réservation:', {
                volId,
                client: clientInfo,
                classe
            });

            const response = await axios.post('http://localhost:3000/api/reservations', {
                volId,
                client: clientInfo,
                classe,
                statut: 'Confirmé'
            });

            console.log('Réponse de la réservation:', response.data);

            if (response.data.success) {
                setSuccess('Réservation confirmée avec succès !');
                setTimeout(() => {
                    navigate('/client/mes-reservations');
                }, 2000);
            } else {
                throw new Error('La réservation n\'a pas pu être confirmée');
            }
        } catch (error) {
            console.error('Erreur lors de la réservation:', error);
            if (error.response) {
                setError(error.response.data?.error || 'Erreur lors de la réservation');
            } else {
                setError(error.message || 'Une erreur est survenue');
            }
        }
    };

    const validateStep = () => {
        console.log('Validation de l\'étape:', activeStep);
        switch (activeStep) {
            case 0:
                return clientInfo.nom && clientInfo.prenom && clientInfo.email && clientInfo.numeroTelephone;
            case 1:
                return classe !== '';
            default:
                return true;
        }
    };

    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Informations personnelles
                        </Typography>
                        <TextField
                            fullWidth
                            label="Nom"
                            name="nom"
                            value={clientInfo.nom}
                            onChange={handleClientInfoChange}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Prénom"
                            name="prenom"
                            value={clientInfo.prenom}
                            onChange={handleClientInfoChange}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={clientInfo.email}
                            onChange={handleClientInfoChange}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Numéro de téléphone"
                            name="numeroTelephone"
                            value={clientInfo.numeroTelephone}
                            onChange={handleClientInfoChange}
                            margin="normal"
                            required
                        />
                    </Box>
                );
            case 1:
                return (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Choisir votre classe
                        </Typography>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Classe</InputLabel>
                            <Select
                                value={classe}
                                onChange={handleClasseChange}
                                label="Classe"
                                required
                            >
                                <MenuItem value="economique">Économique</MenuItem>
                                <MenuItem value="affaires">Affaires</MenuItem>
                                <MenuItem value="premiere">Première</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                );
            case 2:
                return (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Récapitulatif de la réservation
                        </Typography>
                        {vol && (
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle1">
                                    Détails du vol :
                                </Typography>
                                <Typography>
                                    Numéro de vol : {vol.numeroVol}
                                </Typography>
                                <Typography>
                                    Compagnie : {vol.compagnieAerienne}
                                </Typography>
                                <Typography>
                                    Date : {new Date(vol.dateDepart).toLocaleDateString()}
                                </Typography>
                                <Typography>
                                    Heure de départ : {vol.heureDepart}
                                </Typography>
                                <Typography>
                                    Heure d'arrivée : {vol.heureArrivee}
                                </Typography>
                                <Typography>
                                    Départ : {vol.depart.ville}, {vol.depart.pays}
                                </Typography>
                                <Typography>
                                    Destination : {vol.destination.ville}, {vol.destination.pays}
                                </Typography>
                                <Typography>
                                    Prix : {vol.prix} €
                                </Typography>
                            </Box>
                        )}
                        <Typography variant="subtitle1">
                            Vos informations :
                        </Typography>
                        <Typography>
                            Nom complet : {clientInfo.nom} {clientInfo.prenom}
                        </Typography>
                        <Typography>
                            Email : {clientInfo.email}
                        </Typography>
                        <Typography>
                            Téléphone : {clientInfo.numeroTelephone}
                        </Typography>
                        <Typography>
                            Classe : {classe}
                        </Typography>
                    </Box>
                );
            default:
                return 'Étape inconnue';
        }
    };

    if (loading) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>
                    Chargement des détails du vol...
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="md">
            <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Réserver un vol
                </Typography>

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

                {!error && (
                    <>
                        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>

                        {getStepContent(activeStep)}

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                            {activeStep !== 0 && (
                                <Button onClick={handleBack} sx={{ mr: 1 }}>
                                    Retour
                                </Button>
                            )}
                            {activeStep === steps.length - 1 ? (
                                <Button
                                    variant="contained"
                                    onClick={handleSubmit}
                                    disabled={!validateStep()}
                                >
                                    Confirmer la réservation
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    onClick={handleNext}
                                    disabled={!validateStep()}
                                >
                                    Suivant
                                </Button>
                            )}
                        </Box>
                    </>
                )}
            </Paper>
        </Container>
    );
};

export default ReserverVol;
