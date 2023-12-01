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
use crate::schema::ingredients;
use crate::SqlitePool;

#[derive(Debug, Serialize, TS, ToSchema, Queryable, Insertable)]
#[ts(export, export_to = "../frontend/src/")]
pub struct Ingredient {
    #[schema(example = 1)]
    pub id: i64,

    #[schema(example = "Tomato")]
    pub name: String,

    #[schema(example = "Looks like a berry but people use it like a vegetable.")]
    pub description: Option<String>,

    #[schema(example = "Alice")]
    pub author: String,

    #[schema(example = 1691830000)]
    pub created_at: i64,
}

/// Get a list of all ingredients
#[utoipa::path(
    get,
    path = "/api/ingredients",
    responses(
        (status = 200, description = "Ingredients are returned", body = [Ingredient]),
    )
)]
// Return all ingredients
pub async fn get_all(
    Extension(pool): Extension<SqlitePool>,
) -> Result<Json<Vec<Ingredient>>, Error> {
    let mut conn = pool.get().await.expect("can connect to sqlite");

    debug!("Loading all ingredients");
    let ingredients = ingredients::dsl::ingredients
        .load(&mut *conn)
        .context("Failed to load ingredients")?;

    debug!(count = ingredients.len(), "Returning ingredients");
    Ok(Json(ingredients))
}

/// Get an ingredient by its id
#[utoipa::path(
    get,
    path = "/api/ingredient/{id}",
    responses(
        (status = 200, description = "Ingredient data is returned", body = Ingredient),
        (status = 404, description = "Ingredient does not exist"),
    ),
    params(
        ("id" = i64, Path, description = "Identifier of the Ingredient"),
    )
)]
pub async fn get_by_id(
    Path(id): Path<i64>,
    Extension(pool): Extension<SqlitePool>,
) -> Result<Json<Ingredient>, Error> {
    let mut conn = pool.get().await.expect("can connect to sqlite");
    debug!(id, "Loading ingredient with id");

    let ingredient = ingredients::dsl::ingredients
        .filter(ingredients::dsl::id.eq(id))
        .first::<Ingredient>(&mut *conn)
        .optional()
        .context("Failed to query ingredient")?
        .ok_or(Error::NotFound)?;

    debug!(?ingredient, "Found Ingredient");
    Ok(Json(ingredient))
}

// Post ingredient
#[derive(Debug, Deserialize, TS, ToSchema, Insertable)]
#[ts(export, export_to = "../frontend/src/")]
#[diesel(table_name = ingredients)]
pub struct PostIngredient {
    #[schema(example = "Tomato")]
    pub name: String,

    #[schema(example = "Looks like a berry but people use it like a vegetable.")]
    pub description: Option<String>,

    #[ts(skip)]
    #[serde(skip, default = "unix_timestamp")]
    pub created_at: i64,
}

/// Post an ingredient
#[utoipa::path(
    post,
    path = "/api/ingredient",
    responses(
        (status = 200, description = "Posted an ingredient", body = [PostIngredient]),
    )
)]

pub async fn post(
    Extension(pool): Extension<SqlitePool>,
    req: Result<Json<PostIngredient>, JsonRejection>,
) -> Result<Json<Ingredient>, Error> {
    let Json(req) = req?;
    let mut conn = pool.get().await.expect("can connect to sqlite");

    // Insert into db
    let ingredient = diesel::insert_into(ingredients::table)
        .values(&req)
        .get_result(&mut *conn)
        .context("Failed to insert ingredient")?;

    debug!("Inserted ingredient successfully");

    Ok(Json(ingredient))
}

// Delete ingredient
#[utoipa::path(
    delete,
    path = "/api/ingredient/{id}",
    responses(
        (status = 200, description = "Deleted the ingredient"),
    ),
    params(
        ("id" = i64, Path, description = "Identifier of the Ingredient"),
    )
)]

pub async fn delete_by_id(
    Path(id): Path<i64>,
    Extension(pool): Extension<SqlitePool>,
) -> Result<(), Error> {
    let mut conn = pool.get().await.expect("can connect to sqlite");
    diesel::delete(ingredients::dsl::ingredients.filter(ingredients::dsl::id.eq(id)))
        .execute(&mut *conn)
        .context("Failed to delete a ingredient")?;

    Ok(())
}

// Put ingredient
#[derive(Debug, Deserialize, TS, ToSchema, AsChangeset)]
#[ts(export, export_to = "../frontend/src/")]
#[diesel(table_name = ingredients)]
pub struct PutIngredient {
    #[schema(example = "Tomato")]
    pub name: Option<String>,

    #[schema(example = "Looks like a berry but people use it like a vegetable.")]
    pub description: Option<String>,
}

#[utoipa::path(
    put,
    path = "/api/ingredient/{id}",
    responses(
        (status = 200, description = "Updated an ingredient", body = [Ingredient]),
    ),
    params(
        ("id" = i64, Path, description = "Identifier of the Ingredient"),
    )
)]

pub async fn put(
    Path(id): Path<i64>,
    Extension(pool): Extension<SqlitePool>,
    req: Result<Json<PutIngredient>, JsonRejection>,
) -> Result<Json<Ingredient>, Error> {
    let Json(req) = req?;
    let mut conn = pool.get().await.expect("can connect to sqlite");

    let ingredient =
        diesel::update(ingredients::dsl::ingredients.filter(ingredients::dsl::id.eq(id)))
            .set(&req)
            .get_result(&mut *conn)
            .context("Failed to update ingredient")?;

    Ok(Json(ingredient))
}
