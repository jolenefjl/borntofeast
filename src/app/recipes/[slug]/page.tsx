import Image from "next/image";
import {notFound} from "next/navigation";

import {SiteHeader} from "@/app/components/SiteHeader";
import {RecipeContent} from "@/app/recipes/[slug]/RecipeContent";
import {client} from "@/sanity/lib/client";
import {urlFor} from "@/sanity/lib/image";

export const dynamic = "force-dynamic";

type RecipePageProps = {
  params: Promise<{
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

type PortableBlock = {
  _key: string;
  _type: "block";
  children?: {text?: string}[];
};

type Recipe = {
  title: string;
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
  intro?: string;
  ingredients?: {
    _key: string;
    quantity?: number;
    unit?: string;
    name: string;
    note?: string;
  }[];
  methodSteps?: {
    _key: string;
    content?: PortableBlock[];
    ingredients?: {
      _key: string;
      quantity?: number;
      unit?: string;
      name: string;
      note?: string;
    }[];
  }[];
  tipsAndNotes?: PortableBlock[];
  tiktokUrl?: string;
};

const recipeQuery = `*[_type == "recipe" && slug.current == $slug][0]{
  title,
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
  tiktokUrl
}`;

export default async function RecipePage({params}: RecipePageProps) {
  const {slug} = await params;
  const recipe = await client.fetch<Recipe | null>(recipeQuery, {
    slug,
  });

  if (!recipe) {
    notFound();
  }

  const totalTime = recipe.prepTime + recipe.cookTime;
  const heroImage = recipe.heroImage?.asset
    ? urlFor(recipe.heroImage).width(1000).height(1300).fit("crop").url()
    : fallbackHeroImage;
  const heroAlt =
    recipe.heroImage?.alt || `${recipe.title} served in a colorful bowl`;
  const gallery =
    recipe.gallery?.length && recipe.gallery.some((image) => image.asset)
      ? recipe.gallery
          .filter((image) => image.asset)
          .map((image) => ({
            src: urlFor(image).width(900).height(700).fit("crop").url(),
            alt: image.alt || recipe.title,
          }))
      : fallbackGallery;

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#fff3c7] text-[#240B36]">
      <SiteHeader />
      <section className="border-b-4 border-[#240B36] bg-[#e55224] px-4 py-10 sm:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.78fr_1fr] lg:items-center">
            <div className="relative min-h-[28rem] border-4 border-[#240B36] bg-[#ffd447] p-3 shadow-[8px_8px_0_#240B36] sm:min-h-[38rem] lg:min-h-[44rem]">
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
              <p className="mb-4 inline-flex border-2 border-[#240B36] bg-[#ffd447] px-3 py-2 text-sm font-medium uppercase leading-[0.9]">
                {recipe.cuisineType} | {recipe.difficulty} | {totalTime} min
              </p>
              <h1 className="font-serif text-5xl font-black lowercase leading-[0.9] text-[#fff3c7] sm:text-7xl lg:text-8xl">
                {recipe.title}
              </h1>
              {recipe.intro ? (
                <p className="mt-6 max-w-2xl text-xl font-normal leading-[1.8rem] text-[#fff3c7]">
                  {recipe.intro}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#ffd447] px-5 py-8 sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-3 text-sm font-medium uppercase leading-[0.9] sm:grid-cols-2 lg:grid-cols-5">
          {[
            ["Prep", `${recipe.prepTime} min`],
            ["Cook", `${recipe.cookTime} min`],
            ["Serves", `${recipe.servings}`],
            ["Difficulty", recipe.difficulty],
            ["Cuisine", recipe.cuisineType],
          ].map(([label, value]) => (
            <div
              key={label}
              className="border-2 border-[#240B36] bg-[#fff3c7] p-4"
            >
              <p className="text-[#c7391f]">{label}</p>
              <p className="mt-1 text-2xl text-[#240B36]">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <RecipeContent
        baseServings={recipe.servings}
        ingredients={recipe.ingredients}
        methodSteps={recipe.methodSteps}
        tipsAndNotes={recipe.tipsAndNotes}
        gallery={gallery}
        tiktokUrl={recipe.tiktokUrl}
      />
    </main>
  );
}
