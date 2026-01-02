import express from "express";
import {
    addCarousel,
    getCarousel,
    removeCarousel,
} from "../Controller/carousel.controller.js";

import { uploadCarousel } from "../Middleware/uploadCarousel.js";

const router = express.Router();

router.get("/", getCarousel);

router.post(
    "/admin",
    uploadCarousel.fields([
        { name: "mobileImage", maxCount: 1 },
        { name: "desktopImage", maxCount: 1 },
    ]),
    addCarousel
);

router.delete("/admin/:id", removeCarousel);

export default router;
