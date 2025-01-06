import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Typography, Box, Paper } from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Système de Réservation de Vols
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Choisissez votre mode d'accès
        </Typography>
        
        <Box sx={{ mt: 4, display: 'flex', gap: 4, justifyContent: 'center' }}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              cursor: 'pointer',
              '&:hover': { transform: 'scale(1.02)' },
              transition: 'transform 0.2s'
            }}
            onClick={() => navigate('/admin')}
          >
            <AdminPanelSettingsIcon sx={{ fontSize: 60, color: 'primary.main' }} />
            <Typography variant="h5" sx={{ mt: 2 }}>
              Administrateur
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Gérer les vols et les réservations
            </Typography>
          </Paper>

          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              cursor: 'pointer',
              '&:hover': { transform: 'scale(1.02)' },
              transition: 'transform 0.2s'
            }}
            onClick={() => navigate('/client')}
          >
            <PersonIcon sx={{ fontSize: 60, color: 'primary.main' }} />
            <Typography variant="h5" sx={{ mt: 2 }}>
              Client
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Rechercher et réserver des vols
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default Home;
