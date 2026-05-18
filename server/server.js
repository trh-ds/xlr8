import app from "./app.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;
console.log({
    AWS_REGION: process.env.AWS_REGION,
    AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
    HAS_ACCESS_KEY: !!process.env.AWS_ACCESS_KEY_ID,
    HAS_SECRET: !!process.env.AWS_SECRET_ACCESS_KEY,
});
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
