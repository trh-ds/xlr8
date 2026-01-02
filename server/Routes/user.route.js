import express from "express";
import { registerUser, loginUser } from "../Controller/user.controller.js";
import { registerValidation, loginValidation } from "../Middleware/validateUser.js";
import adminAuth from "../Middleware/admin.middleware.js";
const router = express.Router();

router.post("/register", registerValidation, registerUser);
router.post("/login", loginValidation, loginUser);

router.get("/admin-only", adminAuth, (req, res) => {
    res.json({ message: "Welcome Admin!" });
});

router.post("/logout", (req, res) => {
    res.clearCookie("accessToken");
    res.status(200).json({ message: "Logged out successfully" });
});

export default router;
