import Image from "next/image";
import Link from "next/link";
import type {Metadata} from "next";
import {PortableText} from "next-sanity";

import {SiteHeader} from "@/app/components/SiteHeader";
import {getSiteChrome} from "@/app/components/siteChrome";
import {isLocale, localizedPath, type Locale} from "@/i18n/config";
import {getDictionary} from "@/i18n/dictionaries";
import {resolveLocalized, resolveLocalizedString, type LocalizedValue} from "@/i18n/localized";
import {absoluteUrl, localeAlternates} from "@/i18n/urls";
import {client} from "@/sanity/lib/client";
import {urlFor} from "@/sanity/lib/image";

export const dynamic = "force-dynamic";

type PortableBlock = {
  _key: string;
  _type: "block";
  children?: {text?: string}[];
};

type AboutPageDocument = {
  heroEyebrow?: LocalizedValue<string>;
  heroTitle?: LocalizedValue<string>;
  heroIntro?: LocalizedValue<string>;
  heroCtaLabel?: LocalizedValue<string>;
  heroCtaHref?: string;
  heroImage?: {alt?: string; asset?: unknown};
  storyEyebrow?: LocalizedValue<string>;
  storyTitle?: LocalizedValue<string>;
  storyBody?: LocalizedValue<PortableBlock[]>;
  valuesEyebrow?: LocalizedValue<string>;
  valuesTitle?: LocalizedValue<string>;
  values?: {
    title?: LocalizedValue<string>;
    href?: string;
    copy?: LocalizedValue<string>;
  }[];
  nextEyebrow?: LocalizedValue<string>;
  nextTitle?: LocalizedValue<string>;
  nextText?: LocalizedValue<string>;
  nextCtaLabel?: LocalizedValue<string>;
  nextCtaHref?: string;
  nextImage?: {alt?: string; asset?: unknown};
};

const aboutPageQuery = `*[_type == "aboutPage" && _id == "aboutPage"][0]`;

function fetchAboutPage() {
  return client.fetch<AboutPageDocument | null>(
    aboutPageQuery,
    {},
    {cache: "no-store"},
  );
}

