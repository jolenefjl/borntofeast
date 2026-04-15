import Image from "next/image";
import Link from "next/link";

import {SiteHeader} from "@/app/components/SiteHeader";
import {client} from "@/sanity/lib/client";
import {urlFor} from "@/sanity/lib/image";

export const dynamic = "force-dynamic";

const featuredRecipes = [
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

const categories = [
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
};

const siteSettingsQuery = `*[_type == "siteSettings" && _id == "siteSettings"][0]{
  homepageHeroLine1,
  homepageHeroLine2,
  homepageHeroLine3,
  homepageHeroIntro,
  homepageHeroCtaLabel,
  homepageHeroCtaHref,
  homepageHeroPortrait
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

export default async function Home() {
  const settings = await client.fetch<SiteSettings | null>(siteSettingsQuery);
  const heroLines = [
    settings?.homepageHeroLine1 || defaultHero.line1,
    settings?.homepageHeroLine2 || defaultHero.line2,
    settings?.homepageHeroLine3 || defaultHero.line3,
  ];
  const heroIntro = settings?.homepageHeroIntro || defaultHero.intro;
  const heroCtaLabel = settings?.homepageHeroCtaLabel || defaultHero.ctaLabel;
  const heroCtaHref = settings?.homepageHeroCtaHref || defaultHero.ctaHref;
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
                <h1 className="font-serif text-6xl font-bold lowercase leading-[0.9] sm:text-7xl lg:text-8xl">
                  {heroLines.map((line, index) => (
                    <span key={`${line}-${index}`} className="block">
                      {line}
                    </span>
                  ))}
                </h1>
                <p className="mt-6 max-w-2xl text-xl font-normal leading-[1.8rem]">
                  {heroIntro}
                </p>
                <a
                  href={heroCtaHref}
                  className="mt-8 inline-flex border-2 border-[#240B36] bg-[#ffd447] px-6 py-3 text-sm font-black uppercase leading-[0.9] shadow-[4px_4px_0_#240B36]"
                >
                  {heroCtaLabel}
                </a>
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
              <p className="text-sm font-medium uppercase leading-[0.9] text-[#c7391f]">
                homepage picks
              </p>
              <h2 className="font-serif text-5xl font-black lowercase leading-[0.9] sm:text-6xl">
                cook this week
              </h2>
            </div>
            <a
              href="#newsletter"
              className="inline-flex w-fit border-2 border-[#240B36] bg-[#ffd447] px-4 py-3 text-sm font-medium uppercase leading-[0.9] shadow-[4px_4px_0_#240B36]"
            >
              get the feast letter
            </a>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {featuredRecipes.map((recipe) => (
              <Link
                key={recipe.title}
                href={recipe.href}
                className="group block border-4 border-[#240B36] bg-[#f77f1f] shadow-[8px_8px_0_#240B36] transition duration-200 hover:-translate-y-2 hover:shadow-[12px_12px_0_#240B36]"
              >
                <div className="relative aspect-[4/3] overflow-hidden border-b-4 border-[#240B36]">
                  <Image
                    src={recipe.image}
                    alt={recipe.alt}
                    fill
                    sizes="(min-width: 1024px) 31vw, 90vw"
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <div className="mb-4 flex flex-wrap gap-2 text-xs font-medium uppercase leading-[0.9]">
                    <span className="border-2 border-[#240B36] bg-[#fff3c7] px-2 py-1">
                      {recipe.cuisine}
                    </span>
                    <span className="border-2 border-[#240B36] bg-[#ffd447] px-2 py-1">
                      {recipe.difficulty}
                    </span>
                    <span className="border-2 border-[#240B36] bg-[#c7391f] px-2 py-1 text-[#fff3c7]">
                      {recipe.time}
                    </span>
                  </div>
                  <h3 className="text-3xl font-black lowercase leading-[1.8rem]">
                    {recipe.title}
                  </h3>
                  <p className="mt-4 text-base font-normal leading-[1.575rem]">
                    {recipe.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section
        id="categories"
        className="bg-[#ffd447] px-5 py-20 sm:px-8 sm:py-28 lg:py-32"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 border-b-4 border-[#240B36] pb-5">
            <p className="text-sm font-medium uppercase leading-[0.9] text-[#c7391f]">
              browse the pantry
            </p>
            <h2 className="font-serif text-5xl font-black lowercase leading-[0.9] sm:text-6xl">
              cuisines and cravings
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="group grid border-4 border-[#240B36] bg-[#fff3c7] transition duration-200 hover:-translate-y-2 hover:shadow-[10px_10px_0_#240B36] md:grid-cols-[0.85fr_1fr]"
              >
                <div className="relative min-h-56 overflow-hidden border-b-4 border-[#240B36] md:border-b-0 md:border-r-4">
                  <Image
                    src={category.image}
                    alt={category.alt}
                    fill
                    sizes="(min-width: 768px) 24vw, 90vw"
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-4xl font-black lowercase leading-[0.9]">
                    {category.name}
                  </h3>
                  <p className="mt-3 text-base font-normal leading-[1.575rem]">
                    {category.copy}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#240B36] px-5 py-20 text-[#fff3c7] sm:px-8 sm:py-28 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="text-sm font-medium uppercase leading-[0.9] text-[#ffd447]">
              about jo
            </p>
            <h2 className="font-serif text-5xl font-black lowercase leading-[0.9] sm:text-6xl">
              malaysian roots, norway kitchen.
            </h2>
          </div>
          <p className="text-xl font-normal leading-[2.025rem]">
            Born to Feast is for the homesick, the curious, the hungry, and the
            people standing in a Norwegian supermarket wondering which chilli
            paste will get them closest. Come for quick dinners, stay for the
            recipes that ask for a whole afternoon and reward you properly.
          </p>
        </div>
      </section>

      <section
        id="newsletter"
        className="bg-[#c7391f] px-5 py-20 sm:px-8 sm:py-28 lg:py-32"
      >
        <div className="mx-auto grid max-w-7xl gap-6 border-4 border-[#240B36] bg-[#fff3c7] p-6 shadow-[8px_8px_0_#240B36] sm:p-8 lg:grid-cols-[1fr_0.85fr] lg:items-center lg:p-10">
          <div>
            <p className="text-sm font-medium uppercase leading-[0.9] text-[#c7391f]">
              the feast letter
            </p>
            <h2 className="font-serif text-5xl font-black lowercase leading-[0.9] sm:text-6xl">
              get hungry before friday.
            </h2>
            <p className="mt-4 max-w-2xl text-lg font-normal leading-[1.8rem]">
              One recipe, one pantry note, and one thing worth eating this week.
            </p>
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
              sign up
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
