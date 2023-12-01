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
use crate::schema::{ingredients, recipe_ingredient_associations, recipes, steps};
use crate::SqlitePool;

#[derive(Debug, Serialize, TS, ToSchema, Queryable)]
#[ts(export, export_to = "../frontend/src/types/")]
pub struct RecipeMetadata {
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
    pub wait_time: Option<i64>,

    #[schema(example = "Alice")]
    pub author: String,

    #[schema(example = 1691830000)]
    pub created_at: i64,
}

#[derive(Debug, Serialize, TS, ToSchema)]
#[ts(export, export_to = "../frontend/src/types/")]
pub struct Recipe {
    pub ingredients: Vec<UsedIngredient>,
    pub steps: Vec<Step>,

    #[serde(flatten)]
    pub metadata: RecipeMetadata,
}

#[derive(Debug, Serialize, TS, ToSchema, Queryable)]
#[ts(export, export_to = "../frontend/src/types/")]
pub struct UsedIngredient {
    pub amount: Option<i64>,
    pub amount_unit: Option<String>,

    #[serde(flatten)]
    pub metadata: Ingredient,
}

#[derive(Debug, Serialize, Deserialize, TS, ToSchema, Queryable, Insertable)]
#[ts(export, export_to = "../frontend/src/types/")]
pub struct Step {
    #[schema(example = "Cook the tomatoes.")]
    pub instruction: String,

    #[schema(example = "Careful, knifes can cut you.")]
    pub notes: Option<String>,
}

/// Get a list of all recipes
#[utoipa::path(
    get,
    path = "/api/recipe",
    responses(
        (status = 200, description = "Recipes are returned", body = [Recipe]),
    )
)]
pub async fn get_all(
    Extension(pool): Extension<SqlitePool>,
) -> Result<Json<Vec<RecipeMetadata>>, Error> {
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
pub async fn get_by_id(
    Path(id): Path<i64>,
    Extension(pool): Extension<SqlitePool>,
) -> Result<Json<Recipe>, Error> {
    let mut conn = pool.get().await.expect("can connect to sqlite");
    debug!(id, "Loading recipe with id");

    let metadata = recipes::dsl::recipes
        .filter(recipes::dsl::id.eq(id))
        .first::<RecipeMetadata>(&mut *conn)
        .optional()
        .context("Failed to query recipe")?
        .ok_or(Error::NotFound)?;

    let steps = steps::dsl::steps
        .filter(steps::recipe_id.eq(metadata.id))
        .order(steps::idx.asc())
        .select((steps::instruction, steps::notes))
        .load(&mut *conn)
        .context("Failed to load steps")?;

    let ingredients = ingredients::dsl::ingredients
        .inner_join(recipe_ingredient_associations::table)
        .filter(recipe_ingredient_associations::recipe_id.eq(metadata.id))
        .order(recipe_ingredient_associations::idx.asc())
        .select((
            recipe_ingredient_associations::amount,
            recipe_ingredient_associations::amount_unit,
            (
                ingredients::id,
                ingredients::name,
                ingredients::description,
                ingredients::author,
                ingredients::created_at,
            ),
        ))
        .load(&mut *conn)
        .context("Failed to load ingredients")?;

    let recipe = Recipe {
        steps,
        metadata,
        ingredients,
    };

    debug!(?recipe, "Found Recipe");
    Ok(Json(recipe))
}

#[derive(Debug, Deserialize, TS, ToSchema)]
#[ts(export, export_to = "../frontend/src/types/")]
pub struct PostRecipe {
    pub steps: Vec<Step>,
    pub ingredients: Vec<PostIngredientAssociation>,

    #[serde(flatten)]
    pub metadata: PostRecipeMetadata,
}

#[derive(Debug, Deserialize, TS, ToSchema, Insertable)]
#[ts(export, export_to = "../frontend/src/types/")]
#[diesel(table_name = recipe_ingredient_associations)]
pub struct PostIngredientAssociation {
    #[schema(example = 1)]
    ingredient_id: i64,

    #[schema(example = 10)]
    amount: Option<i64>,

    #[schema(example = "kg")]
    amount_unit: Option<String>,
}

#[derive(Debug, Deserialize, TS, ToSchema, Insertable)]
#[ts(export, export_to = "../frontend/src/types/")]
#[diesel(table_name = recipes)]
pub struct PostRecipeMetadata {
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
    pub wait_time: Option<i64>,

    #[ts(skip)]
    #[serde(skip, default = "placeholder_user")]
    pub author: String,

    #[ts(skip)]
    #[serde(skip, default = "unix_timestamp")]
    pub created_at: i64,
}

pub fn placeholder_user() -> String {
    String::from("Placeholder")
}

/// Post an recipe
#[utoipa::path(
    post,
    path = "/api/recipe",
    request_body = PostRecipe,
    responses(
        (status = 200, description = "Posted an recipe", body = PostMetadata),
    )
)]
pub async fn post(
    Extension(pool): Extension<SqlitePool>,
    req: Result<Json<PostRecipe>, JsonRejection>,
) -> Result<Json<RecipeMetadata>, Error> {
    let Json(req) = req?;
    let mut conn = pool.get().await.expect("can connect to sqlite");

    let metadata: RecipeMetadata = diesel::insert_into(recipes::table)
        .values(&req.metadata)
        .get_result(&mut *conn)
        .context("Failed to insert recipe")?;

    insert_ingredients_associations(&mut conn, metadata.id, &req.ingredients)?;
    insert_steps(&mut conn, metadata.id, &req.steps)?;

    debug!("Inserted recipe successfully");

    Ok(Json(metadata))
}

