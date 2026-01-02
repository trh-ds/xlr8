import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/carousel");
    },
    filename: (req, file, cb) => {
        const unique =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(
            null,
            unique + path.extname(file.originalname)
        );
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only images allowed"), false);
    }
};

export const uploadCarouselImages = multer({
    storage,
    fileFilter,
}).fields([
    { name: "mobileImage", maxCount: 1 },
    { name: "desktopImage", maxCount: 1 },
]);
