CREATE TABLE brewery (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT
                     );

CREATE TABLE category (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
                      );

CREATE TABLE ingredient (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
                        );

CREATE TABLE app_user (
    id SERIAL PRIMARY KEY,
    last_name VARCHAR(100) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
                      );

CREATE TABLE beer (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    alcohol_deg NUMERIC,
    price NUMERIC,
    brewery_id INTEGER REFERENCES brewery(id) ON DELETE RESTRICT
                  );

CREATE TABLE photo (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL
                   );

CREATE TABLE user_beer_favorite (
    app_user_id INTEGER REFERENCES app_user(id) ON DELETE CASCADE,
    beer_id INTEGER REFERENCES beer(id) ON DELETE CASCADE,
    UNIQUE (app_user_id, beer_id)
                                );

CREATE TABLE user_brewery_favorite (
    app_user_id INTEGER REFERENCES app_user(id) ON DELETE CASCADE,
    brewery_id INTEGER REFERENCES brewery(id) ON DELETE CASCADE,
    UNIQUE (app_user_id, brewery_id)
                                   );

CREATE TABLE user_beer_review (
    id SERIAL PRIMARY KEY,
    comment TEXT,
    rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    app_user_id INTEGER REFERENCES app_user(id) ON DELETE CASCADE,
    beer_id INTEGER REFERENCES beer(id) ON DELETE CASCADE,
    UNIQUE (app_user_id, beer_id)
                              );

CREATE TABLE user_brewery_review (
    id SERIAL PRIMARY KEY,
    comment TEXT,
    rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    app_user_id INTEGER REFERENCES app_user(id) ON DELETE CASCADE,
    brewery_id INTEGER REFERENCES brewery(id) ON DELETE CASCADE,
    UNIQUE (app_user_id, brewery_id)
                                 );

CREATE TABLE beer_ingredient (
    beer_id INTEGER REFERENCES beer(id) ON DELETE CASCADE,
    ingredient_id INTEGER REFERENCES ingredient(id) ON DELETE RESTRICT,
    UNIQUE (beer_id, ingredient_id)
                             );

CREATE TABLE beer_category (
    beer_id INTEGER REFERENCES beer(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES category(id) ON DELETE RESTRICT,
    UNIQUE (beer_id, category_id)
                             );

CREATE TABLE photo_beer (
    photo_id INTEGER REFERENCES photo(id) ON DELETE CASCADE,
    beer_id INTEGER REFERENCES beer(id) ON DELETE CASCADE
                             );

CREATE TABLE photo_brewery (
    photo_id INTEGER REFERENCES photo(id) ON DELETE CASCADE,
    brewery_id INTEGER REFERENCES brewery(id) ON DELETE RESTRICT
                             );


CREATE OR REPLACE FUNCTION delete_orphan_photo()
RETURNS TRIGGER AS $$
BEGIN
DELETE FROM photo WHERE id = OLD.photo_id;
RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_delete_photo_beer
    AFTER DELETE ON photo_beer
    FOR EACH ROW
    EXECUTE FUNCTION delete_orphan_photo();

CREATE TRIGGER trigger_delete_photo_brewery
    AFTER DELETE ON photo_brewery
    FOR EACH ROW
    EXECUTE FUNCTION delete_orphan_photo();
