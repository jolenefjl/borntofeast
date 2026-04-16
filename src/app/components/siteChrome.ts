import type {RichTextValue} from "@/app/components/RichText";
import {localizedPath, type Locale} from "@/i18n/config";
import type {Dictionary} from "@/i18n/dictionaries";
import {
  resolveLocalized,
  resolveLocalizedString,
  type LocalizedValue,
} from "@/i18n/localized";
import {client} from "@/sanity/lib/client";

export type SiteLink = {
  label: string;
  href: string;
  linkType?: "internal" | "external";
  enabled?: boolean;
  openInNewTab?: boolean;
};

type CmsLink = {
  label?: LocalizedValue<string>;
  href?: string;
  linkType?: "internal" | "external";
  enabled?: boolean;
  openInNewTab?: boolean;
};

type SiteChromeDocument = {
  headerNavigationItems?: CmsLink[];
  footerIntro?: LocalizedValue<RichTextValue>;
  footerNewsletterHeading?: LocalizedValue<string>;
  footerNewsletterCtaLabel?: LocalizedValue<string>;
  footerNewsletterHref?: string;
  footerLinks?: CmsLink[];
};

export type SiteChrome = {
  navigationItems: SiteLink[];
  footer: {
    intro: RichTextValue;
    newsletterHeading: string;
    newsletterCtaLabel: string;
    newsletterHref: string;
    links: SiteLink[];
  };
};

const siteChromeQuery = `*[_type == "siteSettings" && _id == "siteSettings"][0]{
  headerNavigationItems,
  footerIntro,
  footerNewsletterHeading,
  footerNewsletterCtaLabel,
  footerNewsletterHref,
  footerLinks
}`;

function localizeHref(locale: Locale, href: string, linkType?: string) {
  if (linkType === "external" || href.startsWith("http") || href.startsWith("mailto:")) {
    return href;
  }

  if (href.startsWith("#")) {
    return `${localizedPath(locale)}/${href}`;
  }

  if (href.startsWith("/en") || href.startsWith("/no")) {
    return href;
  }

  return localizedPath(locale, href);
}

function normalizeLinks(
  locale: Locale,
  links: CmsLink[] | undefined,
  fallback: SiteLink[],
) {
  const normalized = links
    ?.filter((item) => item.enabled !== false && item.href)
    .map((item) => ({
      label: resolveLocalizedString(item.label, locale),
      href: localizeHref(locale, item.href || "/", item.linkType),
      linkType: item.linkType,
      enabled: item.enabled,
      openInNewTab: item.openInNewTab,
    }))
    .filter((item) => item.label && item.href);

  return normalized?.length ? normalized : fallback;
}

export async function getSiteChrome(
  locale: Locale,
  dictionary: Dictionary,
): Promise<SiteChrome> {
  const settings = await client.fetch<SiteChromeDocument | null>(
    siteChromeQuery,
    {},
    {cache: "no-store"},
  );
  const fallbackNavigation = [
    {label: dictionary.nav.recipes, href: localizedPath(locale, "/recipes")},
    {label: dictionary.nav.about, href: localizedPath(locale, "/about")},
  ];
  const fallbackFooterLinks = [
    {label: dictionary.nav.recipes, href: localizedPath(locale, "/recipes")},
    {label: dictionary.nav.about, href: localizedPath(locale, "/about")},
    {label: dictionary.nav.search, href: localizedPath(locale, "/search")},
  ];

  return {
    navigationItems: normalizeLinks(
      locale,
      settings?.headerNavigationItems,
      fallbackNavigation,
    ),
    footer: {
      intro: resolveLocalized(
        settings?.footerIntro,
        locale,
        dictionary.site.description,
      ),
      newsletterHeading: resolveLocalizedString(
        settings?.footerNewsletterHeading,
        locale,
        dictionary.homepage.newsletterHeading,
      ),
      newsletterCtaLabel: resolveLocalizedString(
        settings?.footerNewsletterCtaLabel,
        locale,
        dictionary.homepage.newsletterButtonLabel,
      ),
      newsletterHref: localizeHref(
        locale,
        settings?.footerNewsletterHref || "/#newsletter",
      ),
      links: normalizeLinks(locale, settings?.footerLinks, fallbackFooterLinks),
    },
  };
}
