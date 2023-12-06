use anyhow::Context;
use axum::{
    extract::{rejection::JsonRejection, Path},
    Extension, Json,
};
use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use tracing::debug;
use ts_rs::TS;
use utoipa::ToSchema;

use crate::schema::reviews;
use crate::util::unix_timestamp;
use crate::{error::Error, SqlitePool};

/// Reviews show up under their respective recipes to allow critique or suggestions.
#[derive(Debug, Serialize, TS, ToSchema, Queryable)]
#[ts(export, export_to = "../frontend/src/types/")]
pub struct Review {
    /// A unique identifier for the reviews, this should never change for a review.
    #[schema(example = 1)]
    #[ts(type = "number")]
    pub id: i64,

    /// The id of the recipe the review belongs to.
    #[schema(example = 1)]
    #[ts(type = "number")]
    pub recipe_id: i64,

    /// The content of the review.
    #[schema(
        example = "Thanks to this beautiful handwritten recipe I was able to conjure a scrumptious dinner for two."
    )]
    pub text: String,

    /// The username of the account who created the review.
    #[schema(example = "Alice")]
    pub author: String,

    /// A unix timestamp of when this review was created.
    #[schema(example = 1670802822)]
    #[ts(type = "number")]
    pub created_at: i64,
}

/// Get a review by its id.
#[utoipa::path(
    get,
    path = "/api/recipe/{id}/review",
    responses(
        (status = 200, description = "The reviews for the recipe with the matching ID are returned", body = Review),
    ),
    params(
        ("id" = i64, Path, description = "ID of the recipe the reviews belong to."),
    )
)]
pub async fn get_all(
    Path(id): Path<i64>,
    Extension(pool): Extension<SqlitePool>,
) -> Result<Json<Vec<Review>>, Error> {
    let mut conn = pool.get().await.expect("can connect to sqlite");
    debug!(id, "Loading reviews for recipe with id");

    let reviews = reviews::dsl::reviews
        .filter(reviews::dsl::recipe_id.eq(id))
        .load(&mut *conn)
        .context("Failed to query reviews")?;

    debug!(count = reviews.len(), "Found Reviews");
    Ok(Json(reviews))
}

/// Used to create a review on a recipe.
#[derive(Debug, Deserialize, TS, ToSchema, Insertable)]
#[ts(export, export_to = "../frontend/src/types/")]
#[diesel(table_name = reviews)]
pub struct PostReview {
    /// The content of the review. Can't be empty and whitespace gets trimmed from the start and
    /// end.
    #[schema(
        example = "Thanks to this beautiful handwritten recipe I was able to conjure a scrumptious dinner for two."
    )]
    pub text: String,

    #[ts(skip)]
    #[serde(skip, default = "placeholder_user")]
    pub author: String,

    #[ts(skip)]
    #[serde(skip, default = "unix_timestamp")]
    #[ts(type = "number")]
    pub created_at: i64,
}

pub fn placeholder_user() -> String {
    String::from("Placeholder")
}

/// Creates a review from the request body.
#[utoipa::path(
    post,
    path = "/api/recipe/{id}/review",
    request_body = PostReview,
    responses(
        (status = 200, description = "The review was created"),
        (status = 403, description = "The request body was invalid"),
    ),
    params(
        ("id" = i64, Path, description = "ID of the recipe the review should be created on."),
    )
)]
pub(super) async fn post(
    Path(id): Path<i64>,
    Extension(pool): Extension<SqlitePool>,
    request: Result<Json<PostReview>, JsonRejection>,
) -> Result<Json<Review>, Error> {
    let Json(request) = request?;
    let mut conn = pool.get().await.expect("can connect to sqlite");

    let review = diesel::insert_into(reviews::table)
        .values((reviews::recipe_id.eq(id), &request))
        .get_result(&mut *conn)
        .context("Failed to insert review")?;

    debug!("Inserted review successfully");

    Ok(Json(review))
}

/// Deletes a review by id.
#[utoipa::path(
    delete,
    path = "/api/review/{id}",
    responses(
        (status = 200, description = "The review was deleted."),
        (status = 404, description = "Review does not exist."),
        (status = 403, description = "Only the author can delete their review."),
    ),
    params(
        ("id" = i64, Path, description = "ID of the review that should be deleted."),
    )
)]
pub(super) async fn delete(
    Path(id): Path<i64>,
    Extension(pool): Extension<SqlitePool>,
) -> Result<(), Error> {
    let mut conn = pool.get().await.expect("can connect to sqlite");

    diesel::delete(reviews::dsl::reviews.filter(reviews::dsl::id.eq(id)))
        .execute(&mut *conn)
        .context("Failed to delete review")?;

    Ok(())
}
