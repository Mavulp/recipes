use diesel::prelude::*;

use anyhow::Context;
use axum::{extract::Path, Extension, Json};
use serde::Serialize;
use tracing::debug;
use ts_rs::TS;
use utoipa::ToSchema;

use crate::error::Error;
use crate::schema::users;
use crate::SqlitePool;

/// The definition of a user.
#[derive(Debug, Serialize, TS, ToSchema, Queryable)]
#[ts(export, export_to = "../frontend/src/")]
#[serde(rename_all = "camelCase")]
pub struct User {
    /// The unique username of a user.
    #[schema(example = "alice")]
    pub username: String,

    /// A unix timestamp of when this alias was created.
    #[schema(example = 1670802822)]
    pub created_at: i64,
}

/// Get a list of all users.
#[utoipa::path(
    get,
    path = "/api/user",
    responses(
        (status = 200, description = "Users are returned", body = [User]),
    )
)]
pub async fn get_all(Extension(pool): Extension<SqlitePool>) -> Result<Json<Vec<User>>, Error> {
    let mut conn = pool.get().await.expect("can connect to sqlite");

    debug!("Loading all users");

    let users = users::dsl::users
        .load(&mut *conn)
        .context("Failed to load users")?;

    debug!(count = users.len(), "Returning users");

    Ok(Json(users))
}

#[utoipa::path(
    get,
    path = "/api/user/{username}",
    responses(
        (status = 200, description = "User data is returned", body = User),
        (status = 404, description = "User does not exist"),
    ),
    params(
        ("username" = String, Path, description = "Username of the user to query"),
    )
)]
pub async fn get_by_username(
    Path(username): Path<String>,
    Extension(pool): Extension<SqlitePool>,
) -> Result<Json<User>, Error> {
    let mut conn = pool.get().await.expect("can connect to sqlite");

    debug!(username, "Trying to find user by name");

    let user = users::dsl::users
        .filter(users::dsl::username.eq(username))
        .first::<User>(&mut *conn)
        .optional()
        .context("Failed to query user")?
        .ok_or(Error::NotFound)?;

    debug!(?user, "Found user");

    Ok(Json(user))
}
