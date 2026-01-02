import pool from "../config/db.js";
import bcrypt from "bcrypt";

export const createUser = async (username, email, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
        "INSERT INTO users (username, email, password) VALUES (?,?,?)",
        [username, email, hashedPassword]
    );

    return result.insertId;
};

export const getUserByEmail = async (email) => {
    const [rows] = await pool.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
    );

    return rows[0];
};

export const updateLastLogin = async (id) => {
    await pool.query("UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?", [id]);
};
