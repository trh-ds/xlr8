// controllers/payment.controller.js
import { razorpay } from "../config/razorpay.js";

export const createOrder = async (req, res) => {
    try {
        const { amount } = req.body; // INR from frontend

        const order = await razorpay.orders.create({
            amount: amount * 100, // convert to paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        });

        res.json({ order });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const verifyPayment = (req, res) => {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest("hex");

    if (expectedSignature === razorpay_signature) {
        // ✅ payment verified
        res.json({ success: true });
    } else {
        // ❌ fraud / invalid
        res.status(400).json({ success: false });
    }
};