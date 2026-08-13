const mongoose = require('mongoose');
const Spot = require('../models/Spot')
const User = require('../models/User')

module.exports = {
    async index(req, res){
        const { tech } = req.query;

        const query = typeof tech === 'string' && tech.length
            ? { techs: tech }
            : {};

        const spots = await Spot.find(query);

        return res.json(spots);

    },

    async store(req, res){
        if (!req.file) {
            return res.status(400).json({ error: 'Thumbnail is required' });
        }

        const { filename } = req.file;
        const { company, techs, price } = req.body;
        const { user_id } = req.headers;

        if (!mongoose.Types.ObjectId.isValid(user_id)) {
            return res.status(400).json({ error: 'Invalid user_id' });
        }

        if (typeof company !== 'string' || !company.trim()) {
            return res.status(400).json({ error: 'company is required' });
        }

        if (typeof techs !== 'string' || !techs.trim()) {
            return res.status(400).json({ error: 'techs is required' });
        }

        if (price !== undefined && price !== '' && Number.isNaN(Number(price))) {
            return res.status(400).json({ error: 'price must be a number' });
        }

        const user = await User.findById(user_id);

        if(!user){
            return res.status(400).json({ error: 'User does not exists' });
        }

        const spot = await Spot.create({
            user: user_id,
            thumbnail: filename,
            company,
            techs: techs.split(',').map(tech => tech.trim()).filter(Boolean),
            price: price ? Number(price) : undefined,
        })

        return res.json(spot);
    }
}