const Reservation = require('../models/reservation.model');
const Vol = require('../models/vol.model');

class ReservationService {
    async createReservation(reservationData) {
        try {
            // Vérifier si le vol existe et a des places disponibles
            const vol = await Vol.findById(reservationData.volId);
            if (!vol) {
                throw new Error('Vol non trouvé');
            }

            if (vol.placesDisponibles <= 0) {
                throw new Error('Plus de places disponibles pour ce vol');
            }

            // Créer la réservation
            const reservation = new Reservation({
                volId: reservationData.volId,
                client: reservationData.client,
                classe: reservationData.classe,
                statut: reservationData.statut
            });

            // Sauvegarder la réservation
            const savedReservation = await reservation.save();

            // Mettre à jour le nombre de places disponibles
            vol.placesDisponibles -= 1;
            await vol.save();

            return {
                success: true,
                reservation: savedReservation
            };
        } catch (error) {
            console.error('Erreur lors de la création de la réservation:', error);
            throw error;
        }
    }

    async getReservationsByClient(email) {
        try {
            return await Reservation.find({ 'client.email': email })
                .populate('volId')
                .sort({ dateReservation: -1 });
        } catch (error) {
            console.error('Erreur lors de la récupération des réservations:', error);
            throw error;
        }
    }

    async updateReservationStatus(reservationId, newStatus) {
        try {
            const reservation = await Reservation.findById(reservationId);
            if (!reservation) {
                throw new Error('Réservation non trouvée');
            }

            if (newStatus === 'Annulé' && reservation.statut !== 'Annulé') {
                // Si on annule la réservation, on réincrémente le nombre de places disponibles
                const vol = await Vol.findById(reservation.volId);
                if (vol) {
                    vol.placesDisponibles += 1;
                    await vol.save();
                }
            }

            reservation.statut = newStatus;
            return await reservation.save();
        } catch (error) {
            console.error('Erreur lors de la mise à jour du statut:', error);
            throw error;
        }
    }
}

module.exports = new ReservationService();
