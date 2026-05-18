import {
    createCarousel,
    getAllCarousel,
    deleteCarousel,
} from "../Services/carousel.service.js";

export const addCarousel = async (req, res) => {
    try {
        const { title, description, productLink } = req.body;

        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }

        if (
            !req.files ||
            !req.files.mobileImage ||
            !req.files.desktopImage
        ) {
            return res.status(400).json({
                message: "Both mobile and desktop images are required",
            });
        }

        // ✅ multer-s3 gives FULL S3 URLs here
        const mobileImage = req.files.mobileImage[0].location;
        const desktopImage = req.files.desktopImage[0].location;

        if (!mobileImage || !desktopImage) {
            return res.status(500).json({
                message: "Image upload failed",
            });
        }

        const id = await createCarousel({
            title,
            description,
            productLink,
            mobileImage,
            desktopImage,
        });

        res.status(201).json({
            message: "Carousel slide added successfully",
            id,
        });
    } catch (err) {
        console.error("Add carousel error:", err);
        res.status(500).json({
            message: "Failed to add carousel slide",
        });
    }
};

export const getCarousel = async (req, res) => {
    try {
        const data = await getAllCarousel();
        res.status(200).json(data);
    } catch (err) {
        console.error("Get carousel error:", err);
        res.status(500).json({
            message: "Failed to fetch carousel",
        });
    }
};

export const removeCarousel = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await deleteCarousel(id);

        if (!deleted) {
            return res.status(404).json({
                message: "Carousel slide not found",
            });
        }

        res.json({ message: "Carousel slide deleted" });
    } catch (err) {
        console.error("Delete carousel error:", err);
        res.status(500).json({
            message: "Failed to delete carousel slide",
        });
    }
};
    