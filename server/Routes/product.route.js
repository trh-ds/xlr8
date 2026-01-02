import express from "express";
import upload from "../Middleware/upload.middleware.js";
import adminAuth from "../Middleware/admin.middleware.js";
import { createProduct, fetchProducts, removeProduct } from "../Controller/product.controller.js";

const router = express.Router();

router.post("/add", adminAuth, upload.single("image"), createProduct);
router.get("/", fetchProducts);
router.delete("/:id", adminAuth, removeProduct);


export default router;
