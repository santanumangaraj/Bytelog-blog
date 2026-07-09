import dotenv from "dotenv";
import path from "path"
dotenv.config({
    path: path.resolve(process.cwd(),"../.env"),
});
import { S3Client } from "@aws-sdk/client-s3"

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials:{
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SCERET_ACCESS_KEY
    }
})

export default s3;