// Delete recipe
#[utoipa::path(
    delete,
    path = "/api/recipe/{id}",
    responses(
        (status = 200, description = "Deleted an recipe"),
    ),
    params(
        ("id" = i64, Path, description = "Identifier of the recipe"),
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

#[derive(Debug, Deserialize, TS, ToSchema, AsChangeset)]
#[ts(export, export_to = "../frontend/src/types/")]
#[diesel(table_name = recipes)]
pub struct PutRecipeMetadata {
    #[schema(example = "Tomato Soup")]
    pub name: Option<String>,

    #[schema(example = "A tasty soup made from tomatoes. Duh!")]
    pub description: Option<String>,

    #[schema(example = "https://www.example.com/soup.png")]
    pub image_url: Option<String>,

    #[schema(example = 5)]
    pub servings: Option<i64>,

    #[schema(example = 10)]
    pub work_time: Option<i64>,

    #[schema(example = 30)]
    pub wait_time: Option<i64>,
}

impl PutRecipeMetadata {
    fn has_changes(&self) -> bool {
        self.name.is_some()
            || self.description.is_some()
            || self.image_url.is_some()
            || self.servings.is_some()
            || self.work_time.is_some()
            || self.wait_time.is_some()
    }
}

#[derive(Debug, Deserialize, TS, ToSchema)]
#[ts(export, export_to = "../frontend/src/types/")]
pub struct PutRecipe {
    pub steps: Option<Vec<Step>>,
    pub ingredients: Option<Vec<PostIngredientAssociation>>,

    #[serde(flatten)]
    pub metadata: PutRecipeMetadata,
}

#[utoipa::path(
    put,
    path = "/api/recipe/{id}",
    request_body = PutRecipe,
    responses(
        (status = 200, description = "Updated an recipe"),
    ),
    params(
        ("id" = i64, Path, description = "Identifier of the recipe"),
    )
)]
pub async fn put(
    Path(id): Path<i64>,
    Extension(pool): Extension<SqlitePool>,
    req: Result<Json<PutRecipe>, JsonRejection>,
) -> Result<(), Error> {
    let Json(req) = req?;
    let mut conn = pool.get().await.expect("can connect to sqlite");

    if req.metadata.has_changes() {
        diesel::update(recipes::dsl::recipes.filter(recipes::dsl::id.eq(id)))
            .set(&req.metadata)
            .execute(&mut *conn)
            .context("Failed to update recipe")?;
    }

    if let Some(ingredients) = req.ingredients {
        diesel::delete(
            recipe_ingredient_associations::dsl::recipe_ingredient_associations
                .filter(recipe_ingredient_associations::dsl::recipe_id.eq(id)),
        )
        .execute(&mut *conn)
        .context("Failed to delete ingredients")?;

        insert_ingredients_associations(&mut conn, id, &ingredients)?;
    }

    if let Some(steps) = req.steps {
        diesel::delete(steps::dsl::steps.filter(steps::dsl::recipe_id.eq(id)))
            .execute(&mut *conn)
            .context("Failed to delete a steps")?;

        insert_steps(&mut conn, id, &steps)?;
    }

    debug!("Updated recipe successfully");

    Ok(())
}

fn insert_ingredients_associations(
    conn: &mut SqliteConnection,
    recipe_id: i64,
    ingredients: &[PostIngredientAssociation],
) -> Result<(), Error> {
    diesel::insert_into(recipe_ingredient_associations::table)
        .values(
            ingredients
                .iter()
                .enumerate()
                .map(|(idx, ingredient)| {
                    (
                        recipe_ingredient_associations::recipe_id.eq(recipe_id),
                        recipe_ingredient_associations::idx.eq(idx as i64),
                        ingredient,
                    )
                })
                .collect::<Vec<_>>(),
        )
        .execute(conn)
        .context("Failed to insert steps")?;

    Ok(())
}

fn insert_steps(conn: &mut SqliteConnection, recipe_id: i64, steps: &[Step]) -> Result<(), Error> {
    diesel::insert_into(steps::table)
        .values(
            steps
                .iter()
                .enumerate()
                .map(|(idx, step)| {
                    (
                        steps::recipe_id.eq(recipe_id),
                        steps::idx.eq(idx as i64),
                        step,
                    )
                })
                .collect::<Vec<_>>(),
        )
        .execute(conn)
        .context("Failed to insert steps")?;

    Ok(())
}
