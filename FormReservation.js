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
import { createReservation } from '../services/reservationService';

const FormReservation = ({ vol, onReservationComplete }) => {
  const [formData, setFormData] = useState({
    client: {
      nom: '',
      prenom: '',
      email: '',
      telephone: ''
    },
    classe: 'economique'
  });

  const handleChange = (e, section) => {
    if (section) {
      setFormData(prev => ({
        ...prev,
        client: {
          ...prev.client,
          [e.target.name]: e.target.value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [e.target.name]: e.target.value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const reservationData = {
        volId: vol._id,
        client: formData.client,
        classe: formData.classe
      };

      console.log('Envoi de la réservation:', reservationData);
      const response = await createReservation(reservationData);
      console.log('Réservation créée:', response.data);

      // Réinitialiser le formulaire
      setFormData({
        client: {
          nom: '',
          prenom: '',
          email: '',
          telephone: ''
        },
        classe: 'economique'
      });

      // Notifier le composant parent
      if (onReservationComplete) {
        onReservationComplete(response.data);
      }
    } catch (error) {
      console.error('Erreur lors de la création de la réservation:', error);
      alert(error.response?.data?.error || 'Erreur lors de la création de la réservation');
    }
  };

  const calculatePrice = () => {
    let basePrice = vol.prix;
    switch (formData.classe) {
      case 'affaires':
        return basePrice * 2;
      case 'premiere':
        return basePrice * 3;
      default:
        return basePrice;
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Réserver le vol {vol.numeroVol}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {vol.compagnieAerienne} - {vol.dateDepart} - {vol.heureDepart}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          De {vol.depart.ville} à {vol.destination.ville}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Nom"
                name="nom"
                value={formData.client.nom}
                onChange={(e) => handleChange(e, 'client')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Prénom"
                name="prenom"
                value={formData.client.prenom}
                onChange={(e) => handleChange(e, 'client')}
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
                onChange={(e) => handleChange(e, 'client')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Téléphone"
                name="telephone"
                value={formData.client.telephone}
                onChange={(e) => handleChange(e, 'client')}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Classe</InputLabel>
                <Select
                  name="classe"
                  value={formData.classe}
                  onChange={(e) => handleChange(e)}
                  label="Classe"
                >
                  <MenuItem value="economique">Économique ({vol.prix} €)</MenuItem>
                  <MenuItem value="affaires">Affaires ({vol.prix * 2} €)</MenuItem>
                  <MenuItem value="premiere">Première ({vol.prix * 3} €)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Prix total: {calculatePrice()} €
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
              >
                Réserver
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default FormReservation;
