CREATE TABLE users (
    username TEXT PRIMARY KEY NOT NULL COLLATE NOCASE,
    created_at INTEGER NOT NULL -- unix ts
) STRICT;

CREATE TABLE recipes (
    id INTEGER PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    description TEXT NULL,
    image_url TEXT NULL,

    servings INTEGER NULL,
    work_time INTEGER NULL, -- minutes
    wait_time INTEGER NULL, -- minutes

    author TEXT NOT NULL COLLATE NOCASE,
    created_at INTEGER NOT NULL -- unix ts
) STRICT;

CREATE TABLE ingredients (
    id INTEGER PRIMARY KEY NOT NULL,
    name TEXT NOT NULL COLLATE NOCASE,
    description TEXT NULL,

    author TEXT NOT NULL COLLATE NOCASE,
    created_at INTEGER NOT NULL -- unix ts
) STRICT;

CREATE TABLE recipe_ingredient_associations (
    id INTEGER PRIMARY KEY NOT NULL,
    ingredient_id INTEGER NOT NULL, -- ingredient is a part of:
    recipe_id INTEGER NOT NULL, -- this album
    idx INTEGER NOT NULL, -- position in the recipe
    amount INTEGER NULL,
    amount_unit TEXT NULL,

    UNIQUE(ingredient_id, recipe_id, idx),

    CONSTRAINT fk_ingredient_id_assoc
        FOREIGN KEY (ingredient_id)
        REFERENCES ingredients (id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_recipe_id_assoc
        FOREIGN KEY (recipe_id)
        REFERENCES recipes (id)
        ON DELETE CASCADE
) STRICT;

CREATE TABLE steps (
    id INTEGER PRIMARY KEY NOT NULL,
    recipe_id INTEGER NOT NULL,
    idx INTEGER NOT NULL, -- position in the recipe
    instruction TEXT NOT NULL,

    UNIQUE(recipe_id, idx),

    CONSTRAINT fk_recipe_id_assoc
        FOREIGN KEY (recipe_id)
        REFERENCES recipes (id)
        ON DELETE CASCADE
) STRICT;

CREATE TABLE tags (
    id INTEGER PRIMARY KEY NOT NULL,
    name TEXT NOT NULL UNIQUE COLLATE NOCASE,
    description TEXT,

    author TEXT NOT NULL COLLATE NOCASE,
    created_at INTEGER NOT NULL, -- unix ts

    CONSTRAINT fk_author_assoc
        FOREIGN KEY (author)
        REFERENCES users (username)
) STRICT;

CREATE TABLE recipe_tag_associations (
    id INTEGER PRIMARY KEY NOT NULL,
    recipe_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,

    UNIQUE(recipe_id, tag_id),

    CONSTRAINT fk_recipe_id_assoc
        FOREIGN KEY (recipe_id)
        REFERENCES recipes (id)
        ON DELETE CASCADE,

    CONSTRAINT fk_tag_id_assoc
        FOREIGN KEY (tag_id)
        REFERENCES tags (id)
        ON DELETE CASCADE
) STRICT;

CREATE TABLE reviews (
    id INTEGER PRIMARY KEY NOT NULL,
    recipe_id INTEGER NOT NULL,

    text TEXT NOT NULL,

    author TEXT NOT NULL COLLATE NOCASE,
    created_at INTEGER NOT NULL, -- unix ts

    CONSTRAINT fk_recipe_id_assoc
        FOREIGN KEY (recipe_id)
        REFERENCES recipes (id)
        ON DELETE CASCADE,

    CONSTRAINT fk_author_assoc
        FOREIGN KEY (author)
        REFERENCES users (username)
        ON DELETE CASCADE
) STRICT;
