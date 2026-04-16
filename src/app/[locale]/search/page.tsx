import type {Metadata} from "next";

import {SiteHeader} from "@/app/components/SiteHeader";
import {getSiteChrome} from "@/app/components/siteChrome";
import {isLocale} from "@/i18n/config";
import {getDictionary} from "@/i18n/dictionaries";
import {absoluteUrl, localeAlternates} from "@/i18n/urls";

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale: localeParam} = await params;
  const locale = isLocale(localeParam) ? localeParam : "en";
  const dictionary = getDictionary(locale);

  return {
    title: dictionary.search.metaTitle,
    description: dictionary.search.metaDescription,
    alternates: {
      canonical: absoluteUrl(`/${locale}/search`),
      languages: localeAlternates("/search"),
    },
  };
}

export default async function SearchPage({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale: localeParam} = await params;
  const locale = isLocale(localeParam) ? localeParam : "en";
  const dictionary = getDictionary(locale);
  const {search} = dictionary;
  const chrome = await getSiteChrome(locale, dictionary);

  return (
    <main className="min-h-screen bg-[#fff3c7] text-[#240B36]">
      <SiteHeader
        locale={locale}
        labels={dictionary.nav}
        navigationItems={chrome.navigationItems}
      />
      <section className="relative isolate overflow-hidden border-b-4 border-[#240B36] bg-[#e55224] px-4 pb-14 pt-10 sm:px-8 sm:pb-28 lg:pb-32 lg:pt-20">
        <div className="absolute inset-0 -z-10 opacity-25 bg-[linear-gradient(90deg,#240B36_1px,transparent_1px),linear-gradient(#240B36_1px,transparent_1px)] bg-[size:42px_42px]" />
        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <p className="text-sm font-medium uppercase leading-[0.9]">
              {search.eyebrow}
            </p>
            <h1 className="mt-4 font-serif text-5xl font-bold lowercase leading-[0.95] sm:text-7xl sm:leading-[0.9] lg:text-8xl">
              {search.title}
            </h1>
            <p className="mt-5 max-w-prose text-lg font-normal leading-[1.65rem] sm:mt-6 sm:text-xl sm:leading-[1.8rem]">
              {search.intro}
            </p>
            <form className="mt-8 grid gap-3 sm:grid-cols-[1fr_auto]">
              <label className="sr-only" htmlFor="site-search">
                {search.inputLabel}
              </label>
              <input
                id="site-search"
                type="search"
                placeholder={search.placeholder}
                className="min-h-12 w-full border-2 border-[#240B36] bg-[#fff3c7] px-4 text-base font-normal outline-none sm:min-h-14 sm:text-lg"
              />
              <button
                type="submit"
                className="min-h-12 border-2 border-[#240B36] bg-[#ffd447] px-6 text-sm font-medium uppercase leading-[0.9] shadow-[4px_4px_0_#240B36] sm:min-h-14"
              >
                {search.button}
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="bg-[#ffd447] px-4 py-14 sm:px-8 sm:py-28 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 border-b-4 border-[#240B36] pb-5">
            <p className="text-sm font-medium uppercase leading-[0.9] text-[#c7391f]">
              {search.quickStartsEyebrow}
            </p>
            <h2 className="font-serif text-4xl font-black lowercase leading-[0.95] sm:text-6xl sm:leading-[0.9]">
              {search.quickStartsTitle}
            </h2>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1 sm:flex-wrap sm:gap-4 sm:overflow-visible sm:pb-0">
            {search.quickSearches.map((item) => (
              <button
                key={item}
                type="button"
                className="min-h-11 shrink-0 border-2 border-[#240B36] bg-[#fff3c7] px-5 py-3 text-base font-normal uppercase leading-[0.9] shadow-[4px_4px_0_#240B36] transition duration-200 hover:-translate-y-1 hover:shadow-[6px_6px_0_#240B36] sm:text-lg"
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
