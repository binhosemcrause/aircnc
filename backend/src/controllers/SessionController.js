const User = require('../models/User');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

module.exports = {
    async store(req, res){
        const { email } = req.body;

        if (typeof email !== 'string' || !EMAIL_REGEX.test(email)) {
            return res.status(400).json({ error: 'Invalid email' });
        }

        let user = await User.findOne({ email });

        if(!user){
            user  = await User.create({ email });
        }

        return res.json(user);
    }
};