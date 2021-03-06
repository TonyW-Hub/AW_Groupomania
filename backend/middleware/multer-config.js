const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/.gif': 'gif'
};
// Delimit files size
const maxSize = 1 * 20000 * 20000;

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },

    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    },
    limits: { fileSize: maxSize }
});

module.exports = multer({ storage: storage }).single('image');