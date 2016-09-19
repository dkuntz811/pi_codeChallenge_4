-- Database name: treats


-- Document you create tables pSQL here
CREATE TABLE treats (
id SERIAL PRIMARY KEY,
treat_name VARCHAR (100),
treat_description VARCHAR (300),
treat_image_url VARCHAR NOT NULL
);
