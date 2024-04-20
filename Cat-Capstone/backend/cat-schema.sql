CREATE TABLE users (
  username VARCHAR(25) PRIMARY KEY,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL
    CHECK (position('@' IN email) > 1),
  is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE cats (
    id SERIAL PRIMARY KEY,
    name VARCHAR(25),
    username VARCHAR(25) REFERENCES users(username) ON DELETE CASCADE,
    picture_id INT,
    breed TEXT,
    age INT,
    outdoor BOOLEAN,
    friendly BOOLEAN
);

CREATE TABLE pictures (
    picture_id SERIAL PRIMARY KEY,
    cat_id INT,
    title VARCHAR(255),
    description TEXT,
    file_name VARCHAR(255), -- Name of the uploaded file
    file_path VARCHAR(255), -- Path to the uploaded file
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE swipes (
  id SERIAL PRIMARY KEY,
  username VARCHAR(25) REFERENCES users(username) ON DELETE CASCADE NOT NULL,
  cat_id INT REFERENCES cats(id) ON DELETE CASCADE NOT NULL,
  liked BOOLEAN NOT NULL
);

-- Add foreign key constraints
ALTER TABLE cats ADD CONSTRAINT fk_picture_id FOREIGN KEY (picture_id) REFERENCES pictures (picture_id) ON DELETE SET NULL;
ALTER TABLE pictures ADD CONSTRAINT fk_cat_id FOREIGN KEY (cat_id) REFERENCES cats(id) ON DELETE CASCADE;