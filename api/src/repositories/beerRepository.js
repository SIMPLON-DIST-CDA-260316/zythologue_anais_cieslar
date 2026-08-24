import pool from "../database/client.js";

export async function getById(id) {
    const result = await pool.query(
        'SELECT * FROM beer WHERE id = $1',
        [id]
    );
    return result.rows[0];
}

export async function addBeer(beer) {
    const result = await pool.query(
        `INSERT INTO beer (name, description, alcohol_deg, price, brewery_id) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [beer.name, beer.description, beer.alcohol_deg, beer.price, beer.brewery_id]
    );
    return result.rows[0];
}

export async function updateBeer(id, beer) {
    const result = await pool.query(
        `UPDATE beer SET name = COALESCE($1, name), description = COALESCE($2, description), alcohol_deg = COALESCE($3, alcohol_deg), price = COALESCE($4, price), brewery_id = COALESCE($5, brewery_id) WHERE id = $6 RETURNING *`,
        [beer.name, beer.description, beer.alcohol_deg, beer.price, beer.brewery_id, id]
    );
    return result.rows[0];
}