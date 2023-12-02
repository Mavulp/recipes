// @generated automatically by Diesel CLI.

diesel::table! {
    use crate::sqlite_mapping::*;

    ingredients (id) {
        id -> Integer,
        name -> Text,
        description -> Nullable<Text>,
        author -> Text,
        created_at -> Integer,
    }
}

diesel::table! {
    use crate::sqlite_mapping::*;

    recipe_ingredient_associations (id) {
        id -> Integer,
        ingredient_id -> Integer,
        recipe_id -> Integer,
        idx -> Integer,
        amount -> Nullable<Integer>,
        amount_unit -> Nullable<Text>,
    }
}

diesel::table! {
    use crate::sqlite_mapping::*;

    recipe_tag_associations (id) {
        id -> Integer,
        recipe_id -> Integer,
        tag_id -> Integer,
    }
}

diesel::table! {
    use crate::sqlite_mapping::*;

    recipes (id) {
        id -> Integer,
        name -> Text,
        description -> Nullable<Text>,
        image_url -> Nullable<Text>,
        servings -> Nullable<Integer>,
        work_time -> Nullable<Integer>,
        wait_time -> Nullable<Integer>,
        author -> Text,
        created_at -> Integer,
    }
}

diesel::table! {
    use crate::sqlite_mapping::*;

    reviews (id) {
        id -> Integer,
        author -> Text,
        recipe_id -> Integer,
        created_at -> Integer,
        text -> Text,
    }
}

diesel::table! {
    use crate::sqlite_mapping::*;

    steps (id) {
        id -> Integer,
        recipe_id -> Integer,
        idx -> Integer,
        instruction -> Text,
    }
}

diesel::table! {
    use crate::sqlite_mapping::*;

    tags (id) {
        id -> Integer,
        name -> Text,
        description -> Nullable<Text>,
        author -> Text,
        created_at -> Integer,
    }
}

diesel::table! {
    use crate::sqlite_mapping::*;

    users (username) {
        username -> Text,
        created_at -> Integer,
    }
}

diesel::joinable!(recipe_ingredient_associations -> ingredients (ingredient_id));
diesel::joinable!(recipe_ingredient_associations -> recipes (recipe_id));
diesel::joinable!(recipe_tag_associations -> recipes (recipe_id));
diesel::joinable!(recipe_tag_associations -> tags (tag_id));
diesel::joinable!(reviews -> recipes (recipe_id));
diesel::joinable!(reviews -> users (author));
diesel::joinable!(steps -> recipes (recipe_id));
diesel::joinable!(tags -> users (author));

diesel::allow_tables_to_appear_in_same_query!(
    ingredients,
    recipe_ingredient_associations,
    recipe_tag_associations,
    recipes,
    reviews,
    steps,
    tags,
    users,
);
