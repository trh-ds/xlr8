import { validationResult } from "express-validator";
import { createUser, getUserByEmail, updateLastLogin } from "../Services/user.service.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { username, email, password } = req.body;

        const existingUser = await getUserByEmail(email);
        if (existingUser) return res.status(409).json({ message: "Email already registered" });

        const userId = await createUser(username, email, password);

        res.status(201).json({ message: "User registered successfully", userId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};

export const loginUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // ✅ 7 days expiry
        const accessToken = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        await updateLastLogin(user.id);

        // ✅ HttpOnly cookie
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(200).json({
            message: "Login successful",
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};

