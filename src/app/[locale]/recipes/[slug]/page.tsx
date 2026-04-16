import Image from "next/image";
import type {Metadata} from "next";
import {notFound} from "next/navigation";

import {RichText, richTextToPlainText, type RichTextValue} from "@/app/components/RichText";
import {SiteHeader} from "@/app/components/SiteHeader";
import {getSiteChrome} from "@/app/components/siteChrome";
import {RecipeContent} from "./RecipeContent";
import {isLocale, type Locale} from "@/i18n/config";
import {getDictionary} from "@/i18n/dictionaries";
import {resolveLocalized, resolveLocalizedString, type LocalizedValue} from "@/i18n/localized";
import {absoluteUrl} from "@/i18n/urls";
import {client} from "@/sanity/lib/client";
import {urlFor} from "@/sanity/lib/image";

export const dynamic = "force-dynamic";

type RecipePageProps = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

const fallbackHeroImage =
  "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1400&q=85";

const fallbackGallery = [
  {
    src: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=85",
    alt: "A colorful bowl of fried rice with vegetables",
  },
  {
    src: "https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=900&q=85",
    alt: "Kimchi and Korean side dishes on a table",
  },
  {
    src: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=900&q=85",
    alt: "Fried rice served in a pan with herbs",
  },
];

export type PortableBlock = {
  _key: string;
  _type: "block";
  children?: {text?: string}[];
};

type Recipe = {
  title: LocalizedValue<string>;
  sharedSlug?: string;
  localizedSlug?: {
    en?: {current?: string};
    no?: {current?: string};
  };
  cuisine?: {
    name?: LocalizedValue<string>;
    slug?: {current?: string};
  };
  cuisineType: string;
  difficulty: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  heroImage?: {
    alt?: string;
    asset?: unknown;
  };
  gallery?: {
    alt?: string;
    asset?: unknown;
  }[];
  intro?: LocalizedValue<RichTextValue>;
  ingredients?: {
    _key: string;
    quantity?: number;
    unit?: string;
    name: LocalizedValue<string>;
    note?: LocalizedValue<string>;
    filterKey?: string;
  }[];
  methodSteps?: {
    _key: string;
    content?: LocalizedValue<PortableBlock[]>;
  }[];
  tipsAndNotes?: LocalizedValue<PortableBlock[]>;
  guidanceCards?: {
    _key: string;
    image?: {
      alt?: string;
      asset?: unknown;
    };
    title?: LocalizedValue<string>;
    body?: LocalizedValue<PortableBlock[]>;
  }[];
  tiktokUrl?: string;
};

const recipeQuery = `*[_type == "recipe" && (
  slug.current == $slug ||
  localizedSlug.en.current == $slug ||
  localizedSlug.no.current == $slug
)][0]{
  title,
  "sharedSlug": slug.current,
  localizedSlug,
  cuisine->{name, slug},
  cuisineType,
  difficulty,
  prepTime,
  cookTime,
  servings,
  heroImage,
  gallery,
  intro,
  ingredients,
  methodSteps,
  tipsAndNotes,
  guidanceCards,
  tiktokUrl
}`;

function normalizeRecipe(recipe: Recipe, locale: Locale) {
  const title = resolveLocalizedString(recipe.title, locale);
  const legacyCuisineFallback = locale === "en" ? recipe.cuisineType : "";
  const cuisineName = resolveLocalizedString(
    recipe.cuisine?.name,
    locale,
    legacyCuisineFallback,
  );
  const intro = resolveLocalized<RichTextValue>(recipe.intro, locale);
  const tipsAndNotes = resolveLocalized<PortableBlock[]>(
    recipe.tipsAndNotes,
    locale,
    [],
  );
  const methodSteps = recipe.methodSteps
    ?.map((step) => ({
      _key: step._key,
      content: resolveLocalized<PortableBlock[]>(step.content, locale, []),
    }))
    .filter((step) => step.content?.length);
  const ingredients = recipe.ingredients
    ?.map((ingredient) => ({
      _key: ingredient._key,
      quantity: ingredient.quantity,
      unit: ingredient.unit,
      name: resolveLocalizedString(ingredient.name, locale),
      note: resolveLocalizedString(ingredient.note, locale),
      filterKey: ingredient.filterKey,
    }))
    .filter((ingredient) => ingredient.name);
  const guidanceCards = recipe.guidanceCards
    ?.map((card) => ({
      _key: card._key,
      title: resolveLocalizedString(card.title, locale),
      body: resolveLocalized<PortableBlock[]>(card.body, locale, []),
      image: card.image?.asset
        ? {
            src: urlFor(card.image).width(900).height(675).fit("crop").url(),
            alt: card.image.alt || resolveLocalizedString(card.title, locale),
          }
        : null,
    }))
    .filter((card) => card.title && card.image);

  return {
    ...recipe,
    title,
    cuisineName,
    intro,
    tipsAndNotes,
    methodSteps,
    ingredients,
    guidanceCards,
  };
}

