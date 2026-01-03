import multer from "multer";
import multerS3 from "multer-s3";
import path from "path";
import crypto from "crypto";
import { S3Client } from "@aws-sdk/client-s3";

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only images allowed"), false);
    }
};

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_S3_BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: "public-read", // remove if you want private files
        key: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            const unique = crypto.randomBytes(6).toString("hex");
            const fileName = `${Date.now()}-${unique}${ext}`;

            cb(null, `uploads/${fileName}`);
        },
    }),
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
});

export default upload;
