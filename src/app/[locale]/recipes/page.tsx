import Image from "next/image";
import Link from "next/link";
import type {Metadata} from "next";

import {richTextToPlainText, type RichTextValue} from "@/app/components/RichText";
import {SiteHeader} from "@/app/components/SiteHeader";
import {getSiteChrome} from "@/app/components/siteChrome";
import {isLocale, localizedPath, type Locale} from "@/i18n/config";
import {getDictionary} from "@/i18n/dictionaries";
import {
  resolveLocalized,
  resolveLocalizedString,
  type LocalizedValue,
} from "@/i18n/localized";
import {absoluteUrl, localeAlternates} from "@/i18n/urls";
import {client} from "@/sanity/lib/client";
import {urlFor} from "@/sanity/lib/image";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{
  cuisine?: string;
  difficulty?: string;
  time?: string;
  ingredient?: string;
}>;

type RecipeListPageProps = {
  params: Promise<{locale: string}>;
  searchParams: SearchParams;
};

type RecipeListItem = {
  title?: LocalizedValue<string>;
  slug?: string;
  cuisine?: {
    name?: LocalizedValue<string>;
    slug?: {current?: string};
  };
  cuisineType?: string;
  difficulty?: string;
  prepTime?: number;
  cookTime?: number;
  intro?: LocalizedValue<RichTextValue>;
  heroImage?: {alt?: string; asset?: unknown};
  ingredients?: {
    name?: LocalizedValue<string>;
    filterKey?: string;
  }[];
};

type FilterOption = {
  label: string;
  value: string;
};

const recipesQuery = `*[_type == "recipe" && defined(slug.current)] | order(publishedAt desc){
  title,
  "slug": slug.current,
  cuisine->{name, slug},
  cuisineType,
  difficulty,
  prepTime,
  cookTime,
  intro,
  heroImage,
  ingredients[]{name, filterKey}
}`;

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeRecipe(recipe: RecipeListItem, locale: Locale) {
  const title = resolveLocalizedString(recipe.title, locale);
  const cuisineName = resolveLocalizedString(
    recipe.cuisine?.name,
    locale,
    recipe.cuisineType || "",
  );
  const cuisineKey = recipe.cuisine?.slug?.current || slugify(cuisineName);
  const intro = richTextToPlainText(resolveLocalized(recipe.intro, locale));
  const ingredients =
    recipe.ingredients
      ?.map((ingredient) => ({
        label: resolveLocalizedString(ingredient.name, locale),
        value: ingredient.filterKey || "",
      }))
      .filter((ingredient) => ingredient.label && ingredient.value) || [];
  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);

  return {
    ...recipe,
    title,
    cuisineName,
    cuisineKey,
    intro,
    ingredients,
    totalTime,
  };
}

function uniqueOptions(options: FilterOption[]) {
  const seen = new Map<string, FilterOption>();

  for (const option of options) {
    if (!seen.has(option.value)) {
      seen.set(option.value, option);
    }
  }

  return [...seen.values()].sort((a, b) => a.label.localeCompare(b.label));
}

function selectedHref(
  locale: Locale,
  params: Awaited<SearchParams>,
  key: keyof Awaited<SearchParams>,
  value?: string,
) {
  const search = new URLSearchParams();

  for (const [paramKey, paramValue] of Object.entries(params)) {
    if (paramKey !== key && paramValue) {
      search.set(paramKey, paramValue);
    }
  }

  if (value) {
    search.set(key, value);
  }

  const query = search.toString();
  return `${localizedPath(locale, "/recipes")}${query ? `?${query}` : ""}`;
}

function timeMatches(bucket: string | undefined, totalTime: number) {
  if (!bucket) {
    return true;
  }

  if (bucket === "under-30") {
    return totalTime <= 30;
  }

  if (bucket === "under-60") {
    return totalTime <= 60;
  }

  if (bucket === "over-60") {
    return totalTime > 60;
  }

  return true;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale: localeParam} = await params;
  const locale = isLocale(localeParam) ? localeParam : "en";
  const dictionary = getDictionary(locale);

  return {
    title: dictionary.recipes.metaTitle,
    description: dictionary.recipes.metaDescription,
    alternates: {
      canonical: absoluteUrl(`/${locale}/recipes`),
      languages: localeAlternates("/recipes"),
    },
  };
}

