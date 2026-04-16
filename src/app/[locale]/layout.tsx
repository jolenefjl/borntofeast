import type {Metadata} from "next";
import {Afacad, Fraunces} from "next/font/google";
import {notFound} from "next/navigation";

import "../globals.css";
import {SiteFooter} from "@/app/components/SiteFooter";
import {getSiteChrome} from "@/app/components/siteChrome";
import {getDictionary} from "@/i18n/dictionaries";
import {isLocale, locales, type Locale} from "@/i18n/config";
import {absoluteUrl, localeAlternates} from "@/i18n/urls";

export const dynamic = "force-dynamic";

const afacad = Afacad({
  variable: "--font-afacad",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
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
    title: {
      default: dictionary.site.title,
      template: `%s | ${dictionary.site.title}`,
    },
    description: dictionary.site.description,
    alternates: {
      canonical: absoluteUrl(`/${locale}`),
      languages: localeAlternates(""),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const {locale: localeParam} = await params;

  if (!isLocale(localeParam)) {
    notFound();
  }

  const locale: Locale = localeParam;
  const dictionary = getDictionary(locale);
  const chrome = await getSiteChrome(locale, dictionary);

  return (
    <html
      lang={locale}
      className={`${afacad.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <SiteFooter footer={chrome.footer} />
      </body>
    </html>
  );
}
