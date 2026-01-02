import pool from "../config/db.js";

export const addProduct = async (title, price, description, imagePath) => {
    const [result] = await pool.query(
        "INSERT INTO products (title, price, description, image) VALUES (?, ?, ?, ?)",
        [title, price, description, imagePath]
    );
    return result.insertId;
};

export const getProducts = async () => {
    const [rows] = await pool.query("SELECT * FROM products ORDER BY id DESC");
    return rows;
};

export const deleteProduct = async (id) => {
    const [result] = await pool.query("DELETE FROM products WHERE id = ?", [id]);
    return result;
};