function recipeSlugForLocale(recipe: Recipe, locale: Locale, fallback: string) {
  return recipe.localizedSlug?.[locale]?.current || recipe.sharedSlug || fallback;
}

function recipeLanguages(recipe: Recipe, fallbackSlug: string) {
  return {
    en: absoluteUrl(`/en/recipes/${recipeSlugForLocale(recipe, "en", fallbackSlug)}`),
    no: absoluteUrl(`/no/recipes/${recipeSlugForLocale(recipe, "no", fallbackSlug)}`),
  };
}

function isRecipeVisibleForLocale(
  recipe: ReturnType<typeof normalizeRecipe>,
  locale: Locale,
) {
  if (!recipe.title) {
    return false;
  }

  if (locale === "no") {
    return Boolean(
      recipe.cuisineName && recipe.ingredients?.length && recipe.methodSteps?.length,
    );
  }

  return true;
}

function plainTextFromBlocks(blocks?: PortableBlock[]) {
  return (
    blocks
      ?.map((block) => block.children?.map((child) => child.text).join(""))
      .filter(Boolean)
      .join(" ") || ""
  );
}

function minutesToDuration(minutes: number) {
  return `PT${minutes}M`;
}

export async function generateMetadata({
  params,
}: RecipePageProps): Promise<Metadata> {
  const {locale: localeParam, slug} = await params;
  const locale = isLocale(localeParam) ? localeParam : "en";
  const dictionary = getDictionary(locale);
  const recipe = await client.fetch<Recipe | null>(
    recipeQuery,
    {slug},
    {cache: "no-store"},
  );

  if (!recipe) {
    notFound();
  }

  const normalized = normalizeRecipe(recipe, locale);

  if (!isRecipeVisibleForLocale(normalized, locale)) {
    notFound();
  }

  const description =
    richTextToPlainText(normalized.intro) || dictionary.site.description;

  return {
    title: normalized.title,
    description,
    alternates: {
      canonical: absoluteUrl(
        `/${locale}/recipes/${recipeSlugForLocale(recipe, locale, slug)}`,
      ),
      languages: recipeLanguages(recipe, slug),
    },
  };
}

