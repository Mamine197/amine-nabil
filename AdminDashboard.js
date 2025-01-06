import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Grid, Paper, Typography, Button, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ListIcon from '@mui/icons-material/List';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const adminActions = [
    {
      title: 'Ajouter un Vol',
      icon: <AddIcon sx={{ fontSize: 40 }} />,
      description: 'Créer un nouveau vol dans le système',
      path: '/admin/ajouter-vol'
    },
    {
      title: 'Liste des Vols',
      icon: <ListIcon sx={{ fontSize: 40 }} />,
      description: 'Voir et gérer tous les vols',
      path: '/admin/liste-vols'
    },
    {
      title: 'Modifier un Vol',
      icon: <EditIcon sx={{ fontSize: 40 }} />,
      description: 'Modifier les détails d\'un vol existant',
      path: '/admin/modifier-vol'
    },
    {
      title: 'Supprimer un Vol',
      icon: <DeleteIcon sx={{ fontSize: 40 }} />,
      description: 'Supprimer un vol du système',
      path: '/admin/supprimer-vol'
    }
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Panneau d'Administration
        </Typography>
        <Button 
          variant="outlined" 
          onClick={() => navigate('/')}
          sx={{ mb: 4 }}
        >
          Retour à l'accueil
        </Button>
        
        <Grid container spacing={3}>
          {adminActions.map((action, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
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

export default AdminDashboard;
