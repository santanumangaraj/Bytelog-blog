import "dotenv/config";
import { S3Client } from "@aws-sdk/client-s3";

const awsRegion = process.env.AWS_REGION;
const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID;
const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || process.env.AWS_SCERET_ACCESS_KEY;
const awsBucketName = process.env.AWS_BUCKET_NAME;

if (!awsRegion || !awsAccessKeyId || !awsSecretAccessKey || !awsBucketName) {
    throw new Error("Missing required AWS environment variables: AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY/AWS_SCERET_ACCESS_KEY, and AWS_BUCKET_NAME");
}

const s3 = new S3Client({
    region: awsRegion,
    credentials: {
        accessKeyId: awsAccessKeyId,
        secretAccessKey: awsSecretAccessKey,
    },
});

export default s3;