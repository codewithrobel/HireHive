import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure uploads folder exists
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage engine - using MemoryStorage to convert to Base64
const storage = multer.memoryStorage();

function checkFileType(file, cb) {
    if (file.fieldname === 'profilePicture' || file.fieldname === 'companyLogo') {
        const filetypes = /jpeg|jpg|png|webp/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error(`Images only for ${file.fieldname} (JPEG, JPG, PNG, WEBP)!`));
        }
    } else {
        const filetypes = /pdf|doc|docx/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (extname) {
            return cb(null, true);
        } else {
            cb(new Error('Resumes only (PDF, DOC, DOCX)!'));
        }
    }
}

const upload = multer({
    storage,
    limits: { fileSize: 3000000 }, // 3MB limit for base64 storage in MongoDB
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

export default upload;
