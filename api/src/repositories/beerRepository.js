import pool from "../database/client.js";

export async function findAllBeers() {
    const result = await pool.query(
        'SELECT b.id AS beer_id, b.name AS beer_name, b.description,b.alcohol_deg, b.price, brewery.name AS brewery_name, ( SELECT array_agg(i.name) FROM beer_ingredient bi JOIN ingredient i ON i.id = bi.ingredient_id WHERE bi.beer_id = b.id ) AS ingredients, ( SELECT array_agg(c.name) FROM beer_category bc JOIN category c ON c.id = bc.category_id WHERE bc.beer_id = b.id ) AS categories, ( SELECT array_agg(p.url) FROM photo_beer pb JOIN photo p ON p.id = pb.photo_id WHERE pb.beer_id = b.id ) AS photos FROM beer b LEFT JOIN brewery ON b.brewery_id = brewery.id ORDER BY b.id'
    );
    return result.rows;
}

export async function findOneBeer(id) {
    const result = await pool.query(
        `SELECT b.id AS beer_id, b.name AS beer_name, b.description,b.alcohol_deg, b.price, brewery.name AS brewery_name, b.created_by,
             ( SELECT array_agg(i.name) FROM beer_ingredient bi JOIN ingredient i ON i.id = bi.ingredient_id WHERE bi.beer_id = b.id ) AS ingredients,
             ( SELECT array_agg(c.name) FROM beer_category bc JOIN category c ON c.id = bc.category_id WHERE bc.beer_id = b.id ) AS categories,
             ( SELECT array_agg(p.url) FROM photo_beer pb JOIN photo p ON p.id = pb.photo_id WHERE pb.beer_id = b.id ) AS photos
         FROM beer b LEFT JOIN brewery ON b.brewery_id = brewery.id WHERE b.id = $1`, [id]
    );
    return result.rows[0];
}

export async function addBeer(beer, userId) {
    const result = await pool.query(
        `INSERT INTO beer (name, description, alcohol_deg, price, brewery_id, created_by) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [beer.name, beer.description, beer.alcohol_deg, beer.price, beer.brewery_id, userId]
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

export async function deleteBeer(id) {
    const result = await pool.query(
        'DELETE FROM beer WHERE id = $1 RETURNING *',[id]
    )
    return result.rows[0];
}