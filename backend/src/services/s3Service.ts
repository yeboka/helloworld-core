import * as dotenv from "dotenv";
import AWS from "aws-sdk";
import { randomUUID } from "crypto";

dotenv.config();

const { Credentials, S3 } = AWS;

if (!process.env.AWS_REGION || !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
  throw new Error("Missing one or more AWS environment variables: AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY");
}

const s3 = new S3({
  region: process.env.AWS_REGION,
  signatureVersion: "v4",
  credentials: new Credentials({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }),
});

export const getSignedUrl = async (fileName: string, fileType: string) => {
  const bucketName = process.env.AWS_S3_BUCKET_NAME;

  if (!bucketName) {
    throw new Error("AWS_S3_BUCKET_NAME is not defined or empty.");
  }

  const uniqueFileName = `${randomUUID()}-${fileName}`;

  const params = {
    Bucket: bucketName,
    Key: uniqueFileName,
    ContentType: fileType,
    Expires: 180, // URL expires in 180 seconds (3 minutes)
  };

  console.log("Generated uniqueFileName:", uniqueFileName);
  console.log("File type:", fileType);

  try {
    const uploadUrl = await s3.getSignedUrlPromise("putObject", params);

    if (!process.env.AWS_REGION) {
      throw new Error("AWS_REGION is not defined, cannot construct imageUrl.");
    }
    const imageUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueFileName}`;

    return {
      uploadUrl,
      imageUrl,
    };
  } catch (err: any) {
    console.error("Error details:", err);
    throw new Error(`Error while generating signed url: ${err.message}`);
  }
};