import multer from "multer";
import multerS3 from "multer-s3";
import s3 from "../config/s3.js";
import fs from "fs";
import path from "path";
import crypto from "crypto";

// Ensure temporary directory exists dynamically
const tempDir = path.resolve("public/temp");
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

const uploadAvatar = multer({
    storage: multerS3({
        s3,
        bucket: process.env.AWS_BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: function(req,file,cb){
            cb(null,{fieldName: file.fieldname});
        },
        key: function(req,file,cb){
            const fileName = `uploads/userAvatars/${Date.now()}-${file.originalname}`;
            cb(null,fileName);
        }
    }),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB limit
    }
});

const blogStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, tempDir);
    },
    filename: function (req, file, cb) {
        // Safe randomized server-side filename, ignore client original path
        const fileExt = path.extname(file.originalname).toLowerCase();
        const uniqueName = `${Date.now()}-${crypto.randomUUID()}${fileExt}`;
        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {
    // Validate MIME type
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(new Error("Only image files (JPEG, PNG, WEBP, GIF) are allowed!"), false);
    }

    // Validate Extension
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
    const fileExt = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.includes(fileExt)) {
        return cb(new Error("Invalid file extension! Only image files are allowed."), false);
    }

    cb(null, true);
};

const uploadBlogImage = multer({
    storage: blogStorage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB limit
    }
});

export {
    uploadAvatar,
    uploadBlogImage
};