import Image from "next/image";
import Link from "next/link";

import {SiteHeader} from "@/app/components/SiteHeader";

const values = [
  {
    title: "home food travels",
    href: "/search?tag=comfort",
    copy: "Recipes for the meals you miss, the ingredients you can actually find, and the shortcuts that still taste generous.",
  },
  {
    title: "fast is allowed",
    href: "/search?tag=quick",
    copy: "Weeknight bowls, pantry sauces, and low-drama dinners sit next to slower weekend projects.",
  },
  {
    title: "flavour first",
    href: "/search?tag=spicy",
    copy: "Big seasoning, bright heat, texture, crunch, and the small details that make a dish feel alive.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#fff3c7] text-[#240B36]">
      <SiteHeader />
      <section className="relative isolate overflow-hidden border-b-4 border-[#240B36] bg-[#e55224] px-5 pb-20 pt-12 sm:px-8 sm:pb-28 lg:pb-32 lg:pt-20">
        <div className="absolute inset-0 -z-10 opacity-25 bg-[linear-gradient(90deg,#240B36_1px,transparent_1px),linear-gradient(#240B36_1px,transparent_1px)] bg-[size:42px_42px]" />
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.42fr_1fr] lg:items-center">
            <div className="relative min-h-[34rem] max-w-sm border-4 border-[#240B36] bg-[#ffd447] p-3 shadow-[10px_10px_0_#240B36]">
              <Image
                src="https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=900&q=85"
                alt="Hands preparing a colorful table of food"
                fill
                priority
                sizes="(min-width: 1024px) 30vw, 90vw"
                className="object-cover p-3"
              />
            </div>

            <div>
              <p className="text-sm font-medium uppercase leading-[0.9]">
                about born to feast
              </p>
              <h1 className="mt-4 font-serif text-6xl font-bold lowercase leading-[0.9] sm:text-7xl lg:text-8xl">
                asian comfort food wherever you live.
              </h1>
              <p className="mt-6 max-w-2xl text-xl font-normal leading-[1.8rem]">
                Born to Feast is where Malaysian roots, Chinese home cooking,
                Korean cravings, and Norwegian supermarket realities meet in
                one loud, hungry kitchen.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#ffd447] px-5 py-20 sm:px-8 sm:py-28 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
          <div>
            <p className="text-sm font-medium uppercase leading-[0.9] text-[#c7391f]">
              the story
            </p>
            <h2 className="font-serif text-5xl font-black lowercase leading-[0.9] sm:text-6xl">
              food for the homesick and the curious.
            </h2>
          </div>
          <div className="space-y-6 text-xl font-normal leading-[2.025rem]">
            <p>
              This is a recipe notebook for the people cooking between places:
              Asians abroad who miss the food that raised them, and Norwegians
              discovering the sauces, noodles, rice dishes, broths, snacks, and
              stews that make Asian cooking feel so generous.
            </p>
            <p>
              Some recipes are quick enough for a Tuesday. Some ask for a
              little patience. All of them are written like a friend is standing
              beside you at the stove, pointing out what matters and what can
              be relaxed.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#fff3c7] px-5 py-20 sm:px-8 sm:py-28 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 border-b-4 border-[#240B36] pb-5">
            <p className="text-sm font-medium uppercase leading-[0.9] text-[#c7391f]">
              kitchen rules
            </p>
            <h2 className="font-serif text-5xl font-black lowercase leading-[0.9] sm:text-6xl">
              no gatekeeping.
            </h2>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {values.map((value) => (
              <Link
                key={value.title}
                href={value.href}
                className="block border-4 border-[#240B36] bg-[#f77f1f] p-6 shadow-[8px_8px_0_#240B36] transition duration-200 hover:-translate-y-2 hover:shadow-[12px_12px_0_#240B36]"
              >
                <h3 className="font-serif text-4xl font-black lowercase leading-[0.9]">
                  {value.title}
                </h3>
                <p className="mt-4 text-lg font-normal leading-[1.8rem]">
                  {value.copy}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#240B36] px-5 py-20 text-[#fff3c7] sm:px-8 sm:py-28 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm font-medium uppercase leading-[0.9] text-[#ffd447]">
              what comes next
            </p>
            <h2 className="font-serif text-5xl font-black lowercase leading-[0.9] sm:text-6xl">
              quick bowls, deep dives, loud flavours.
            </h2>
            <p className="mt-6 text-xl font-normal leading-[2.025rem]">
              Expect Chinese, Korean, Malaysian, and fusion recipes with enough
              personality to make dinner feel less like maintenance and more
              like a small event.
            </p>
          </div>
          <div className="relative min-h-[24rem] border-4 border-[#fff3c7] bg-[#ffd447]">
            <Image
              src="https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=1000&q=85"
              alt="A colorful table of Asian dishes"
              fill
              sizes="(min-width: 1024px) 36vw, 90vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
