import Image from "next/image";
import Link from "next/link";
import type {Metadata} from "next";

import {SiteHeader} from "@/app/components/SiteHeader";
import {getSiteChrome} from "@/app/components/siteChrome";
import {isLocale, localizedPath, type Locale} from "@/i18n/config";
import {getDictionary} from "@/i18n/dictionaries";
import {resolveLocalizedString, type LocalizedValue} from "@/i18n/localized";
import {absoluteUrl, localeAlternates} from "@/i18n/urls";
import {client} from "@/sanity/lib/client";
import {urlFor} from "@/sanity/lib/image";

export const dynamic = "force-dynamic";

const featuredRecipes: RecipeCard[] = [
  {
    title: "Charred Spring Onion Oil Noodles",
    href: "/search?tag=noodles",
    cuisine: "Chinese Fusion",
    difficulty: "Easy",
    time: "20 min",
    description:
      "Glossy noodles, smoky scallions, soy, sesame, and the kind of pantry magic that saves a cold Tuesday.",
    image:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1000&q=85",
    alt: "A bowl of noodles with broth, herbs, and chopsticks",
  },
  {
    title: "Kimchi Butter Fried Rice",
    href: "/recipes/kimchi-butter-fried-rice",
    cuisine: "Korean",
    difficulty: "Easy",
    time: "18 min",
    description:
      "Sharp kimchi, soft egg, butter, and rice that tastes like coming home after a long day.",
    image:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1000&q=85",
    alt: "A colorful bowl of fried rice with vegetables",
  },
  {
    title: "Malaysian Chicken Curry Puffs",
    href: "/search?tag=malaysian",
    cuisine: "Malaysian",
    difficulty: "Deep Dive",
    time: "90 min",
    description:
      "Flaky pastry, spiced potato, chicken, and a weekend kitchen that smells like pasar malam.",
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1000&q=85",
    alt: "Golden fried pastries on a plate",
  },
];

const categories: CategoryCard[] = [
  {
    name: "Malaysian",
    href: "/search?category=malaysian",
    copy: "Curry laksa moods, sambal cravings, kopitiam breakfasts, and food that travels well.",
    image:
      "https://images.unsplash.com/photo-1625398407796-82650a8c135f?auto=format&fit=crop&w=800&q=85",
    alt: "A richly colored curry dish in a bowl",
  },
  {
    name: "Korean",
    href: "/search?category=korean",
    copy: "Big comfort, bold ferments, weeknight rice, noodles, stews, and crispy things.",
    image:
      "https://images.unsplash.com/photo-1583224964978-2257b960c3d3?auto=format&fit=crop&w=800&q=85",
    alt: "Korean side dishes and rice on a table",
  },
  {
    name: "Chinese",
    href: "/search?category=chinese",
    copy: "Saucy stir-fries, dumpling days, noodle bowls, and simple home-style favorites.",
    image:
      "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=800&q=85",
    alt: "Steamed dumplings served with dipping sauce",
  },
  {
    name: "Fusion",
    href: "/search?category=fusion",
    copy: "Asian comfort food using what you can actually find in a Norwegian grocery store.",
    image:
      "https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&w=800&q=85",
    alt: "A spread of colorful Asian dishes on a table",
  },
];

