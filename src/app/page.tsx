import Image from "next/image";
import Link from "next/link";

import {SiteHeader} from "@/app/components/SiteHeader";
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
  homepageHeroLine1?: string;
  homepageHeroLine2?: string;
  homepageHeroLine3?: string;
  homepageHeroIntro?: string;
  homepageHeroCtaLabel?: string;
  homepageHeroCtaHref?: string;
  homepageHeroPortrait?: {
    alt?: string;
    asset?: unknown;
  };
  featuredRecipes?: RecipeCard[];
  homepageRecipesEyebrow?: string;
  homepageRecipesHeading?: string;
  homepageRecipesCtaLabel?: string;
  homepageRecipesCtaHref?: string;
  homepageCategoriesEyebrow?: string;
  homepageCategoriesHeading?: string;
  homepageCategoryCards?: CategoryCard[];
  homepageAboutEyebrow?: string;
  homepageAboutHeading?: string;
  homepageAboutText?: string;
  homepageNewsletterEyebrow?: string;
  homepageNewsletterHeading?: string;
  homepageNewsletterText?: string;
  homepageNewsletterButtonLabel?: string;
};

type HomepageData = {
  settings: SiteSettings | null;
  featuredRecipes: RecipeCard[];
};

type RecipeCard = {
  title?: string;
  href?: string;
  slug?: string;
  cuisine?: string;
  difficulty?: string;
  time?: string;
  prepTime?: number;
  cookTime?: number;
  description?: string;
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
  title?: string;
  href?: string;
  copy?: string;
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
      "cuisine": cuisineType,
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
    "cuisine": cuisineType,
    difficulty,
    prepTime,
    cookTime,
    "description": intro,
    "image": heroImage
  }
}`;

const defaultHero = {
  line1: "Big bowls.",
  line2: "Loud flavors.",
  line3: "No gatekeeping.",
  intro:
    "Easy recipes for Asians abroad who miss home, and for Norwegians discovering the Asian kitchen.",
  ctaLabel: "Explore",
  ctaHref: "#recipes",
};

const defaultHomepageCopy = {
  recipesEyebrow: "homepage picks",
  recipesHeading: "cook this week",
  recipesCtaLabel: "get the feast letter",
  recipesCtaHref: "#newsletter",
  categoriesEyebrow: "browse the pantry",
  categoriesHeading: "cuisines and cravings",
  aboutEyebrow: "about jo",
  aboutHeading: "malaysian roots, norway kitchen.",
  aboutText:
    "Born to Feast is for the homesick, the curious, the hungry, and the people standing in a Norwegian supermarket wondering which chilli paste will get them closest. Come for quick dinners, stay for the recipes that ask for a whole afternoon and reward you properly.",
  newsletterEyebrow: "the feast letter",
  newsletterHeading: "get hungry before friday.",
  newsletterText: "One recipe, one pantry note, and one thing worth eating this week.",
  newsletterButtonLabel: "sign up",
};

function hasText(value?: string) {
  return Boolean(value?.trim());
}

function getSetting(
  settings: SiteSettings | null,
  value: string | null | undefined,
  fallback: string,
) {
  return settings && value != null ? value : fallback;
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

export default async function Home() {
  const {settings, featuredRecipes: sanityFeaturedRecipes} =
    await client.fetch<HomepageData>(homepageQuery);
  const heroLines = settings
    ? [
        settings.homepageHeroLine1,
        settings.homepageHeroLine2,
        settings.homepageHeroLine3,
      ].filter(hasText)
    : [defaultHero.line1, defaultHero.line2, defaultHero.line3];
  const heroIntro = settings?.homepageHeroIntro ?? defaultHero.intro;
  const heroCtaLabel = settings?.homepageHeroCtaLabel ?? defaultHero.ctaLabel;
  const heroCtaHref = settings?.homepageHeroCtaHref ?? defaultHero.ctaHref;
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
    settings,
    settings?.homepageRecipesEyebrow,
    defaultHomepageCopy.recipesEyebrow,
  );
  const recipesHeading = getSetting(
    settings,
    settings?.homepageRecipesHeading,
    defaultHomepageCopy.recipesHeading,
  );
  const recipesCtaLabel = getSetting(
    settings,
    settings?.homepageRecipesCtaLabel,
    defaultHomepageCopy.recipesCtaLabel,
  );
  const recipesCtaHref = getSetting(
    settings,
    settings?.homepageRecipesCtaHref,
    defaultHomepageCopy.recipesCtaHref,
  );
  const categoriesEyebrow = getSetting(
    settings,
    settings?.homepageCategoriesEyebrow,
    defaultHomepageCopy.categoriesEyebrow,
  );
  const categoriesHeading = getSetting(
    settings,
    settings?.homepageCategoriesHeading,
    defaultHomepageCopy.categoriesHeading,
  );
  const aboutEyebrow = getSetting(
    settings,
    settings?.homepageAboutEyebrow,
    defaultHomepageCopy.aboutEyebrow,
  );
  const aboutHeading = getSetting(
    settings,
    settings?.homepageAboutHeading,
    defaultHomepageCopy.aboutHeading,
  );
  const aboutText = getSetting(
    settings,
    settings?.homepageAboutText,
    defaultHomepageCopy.aboutText,
  );
  const newsletterEyebrow = getSetting(
    settings,
    settings?.homepageNewsletterEyebrow,
    defaultHomepageCopy.newsletterEyebrow,
  );
  const newsletterHeading = getSetting(
    settings,
    settings?.homepageNewsletterHeading,
    defaultHomepageCopy.newsletterHeading,
  );
  const newsletterText = getSetting(
    settings,
    settings?.homepageNewsletterText,
    defaultHomepageCopy.newsletterText,
  );
  const newsletterButtonLabel = getSetting(
    settings,
    settings?.homepageNewsletterButtonLabel,
    defaultHomepageCopy.newsletterButtonLabel,
  );

  return (
    <main className="min-h-screen bg-[#c7391f] text-[#240B36]">
      <SiteHeader />
      <section className="relative isolate overflow-hidden border-b-4 border-[#240B36] bg-[#e55224]">
        <div className="absolute inset-0 -z-10 opacity-25 bg-[linear-gradient(90deg,#240B36_1px,transparent_1px),linear-gradient(#240B36_1px,transparent_1px)] bg-[size:42px_42px]" />
        <div className="mx-auto flex min-h-[88vh] max-w-7xl px-5 pb-20 pt-6 sm:px-8 sm:pb-28 lg:pb-32 lg:pt-10">
          <div className="flex w-full flex-col gap-6">
            <div
              className={
                heroPortrait
                  ? "mt-16 grid max-w-6xl gap-8 sm:mt-24 lg:mt-28 lg:grid-cols-[minmax(220px,0.38fr)_1fr] lg:items-center"
                  : "mt-16 max-w-6xl sm:mt-24 lg:mt-28"
              }
            >
              {heroPortrait ? (
                <div className="relative min-h-[22rem] border-4 border-[#240B36] bg-[#ffd447] shadow-[8px_8px_0_#240B36] lg:h-full lg:min-h-0">
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
                  <h1 className="font-serif text-6xl font-bold lowercase leading-[0.9] sm:text-7xl lg:text-8xl">
                    {heroLines.map((line, index) => (
                      <span key={`${line}-${index}`} className="block">
                        {line}
                      </span>
                    ))}
                  </h1>
                ) : null}
                {hasText(heroIntro) ? (
                  <p className="mt-6 max-w-2xl text-xl font-normal leading-[1.8rem]">
                    {heroIntro}
                  </p>
                ) : null}
                {hasText(heroCtaLabel) && hasText(heroCtaHref) ? (
                  <a
                    href={heroCtaHref}
                    className="mt-8 inline-flex border-2 border-[#240B36] bg-[#ffd447] px-6 py-3 text-sm font-black uppercase leading-[0.9] shadow-[4px_4px_0_#240B36]"
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
        className="bg-[#fff3c7] px-5 py-20 sm:px-8 sm:py-28 lg:py-32"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col justify-between gap-4 border-b-4 border-[#240B36] pb-5 md:flex-row md:items-end">
            <div>
              {hasText(recipesEyebrow) ? (
                <p className="text-sm font-medium uppercase leading-[0.9] text-[#c7391f]">
                  {recipesEyebrow}
                </p>
              ) : null}
              {hasText(recipesHeading) ? (
                <h2 className="font-serif text-5xl font-black lowercase leading-[0.9] sm:text-6xl">
                  {recipesHeading}
                </h2>
              ) : null}
            </div>
            {hasText(recipesCtaLabel) && hasText(recipesCtaHref) ? (
              <a
                href={recipesCtaHref}
                className="inline-flex w-fit border-2 border-[#240B36] bg-[#ffd447] px-4 py-3 text-sm font-medium uppercase leading-[0.9] shadow-[4px_4px_0_#240B36]"
              >
                {recipesCtaLabel}
              </a>
            ) : null}
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {displayedRecipes.map((recipe) => {
              const href =
                "slug" in recipe && recipe.slug
                  ? `/recipes/${recipe.slug}`
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

              if (!recipe.title || !href || !image) {
                return null;
              }

              return (
              <Link
                key={recipe.title}
                href={href}
                className="group block border-4 border-[#240B36] bg-[#f77f1f] shadow-[8px_8px_0_#240B36] transition duration-200 hover:-translate-y-2 hover:shadow-[12px_12px_0_#240B36]"
              >
                <div className="relative aspect-[4/3] overflow-hidden border-b-4 border-[#240B36]">
                  <Image
                    src={image}
                    alt={imageAlt || recipe.title}
                    fill
                    sizes="(min-width: 1024px) 31vw, 90vw"
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <div className="mb-4 flex flex-wrap gap-2 text-xs font-medium uppercase leading-[0.9]">
                    {recipe.cuisine ? (
                      <span className="border-2 border-[#240B36] bg-[#fff3c7] px-2 py-1">
                        {recipe.cuisine}
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
                  <h3 className="text-3xl font-black lowercase leading-[1.8rem]">
                    {recipe.title}
                  </h3>
                  {recipe.description ? (
                    <p className="mt-4 text-base font-normal leading-[1.575rem]">
                      {recipe.description}
                    </p>
                  ) : null}
                </div>
              </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section
        id="categories"
        className="bg-[#ffd447] px-5 py-20 sm:px-8 sm:py-28 lg:py-32"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 border-b-4 border-[#240B36] pb-5">
            {hasText(categoriesEyebrow) ? (
              <p className="text-sm font-medium uppercase leading-[0.9] text-[#c7391f]">
                {categoriesEyebrow}
              </p>
            ) : null}
            {hasText(categoriesHeading) ? (
              <h2 className="font-serif text-5xl font-black lowercase leading-[0.9] sm:text-6xl">
                {categoriesHeading}
              </h2>
            ) : null}
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {displayedCategories.map((category) => {
              const image =
                typeof category.image === "string"
                  ? category.image
                  : getImageSource(category.image, "", 800, 600);
              const imageAlt =
                typeof category.image === "object"
                  ? category.image.alt
                  : category.alt;

              if (!category.title && !category.name) {
                return null;
              }

              return (
              <Link
                key={category.title || category.name}
                href={category.href || "/search"}
                className="group grid border-4 border-[#240B36] bg-[#fff3c7] transition duration-200 hover:-translate-y-2 hover:shadow-[10px_10px_0_#240B36] md:grid-cols-[0.85fr_1fr]"
              >
                {image ? (
                  <div className="relative min-h-56 overflow-hidden border-b-4 border-[#240B36] md:border-b-0 md:border-r-4">
                    <Image
                      src={image}
                      alt={imageAlt || category.title || category.name || "Category"}
                      fill
                      sizes="(min-width: 768px) 24vw, 90vw"
                      className="object-cover transition duration-300 group-hover:scale-105"
                    />
                  </div>
                ) : null}
                <div className="p-5">
                  <h3 className="font-serif text-4xl font-black lowercase leading-[0.9]">
                    {category.title || category.name}
                  </h3>
                  {category.copy ? (
                    <p className="mt-3 text-base font-normal leading-[1.575rem]">
                      {category.copy}
                    </p>
                  ) : null}
                </div>
              </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#240B36] px-5 py-20 text-[#fff3c7] sm:px-8 sm:py-28 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            {hasText(aboutEyebrow) ? (
              <p className="text-sm font-medium uppercase leading-[0.9] text-[#ffd447]">
                {aboutEyebrow}
              </p>
            ) : null}
            {hasText(aboutHeading) ? (
              <h2 className="font-serif text-5xl font-black lowercase leading-[0.9] sm:text-6xl">
                {aboutHeading}
              </h2>
            ) : null}
          </div>
          {hasText(aboutText) ? (
            <p className="text-xl font-normal leading-[2.025rem]">
              {aboutText}
            </p>
          ) : null}
        </div>
      </section>

      <section
        id="newsletter"
        className="bg-[#c7391f] px-5 py-20 sm:px-8 sm:py-28 lg:py-32"
      >
        <div className="mx-auto grid max-w-7xl gap-6 border-4 border-[#240B36] bg-[#fff3c7] p-6 shadow-[8px_8px_0_#240B36] sm:p-8 lg:grid-cols-[1fr_0.85fr] lg:items-center lg:p-10">
          <div>
            {hasText(newsletterEyebrow) ? (
              <p className="text-sm font-medium uppercase leading-[0.9] text-[#c7391f]">
                {newsletterEyebrow}
              </p>
            ) : null}
            {hasText(newsletterHeading) ? (
              <h2 className="font-serif text-5xl font-black lowercase leading-[0.9] sm:text-6xl">
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
              className="min-h-12 border-2 border-[#240B36] bg-white px-4 text-base font-normal outline-none"
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
