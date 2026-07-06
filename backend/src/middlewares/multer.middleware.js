import multer from "multer";
import multerS3 from "multer-s3";
import s3 from "../config/s3.js";

const upload = multer({
    storage: multerS3({
        s3,
        bucket: process.env.AWS_BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: function(req,file,cb){
            cb(null,{fieldName: file.fieldname});
        },
        key: function(req,file,cb){
            const fileName = `uploads/${Date.now()}-${file.originalname}`
            cb(null,fileName)
        }
    })
})


export default upload