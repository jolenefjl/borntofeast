import {aboutPageType} from "@/sanity/schemaTypes/aboutPage";
import {categoryType} from "@/sanity/schemaTypes/category";
import {cuisineType} from "@/sanity/schemaTypes/cuisine";
import {recipeType} from "@/sanity/schemaTypes/recipe";
import {siteSettingsType} from "@/sanity/schemaTypes/siteSettings";

export const schemaTypes = [
  recipeType,
  cuisineType,
  categoryType,
  siteSettingsType,
  aboutPageType,
];
