const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Spot = require('../models/Spot');
const User = require('../models/User');

module.exports = {
    async store(req, res) {
        const { user_id } = req.headers;
        const { spot_id } = req.params;
        const { date } = req.body;

        if (!mongoose.Types.ObjectId.isValid(user_id)) {
            return res.status(400).json({ error: 'Invalid user_id' });
        }

        if (!mongoose.Types.ObjectId.isValid(spot_id)) {
            return res.status(400).json({ error: 'Invalid spot_id' });
        }

        if (typeof date !== 'string' || !date.trim()) {
            return res.status(400).json({ error: 'date is required' });
        }

        const [user, spot] = await Promise.all([
            User.findById(user_id),
            Spot.findById(spot_id),
        ]);

        if (!user) {
            return res.status(400).json({ error: 'User does not exist' });
        }

        if (!spot) {
            return res.status(404).json({ error: 'Spot not found' });
        }

        const booking = await Booking.create({
            user: user_id,
            spot: spot_id,
            date,
        });

        await booking.populate(['spot', 'user']);

        const ownerSocket = req.connectedUsers[booking.spot.user];

        if(ownerSocket) {
            req.io.to(ownerSocket).emit('booking_request', booking);
        }

        return res.json(booking);
    }
}