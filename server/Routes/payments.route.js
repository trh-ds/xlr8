import express from "express";
import { createOrder, verifyPayment } from "../Controller/payment.controller.js";
const router = express.Router();

router.post("/create-order", createOrder);
router.post("/verify", verifyPayment);


export default router;