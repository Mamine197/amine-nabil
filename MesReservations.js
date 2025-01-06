import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress,
  IconButton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';

const API_URL = 'http://localhost:3000';

const MesReservations = () => {
  const [email, setEmail] = useState('');
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const fetchReservations = async (e) => {
    e?.preventDefault();
    if (!email) return;

    setLoading(true);
    setError('');
    setSubmitted(true);

    try {
      const response = await axios.get(`${API_URL}/api/reservations/client/${email}`);
      setReservations(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des réservations:', error);
      setError('Erreur lors de la récupération des réservations. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const getClasseLabel = (classe) => {
    switch (classe) {
      case 'economique':
        return 'Économique';
      case 'affaires':
        return 'Affaires';
      case 'premiere':
        return 'Première';
      default:
        return classe;
    }
  };

  const getStatusLabel = (statut) => {
    switch (statut) {
      case 'confirmee':
        return 'Confirmée';
      case 'en_attente':
        return 'En attente';
      case 'annulee':
        return 'Annulée';
      default:
        return statut;
    }
  };

  const getStatusColor = (statut) => {
    switch (statut) {
      case 'confirmee':
        return 'success.main';
      case 'en_attente':
        return 'warning.main';
      case 'annulee':
        return 'error.main';
      default:
        return 'text.primary';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <IconButton 
            onClick={() => navigate('/client')} 
            sx={{ mr: 2 }}
            aria-label="retour"
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4">
            Mes Réservations
          </Typography>
        </Box>

        <Box component="form" onSubmit={fetchReservations} sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{ flexGrow: 1 }}
              placeholder="Entrez votre email pour voir vos réservations"
            />
            <Button
              variant="contained"
              type="submit"
              disabled={loading}
              sx={{ height: 56 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Rechercher'}
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {submitted && !loading && reservations.length === 0 ? (
          <Alert severity="info">
            Aucune réservation trouvée pour cet email.
          </Alert>
        ) : (
          reservations.length > 0 && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>N° Réservation</TableCell>
                    <TableCell>Vol</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Départ</TableCell>
                    <TableCell>Destination</TableCell>
                    <TableCell>Classe</TableCell>
                    <TableCell>Prix</TableCell>
                    <TableCell>Statut</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reservations.map((reservation) => (
                    <TableRow key={reservation._id}>
                      <TableCell>{reservation.numeroReservation}</TableCell>
                      <TableCell>
                        {reservation.vol?.numeroVol || 'N/A'}
                        <br />
                        <Typography variant="caption" color="text.secondary">
                          {reservation.vol?.compagnieAerienne || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>{reservation.vol?.dateDepart || 'N/A'}</TableCell>
                      <TableCell>
                        {reservation.vol?.depart?.ville || 'N/A'}
                        <br />
                        <Typography variant="caption" color="text.secondary">
                          {reservation.vol?.depart?.nomAeroport || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {reservation.vol?.destination?.ville || 'N/A'}
                        <br />
                        <Typography variant="caption" color="text.secondary">
                          {reservation.vol?.destination?.nomAeroport || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>{getClasseLabel(reservation.classe)}</TableCell>
                      <TableCell>{reservation.prix} €</TableCell>
                      <TableCell>
                        <Typography color={getStatusColor(reservation.statut)}>
                          {getStatusLabel(reservation.statut)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )
        )}
      </Paper>
    </Container>
  );
};

export default MesReservations;
