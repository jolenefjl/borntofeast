import Image from "next/image";
import Link from "next/link";
import type {Metadata} from "next";
import {PortableText} from "next-sanity";

import {SiteHeader} from "@/app/components/SiteHeader";
import {isLocale, localizedPath, type Locale} from "@/i18n/config";
import {getDictionary} from "@/i18n/dictionaries";
import {resolveLocalized, resolveLocalizedString, type LocalizedValue} from "@/i18n/localized";
import {absoluteUrl, localeAlternates} from "@/i18n/urls";
import {client} from "@/sanity/lib/client";
import {urlFor} from "@/sanity/lib/image";

type PortableBlock = {
  _key: string;
  _type: "block";
  children?: {text?: string}[];
};

type AboutPageDocument = {
  heroEyebrow?: LocalizedValue<string>;
  heroTitle?: LocalizedValue<string>;
  heroIntro?: LocalizedValue<string>;
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
  nextImage?: {alt?: string; asset?: unknown};
};

const aboutPageQuery = `*[_type == "aboutPage" && _id == "aboutPage"][0]`;

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

  return {
    title: dictionary.about.metaTitle,
    description: dictionary.about.metaDescription,
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
  const aboutPage = await client.fetch<AboutPageDocument | null>(aboutPageQuery);
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
  const heroImage = aboutPage?.heroImage?.asset
    ? urlFor(aboutPage.heroImage).width(900).height(1200).fit("crop").url()
    : "https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=900&q=85";
  const nextImage = aboutPage?.nextImage?.asset
    ? urlFor(aboutPage.nextImage).width(1000).height(800).fit("crop").url()
    : "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=1000&q=85";

  return (
    <main className="min-h-screen bg-[#fff3c7] text-[#240B36]">
      <SiteHeader locale={locale} labels={dictionary.nav} />
      <section className="relative isolate overflow-hidden border-b-4 border-[#240B36] bg-[#e55224] px-5 pb-20 pt-12 sm:px-8 sm:pb-28 lg:pb-32 lg:pt-20">
        <div className="absolute inset-0 -z-10 opacity-25 bg-[linear-gradient(90deg,#240B36_1px,transparent_1px),linear-gradient(#240B36_1px,transparent_1px)] bg-[size:42px_42px]" />
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.42fr_1fr] lg:items-center">
            <div className="relative min-h-[34rem] max-w-sm border-4 border-[#240B36] bg-[#ffd447] p-3 shadow-[10px_10px_0_#240B36]">
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
              <h1 className="mt-4 font-serif text-6xl font-bold lowercase leading-[0.9] sm:text-7xl lg:text-8xl">
                {heroTitle}
              </h1>
              <p className="mt-6 max-w-2xl text-xl font-normal leading-[1.8rem]">
                {heroIntro}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#ffd447] px-5 py-20 sm:px-8 sm:py-28 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
          <div>
            <p className="text-sm font-medium uppercase leading-[0.9] text-[#c7391f]">
              {storyEyebrow}
            </p>
            <h2 className="font-serif text-5xl font-black lowercase leading-[0.9] sm:text-6xl">
              {storyTitle}
            </h2>
          </div>
          <div className="space-y-6 text-xl font-normal leading-[2.025rem]">
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

      <section className="bg-[#fff3c7] px-5 py-20 sm:px-8 sm:py-28 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 border-b-4 border-[#240B36] pb-5">
            <p className="text-sm font-medium uppercase leading-[0.9] text-[#c7391f]">
              {valuesEyebrow}
            </p>
            <h2 className="font-serif text-5xl font-black lowercase leading-[0.9] sm:text-6xl">
              {valuesTitle}
            </h2>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {values.map((value) => (
              <Link
                key={value.title}
                href={localizeHref(locale, value.href)}
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
              {nextEyebrow}
            </p>
            <h2 className="font-serif text-5xl font-black lowercase leading-[0.9] sm:text-6xl">
              {nextTitle}
            </h2>
            <p className="mt-6 text-xl font-normal leading-[2.025rem]">
              {nextText}
            </p>
          </div>
          <div className="relative min-h-[24rem] border-4 border-[#fff3c7] bg-[#ffd447]">
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
