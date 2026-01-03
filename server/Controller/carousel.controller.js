import {
    createCarousel,
    getAllCarousel,
    deleteCarousel,
} from "../Services/carousel.service.js";

export const addCarousel = async (req, res) => {
    try {
        const { title, description, productLink } = req.body;

        if (!req.files || !req.files.mobileImage || !req.files.desktopImage) {
            return res.status(400).json({ message: "Images required" });
        }

        // S3 gives you the full public URL here
        const mobileImage = req.files.mobileImage[0].location;
        const desktopImage = req.files.desktopImage[0].location;

        await createCarousel({
            title,
            description,
            productLink,
            mobileImage,
            desktopImage,
        });

        res.json({ message: "Carousel slide added successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getCarousel = async (req, res) => {
    try {
        const data = await getAllCarousel();
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const removeCarousel = async (req, res) => {
    try {
        await deleteCarousel(req.params.id);
        res.json({ message: "Carousel slide deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
