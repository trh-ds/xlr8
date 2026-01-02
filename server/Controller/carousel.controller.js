import {
    createCarousel,
    getAllCarousel,
    deleteCarousel,
} from "../services/carousel.service.js";

export const addCarousel = async (req, res) => {
    try {
        const { title, description, productLink } = req.body;

        if (!req.files?.mobileImage || !req.files?.desktopImage) {
            return res.status(400).json({ message: "Images required" });
        }

        const mobileImage =
            "/uploads/carousel/" + req.files.mobileImage[0].filename;
        const desktopImage =
            "/uploads/carousel/" + req.files.desktopImage[0].filename;

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
