import {
    addProduct,
    getProducts,
    deleteProduct,
} from "../Services/product.service.js";

export const createProduct = async (req, res) => {
    try {
        const { title, price, description } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "Product image required" });
        }

        // S3 public URL
        const imagePath = req.file.location;

        const id = await addProduct(
            title,
            price,
            description,
            imagePath
        );

        res.status(201).json({
            message: "Product added",
            productId: id,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const fetchProducts = async (req, res) => {
    try {
        const products = await getProducts();
        res.status(200).json(products);
    } catch {
        res.status(500).json({ message: "Server error" });
    }
};

export const removeProduct = async (req, res) => {
    try {
        const { id } = req.params;
        await deleteProduct(id);
        res.status(200).json({ message: "Product deleted" });
    } catch {
        res.status(500).json({ message: "Server error" });
    }
};
