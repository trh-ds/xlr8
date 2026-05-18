import db from "../config/db.js";

export const createCarousel = async ({
    title,
    description,
    productLink,
    mobileImage,
    desktopImage,
}) => {
    const sql = `
    INSERT INTO carousel
    (title, description, product_link, mobile_image, desktop_image)
    VALUES (?, ?, ?, ?, ?)
  `;

    const values = [
        title,
        description || null,
        productLink || null,
        mobileImage,   // ✅ FULL S3 URL
        desktopImage,  // ✅ FULL S3 URL
    ];

    const [result] = await db.query(sql, values);
    return result.insertId;
};

export const getAllCarousel = async () => {
    const [rows] = await db.query(`
    SELECT 
      id,
      title,
      description,
      product_link,
      mobile_image,
      desktop_image,
      created_at
    FROM carousel
    ORDER BY created_at DESC
  `);

    return rows;
};

export const deleteCarousel = async (id) => {
    const [result] = await db.query(
        "DELETE FROM carousel WHERE id = ?",
        [id]
    );

    return result.affectedRows;
};
