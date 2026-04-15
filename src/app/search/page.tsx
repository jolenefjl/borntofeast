import Image from "next/image";
import Link from "next/link";

const quickSearches = ["noodles", "rice", "quick", "spicy", "vegetarian"];

function SiteHeader() {
  return (
    <nav
      aria-label="Main navigation"
      className="flex flex-wrap items-center justify-between gap-6 border-b-2 border-[#240B36] pb-4 text-sm font-medium lowercase"
    >
      <Link href="/" aria-label="Born to Feast home">
        <Image
          src="/born-to-feast-logo.svg"
          alt="Born to Feast"
          width={121}
          height={47}
          priority
          className="h-auto w-[8.65rem] sm:w-[10.1rem]"
        />
      </Link>
      <div className="flex flex-wrap items-center gap-8">
        <Link href="/#recipes">recipes</Link>
        <Link href="/#categories">ingredients</Link>
        <Link href="/about">about</Link>
        <Link href="/search" aria-label="search">
          <svg
            aria-hidden="true"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-4.35-4.35m1.1-5.15a6.25 6.25 0 1 1-12.5 0 6.25 6.25 0 0 1 12.5 0Z"
            />
          </svg>
        </Link>
      </div>
    </nav>
  );
}

export default function SearchPage() {
  return (
    <main className="min-h-screen bg-[#fff3c7] text-[#240B36]">
      <section className="relative isolate overflow-hidden border-b-4 border-[#240B36] bg-[#e55224] px-5 pb-20 pt-6 sm:px-8 sm:pb-28 lg:pb-32 lg:pt-10">
        <div className="absolute inset-0 -z-10 opacity-25 bg-[linear-gradient(90deg,#240B36_1px,transparent_1px),linear-gradient(#240B36_1px,transparent_1px)] bg-[size:42px_42px]" />
        <div className="mx-auto max-w-7xl">
          <SiteHeader />

          <div className="mt-16 max-w-4xl">
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
