const express = require('express');
const router = express.Router();
const reservationService = require('../services/reservationService');

// Créer une nouvelle réservation
router.post('/', async (req, res) => {
    try {
        const result = await reservationService.createReservation(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Obtenir les réservations d'un client par email
router.get('/client/:email', async (req, res) => {
    try {
        const reservations = await reservationService.getReservationsByClient(req.params.email);
        res.json(reservations);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Mettre à jour le statut d'une réservation
router.put('/:id/status', async (req, res) => {
    try {
        const reservation = await reservationService.updateReservationStatus(
            req.params.id,
            req.body.status
        );
        res.json(reservation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
