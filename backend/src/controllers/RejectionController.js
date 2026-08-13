const mongoose = require('mongoose');
const Booking = require('../models/Booking');

module.exports = {
    async store(req, res) {
        const { booking_id } = req.params;
        const { user_id } = req.headers;

        if (!mongoose.Types.ObjectId.isValid(booking_id)) {
            return res.status(400).json({ error: 'Invalid booking_id' });
        }

        if (!mongoose.Types.ObjectId.isValid(user_id)) {
            return res.status(400).json({ error: 'Invalid user_id' });
        }

        const booking = await Booking.findById(booking_id).populate('spot');

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        if (String(booking.spot.user) !== String(user_id)) {
            return res.status(403).json({ error: 'Only the spot owner can reject this booking' });
        }

        booking.approved = false;

        await booking.save();

        const bookingUserSocket = req.connectedUsers[booking.user];

        if(bookingUserSocket) {
            req.io.to(bookingUserSocket).emit('booking_response', booking);
        }

        return res.json(booking);
    }
};