use anyhow::Context;
use axum::{
    routing::{delete, get, post, put, Router},
    Extension,
};
use bb8_diesel::DieselConnectionManager;
use diesel::SqliteConnection;
use diesel_migrations::{embed_migrations, EmbeddedMigrations, MigrationHarness};
use tower_http::cors::CorsLayer;
use utoipa::OpenApi;
use utoipa_swagger_ui::SwaggerUi;

pub mod util;

mod error;
mod ingredient;
mod recipe;
mod schema;
mod sqlite_mapping;
mod user;

pub const MIGRATIONS: EmbeddedMigrations = embed_migrations!();

#[derive(OpenApi)]
#[openapi(
    paths(
        user::get_all,
        user::get_by_username,
        recipe::get_all,
        recipe::get_by_id,
        recipe::post,
        recipe::delete_by_id,
        recipe::put,
        ingredient::get_all,
        ingredient::get_by_id,
        ingredient::post,
        ingredient::delete_by_id,
        ingredient::put,
    ),
    components(schemas(
        user::User,
        recipe::Recipe,
        recipe::PostRecipe,
        recipe::PutRecipe,
        recipe::Step,
        recipe::PostRecipeMetadata,
        recipe::PutRecipeMetadata,
        recipe::PostIngredientAssociation,
        recipe::UsedIngredient,
        ingredient::Ingredient,
        ingredient::PostIngredient,
        ingredient::PutIngredient
    ))
)]
struct ApiDoc;

pub async fn api_route(pool: SqlitePool) -> anyhow::Result<Router> {
    Ok(Router::new()
        .merge(SwaggerUi::new("/swagger").url("/api-doc/openapi.json", ApiDoc::openapi()))
        .route("/api/user", get(user::get_all))
        .route("/api/user/:username", get(user::get_by_username))
        .route("/api/recipe", get(recipe::get_all))
        .route("/api/recipe", post(recipe::post))
        .route("/api/recipe/:id", get(recipe::get_by_id))
        .route("/api/recipe/:id", delete(recipe::delete_by_id))
        .route("/api/recipe/:id", put(recipe::put))
        .route("/api/ingredient", get(ingredient::get_all))
        .route("/api/ingredient", post(ingredient::post))
        .route("/api/ingredient/:id", get(ingredient::get_by_id))
        .route("/api/ingredient/:id", delete(ingredient::delete_by_id))
        .route("/api/ingredient/:id", put(ingredient::put))
        .layer(Extension(pool))
        .layer(CorsLayer::permissive()))
}

type SqlitePool = bb8::Pool<DieselConnectionManager<SqliteConnection>>;

pub async fn setup_database(database_url: String) -> anyhow::Result<SqlitePool> {
    let manager = DieselConnectionManager::<SqliteConnection>::new(database_url);

    let pool = bb8::Pool::builder()
        .build(manager)
        .await
        .context("Failed to build sqlite pool")?;

    let cpool = pool.clone();
    let mut connection = cpool.get().await.expect("can connect to sqlite");
    connection
        .run_pending_migrations(MIGRATIONS)
        .expect("migrations should be tested to work without error");

    Ok(pool)
}
