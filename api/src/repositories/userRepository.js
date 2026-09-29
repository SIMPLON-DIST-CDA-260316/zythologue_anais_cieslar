import pool from "../database/client.js";

export async function findUserByEmail(email) {
    const result = await pool.query(
        `SELECT id, email, hashed_password FROM app_user WHERE email = $1`,
        [email]
    );
    return result.rows[0];
}

export async function addUser(user) {
    const result = await pool.query(
        `INSERT INTO app_user (last_name, first_name, email, hashed_password) VALUES ($1, $2, $3, $4) RETURNING last_name, first_name, email, created_at`,
        [user.last_name, user.first_name, user.email, user.password]
    );
    return result.rows[0];
}