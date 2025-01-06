import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Grid, Paper, Typography, Button, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import HistoryIcon from '@mui/icons-material/History';

const ClientDashboard = () => {
  const navigate = useNavigate();

  const clientActions = [
    {
      title: 'Rechercher un Vol',
      icon: <SearchIcon sx={{ fontSize: 40 }} />,
      description: 'Rechercher parmi les vols disponibles',
      path: '/client/rechercher'
    },
    {
      title: 'Réserver un Vol',
      icon: <BookOnlineIcon sx={{ fontSize: 40 }} />,
      description: 'Effectuer une nouvelle réservation',
      path: '/client/reserver'
    },
    {
      title: 'Mes Réservations',
      icon: <HistoryIcon sx={{ fontSize: 40 }} />,
      description: 'Voir l\'historique de mes réservations',
      path: '/client/mes-reservations'
    }
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Espace Client
        </Typography>
        <Button 
          variant="outlined" 
          onClick={() => navigate('/')}
          sx={{ mb: 4 }}
        >
          Retour à l'accueil
        </Button>
        
        <Grid container spacing={3}>
          {clientActions.map((action, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                    transform: 'translateY(-4px)'
                  },
                  transition: 'all 0.3s'
                }}
                onClick={() => navigate(action.path)}
              >
                {action.icon}
                <Typography variant="h6" component="h2" sx={{ mt: 2 }}>
                  {action.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                  {action.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default ClientDashboard;
