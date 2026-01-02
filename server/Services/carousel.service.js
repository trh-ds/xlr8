import db from "../config/db.js";

export const createCarousel = async (data) => {
    const sql = `
    INSERT INTO carousel
    (title, description, product_link, mobile_image, desktop_image)
    VALUES (?, ?, ?, ?, ?)
  `;

    const values = [
        data.title,
        data.description,
        data.productLink,
        data.mobileImage,
        data.desktopImage,
    ];

    const [result] = await db.query(sql, values);
    return result;
};

export const getAllCarousel = async () => {
    const [rows] = await db.query(
        "SELECT * FROM carousel ORDER BY created_at DESC"
    );
    return rows;
};

export const deleteCarousel = async (id) => {
    const [result] = await db.query(
        "DELETE FROM carousel WHERE id = ?",
        [id]
    );
    return result;
};
