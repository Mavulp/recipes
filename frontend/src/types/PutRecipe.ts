// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { PostIngredientAssociation } from "./PostIngredientAssociation";

export interface PutRecipe {
  steps: Array<string> | null;
  ingredients: Array<PostIngredientAssociation> | null;
  name: string | null;
  description: string | null;
  image_url: string | null;
  servings: number | null;
  work_time: number | null;
  wait_time: number | null;
}
