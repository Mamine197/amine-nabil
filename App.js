import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Home from './components/Home';
import AdminDashboard from './components/AdminDashboard';
import ClientDashboard from './components/ClientDashboard';
import ListeVols from './components/ListeVols';
import AjouterVol from './components/AjouterVol';
import ReserverVol from './components/ReserverVol';
import MesReservations from './components/MesReservations';
import ModifierVol from './components/ModifierVol';
import './styles/App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Routes>
            {/* Page d'accueil */}
            <Route path="/" element={<Home />} />
            
            {/* Routes Admin */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/ajouter-vol" element={<AjouterVol />} />
            <Route path="/admin/liste-vols" element={<ListeVols isAdminView={true} />} />
            <Route path="/admin/modifier-vol" element={<Navigate to="/admin/liste-vols" replace />} />
            <Route path="/admin/modifier-vol/:volId" element={<ModifierVol />} />
            <Route path="/admin/supprimer-vol" element={<Navigate to="/admin/liste-vols" replace />} />
            
            {/* Routes Client */}
            <Route path="/client" element={<ClientDashboard />} />
            <Route path="/client/rechercher" element={<ListeVols isClientView={true} />} />
            <Route path="/client/reserver" element={<ListeVols isClientView={true} showReservationButtons={true} />} />
            <Route path="/client/reserver/:volId" element={<ReserverVol />} />
            <Route path="/client/mes-reservations" element={<MesReservations />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