export default async function RecipesPage({
  params,
  searchParams,
}: RecipeListPageProps) {
  const [{locale: localeParam}, filters] = await Promise.all([
    params,
    searchParams,
  ]);
  const locale = isLocale(localeParam) ? localeParam : "en";
  const dictionary = getDictionary(locale);
  const [recipes, chrome] = await Promise.all([
    client.fetch<RecipeListItem[]>(recipesQuery, {}, {cache: "no-store"}),
    getSiteChrome(locale, dictionary),
  ]);
  const normalizedRecipes = recipes
    .map((recipe) => normalizeRecipe(recipe, locale))
    .filter((recipe) => recipe.title && recipe.slug);
  const cuisineOptions = uniqueOptions(
    normalizedRecipes
      .filter((recipe) => recipe.cuisineName && recipe.cuisineKey)
      .map((recipe) => ({
        label: recipe.cuisineName,
        value: recipe.cuisineKey,
      })),
  );
  const difficultyOptions = uniqueOptions(
    normalizedRecipes
      .filter((recipe) => recipe.difficulty)
      .map((recipe) => ({
        label:
          dictionary.recipe.difficultyLabels[
            recipe.difficulty as keyof typeof dictionary.recipe.difficultyLabels
          ] || recipe.difficulty || "",
        value: recipe.difficulty || "",
      })),
  );
  const ingredientOptions = uniqueOptions(
    normalizedRecipes.flatMap((recipe) => recipe.ingredients),
  );
  const timeOptions = [
    {label: dictionary.recipes.under30, value: "under-30"},
    {label: dictionary.recipes.under60, value: "under-60"},
    {label: dictionary.recipes.over60, value: "over-60"},
  ];
  const filteredRecipes = normalizedRecipes.filter((recipe) => {
    const matchesCuisine =
      !filters.cuisine || recipe.cuisineKey === filters.cuisine;
    const matchesDifficulty =
      !filters.difficulty || recipe.difficulty === filters.difficulty;
    const matchesIngredient =
      !filters.ingredient ||
      recipe.ingredients.some((ingredient) => ingredient.value === filters.ingredient);

    return (
      matchesCuisine &&
      matchesDifficulty &&
      matchesIngredient &&
      timeMatches(filters.time, recipe.totalTime)
    );
  });

  return (
    <main className="min-h-screen bg-[#fff3c7] text-[#240B36]">
      <SiteHeader
        locale={locale}
        labels={dictionary.nav}
        navigationItems={chrome.navigationItems}
      />
      <section className="relative isolate overflow-hidden border-b-4 border-[#240B36] bg-[#e55224] px-4 pb-12 pt-10 sm:px-8 sm:pb-20 lg:pt-20">
        <div className="absolute inset-0 -z-10 opacity-25 bg-[linear-gradient(90deg,#240B36_1px,transparent_1px),linear-gradient(#240B36_1px,transparent_1px)] bg-[size:42px_42px]" />
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-medium uppercase leading-[0.9]">
            {dictionary.recipes.eyebrow}
          </p>
          <h1 className="mt-4 max-w-4xl font-serif text-5xl font-bold lowercase leading-[0.95] sm:text-7xl sm:leading-[0.9] lg:text-8xl">
            {dictionary.recipes.title}
          </h1>
          <p className="mt-5 max-w-prose text-lg leading-[1.65rem] sm:mt-6 sm:text-xl sm:leading-[1.8rem]">
            {dictionary.recipes.intro}
          </p>
        </div>
      </section>

      <section className="bg-[#ffd447] px-4 py-7 sm:px-8 sm:py-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-sm font-medium uppercase leading-[0.9] text-[#c7391f]">
            {dictionary.recipes.filters}
          </h2>
          <div className="mt-4 grid gap-5 lg:grid-cols-4">
            {[
              {
                label: dictionary.recipes.cuisine,
                key: "cuisine" as const,
                options: cuisineOptions,
              },
              {
                label: dictionary.recipes.difficulty,
                key: "difficulty" as const,
                options: difficultyOptions,
              },
              {
                label: dictionary.recipes.totalTime,
                key: "time" as const,
                options: timeOptions,
              },
              {
                label: dictionary.recipes.ingredient,
                key: "ingredient" as const,
                options: ingredientOptions,
              },
            ].map((group) => (
              <div key={group.key} className="min-w-0">
                <p className="mb-2 text-xs font-black uppercase leading-[0.9]">
                  {group.label}
                </p>
                <div className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
                  <Link
                    href={selectedHref(locale, filters, group.key)}
                    className={`inline-flex min-h-11 shrink-0 items-center border-2 border-[#240B36] px-3 py-2 text-sm font-medium lowercase leading-[0.9] ${
                      filters[group.key]
                        ? "bg-[#fff3c7]"
                        : "bg-[#240B36] text-[#fff3c7]"
                    }`}
                  >
                    {dictionary.recipes.all}
                  </Link>
                  {group.options.map((option) => (
                    <Link
                      key={option.value}
                      href={selectedHref(locale, filters, group.key, option.value)}
                      className={`inline-flex min-h-11 shrink-0 items-center border-2 border-[#240B36] px-3 py-2 text-sm font-medium lowercase leading-[0.9] ${
                        filters[group.key] === option.value
                          ? "bg-[#240B36] text-[#fff3c7]"
                          : "bg-[#fff3c7]"
                      }`}
                    >
                      {option.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <Link
            href={localizedPath(locale, "/recipes")}
            className="mt-5 inline-flex min-h-10 items-center text-sm font-black uppercase leading-[0.9] underline"
          >
            {dictionary.recipes.clearFilters}
          </Link>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-7xl">
          {filteredRecipes.length ? (
            <div className="grid gap-6 lg:grid-cols-3">
              {filteredRecipes.map((recipe) => {
                const image = recipe.heroImage?.asset
                  ? urlFor(recipe.heroImage)
                      .width(900)
                      .height(675)
                      .fit("crop")
                      .url()
                  : "";

                return (
                  <Link
                    key={recipe.slug}
                    href={localizedPath(locale, `/recipes/${recipe.slug}`)}
                    className="group block border-4 border-[#240B36] bg-[#f77f1f] shadow-[6px_6px_0_#240B36] transition duration-200 hover:-translate-y-2 hover:shadow-[12px_12px_0_#240B36] sm:shadow-[8px_8px_0_#240B36]"
                  >
                    {image ? (
                      <div className="relative aspect-[4/3] overflow-hidden border-b-4 border-[#240B36]">
                        <Image
                          src={image}
                          alt={recipe.heroImage?.alt || recipe.title}
                          fill
                          sizes="(min-width: 1024px) 31vw, 90vw"
                          className="object-cover transition duration-300 group-hover:scale-105"
                        />
                      </div>
                    ) : null}
                    <div className="p-4 sm:p-5">
                      <div className="mb-4 flex flex-wrap gap-2 text-xs font-medium uppercase leading-[0.9]">
                        {recipe.cuisineName ? (
                          <span className="border-2 border-[#240B36] bg-[#fff3c7] px-2 py-1">
                            {recipe.cuisineName}
                          </span>
                        ) : null}
                        {recipe.difficulty ? (
                          <span className="border-2 border-[#240B36] bg-[#ffd447] px-2 py-1">
                            {dictionary.recipe.difficultyLabels[
                              recipe.difficulty as keyof typeof dictionary.recipe.difficultyLabels
                            ] || recipe.difficulty}
                          </span>
                        ) : null}
                        <span className="border-2 border-[#240B36] bg-[#c7391f] px-2 py-1 text-[#fff3c7]">
                          {recipe.totalTime} min
                        </span>
                      </div>
                      <h3 className="text-2xl font-black lowercase leading-[1.65rem] sm:text-3xl sm:leading-[1.8rem]">
                        {recipe.title}
                      </h3>
                      {recipe.intro ? (
                        <p className="mt-3 text-base leading-[1.575rem] sm:mt-4">
                          {recipe.intro}
                        </p>
                      ) : null}
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="border-4 border-[#240B36] bg-[#ffd447] p-4 text-lg font-black lowercase shadow-[6px_6px_0_#240B36] sm:p-6 sm:text-xl sm:shadow-[8px_8px_0_#240B36]">
              {dictionary.recipes.noResults}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
