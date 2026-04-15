import Image from "next/image";
import Link from "next/link";

const ingredients = [
  {amount: "2 cups", item: "cooked short-grain rice", note: "day-old is best"},
  {amount: "1 cup", item: "kimchi", note: "roughly chopped"},
  {amount: "2 tbsp", item: "kimchi juice", note: "from the jar"},
  {amount: "1 tbsp", item: "gochujang", note: "use less for mild heat"},
  {amount: "2 tbsp", item: "butter", note: "plus more if your heart says yes"},
  {amount: "1 tsp", item: "soy sauce", note: "or tamari"},
  {amount: "2", item: "eggs", note: "fried sunny side up"},
  {amount: "2", item: "spring onions", note: "thinly sliced"},
  {amount: "1 sheet", item: "roasted seaweed", note: "crushed over the top"},
];

const steps = [
  "Warm a large frying pan over medium-high heat. Add one tablespoon of butter, then the chopped kimchi. Cook until the edges darken and the kitchen smells sharp, buttery, and slightly sweet.",
  "Stir in the gochujang, kimchi juice, and soy sauce. Let it bubble for a minute so the sauce thickens and stops tasting raw.",
  "Add the rice and press it into the pan. Break up any clumps, then toss until every grain is glossy and orange-red. Add the remaining butter and fold it through.",
  "Taste and adjust. More soy for salt, more kimchi juice for tang, a tiny pinch of sugar if the kimchi is very sour.",
  "Top with fried eggs, spring onions, seaweed, and sesame seeds. Eat while the edges are still hot and a little crispy.",
];

const tips = [
  "If your rice is fresh, spread it on a tray for 10 minutes so the steam escapes before frying.",
  "Norwegian supermarket swap: use sriracha plus a pinch of sugar if you cannot find gochujang yet.",
  "Add bacon, mushrooms, tofu, or leftover roast chicken when you want it to become dinner-dinner.",
];

