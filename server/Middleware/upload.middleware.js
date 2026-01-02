import multer from "multer";
import path from "path";
import crypto from "crypto";

const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const unique = crypto.randomBytes(6).toString("hex");
        cb(null, `${Date.now()}-${unique}${ext}`);
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only images allowed"), false);
};

export default multer({ storage, fileFilter });
