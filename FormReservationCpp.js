import React, { useState } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import axios from 'axios';

const FormReservationCpp = ({ vol, onReservationComplete }) => {
  const [formData, setFormData] = useState({
    // Client
    client: {
      nom: '',
      prenom: '',
      email: '',
      numeroTelephone: ''
    },
    // Billet
    billet: {
      classe: '',
      prix: 0
    },
    // Reservation
    reservation: {
      dateReservation: new Date().toISOString(),
      statut: 'En attente'
    },
    // Vol
    vol: {
      CompagnieAerienne: vol?.CompagnieAerienne || '',
      dateDepart: vol?.dateDepart || '',
      heureDepart: vol?.heureDepart || '',
      heureArrivee: vol?.heureArrivee || '',
      prix: vol?.prix || 0,
      placesDisponible: vol?.placesDisponible || 0
    }
  });

  const handleClientChange = (e) => {
    setFormData(prev => ({
      ...prev,
      client: {
        ...prev.client,
        [e.target.name]: e.target.value
      }
    }));
  };

  const handleBilletChange = (e) => {
    const newClasse = e.target.value;
    const prixBase = vol?.prix || 0;
    let nouveauPrix = prixBase;

    // Calcul du prix selon la classe
    switch(newClasse) {
      case 'Affaires':
        nouveauPrix = prixBase * 2;
        break;
      case 'Premiere':
        nouveauPrix = prixBase * 3;
        break;
      default:
        nouveauPrix = prixBase;
    }

    setFormData(prev => ({
      ...prev,
      billet: {
        classe: newClasse,
        prix: nouveauPrix
      }
    }));
  };

  const confirmerReservation = () => {
    setFormData(prev => ({
      ...prev,
      reservation: {
        ...prev.reservation,
        statut: 'Confirme'
      }
    }));
  };

  const annulerReservation = () => {
    setFormData(prev => ({
      ...prev,
      reservation: {
        ...prev.reservation,
        statut: 'Annule'
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      confirmerReservation();
      
      const response = await axios.post('http://localhost:3000/api/reservations', {
        ...formData,
        volId: vol?._id
      });

      if (onReservationComplete) {
        onReservationComplete(response.data);
      }

      // Réinitialiser le formulaire
      setFormData({
        client: {
          nom: '',
          prenom: '',
          email: '',
          numeroTelephone: ''
        },
        billet: {
          classe: '',
          prix: 0
        },
        reservation: {
          dateReservation: new Date().toISOString(),
          statut: 'En attente'
        },
        vol: {
          CompagnieAerienne: vol?.CompagnieAerienne || '',
          dateDepart: vol?.dateDepart || '',
          heureDepart: vol?.heureDepart || '',
          heureArrivee: vol?.heureArrivee || '',
          prix: vol?.prix || 0,
          placesDisponible: vol?.placesDisponible || 0
        }
      });

    } catch (error) {
      console.error('Erreur lors de la création de la réservation:', error);
      annulerReservation();
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Réserver le vol
        </Typography>
        
        {/* Informations du vol */}
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            Détails du vol
          </Typography>
          <Typography>Compagnie: {formData.vol.CompagnieAerienne}</Typography>
          <Typography>Date de départ: {formData.vol.dateDepart}</Typography>
          <Typography>Heure de départ: {formData.vol.heureDepart}</Typography>
          <Typography>Heure d'arrivée: {formData.vol.heureArrivee}</Typography>
          <Typography>Prix de base: {formData.vol.prix} €</Typography>
          <Typography>Places disponibles: {formData.vol.placesDisponible}</Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          {/* Section Client */}
          <Box mb={3}>
            <Typography variant="h6" gutterBottom>
              Information du client
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Nom"
                  name="nom"
                  value={formData.client.nom}
                  onChange={handleClientChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Prénom"
                  name="prenom"
                  value={formData.client.prenom}
                  onChange={handleClientChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.client.email}
                  onChange={handleClientChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Numéro de téléphone"
                  name="numeroTelephone"
                  value={formData.client.numeroTelephone}
                  onChange={handleClientChange}
                />
              </Grid>
            </Grid>
          </Box>

          {/* Section Billet */}
          <Box mb={3}>
            <Typography variant="h6" gutterBottom>
              Classe et Prix
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Classe</InputLabel>
                  <Select
                    value={formData.billet.classe}
                    onChange={handleBilletChange}
                    label="Classe"
                  >
                    <MenuItem value="Economique">Économique ({vol?.prix} €)</MenuItem>
                    <MenuItem value="Affaires">Affaires ({vol?.prix * 2} €)</MenuItem>
                    <MenuItem value="Premiere">Première ({vol?.prix * 3} €)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Typography>
                  Prix total: {formData.billet.prix} €
                </Typography>
              </Grid>
            </Grid>
          </Box>

          {/* Boutons de soumission */}
          <Box mt={3}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Confirmer la réservation
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  type="button"
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  onClick={annulerReservation}
                >
                  Annuler
                </Button>
              </Grid>
            </Grid>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default FormReservationCpp;
