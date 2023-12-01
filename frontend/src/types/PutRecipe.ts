// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { PostIngredientAssociation } from "./PostIngredientAssociation";
import type { PutRecipeMetadata } from "./PutRecipeMetadata";
import type { Step } from "./Step";

export interface PutRecipe {
  steps: Array<Step> | null;
  ingredients: Array<PostIngredientAssociation> | null;
  metadata: PutRecipeMetadata;
}