function localizeHref(locale: Locale, href: string) {
  return href.startsWith("/") ? localizedPath(locale, href) : href;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale: localeParam} = await params;
  const locale = isLocale(localeParam) ? localeParam : "en";
  const dictionary = getDictionary(locale);
  const aboutPage = await fetchAboutPage();
  const title = resolveLocalizedString(
    aboutPage?.heroTitle,
    locale,
    dictionary.about.metaTitle,
  );
  const description = resolveLocalizedString(
    aboutPage?.heroIntro,
    locale,
    dictionary.about.metaDescription,
  );

  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl(`/${locale}/about`),
      languages: localeAlternates("/about"),
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale: localeParam} = await params;
  const locale = isLocale(localeParam) ? localeParam : "en";
  const dictionary = getDictionary(locale);
  const {about} = dictionary;
  const [aboutPage, chrome] = await Promise.all([
    fetchAboutPage(),
    getSiteChrome(locale, dictionary),
  ]);
  const heroEyebrow = resolveLocalizedString(
    aboutPage?.heroEyebrow,
    locale,
    about.heroEyebrow,
  );
  const heroTitle = resolveLocalizedString(
    aboutPage?.heroTitle,
    locale,
    about.heroTitle,
  );
  const heroIntro = resolveLocalizedString(
    aboutPage?.heroIntro,
    locale,
    about.heroIntro,
  );
  const heroCtaLabel = resolveLocalizedString(aboutPage?.heroCtaLabel, locale);
  const heroCtaHref = aboutPage?.heroCtaHref;
  const storyEyebrow = resolveLocalizedString(
    aboutPage?.storyEyebrow,
    locale,
    about.storyEyebrow,
  );
  const storyTitle = resolveLocalizedString(
    aboutPage?.storyTitle,
    locale,
    about.storyTitle,
  );
  const storyBody = resolveLocalized<PortableBlock[]>(
    aboutPage?.storyBody,
    locale,
  );
  const valuesEyebrow = resolveLocalizedString(
    aboutPage?.valuesEyebrow,
    locale,
    about.valuesEyebrow,
  );
  const valuesTitle = resolveLocalizedString(
    aboutPage?.valuesTitle,
    locale,
    about.valuesTitle,
  );
  const values = aboutPage?.values?.length
    ? aboutPage.values
        .map((value) => ({
          title: resolveLocalizedString(value.title, locale),
          href: value.href || "/search",
          copy: resolveLocalizedString(value.copy, locale),
        }))
        .filter((value) => value.title)
    : about.values;
  const nextEyebrow = resolveLocalizedString(
    aboutPage?.nextEyebrow,
    locale,
    about.nextEyebrow,
  );
  const nextTitle = resolveLocalizedString(
    aboutPage?.nextTitle,
    locale,
    about.nextTitle,
  );
  const nextText = resolveLocalizedString(
    aboutPage?.nextText,
    locale,
    about.nextText,
  );
  const nextCtaLabel = resolveLocalizedString(aboutPage?.nextCtaLabel, locale);
  const nextCtaHref = aboutPage?.nextCtaHref;
  const heroImage = aboutPage?.heroImage?.asset
    ? urlFor(aboutPage.heroImage).width(900).height(1200).fit("crop").url()
    : "https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=900&q=85";
  const nextImage = aboutPage?.nextImage?.asset
    ? urlFor(aboutPage.nextImage).width(1000).height(800).fit("crop").url()
    : "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=1000&q=85";

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
          <div className="grid gap-7 lg:grid-cols-[0.42fr_1fr] lg:items-center">
            <div className="relative min-h-[22rem] max-w-sm border-4 border-[#240B36] bg-[#ffd447] p-2 shadow-[6px_6px_0_#240B36] sm:min-h-[34rem] sm:p-3 sm:shadow-[10px_10px_0_#240B36]">
              <Image
                src={heroImage}
                alt={aboutPage?.heroImage?.alt || "Hands preparing a colorful table of food"}
                fill
                priority
                sizes="(min-width: 1024px) 30vw, 90vw"
                className="object-cover p-3"
              />
            </div>

            <div>
              <p className="text-sm font-medium uppercase leading-[0.9]">
                {heroEyebrow}
              </p>
              <h1 className="mt-4 font-serif text-5xl font-bold lowercase leading-[0.95] sm:text-7xl sm:leading-[0.9] lg:text-8xl">
                {heroTitle}
              </h1>
              <p className="mt-5 max-w-prose text-lg font-normal leading-[1.65rem] sm:mt-6 sm:text-xl sm:leading-[1.8rem]">
                {heroIntro}
              </p>
              {heroCtaLabel && heroCtaHref ? (
                <Link
                  href={localizeHref(locale, heroCtaHref)}
                  className="mt-7 inline-flex min-h-11 items-center border-2 border-[#240B36] bg-[#ffd447] px-5 py-3 text-sm font-black uppercase leading-[0.9] shadow-[4px_4px_0_#240B36] sm:mt-8 sm:px-6"
                >
                  {heroCtaLabel}
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#ffd447] px-4 py-14 sm:px-8 sm:py-28 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
          <div>
            <p className="text-sm font-medium uppercase leading-[0.9] text-[#c7391f]">
              {storyEyebrow}
            </p>
            <h2 className="font-serif text-4xl font-black lowercase leading-[0.95] sm:text-6xl sm:leading-[0.9]">
              {storyTitle}
            </h2>
          </div>
          <div className="max-w-prose space-y-5 text-lg font-normal leading-[1.75rem] sm:space-y-6 sm:text-xl sm:leading-[2.025rem] lg:max-w-none">
            {storyBody?.length ? (
              <PortableText value={storyBody} />
            ) : (
              about.storyBody.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="bg-[#fff3c7] px-4 py-14 sm:px-8 sm:py-28 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 border-b-4 border-[#240B36] pb-5">
            <p className="text-sm font-medium uppercase leading-[0.9] text-[#c7391f]">
              {valuesEyebrow}
            </p>
            <h2 className="font-serif text-4xl font-black lowercase leading-[0.95] sm:text-6xl sm:leading-[0.9]">
              {valuesTitle}
            </h2>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {values.map((value) => (
              <Link
                key={value.title}
                href={localizeHref(locale, value.href)}
                className="block border-4 border-[#240B36] bg-[#f77f1f] p-4 shadow-[6px_6px_0_#240B36] transition duration-200 hover:-translate-y-2 hover:shadow-[12px_12px_0_#240B36] sm:p-6 sm:shadow-[8px_8px_0_#240B36]"
              >
                <h3 className="font-serif text-3xl font-black lowercase leading-[0.95] sm:text-4xl sm:leading-[0.9]">
                  {value.title}
                </h3>
                <p className="mt-3 text-base font-normal leading-[1.6rem] sm:mt-4 sm:text-lg sm:leading-[1.8rem]">
                  {value.copy}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#240B36] px-4 py-14 text-[#fff3c7] sm:px-8 sm:py-28 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm font-medium uppercase leading-[0.9] text-[#ffd447]">
              {nextEyebrow}
            </p>
            <h2 className="font-serif text-4xl font-black lowercase leading-[0.95] sm:text-6xl sm:leading-[0.9]">
              {nextTitle}
            </h2>
            <p className="mt-5 max-w-prose text-lg font-normal leading-[1.75rem] sm:mt-6 sm:text-xl sm:leading-[2.025rem]">
              {nextText}
            </p>
            {nextCtaLabel && nextCtaHref ? (
              <Link
                href={localizeHref(locale, nextCtaHref)}
                className="mt-7 inline-flex min-h-11 items-center border-2 border-[#fff3c7] bg-[#ffd447] px-5 py-3 text-sm font-black uppercase leading-[0.9] text-[#240B36] shadow-[4px_4px_0_#fff3c7] sm:mt-8 sm:px-6"
              >
                {nextCtaLabel}
              </Link>
            ) : null}
          </div>
          <div className="relative min-h-[18rem] border-4 border-[#fff3c7] bg-[#ffd447] sm:min-h-[24rem]">
            <Image
              src={nextImage}
              alt={aboutPage?.nextImage?.alt || "A colorful table of Asian dishes"}
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
