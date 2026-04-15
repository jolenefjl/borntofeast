import {SiteHeader} from "@/app/components/SiteHeader";

const quickSearches = ["noodles", "rice", "quick", "spicy", "vegetarian"];

export default function SearchPage() {
  return (
    <main className="min-h-screen bg-[#fff3c7] text-[#240B36]">
      <SiteHeader />
      <section className="relative isolate overflow-hidden border-b-4 border-[#240B36] bg-[#e55224] px-5 pb-20 pt-12 sm:px-8 sm:pb-28 lg:pb-32 lg:pt-20">
        <div className="absolute inset-0 -z-10 opacity-25 bg-[linear-gradient(90deg,#240B36_1px,transparent_1px),linear-gradient(#240B36_1px,transparent_1px)] bg-[size:42px_42px]" />
        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <p className="text-sm font-medium uppercase leading-[0.9]">
              find dinner
            </p>
            <h1 className="mt-4 font-serif text-6xl font-bold lowercase leading-[0.9] sm:text-7xl lg:text-8xl">
              search recipes.
            </h1>
            <p className="mt-6 max-w-2xl text-xl font-normal leading-[1.8rem]">
              Search by craving, ingredient, cuisine, or the amount of energy
              you have left after work.
            </p>
            <form className="mt-8 grid gap-3 sm:grid-cols-[1fr_auto]">
              <label className="sr-only" htmlFor="site-search">
                Search recipes
              </label>
              <input
                id="site-search"
                type="search"
                placeholder="kimchi, noodles, sambal..."
                className="min-h-14 border-2 border-[#240B36] bg-[#fff3c7] px-4 text-lg font-normal outline-none"
              />
              <button
                type="submit"
                className="min-h-14 border-2 border-[#240B36] bg-[#ffd447] px-6 text-sm font-medium uppercase leading-[0.9] shadow-[4px_4px_0_#240B36]"
              >
                search
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="bg-[#ffd447] px-5 py-20 sm:px-8 sm:py-28 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 border-b-4 border-[#240B36] pb-5">
            <p className="text-sm font-medium uppercase leading-[0.9] text-[#c7391f]">
              quick starts
            </p>
            <h2 className="font-serif text-5xl font-black lowercase leading-[0.9] sm:text-6xl">
              start with a craving.
            </h2>
          </div>
          <div className="flex flex-wrap gap-4">
            {quickSearches.map((item) => (
              <button
                key={item}
                type="button"
                className="border-2 border-[#240B36] bg-[#fff3c7] px-5 py-3 text-lg font-normal uppercase leading-[0.9] shadow-[4px_4px_0_#240B36] transition duration-200 hover:-translate-y-1 hover:shadow-[6px_6px_0_#240B36]"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