export default async function RecipePage({params}: RecipePageProps) {
  const {locale: localeParam, slug} = await params;
  const locale = isLocale(localeParam) ? localeParam : "en";
  const dictionary = getDictionary(locale);
  const [recipe, chrome] = await Promise.all([
    client.fetch<Recipe | null>(
      recipeQuery,
      {slug},
      {cache: "no-store"},
    ),
    getSiteChrome(locale, dictionary),
  ]);

  if (!recipe) {
    notFound();
  }

  const normalizedRecipe = normalizeRecipe(recipe, locale);

  if (!isRecipeVisibleForLocale(normalizedRecipe, locale)) {
    notFound();
  }

  const totalTime = normalizedRecipe.prepTime + normalizedRecipe.cookTime;
  const heroImage = recipe.heroImage?.asset
    ? urlFor(recipe.heroImage).width(1000).height(1300).fit("crop").url()
    : fallbackHeroImage;
  const heroAlt =
    recipe.heroImage?.alt || `${normalizedRecipe.title} served in a colorful bowl`;
  const gallery =
    recipe.gallery?.length && recipe.gallery.some((image) => image.asset)
      ? recipe.gallery
          .filter((image) => image.asset)
          .map((image) => ({
            src: urlFor(image).width(900).height(700).fit("crop").url(),
            alt: image.alt || normalizedRecipe.title,
          }))
      : fallbackGallery;
  const recipeJsonLd = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: normalizedRecipe.title,
    description: richTextToPlainText(normalizedRecipe.intro),
    image: [heroImage],
    recipeCuisine: normalizedRecipe.cuisineName,
    prepTime: minutesToDuration(normalizedRecipe.prepTime),
    cookTime: minutesToDuration(normalizedRecipe.cookTime),
    totalTime: minutesToDuration(totalTime),
    recipeYield: `${normalizedRecipe.servings}`,
    recipeIngredient: normalizedRecipe.ingredients?.map((ingredient) =>
      [ingredient.quantity, ingredient.unit, ingredient.name]
        .filter(Boolean)
        .join(" "),
    ),
    recipeInstructions: normalizedRecipe.methodSteps?.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      text: plainTextFromBlocks(step.content),
    })),
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#fff3c7] text-[#240B36]">
      <SiteHeader
        locale={locale}
        labels={dictionary.nav}
        navigationItems={chrome.navigationItems}
      />
      <section className="border-b-4 border-[#240B36] bg-[#e55224] px-4 py-8 sm:px-8 sm:py-10 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-7 lg:grid-cols-[0.78fr_1fr] lg:items-center">
            <div className="relative min-h-[22rem] border-4 border-[#240B36] bg-[#ffd447] p-2 shadow-[6px_6px_0_#240B36] sm:min-h-[38rem] sm:p-3 sm:shadow-[8px_8px_0_#240B36] lg:min-h-[44rem]">
              <Image
                src={heroImage}
                alt={heroAlt}
                fill
                priority
                sizes="(min-width: 1024px) 38vw, 92vw"
                className="object-cover p-3"
              />
            </div>

            <div className="min-w-0">
              <p className="mb-4 inline-flex max-w-full flex-wrap gap-x-1 gap-y-1 border-2 border-[#240B36] bg-[#ffd447] px-3 py-2 text-xs font-medium uppercase leading-[1.1] sm:text-sm sm:leading-[0.9]">
                {normalizedRecipe.cuisineName} |{" "}
                {dictionary.recipe.difficultyLabels[normalizedRecipe.difficulty as keyof typeof dictionary.recipe.difficultyLabels] ??
                  normalizedRecipe.difficulty}{" "}
                | {totalTime} min
              </p>
              <h1 className="font-serif text-4xl font-black lowercase leading-[0.95] text-[#fff3c7] sm:text-7xl sm:leading-[0.9] lg:text-8xl">
                {normalizedRecipe.title}
              </h1>
              <RichText
                value={normalizedRecipe.intro}
                className="mt-5 max-w-prose space-y-4 text-lg font-normal leading-[1.65rem] text-[#fff3c7] sm:mt-6 sm:text-xl sm:leading-[1.8rem]"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#ffd447] px-4 py-6 sm:px-8 sm:py-8">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-2 text-xs font-medium uppercase leading-[1] sm:grid-cols-2 sm:gap-3 sm:text-sm sm:leading-[0.9] lg:grid-cols-5">
          {[
            [dictionary.recipe.prep, `${normalizedRecipe.prepTime} min`],
            [dictionary.recipe.cook, `${normalizedRecipe.cookTime} min`],
            [dictionary.recipe.serves, `${normalizedRecipe.servings}`],
            [
              dictionary.recipe.difficulty,
              dictionary.recipe.difficultyLabels[
                normalizedRecipe.difficulty as keyof typeof dictionary.recipe.difficultyLabels
              ] ?? normalizedRecipe.difficulty,
            ],
            [dictionary.recipe.cuisine, normalizedRecipe.cuisineName],
          ].map(([label, value]) => (
            <div
              key={label}
              className="border-2 border-[#240B36] bg-[#fff3c7] p-3 sm:p-4"
            >
              <p className="text-[#c7391f]">{label}</p>
              <p className="mt-1 text-xl text-[#240B36] sm:text-2xl">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <RecipeContent
        dictionary={dictionary.recipe}
        baseServings={normalizedRecipe.servings}
        ingredients={normalizedRecipe.ingredients}
        methodSteps={normalizedRecipe.methodSteps}
        tipsAndNotes={normalizedRecipe.tipsAndNotes}
        guidanceCards={normalizedRecipe.guidanceCards}
        gallery={gallery}
        tiktokUrl={normalizedRecipe.tiktokUrl}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(recipeJsonLd)}}
      />
    </main>
  );
}
