const mongoose = require('mongoose');
const Spot = require('../models/Spot')

module.exports = {
    async show(req, res){
        const { user_id } = req.headers;

        if (!mongoose.Types.ObjectId.isValid(user_id)) {
            return res.status(400).json({ error: 'Invalid user_id' });
        }

        const spots = await Spot.find({ user: user_id });

        return res.json(spots);
    }
}