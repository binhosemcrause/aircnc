const multer = require('multer');
const crypto = require('crypto');
const path = require('path');

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/pjpeg', 'image/png', 'image/gif', 'image/webp'];

module.exports = {
    storage: multer.diskStorage({
        destination: path.resolve(__dirname, '..', '..', 'uploads'),
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname).toLowerCase();
            crypto.randomBytes(16, (err, res) => {
                if (err) return cb(err);
                cb(null, `${res.toString('hex')}-${Date.now()}${ext}`);
            });
        }
    }),
    fileFilter: (req, file, cb) => {
        if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
            const err = new Error('Invalid file type. Only image uploads are allowed.');
            err.status = 400;
            return cb(err);
        }
        cb(null, true);
    },
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
};