type SiteSettings = {
  homepageHeroLine1?: LocalizedValue<string>;
  homepageHeroLine2?: LocalizedValue<string>;
  homepageHeroLine3?: LocalizedValue<string>;
  homepageHeroIntro?: LocalizedValue<string>;
  homepageHeroCtaLabel?: LocalizedValue<string>;
  homepageHeroCtaHref?: string;
  homepageHeroPortrait?: {
    alt?: string;
    asset?: unknown;
  };
  featuredRecipes?: RecipeCard[];
  homepageRecipesEyebrow?: LocalizedValue<string>;
  homepageRecipesHeading?: LocalizedValue<string>;
  homepageRecipesCtaLabel?: LocalizedValue<string>;
  homepageRecipesCtaHref?: string;
  homepageCategoriesEyebrow?: LocalizedValue<string>;
  homepageCategoriesHeading?: LocalizedValue<string>;
  showHomepageCategories?: boolean;
  homepageCategoryCards?: CategoryCard[];
  homepageAboutEyebrow?: LocalizedValue<string>;
  homepageAboutHeading?: LocalizedValue<string>;
  homepageAboutText?: LocalizedValue<string>;
  homepageNewsletterEyebrow?: LocalizedValue<string>;
  homepageNewsletterHeading?: LocalizedValue<string>;
  homepageNewsletterText?: LocalizedValue<string>;
  homepageNewsletterButtonLabel?: LocalizedValue<string>;
};

type HomepageData = {
  settings: SiteSettings | null;
  featuredRecipes: RecipeCard[];
};

type RecipeCard = {
  title?: LocalizedValue<string>;
  href?: string;
  slug?: string;
  cuisine?: LocalizedValue<string>;
  difficulty?: string;
  time?: string;
  prepTime?: number;
  cookTime?: number;
  description?: LocalizedValue<string>;
  image?:
    | string
    | {
        alt?: string;
        asset?: unknown;
      };
  alt?: string;
};

type CategoryCard = {
  name?: string;
  title?: LocalizedValue<string>;
  href?: string;
  copy?: LocalizedValue<string>;
  image?:
    | string
    | {
        alt?: string;
        asset?: unknown;
      };
  alt?: string;
};

const homepageQuery = `{
  "settings": *[_type == "siteSettings" && _id == "siteSettings"][0]{
    homepageHeroLine1,
    homepageHeroLine2,
    homepageHeroLine3,
    homepageHeroIntro,
    homepageHeroCtaLabel,
    homepageHeroCtaHref,
    homepageHeroPortrait,
    homepageRecipesEyebrow,
    homepageRecipesHeading,
    homepageRecipesCtaLabel,
    homepageRecipesCtaHref,
  homepageCategoriesEyebrow,
  homepageCategoriesHeading,
  showHomepageCategories,
  homepageCategoryCards,
    homepageAboutEyebrow,
    homepageAboutHeading,
    homepageAboutText,
    homepageNewsletterEyebrow,
    homepageNewsletterHeading,
    homepageNewsletterText,
    homepageNewsletterButtonLabel,
    featuredRecipes[]->{
      title,
      "slug": slug.current,
      "cuisine": coalesce(cuisine->name, cuisineType),
      difficulty,
      prepTime,
      cookTime,
      "description": intro,
      "image": heroImage
    }
  },
  "featuredRecipes": *[_type == "recipe" && featured == true] | order(publishedAt desc)[0...4]{
    title,
    "slug": slug.current,
    "cuisine": coalesce(cuisine->name, cuisineType),
    difficulty,
    prepTime,
    cookTime,
    "description": intro,
    "image": heroImage
  }
}`;

function hasText(value?: string) {
  return Boolean(value?.trim());
}

function getSetting<T>(
  locale: Locale,
  value: LocalizedValue<T>,
  fallback: string,
) {
  return resolveLocalizedString(value as LocalizedValue<string>, locale, fallback);
}

function getImageSource(
  image: {asset?: unknown} | undefined,
  fallback: string,
  width: number,
  height: number,
) {
  return image?.asset
    ? urlFor(image).width(width).height(height).fit("crop").url()
    : fallback;
}

