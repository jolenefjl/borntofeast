import Image from "next/image";
import Link from "next/link";

const featuredRecipes = [
  {
    title: "Charred Spring Onion Oil Noodles",
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
    copy: "Curry laksa moods, sambal cravings, kopitiam breakfasts, and food that travels well.",
    image:
      "https://images.unsplash.com/photo-1625398407796-82650a8c135f?auto=format&fit=crop&w=800&q=85",
    alt: "A richly colored curry dish in a bowl",
  },
  {
    name: "Korean",
    copy: "Big comfort, bold ferments, weeknight rice, noodles, stews, and crispy things.",
    image:
      "https://images.unsplash.com/photo-1583224964978-2257b960c3d3?auto=format&fit=crop&w=800&q=85",
    alt: "Korean side dishes and rice on a table",
  },
  {
    name: "Chinese",
    copy: "Saucy stir-fries, dumpling days, noodle bowls, and simple home-style favorites.",
    image:
      "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=800&q=85",
    alt: "Steamed dumplings served with dipping sauce",
  },
  {
    name: "Fusion",
    copy: "Asian comfort food using what you can actually find in a Norwegian grocery store.",
    image:
      "https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&w=800&q=85",
    alt: "A spread of colorful Asian dishes on a table",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#c7391f] text-[#240B36]">
      <section className="relative isolate overflow-hidden border-b-4 border-[#240B36] bg-[#e55224]">
        <div className="absolute inset-0 -z-10 opacity-25 bg-[linear-gradient(90deg,#240B36_1px,transparent_1px),linear-gradient(#240B36_1px,transparent_1px)] bg-[size:42px_42px]" />
        <div className="mx-auto flex min-h-[88vh] max-w-7xl px-5 py-6 sm:px-8 lg:py-10">
          <div className="flex w-full flex-col gap-6">
            <nav
              aria-label="Main navigation"
              className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-[#240B36] pb-4 text-sm font-black uppercase"
            >
              <Link href="/" className="text-xl">
                Born to Feast
              </Link>
              <div className="flex flex-wrap gap-3">
                <a href="#recipes">Recipes</a>
                <a href="#categories">Cuisines</a>
                <a href="#newsletter">Newsletter</a>
              </div>
            </nav>

            <div className="mt-16 max-w-3xl sm:mt-24 lg:mt-28">
              <h1 className="font-serif text-6xl font-black leading-none sm:text-7xl lg:text-8xl">
                Big bowls. Loud flavors. No gatekeeping.
              </h1>
              <p className="mt-6 max-w-2xl text-xl font-medium leading-8">
                Easy recipes for Asians abroad who miss home, and for
                Norwegians discovering the Asian kitchen.
              </p>
              <a
                href="#recipes"
                className="mt-8 inline-flex border-2 border-[#240B36] bg-[#ffd447] px-6 py-3 text-sm font-black uppercase shadow-[4px_4px_0_#240B36]"
              >
                Explore
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="recipes" className="bg-[#fff3c7] px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col justify-between gap-4 border-b-4 border-[#240B36] pb-5 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-black uppercase text-[#c7391f]">
                Homepage picks
              </p>
              <h2 className="font-serif text-5xl font-black uppercase leading-none sm:text-6xl">
                Cook This Week
              </h2>
            </div>
            <a
              href="#newsletter"
              className="inline-flex w-fit border-2 border-[#240B36] bg-[#ffd447] px-4 py-3 text-sm font-black uppercase shadow-[4px_4px_0_#240B36]"
            >
              Get the feast letter
            </a>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {featuredRecipes.map((recipe) => (
              <article
                key={recipe.title}
                className="border-4 border-[#240B36] bg-[#f77f1f] shadow-[8px_8px_0_#240B36]"
              >
                <div className="relative aspect-[4/3] border-b-4 border-[#240B36]">
                  <Image
                    src={recipe.image}
                    alt={recipe.alt}
                    fill
                    sizes="(min-width: 1024px) 31vw, 90vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <div className="mb-4 flex flex-wrap gap-2 text-xs font-black uppercase">
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
                  <h3 className="text-3xl font-black leading-8">
                    {recipe.href ? (
                      <Link href={recipe.href}>{recipe.title}</Link>
                    ) : (
                      recipe.title
                    )}
                  </h3>
                  <p className="mt-4 text-base font-semibold leading-7">
                    {recipe.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="categories" className="bg-[#ffd447] px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 border-b-4 border-[#240B36] pb-5">
            <p className="text-sm font-black uppercase text-[#c7391f]">
              Browse the pantry
            </p>
            <h2 className="font-serif text-5xl font-black uppercase leading-none sm:text-6xl">
              Cuisines And Cravings
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {categories.map((category) => (
              <article
                key={category.name}
                className="grid border-4 border-[#240B36] bg-[#fff3c7] md:grid-cols-[0.85fr_1fr]"
              >
                <div className="relative min-h-56 border-b-4 border-[#240B36] md:border-b-0 md:border-r-4">
                  <Image
                    src={category.image}
                    alt={category.alt}
                    fill
                    sizes="(min-width: 768px) 24vw, 90vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-4xl font-black uppercase">
                    {category.name}
                  </h3>
                  <p className="mt-3 text-base font-semibold leading-7">
                    {category.copy}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#240B36] px-5 py-16 text-[#fff3c7] sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase text-[#ffd447]">
              About Jo
            </p>
            <h2 className="font-serif text-5xl font-black uppercase leading-none sm:text-6xl">
              Malaysian Roots, Norway Kitchen.
            </h2>
          </div>
          <p className="text-xl font-bold leading-9">
            Born to Feast is for the homesick, the curious, the hungry, and the
            people standing in a Norwegian supermarket wondering which chilli
            paste will get them closest. Come for quick dinners, stay for the
            recipes that ask for a whole afternoon and reward you properly.
          </p>
        </div>
      </section>

      <section id="newsletter" className="bg-[#c7391f] px-5 py-16 sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 border-4 border-[#240B36] bg-[#fff3c7] p-6 shadow-[8px_8px_0_#240B36] lg:grid-cols-[1fr_0.85fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase text-[#c7391f]">
              The Feast Letter
            </p>
            <h2 className="font-serif text-5xl font-black uppercase leading-none sm:text-6xl">
              Get Hungry Before Friday.
            </h2>
            <p className="mt-4 max-w-2xl text-lg font-semibold leading-8">
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
              className="min-h-12 border-2 border-[#240B36] bg-white px-4 text-base font-bold outline-none"
            />
            <button
              type="submit"
              className="min-h-12 border-2 border-[#240B36] bg-[#ffd447] px-5 text-sm font-black uppercase shadow-[4px_4px_0_#240B36]"
            >
              Sign up
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
