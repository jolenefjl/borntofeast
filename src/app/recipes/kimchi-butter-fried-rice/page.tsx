import Image from "next/image";
import Link from "next/link";
import {PortableText} from "next-sanity";
import {notFound} from "next/navigation";

import {client} from "@/sanity/lib/client";
import {urlFor} from "@/sanity/lib/image";

export const dynamic = "force-dynamic";

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

function formatIngredientAmount(quantity?: number, unit?: string) {
  return [quantity, unit].filter(Boolean).join(" ");
}

function getFirstBlockText(blocks?: PortableBlock[]) {
  return blocks?.[0]?.children?.map((child) => child.text).join("") || "";
}

export default async function RecipePage() {
  const recipe = await client.fetch<Recipe | null>(recipeQuery, {
    slug: "kimchi-butter-fried-rice",
  });

  if (!recipe) {
    notFound();
  }

  const totalTime = recipe.prepTime + recipe.cookTime;
  const heroImage = recipe.heroImage?.asset
    ? urlFor(recipe.heroImage).width(1400).height(1100).fit("crop").url()
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
    <main className="min-h-screen bg-[#fff3c7] text-[#240B36]">
      <section className="border-b-4 border-[#240B36] bg-[#e55224] px-5 py-6 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <nav className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b-2 border-[#240B36] pb-4 text-sm font-black uppercase">
            <Link href="/" aria-label="Born to Feast home">
              <Image
                src="/born-to-feast-logo.svg"
                alt="Born to Feast"
                width={121}
                height={47}
                priority
                className="h-auto w-[7.2rem] sm:w-[8.4rem]"
              />
            </Link>
            <div className="flex flex-wrap gap-3">
              <Link href="/#recipes">Recipes</Link>
              <Link href="/#categories">Cuisines</Link>
              <Link href="/studio">Studio</Link>
            </div>
          </nav>

          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="mb-4 inline-flex border-2 border-[#240B36] bg-[#ffd447] px-3 py-2 text-sm font-black uppercase">
                {recipe.cuisineType} | {recipe.difficulty} | {totalTime} min
              </p>
              <h1 className="font-serif text-6xl font-black uppercase leading-none text-[#fff3c7] sm:text-7xl lg:text-8xl">
                {recipe.title}
              </h1>
              {recipe.intro ? (
                <p className="mt-6 max-w-2xl text-xl font-bold leading-8 text-[#fff3c7]">
                  {recipe.intro}
                </p>
              ) : null}
            </div>

            <div className="relative min-h-[440px] border-4 border-[#240B36] bg-[#ffd447] p-3 shadow-[10px_10px_0_#240B36]">
              <Image
                src={heroImage}
                alt={heroAlt}
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 90vw"
                className="object-cover p-3"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#ffd447] px-5 py-8 sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-3 text-sm font-black uppercase sm:grid-cols-2 lg:grid-cols-5">
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

      <section className="bg-[#fff3c7] px-5 py-14 sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <aside className="h-fit border-4 border-[#240B36] bg-[#f77f1f] p-5 shadow-[8px_8px_0_#240B36] lg:sticky lg:top-6">
            <div className="mb-5 flex flex-wrap gap-3">
              <button className="border-2 border-[#240B36] bg-[#ffd447] px-4 py-3 text-sm font-black uppercase shadow-[4px_4px_0_#240B36]">
                Print recipe
              </button>
              <button className="border-2 border-[#240B36] bg-[#fff3c7] px-4 py-3 text-sm font-black uppercase shadow-[4px_4px_0_#240B36]">
                Cooking mode
              </button>
            </div>

            <div className="mb-5 border-2 border-[#240B36] bg-[#fff3c7] p-4">
              <p className="text-sm font-black uppercase text-[#c7391f]">
                Servings scaler
              </p>
              <div className="mt-3 flex items-center gap-3">
                <button className="h-10 w-10 border-2 border-[#240B36] bg-white text-xl font-black">
                  -
                </button>
                <span className="text-3xl font-black">{recipe.servings}</span>
                <button className="h-10 w-10 border-2 border-[#240B36] bg-white text-xl font-black">
                  +
                </button>
              </div>
            </div>

            <h2 className="font-serif text-4xl font-black uppercase">
              Ingredients
            </h2>
            <ul className="mt-4 divide-y-2 divide-[#240B36] border-y-2 border-[#240B36] bg-[#fff3c7]">
              {recipe.ingredients?.map((ingredient) => (
                <li
                  key={ingredient._key}
                  className="grid grid-cols-[5.5rem_1fr] gap-3 py-3"
                >
                  <span className="font-black">
                    {formatIngredientAmount(ingredient.quantity, ingredient.unit)}
                  </span>
                  <span>
                    <span className="font-bold">{ingredient.name}</span>
                    {ingredient.note ? (
                      <span className="block text-sm font-semibold text-[#7b2418]">
                        {ingredient.note}
                      </span>
                    ) : null}
                  </span>
                </li>
              ))}
            </ul>
          </aside>

          <div className="space-y-8">
            {recipe.intro ? (
              <section className="border-4 border-[#240B36] bg-[#ffd447] p-5">
                <p className="text-sm font-black uppercase text-[#c7391f]">
                  Why I love this
                </p>
                <p className="mt-3 text-xl font-bold leading-9">
                  {recipe.intro}
                </p>
              </section>
            ) : null}

            <section>
              <div className="mb-5 border-b-4 border-[#240B36] pb-4">
                <p className="text-sm font-black uppercase text-[#c7391f]">
                  Step by step
                </p>
                <h2 className="font-serif text-5xl font-black uppercase leading-none">
                  Method
                </h2>
              </div>
              <ol className="space-y-5">
                {recipe.methodSteps?.map((step, index) => (
                  <li
                    key={step._key}
                    className="grid gap-4 border-4 border-[#240B36] bg-white p-5 md:grid-cols-[4.5rem_1fr]"
                  >
                    <span className="flex h-16 w-16 items-center justify-center border-2 border-[#240B36] bg-[#c7391f] text-3xl font-black text-[#fff3c7]">
                      {index + 1}
                    </span>
                    <div className="text-lg font-semibold leading-8">
                      {step.content ? (
                        <PortableText value={step.content} />
                      ) : (
                        getFirstBlockText(step.content)
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {recipe.tipsAndNotes?.length ? (
              <section className="border-4 border-[#240B36] bg-[#e55224] p-5 text-[#fff3c7]">
                <h2 className="font-serif text-4xl font-black uppercase">
                  Tips & Notes
                </h2>
                <div className="mt-4 space-y-3 text-lg font-bold leading-8">
                  <PortableText value={recipe.tipsAndNotes} />
                </div>
              </section>
            ) : null}

            <section className="grid gap-4 md:grid-cols-3">
              {gallery.map((image) => (
                <div
                  key={image.src}
                  className="relative min-h-64 border-4 border-[#240B36] bg-[#ffd447]"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(min-width: 768px) 30vw, 90vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </section>

            <section className="border-4 border-[#240B36] bg-[#240B36] p-5 text-[#fff3c7]">
              <p className="text-sm font-black uppercase text-[#ffd447]">
                TikTok
              </p>
              <div className="mt-4 flex min-h-64 items-center justify-center border-2 border-dashed border-[#ffd447] p-6 text-center">
                <p className="max-w-md text-2xl font-black">
                  {recipe.tiktokUrl
                    ? recipe.tiktokUrl
                    : "TikTok embed appears here when the recipe has a video URL."}
                </p>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
