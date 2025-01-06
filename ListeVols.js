import React, { useState, useEffect } from 'react';
import { 
    Container, 
    Paper, 
    Typography, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow,
    Button,
    Box,
    IconButton,
    Alert,
    CircularProgress,
    ButtonGroup,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Snackbar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const ListeVols = ({ isClientView = false, isAdminView = false, showReservationButtons = false }) => {
    const [vols, setVols] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [volToDelete, setVolToDelete] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchVols();
    }, []);

    const fetchVols = async () => {
        try {
            const response = await axios.get(`${API_URL}/vols`);
            setVols(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Erreur lors de la récupération des vols:', error);
            setError('Erreur lors de la récupération des vols');
            setLoading(false);
        }
    };

    const handleReserver = (volId) => {
        navigate(`/client/reserver/${volId}`);
    };

    const handleModifier = (volId) => {
        navigate(`/admin/modifier-vol/${volId}`);
    };

    const handleDeleteClick = (vol) => {
        setVolToDelete(vol);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`${API_URL}/vols/${volToDelete._id}`);
            setVols(vols.filter(vol => vol._id !== volToDelete._id));
            setSuccess('Vol supprimé avec succès');
            setDeleteDialogOpen(false);
            setVolToDelete(null);
        } catch (error) {
            console.error('Erreur lors de la suppression du vol:', error);
            setError('Erreur lors de la suppression du vol');
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setVolToDelete(null);
    };

    const handleBack = () => {
        navigate(isClientView ? '/client' : '/admin');
    };

    const handleCloseSnackbar = () => {
        setSuccess('');
        setError('');
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
                    <IconButton onClick={handleBack} sx={{ mr: 2 }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h4">
                        {showReservationButtons ? 'Réserver un Vol' : 'Liste des Vols'}
                    </Typography>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {vols.length === 0 ? (
                    <Alert severity="info">
                        Aucun vol disponible pour le moment.
                    </Alert>
                ) : (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>N° Vol</TableCell>
                                    <TableCell>Compagnie</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Départ</TableCell>
                                    <TableCell>Destination</TableCell>
                                    <TableCell>Prix</TableCell>
                                    <TableCell>Places</TableCell>
                                    {(showReservationButtons || isAdminView) && <TableCell>Actions</TableCell>}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {vols.map((vol) => (
                                    <TableRow key={vol._id}>
                                        <TableCell>{vol.numeroVol}</TableCell>
                                        <TableCell>{vol.compagnieAerienne}</TableCell>
                                        <TableCell>
                                            {vol.dateDepart}
                                            <br />
                                            <Typography variant="caption" color="text.secondary">
                                                {vol.heureDepart} - {vol.heureArrivee}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            {vol.depart.ville}
                                            <br />
                                            <Typography variant="caption" color="text.secondary">
                                                {vol.depart.nomAeroport}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            {vol.destination.ville}
                                            <br />
                                            <Typography variant="caption" color="text.secondary">
                                                {vol.destination.nomAeroport}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>{vol.prix} €</TableCell>
                                        <TableCell>
                                            {vol.placesDisponibles}
                                            {vol.placesDisponibles <= 5 && (
                                                <Typography variant="caption" color="error">
                                                    <br />Plus que {vol.placesDisponibles} places !
                                                </Typography>
                                            )}
                                        </TableCell>
                                        {showReservationButtons && (
                                            <TableCell>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => handleReserver(vol._id)}
                                                    disabled={vol.placesDisponibles <= 0}
                                                >
                                                    {vol.placesDisponibles <= 0 ? 'Complet' : 'Réserver'}
                                                </Button>
                                            </TableCell>
                                        )}
                                        {isAdminView && (
                                            <TableCell>
                                                <ButtonGroup variant="outlined" size="small">
                                                    <Button
                                                        onClick={() => handleModifier(vol._id)}
                                                        startIcon={<EditIcon />}
                                                    >
                                                        Modifier
                                                    </Button>
                                                    <Button
                                                        color="error"
                                                        onClick={() => handleDeleteClick(vol)}
                                                        startIcon={<DeleteIcon />}
                                                    >
                                                        Supprimer
                                                    </Button>
                                                </ButtonGroup>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Paper>

            {/* Dialog de confirmation de suppression */}
            <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteCancel}
            >
                <DialogTitle>Confirmer la suppression</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Êtes-vous sûr de vouloir supprimer le vol {volToDelete?.numeroVol} ?
                        Cette action est irréversible.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel}>Annuler</Button>
                    <Button onClick={handleDeleteConfirm} color="error" autoFocus>
                        Supprimer
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar pour les messages de succès et d'erreur */}
            <Snackbar
                open={Boolean(success || error)}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={success ? 'success' : 'error'}
                    sx={{ width: '100%' }}
                >
                    {success || error}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default ListeVols;
