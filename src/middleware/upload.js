const path = require('path');
const fs = require('fs');
const multer = require('multer');
const {BadRequestError} = require('../errors');

const storage = multer.diskStorage({
    destination: function(req, files, cb){
        const uploadDir = path.join(__dirname, '..', '..', 'public', 'images', 'uploads');
        
        if(!fs.existsSync(uploadDir)){
            fs.mkdirSync(uploadDir, {recursive: true});
        }
        cb(null, uploadDir);
    },
    filename: function(req, file, cb){
        const ext = path.extname(file.originalname);
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueName + ext);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|avif|jfif/;
    const ext = path.extname(file.originalname).toLowerCase();
    const mimeType = allowedTypes.test(file.mimetype);
    const extName = allowedTypes.test(ext);

    if(mimeType && extName){
        cb(null, true);
    }
    else{
        cb(new BadRequestError('Only image files are allowed.'));
    }
};

const upload = multer({
    storage,
    limits: {fileSize: 5 * 1024 * 1024},
    fileFilter
});

module.exports = upload;