use crate::ingredient::Ingredient;
use crate::util::unix_timestamp;
use anyhow::Context;
use axum::extract::rejection::JsonRejection;
use axum::extract::Path;
use axum::{Extension, Json};
use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use tracing::debug;
use ts_rs::TS;
use utoipa::ToSchema;

use crate::error::Error;
use crate::schema::{recipes, steps};
use crate::SqlitePool;

#[derive(Debug, Serialize, TS, ToSchema, Queryable)]
#[ts(export, export_to = "../frontend/src/")]
pub struct Recipe {
    #[schema(example = 1)]
    pub id: i64,

    #[schema(example = "Tomato Soup")]
    pub name: String,

    #[schema(example = "A tasty soup made from tomatoes. Duh!")]
    pub description: Option<String>,

    #[schema(example = "https://www.example.com/soup.png")]
    pub image_url: Option<String>,

    #[schema(example = 5)]
    pub servings: Option<i64>,

    #[schema(example = 10)]
    pub work_time: Option<i64>,

    #[schema(example = 30)]
    pub wait_needed: Option<i64>,

    #[schema(example = "Alice")]
    pub author: String,

    #[schema(example = 1691830000)]
    pub created_at: i64,
}

/// Get a list of all recipes
#[utoipa::path(
    get,
    path = "/api/recipe",
    responses(
        (status = 200, description = "Recipes are returned", body = [Recipe]),
    )
)]
// Return all recipes
pub async fn get_all(Extension(pool): Extension<SqlitePool>) -> Result<Json<Vec<Recipe>>, Error> {
    let mut conn = pool.get().await.expect("can connect to sqlite");
    debug!("Loading all recipes");
    let recipes = recipes::dsl::recipes
        .load(&mut *conn)
        .context("Failed to load recipes")?;

    debug!(count = recipes.len(), "Returning recipes");
    Ok(Json(recipes))
}

/// Get a recipe by its id
#[utoipa::path(
    get,
    path = "/api/recipe/{id}",
    responses(
        (status = 200, description = "Recipe data is returned", body = Recipe),
        (status = 404, description = "Recipe does not exist"),
    ),
    params(
        ("id" = i64, Path, description = "Identifier of the recipe"),
    )
)]

// Return recipe by its id
pub async fn get_by_id(
    Path(id): Path<i64>,
    Extension(pool): Extension<SqlitePool>,
) -> Result<Json<Recipe>, Error> {
    let mut conn = pool.get().await.expect("can connect to sqlite");
    debug!(id, "Loading recipe with id");

    let recipe = recipes::dsl::recipes
        .filter(recipes::dsl::id.eq(id))
        .first::<Recipe>(&mut *conn)
        .optional()
        .context("Failed to query recipe")?
        .ok_or(Error::NotFound)?;

    debug!(?recipe, "Found Recipe");
    Ok(Json(recipe))
}

// Post recipe
#[derive(Debug, Deserialize, TS, ToSchema, Insertable)]
#[ts(export, export_to = "../frontend/src/")]
#[diesel(table_name = recipes)]
pub struct PostRecipe {
    #[schema(example = "Tomato Soup")]
    pub name: String,

    #[schema(example = "A tasty soup made from tomatoes. Duh!")]
    pub description: Option<String>,

    #[schema(example = "https://www.example.com/soup.png")]
    pub image_url: Option<String>,

    #[schema(example = 5)]
    pub servings: Option<i64>,

    #[schema(example = 30)]
    pub time_needed: Option<i64>,

    #[ts(skip)]
    #[serde(skip, default = "unix_timestamp")]
    pub created_at: i64,
}

/// Post an recipe
#[utoipa::path(
    post,
    path = "/api/recipe",
    responses(
        (status = 200, description = "Posted an recipe", body = [PostRecipe]),
    )
)]

pub async fn post(
    Extension(pool): Extension<SqlitePool>,
    req: Result<Json<PostRecipe>, JsonRejection>,
) -> Result<Json<Recipe>, Error> {
    let Json(req) = req?;
    let mut conn = pool.get().await.expect("can connect to sqlite");

    // Insert into db
    let recipe = diesel::insert_into(recipes::table)
        .values(&req)
        .get_result(&mut *conn)
        .context("Failed to insert recipe")?;

    debug!("Inserted recipe successfully");

    Ok(Json(recipe))
}

// Delete recipe
#[utoipa::path(
    delete,
    path = "/api/recipe",
    responses(
        (status = 200, description = "Deleted an recipe"),
    )
)]

pub async fn delete_by_id(
    Path(id): Path<i64>,
    Extension(pool): Extension<SqlitePool>,
) -> Result<(), Error> {
    let mut conn = pool.get().await.expect("can connect to sqlite");
    diesel::delete(recipes::dsl::recipes.filter(recipes::dsl::id.eq(id)))
        .execute(&mut *conn)
        .context("Failed to delete a recipe")?;

    Ok(())
}

// Put recipe
#[derive(Debug, Deserialize, TS, ToSchema, AsChangeset)]
#[ts(export, export_to = "../frontend/src/")]
#[diesel(table_name = recipes)]
pub struct PutRecipe {
    #[schema(example = "Tomato Soup")]
    pub name: Option<String>,

    #[schema(example = "A tasty soup made from tomatoes. Duh!")]
    pub description: Option<String>,

    #[schema(example = "https://www.example.com/soup.png")]
    pub image_url: Option<String>,

    #[schema(example = 5)]
    pub servings: Option<i64>,

    #[schema(example = 30)]
    pub time_needed: Option<i64>,
}

#[utoipa::path(
    put,
    path = "/api/recipe/{id}",
    responses(
        (status = 200, description = "Updated an recipe", body = [Recipe]),
    )
)]

pub async fn put(
    Path(id): Path<i64>,
    Extension(pool): Extension<SqlitePool>,
    req: Result<Json<PutRecipe>, JsonRejection>,
) -> Result<Json<Recipe>, Error> {
    let Json(req) = req?;
    let mut conn = pool.get().await.expect("can connect to sqlite");

    let recipe = diesel::update(recipes::dsl::recipes.filter(recipes::dsl::id.eq(id)))
        .set(&req)
        .get_result(&mut *conn)
        .context("Failed to update recipe")?;

    Ok(Json(recipe))
}