const gallery = [
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

export default function RecipePage() {
  return (
    <main className="min-h-screen bg-[#fff3c7] text-[#230b05]">
      <section className="border-b-4 border-[#230b05] bg-[#e55224] px-5 py-6 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <nav className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b-2 border-[#230b05] pb-4 text-sm font-black uppercase">
            <Link href="/">Born to Feast</Link>
            <div className="flex flex-wrap gap-3">
              <Link href="/#recipes">Recipes</Link>
              <Link href="/#categories">Cuisines</Link>
              <Link href="/studio">Studio</Link>
            </div>
          </nav>

          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="mb-4 inline-flex border-2 border-[#230b05] bg-[#ffd447] px-3 py-2 text-sm font-black uppercase">
                Korean | Easy | 18 min
              </p>
              <h1 className="font-serif text-6xl font-black uppercase leading-none text-[#fff3c7] sm:text-7xl lg:text-8xl">
                Kimchi Butter Fried Rice
              </h1>
              <p className="mt-6 max-w-2xl text-xl font-bold leading-8 text-[#fff3c7]">
                Sharp kimchi, soft egg, butter, and rice that tastes like coming
                home after a long day. This is the emergency dinner I make when
                I want something loud, fast, and properly comforting.
              </p>
            </div>

            <div className="relative min-h-[440px] border-4 border-[#230b05] bg-[#ffd447] p-3 shadow-[10px_10px_0_#230b05]">
              <Image
                src="https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1400&q=85"
                alt="A bowl of kimchi fried rice topped with egg and herbs"
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
            ["Prep", "8 min"],
            ["Cook", "10 min"],
            ["Serves", "2"],
            ["Difficulty", "Easy"],
            ["Heat", "Medium"],
          ].map(([label, value]) => (
            <div key={label} className="border-2 border-[#230b05] bg-[#fff3c7] p-4">
              <p className="text-[#c7391f]">{label}</p>
              <p className="mt-1 text-2xl text-[#230b05]">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#fff3c7] px-5 py-14 sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <aside className="h-fit border-4 border-[#230b05] bg-[#f77f1f] p-5 shadow-[8px_8px_0_#230b05] lg:sticky lg:top-6">
            <div className="mb-5 flex flex-wrap gap-3">
              <button className="border-2 border-[#230b05] bg-[#ffd447] px-4 py-3 text-sm font-black uppercase shadow-[4px_4px_0_#230b05]">
                Print recipe
              </button>
              <button className="border-2 border-[#230b05] bg-[#fff3c7] px-4 py-3 text-sm font-black uppercase shadow-[4px_4px_0_#230b05]">
                Cooking mode
              </button>
            </div>

            <div className="mb-5 border-2 border-[#230b05] bg-[#fff3c7] p-4">
              <p className="text-sm font-black uppercase text-[#c7391f]">
                Servings scaler
              </p>
              <div className="mt-3 flex items-center gap-3">
                <button className="h-10 w-10 border-2 border-[#230b05] bg-white text-xl font-black">
                  -
                </button>
                <span className="text-3xl font-black">2</span>
                <button className="h-10 w-10 border-2 border-[#230b05] bg-white text-xl font-black">
                  +
                </button>
              </div>
            </div>

            <h2 className="font-serif text-4xl font-black uppercase">
              Ingredients
            </h2>
            <ul className="mt-4 divide-y-2 divide-[#230b05] border-y-2 border-[#230b05] bg-[#fff3c7]">
              {ingredients.map((ingredient) => (
                <li key={ingredient.item} className="grid grid-cols-[5.5rem_1fr] gap-3 py-3">
                  <span className="font-black">{ingredient.amount}</span>
                  <span>
                    <span className="font-bold">{ingredient.item}</span>
                    <span className="block text-sm font-semibold text-[#7b2418]">
                      {ingredient.note}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </aside>

          <div className="space-y-8">
            <section className="border-4 border-[#230b05] bg-[#ffd447] p-5">
              <p className="text-sm font-black uppercase text-[#c7391f]">
                Why I love this
              </p>
              <p className="mt-3 text-xl font-bold leading-9">
                It is fast enough for a weeknight but still has that deep,
                fermented, buttery flavour that makes the whole bowl feel like a
                tiny reward. The trick is cooking the kimchi first so it gets
                jammy before the rice joins the party.
              </p>
            </section>

            <section>
              <div className="mb-5 border-b-4 border-[#230b05] pb-4">
                <p className="text-sm font-black uppercase text-[#c7391f]">
                  Step by step
                </p>
                <h2 className="font-serif text-5xl font-black uppercase leading-none">
                  Method
                </h2>
              </div>
              <ol className="space-y-5">
                {steps.map((step, index) => (
                  <li
                    key={step}
                    className="grid gap-4 border-4 border-[#230b05] bg-white p-5 md:grid-cols-[4.5rem_1fr]"
                  >
                    <span className="flex h-16 w-16 items-center justify-center border-2 border-[#230b05] bg-[#c7391f] text-3xl font-black text-[#fff3c7]">
                      {index + 1}
                    </span>
                    <p className="text-lg font-semibold leading-8">{step}</p>
                  </li>
                ))}
              </ol>
            </section>

            <section className="border-4 border-[#230b05] bg-[#e55224] p-5 text-[#fff3c7]">
              <h2 className="font-serif text-4xl font-black uppercase">
                Tips & Notes
              </h2>
              <ul className="mt-4 space-y-3 text-lg font-bold leading-8">
                {tips.map((tip) => (
                  <li key={tip} className="border-l-4 border-[#ffd447] pl-4">
                    {tip}
                  </li>
                ))}
              </ul>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
              {gallery.map((image) => (
                <div
                  key={image.src}
                  className="relative min-h-64 border-4 border-[#230b05] bg-[#ffd447]"
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

            <section className="border-4 border-[#230b05] bg-[#230b05] p-5 text-[#fff3c7]">
              <p className="text-sm font-black uppercase text-[#ffd447]">
                TikTok
              </p>
              <div className="mt-4 flex min-h-64 items-center justify-center border-2 border-dashed border-[#ffd447] p-6 text-center">
                <p className="max-w-md text-2xl font-black">
                  TikTok embed appears here when the recipe has a video URL.
                </p>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
