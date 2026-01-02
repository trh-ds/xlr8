import express from "express";
import dotenv from "dotenv";
import userRoutes from "./Routes/user.route.js";
import productRoutes from "./Routes/product.route.js";
import cookieParser from "cookie-parser";
import carouselRoutes from "./Routes/carousel.routes.js";
import paymentRoutes from "./Routes/payments.route.js";
import cors from "cors";
dotenv.config();

const app = express();

app.use(
    cors({
        origin: "http://localhost:8080", // 👈 your frontend URL
        credentials: true,
    })
);
app.use(express.json());

app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api", carouselRoutes);
app.use("/api/payment", paymentRoutes);
app.get("/", (req, res) => {
    res.send("🔥 Server is running and ready");
});

export default app;
