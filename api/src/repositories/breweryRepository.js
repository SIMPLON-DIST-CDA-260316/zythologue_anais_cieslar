import pool from "../database/client.js";

export async function findBreweryById(id) {
    const result = await pool.query(
        `SELECT * FROM brewery WHERE id = $1`,
        [id]
    );
    return result.rows[0];
}
