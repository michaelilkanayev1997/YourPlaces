const multer = require("multer");
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const sharp = require("sharp");
const uuid = require("uuid").v1;

const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.S3_ACCESS_KEY;
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;

const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
  region: bucketRegion,
});

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.memoryStorage();

const uploadFile = multer({ storage: storage });

async function uploadImageToS3(fileBuffer, mimeType, isProfile = true) {
  const ext = MIME_TYPE_MAP[mimeType];
  const isValid = !!ext; //Convert undefind or null to false || valid file type to true

  if (!isValid) {
    throw new Error("Invalid mime type!");
  }

  // Resize and optimize the image using sharp
  const resizedImageBuffer = await sharp(fileBuffer)
    .resize({
      width: isProfile ? 80 : 600,
      height: isProfile ? 80 : 511,
    })
    .toBuffer();

  const imageKey = uuid() + "." + ext;
  const params = {
    Bucket: bucketName,
    Key: imageKey,
    Body: resizedImageBuffer,
    ContentType: mimeType,
  };

  try {
    const command = new PutObjectCommand(params);
    await s3.send(command);
    return imageKey; // Return the S3 key for the uploaded image
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw new Error("Error uploading file to S3");
  }
}

async function generateS3ImageUrl(user) {
  const getObjectParams = {
    Bucket: bucketName,
    Key: user.image,
  };

  const command = new GetObjectCommand(getObjectParams);
  const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

  return url;
}

async function deleteS3Image(image) {
  const getObjectParams = {
    Bucket: bucketName,
    Key: image,
  };

  const command = new DeleteObjectCommand(getObjectParams);
  await s3.send(command);
}

exports.deleteS3Image = deleteS3Image;
exports.generateS3ImageUrl = generateS3ImageUrl;
exports.uploadImageToS3 = uploadImageToS3;
exports.uploadFile = uploadFile;
