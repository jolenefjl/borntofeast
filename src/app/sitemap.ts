import type {MetadataRoute} from "next";

import {locales} from "@/i18n/config";
import {absoluteUrl} from "@/i18n/urls";
import {client} from "@/sanity/lib/client";

type RecipeSlug = {
  slug?: string;
  updatedAt?: string;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const recipes = await client.fetch<RecipeSlug[]>(
    `*[_type == "recipe" && defined(slug.current)]{
      "slug": slug.current,
      "updatedAt": _updatedAt
    }`,
  );
  const staticPaths = ["", "/about", "/recipes", "/search"];
  const staticEntries = locales.flatMap((locale) =>
    staticPaths.map((path) => ({
      url: absoluteUrl(`/${locale}${path}`),
      lastModified: new Date(),
    })),
  );
  const recipeEntries = locales.flatMap((locale) =>
    recipes
      .filter((recipe) => recipe.slug)
      .map((recipe) => ({
        url: absoluteUrl(`/${locale}/recipes/${recipe.slug}`),
        lastModified: recipe.updatedAt ? new Date(recipe.updatedAt) : new Date(),
      })),
  );

  return [...staticEntries, ...recipeEntries];
}
