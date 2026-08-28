import pool from "../database/client.js";

export async function addPhotoToBeer(beerId, url) {
    const photoResult = await pool.query(
        `INSERT INTO photo (url) VALUES ($1) RETURNING *`,
        [url]
    );
    const photo = photoResult.rows[0];

    await pool.query(
        `INSERT INTO photo_beer (photo_id, beer_id) VALUES ($1, $2)`,
        [photo.id, beerId]
    );

    return photo;
}