function localizeHref(locale: Locale, href?: string) {
  if (!href) {
    return localizedPath(locale);
  }

  if (href.startsWith("#")) {
    return `${localizedPath(locale)}/${href}`;
  }

  if (href.startsWith("/en") || href.startsWith("/no")) {
    return href;
  }

  if (href.startsWith("/")) {
    return localizedPath(locale, href);
  }

  return href;
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
    title: dictionary.site.title,
    description: dictionary.site.description,
    alternates: {
      canonical: absoluteUrl(`/${locale}`),
      languages: localeAlternates(""),
    },
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale: localeParam} = await params;
  const locale = isLocale(localeParam) ? localeParam : "en";
  const dictionary = getDictionary(locale);
  const [
    {settings, featuredRecipes: sanityFeaturedRecipes},
    chrome,
  ] = await Promise.all([
    client.fetch<HomepageData>(homepageQuery, {}, {cache: "no-store"}),
    getSiteChrome(locale, dictionary),
  ]);
  const heroLines = settings
    ? [
        resolveLocalizedString(settings.homepageHeroLine1, locale),
        resolveLocalizedString(settings.homepageHeroLine2, locale),
        resolveLocalizedString(settings.homepageHeroLine3, locale),
      ].filter(hasText)
    : dictionary.homepage.hero.lines;
  const heroIntro = resolveLocalizedString(
    settings?.homepageHeroIntro,
    locale,
    dictionary.homepage.hero.intro,
  );
  const heroCtaLabel = resolveLocalizedString(
    settings?.homepageHeroCtaLabel,
    locale,
    dictionary.homepage.hero.ctaLabel,
  );
  const heroCtaHref = settings?.homepageHeroCtaHref ?? "#recipes";
  const heroPortrait = settings?.homepageHeroPortrait?.asset
    ? {
        src: urlFor(settings.homepageHeroPortrait)
          .width(640)
          .height(860)
          .fit("crop")
          .url(),
        alt: settings.homepageHeroPortrait.alt || "Portrait for Born to Feast",
      }
    : null;
  const displayedRecipes =
    settings?.featuredRecipes?.length &&
    settings.featuredRecipes.some((recipe) => recipe.slug)
      ? settings.featuredRecipes
      : sanityFeaturedRecipes.length
        ? sanityFeaturedRecipes
        : featuredRecipes;
  const displayedCategories =
    settings?.homepageCategoryCards?.length &&
    settings.homepageCategoryCards.some((category) => category.title)
      ? settings.homepageCategoryCards
      : categories;
  const recipesEyebrow = getSetting(
    locale,
    settings?.homepageRecipesEyebrow,
    dictionary.homepage.recipesEyebrow,
  );
  const recipesHeading = getSetting(
    locale,
    settings?.homepageRecipesHeading,
    dictionary.homepage.recipesHeading,
  );
  const recipesCtaLabel = getSetting(
    locale,
    settings?.homepageRecipesCtaLabel,
    dictionary.homepage.recipesCtaLabel,
  );
  const recipesCtaHref = settings?.homepageRecipesCtaHref ?? "/recipes";
  const categoriesEyebrow = getSetting(
    locale,
    settings?.homepageCategoriesEyebrow,
    dictionary.homepage.categoriesEyebrow,
  );
  const categoriesHeading = getSetting(
    locale,
    settings?.homepageCategoriesHeading,
    dictionary.homepage.categoriesHeading,
  );
  const aboutEyebrow = getSetting(
    locale,
    settings?.homepageAboutEyebrow,
    dictionary.homepage.aboutEyebrow,
  );
  const aboutHeading = getSetting(
    locale,
    settings?.homepageAboutHeading,
    dictionary.homepage.aboutHeading,
  );
  const aboutText = getSetting(
    locale,
    settings?.homepageAboutText,
    dictionary.homepage.aboutText,
  );
  const newsletterEyebrow = getSetting(
    locale,
    settings?.homepageNewsletterEyebrow,
    dictionary.homepage.newsletterEyebrow,
  );
  const newsletterHeading = getSetting(
    locale,
    settings?.homepageNewsletterHeading,
    dictionary.homepage.newsletterHeading,
  );
  const newsletterText = getSetting(
    locale,
    settings?.homepageNewsletterText,
    dictionary.homepage.newsletterText,
  );
  const newsletterButtonLabel = getSetting(
    locale,
    settings?.homepageNewsletterButtonLabel,
    dictionary.homepage.newsletterButtonLabel,
  );

  return (
    <main className="min-h-screen bg-[#c7391f] text-[#240B36]">
      <SiteHeader
        locale={locale}
        labels={dictionary.nav}
        navigationItems={chrome.navigationItems}
      />
      <section className="relative isolate overflow-hidden border-b-4 border-[#240B36] bg-[#e55224]">
        <div className="absolute inset-0 -z-10 opacity-25 bg-[linear-gradient(90deg,#240B36_1px,transparent_1px),linear-gradient(#240B36_1px,transparent_1px)] bg-[size:42px_42px]" />
        <div className="mx-auto flex min-h-[72vh] max-w-7xl px-4 pb-14 pt-4 sm:min-h-[88vh] sm:px-8 sm:pb-28 lg:pb-32 lg:pt-10">
          <div className="flex w-full flex-col gap-6">
            <div
              className={
                heroPortrait
                  ? "mt-10 grid max-w-6xl gap-6 sm:mt-24 sm:gap-8 lg:mt-28 lg:grid-cols-[minmax(220px,0.38fr)_1fr] lg:items-center"
                  : "mt-10 max-w-6xl sm:mt-24 lg:mt-28"
              }
            >
              {heroPortrait ? (
                <div className="relative min-h-[18rem] border-4 border-[#240B36] bg-[#ffd447] shadow-[6px_6px_0_#240B36] sm:min-h-[22rem] sm:shadow-[8px_8px_0_#240B36] lg:h-full lg:min-h-0">
                  <Image
                    src={heroPortrait.src}
                    alt={heroPortrait.alt}
                    fill
                    priority
                    sizes="(min-width: 1024px) 28vw, 90vw"
                    className="object-cover"
                  />
                </div>
              ) : null}

              <div>
                {heroLines.length ? (
                  <h1 className="font-serif text-5xl font-bold lowercase leading-[0.95] sm:text-7xl sm:leading-[0.9] lg:text-8xl">
                    {heroLines.map((line, index) => (
                      <span key={`${line}-${index}`} className="block">
                        {line}
                      </span>
                    ))}
                  </h1>
                ) : null}
                {hasText(heroIntro) ? (
                  <p className="mt-5 max-w-prose text-lg font-normal leading-[1.65rem] sm:mt-6 sm:text-xl sm:leading-[1.8rem]">
                    {heroIntro}
                  </p>
                ) : null}
                {hasText(heroCtaLabel) && hasText(heroCtaHref) ? (
                  <a
                    href={localizeHref(locale, heroCtaHref)}
                    className="mt-7 inline-flex min-h-11 items-center border-2 border-[#240B36] bg-[#ffd447] px-5 py-3 text-sm font-black uppercase leading-[0.9] shadow-[4px_4px_0_#240B36] sm:mt-8 sm:px-6"
                  >
                    {heroCtaLabel}
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="recipes"
        className="bg-[#fff3c7] px-4 py-14 sm:px-8 sm:py-28 lg:py-32"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-col justify-between gap-4 border-b-4 border-[#240B36] pb-5 sm:mb-8 md:flex-row md:items-end">
            <div>
              {hasText(recipesEyebrow) ? (
                <p className="text-sm font-medium uppercase leading-[0.9] text-[#c7391f]">
                  {recipesEyebrow}
                </p>
              ) : null}
              {hasText(recipesHeading) ? (
                <h2 className="font-serif text-4xl font-black lowercase leading-[0.95] sm:text-6xl sm:leading-[0.9]">
                  {recipesHeading}
                </h2>
              ) : null}
            </div>
            {hasText(recipesCtaLabel) && hasText(recipesCtaHref) ? (
              <a
                href={localizeHref(locale, recipesCtaHref)}
                className="inline-flex min-h-11 w-fit items-center border-2 border-[#240B36] bg-[#ffd447] px-4 py-3 text-sm font-medium uppercase leading-[0.9] shadow-[4px_4px_0_#240B36]"
              >
                {recipesCtaLabel}
              </a>
            ) : null}
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {displayedRecipes.map((recipe) => {
              const title = resolveLocalizedString(recipe.title, locale);
              const description = resolveLocalizedString(
                recipe.description,
                locale,
              );
              const href =
                "slug" in recipe && recipe.slug
                  ? localizedPath(locale, `/recipes/${recipe.slug}`)
                  : recipe.href;
              const time =
                recipe.time ||
                (typeof recipe.prepTime === "number" &&
                typeof recipe.cookTime === "number"
                  ? `${recipe.prepTime + recipe.cookTime} min`
                  : undefined);
              const image =
                typeof recipe.image === "string"
                  ? recipe.image
                  : getImageSource(recipe.image, "", 1000, 750);
              const imageAlt =
                typeof recipe.image === "object"
                  ? recipe.image.alt
                  : recipe.alt;

              if (!title || !href || !image) {
                return null;
              }

              return (
              <Link
                key={title}
                href={localizeHref(locale, href)}
                className="group block border-4 border-[#240B36] bg-[#f77f1f] shadow-[6px_6px_0_#240B36] transition duration-200 hover:-translate-y-2 hover:shadow-[12px_12px_0_#240B36] sm:shadow-[8px_8px_0_#240B36]"
              >
                <div className="relative aspect-[4/3] overflow-hidden border-b-4 border-[#240B36]">
                  <Image
                    src={image}
                    alt={imageAlt || title}
                    fill
                    sizes="(min-width: 1024px) 31vw, 90vw"
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4 sm:p-5">
                  <div className="mb-4 flex flex-wrap gap-2 text-xs font-medium uppercase leading-[0.9]">
                    {resolveLocalizedString(recipe.cuisine, locale) ? (
                      <span className="border-2 border-[#240B36] bg-[#fff3c7] px-2 py-1">
                        {resolveLocalizedString(recipe.cuisine, locale)}
                      </span>
                    ) : null}
                    {recipe.difficulty ? (
                      <span className="border-2 border-[#240B36] bg-[#ffd447] px-2 py-1">
                        {recipe.difficulty}
                      </span>
                    ) : null}
                    {time ? (
                      <span className="border-2 border-[#240B36] bg-[#c7391f] px-2 py-1 text-[#fff3c7]">
                        {time}
                      </span>
                    ) : null}
                  </div>
                  <h3 className="text-2xl font-black lowercase leading-[1.65rem] sm:text-3xl sm:leading-[1.8rem]">
                    {title}
                  </h3>
                  {description ? (
                    <p className="mt-3 text-base font-normal leading-[1.575rem] sm:mt-4">
                      {description}
                    </p>
                  ) : null}
                </div>
              </Link>
              );
            })}
          </div>
        </div>
      </section>

      {settings?.showHomepageCategories === true ? (
      <section
        id="categories"
        className="bg-[#ffd447] px-4 py-14 sm:px-8 sm:py-28 lg:py-32"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 border-b-4 border-[#240B36] pb-5">
            {hasText(categoriesEyebrow) ? (
              <p className="text-sm font-medium uppercase leading-[0.9] text-[#c7391f]">
                {categoriesEyebrow}
              </p>
            ) : null}
            {hasText(categoriesHeading) ? (
              <h2 className="font-serif text-4xl font-black lowercase leading-[0.95] sm:text-6xl sm:leading-[0.9]">
                {categoriesHeading}
              </h2>
            ) : null}
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {displayedCategories.map((category) => {
              const title =
                resolveLocalizedString(category.title, locale) || category.name;
              const copy = resolveLocalizedString(category.copy, locale);
              const image =
                typeof category.image === "string"
                  ? category.image
                  : getImageSource(category.image, "", 800, 600);
              const imageAlt =
                typeof category.image === "object"
                  ? category.image.alt
                  : category.alt;

              if (!title) {
                return null;
              }

              return (
              <Link
                key={title}
                href={localizeHref(locale, category.href || "/search")}
                className="group grid border-4 border-[#240B36] bg-[#fff3c7] transition duration-200 hover:-translate-y-2 hover:shadow-[10px_10px_0_#240B36] md:grid-cols-[0.85fr_1fr]"
              >
                {image ? (
                  <div className="relative min-h-56 overflow-hidden border-b-4 border-[#240B36] md:border-b-0 md:border-r-4">
                    <Image
                      src={image}
                      alt={imageAlt || title || "Category"}
                      fill
                      sizes="(min-width: 768px) 24vw, 90vw"
                      className="object-cover transition duration-300 group-hover:scale-105"
                    />
                  </div>
                ) : null}
                <div className="p-4 sm:p-5">
                  <h3 className="font-serif text-3xl font-black lowercase leading-[0.95] sm:text-4xl sm:leading-[0.9]">
                    {title}
                  </h3>
                  {copy ? (
                    <p className="mt-3 text-base font-normal leading-[1.575rem]">
                      {copy}
                    </p>
                  ) : null}
                </div>
              </Link>
              );
            })}
          </div>
        </div>
      </section>
      ) : null}

      <section className="bg-[#240B36] px-4 py-14 text-[#fff3c7] sm:px-8 sm:py-28 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            {hasText(aboutEyebrow) ? (
              <p className="text-sm font-medium uppercase leading-[0.9] text-[#ffd447]">
                {aboutEyebrow}
              </p>
            ) : null}
            {hasText(aboutHeading) ? (
                <h2 className="font-serif text-4xl font-black lowercase leading-[0.95] sm:text-6xl sm:leading-[0.9]">
                {aboutHeading}
              </h2>
            ) : null}
          </div>
          {hasText(aboutText) ? (
            <p className="max-w-prose text-lg font-normal leading-[1.75rem] sm:text-xl sm:leading-[2.025rem]">
              {aboutText}
            </p>
          ) : null}
        </div>
      </section>

      <section
        id="newsletter"
        className="bg-[#c7391f] px-4 py-14 sm:px-8 sm:py-28 lg:py-32"
      >
        <div className="mx-auto grid max-w-7xl gap-6 border-4 border-[#240B36] bg-[#fff3c7] p-4 shadow-[6px_6px_0_#240B36] sm:p-8 sm:shadow-[8px_8px_0_#240B36] lg:grid-cols-[1fr_0.85fr] lg:items-center lg:p-10">
          <div>
            {hasText(newsletterEyebrow) ? (
              <p className="text-sm font-medium uppercase leading-[0.9] text-[#c7391f]">
                {newsletterEyebrow}
              </p>
            ) : null}
            {hasText(newsletterHeading) ? (
              <h2 className="font-serif text-4xl font-black lowercase leading-[0.95] sm:text-6xl sm:leading-[0.9]">
                {newsletterHeading}
              </h2>
            ) : null}
            {hasText(newsletterText) ? (
              <p className="mt-4 max-w-2xl text-lg font-normal leading-[1.8rem]">
                {newsletterText}
              </p>
            ) : null}
          </div>
          <form className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <label className="sr-only" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="min-h-12 w-full border-2 border-[#240B36] bg-white px-4 text-base font-normal outline-none"
            />
            <button
              type="submit"
              className="min-h-12 border-2 border-[#240B36] bg-[#ffd447] px-5 text-sm font-medium uppercase leading-[0.9] shadow-[4px_4px_0_#240B36]"
            >
              {newsletterButtonLabel}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
