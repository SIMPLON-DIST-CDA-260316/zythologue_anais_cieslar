import pool from "../database/client.js";

export async function findById(id) {
    const result = await pool.query(
        'SELECT * FROM beer WHERE id = $1',
        [id]
    );
    return result.rows[0];
}