import {defineArrayMember, defineField, defineType} from "sanity";

import {
  localizedRichTextField,
  localizedStringField,
  localizedTextField,
} from "@/sanity/schemaTypes/localized";

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fieldsets: [
    {
      name: "homepageHero",
      title: "Homepage hero",
      options: {collapsible: true, collapsed: false},
    },
    {
      name: "headerNavigation",
      title: "Header navigation",
      options: {collapsible: true, collapsed: false},
    },
    {
      name: "footer",
      title: "Footer",
      options: {collapsible: true, collapsed: false},
    },
    {
      name: "homepageRecipes",
      title: "Homepage recipes section",
      options: {collapsible: true, collapsed: false},
    },
    {
      name: "homepageCategories",
      title: "Homepage categories section",
      options: {collapsible: true, collapsed: false},
    },
    {
      name: "homepageAbout",
      title: "Homepage about section",
      options: {collapsible: true, collapsed: false},
    },
    {
      name: "homepageNewsletter",
      title: "Homepage newsletter section",
      options: {collapsible: true, collapsed: false},
    },
  ],
  fields: [
    localizedStringField("homepageHeroLine1", "Hero headline line 1", {
      fieldset: "homepageHero",
    }),
    localizedStringField("homepageHeroLine2", "Hero headline line 2", {
      fieldset: "homepageHero",
    }),
    localizedStringField("homepageHeroLine3", "Hero headline line 3", {
      fieldset: "homepageHero",
    }),
    localizedRichTextField("homepageHeroIntro", "Hero intro text", {
      description: "Short supporting body copy below the homepage headline.",
      fieldset: "homepageHero",
    }),
    localizedStringField("homepageHeroCtaLabel", "Hero CTA label", {
      fieldset: "homepageHero",
    }),
    defineField({
      name: "homepageHeroCtaHref",
      title: "Hero CTA link",
      description: "Use a page path or section link, for example /#recipes or #recipes.",
      type: "string",
      fieldset: "homepageHero",
    }),
    defineField({
      name: "homepageHeroPortrait",
      title: "Hero portrait image",
      type: "image",
      fieldset: "homepageHero",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "headerNavigationItems",
      title: "Header navigation items",
      description:
        "Manage the top navigation here. Use internal paths without locale prefixes, for example /recipes or /about. Labels are localized.",
      type: "array",
      fieldset: "headerNavigation",
      of: [
        defineArrayMember({
          name: "navigationItem",
          title: "Navigation item",
          type: "object",
          fields: [
            localizedStringField("label", "Label"),
            defineField({
              name: "href",
              title: "Link",
              description:
                "Internal path such as /recipes, /about, /search, or an external URL.",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "linkType",
              title: "Link type",
              type: "string",
              initialValue: "internal",
              options: {
                list: [
                  {title: "Internal", value: "internal"},
                  {title: "External", value: "external"},
                ],
                layout: "radio",
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "enabled",
              title: "Enabled",
              type: "boolean",
              initialValue: true,
            }),
            defineField({
              name: "openInNewTab",
              title: "Open in new tab",
              type: "boolean",
              initialValue: false,
            }),
          ],
          preview: {
            select: {
              title: "label.en",
              subtitle: "href",
            },
          },
        }),
      ],
    }),
    localizedRichTextField("footerIntro", "Footer intro", {
      description: "Short descriptive copy for the footer.",
      fieldset: "footer",
    }),
    localizedStringField("footerNewsletterHeading", "Footer newsletter heading", {
      fieldset: "footer",
    }),
    localizedStringField("footerNewsletterCtaLabel", "Footer newsletter CTA label", {
      fieldset: "footer",
    }),
    defineField({
      name: "footerNewsletterHref",
      title: "Footer newsletter link",
      type: "string",
      fieldset: "footer",
    }),
    defineField({
      name: "footerLinks",
      title: "Footer links",
      type: "array",
      fieldset: "footer",
      of: [
        defineArrayMember({
          name: "footerLink",
          title: "Footer link",
          type: "object",
          fields: [
            localizedStringField("label", "Label"),
            defineField({
              name: "href",
              title: "Link",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "linkType",
              title: "Link type",
              type: "string",
              initialValue: "internal",
              options: {
                list: [
                  {title: "Internal", value: "internal"},
                  {title: "External", value: "external"},
                ],
                layout: "radio",
              },
            }),
            defineField({
              name: "enabled",
              title: "Enabled",
              type: "boolean",
              initialValue: true,
            }),
            defineField({
              name: "openInNewTab",
              title: "Open in new tab",
              type: "boolean",
              initialValue: false,
            }),
          ],
          preview: {
            select: {
              title: "label.en",
              subtitle: "href",
            },
          },
        }),
      ],
    }),
    defineField({
      name: "featuredRecipes",
      title: "Homepage featured recipes",
      type: "array",
      fieldset: "homepageRecipes",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{type: "recipe"}],
        }),
      ],
      validation: (rule) => rule.max(4),
    }),
    localizedStringField("homepageRecipesEyebrow", "Recipes eyebrow", {
      fieldset: "homepageRecipes",
    }),
    localizedStringField("homepageRecipesHeading", "Recipes heading", {
      fieldset: "homepageRecipes",
    }),
    localizedStringField("homepageRecipesCtaLabel", "Recipes CTA label", {
      fieldset: "homepageRecipes",
    }),
    defineField({
      name: "homepageRecipesCtaHref",
      title: "Recipes CTA link",
      type: "string",
      fieldset: "homepageRecipes",
    }),
    localizedStringField("homepageCategoriesEyebrow", "Categories eyebrow", {
      fieldset: "homepageCategories",
    }),
    localizedStringField("homepageCategoriesHeading", "Categories heading", {
      fieldset: "homepageCategories",
    }),
    defineField({
      name: "showHomepageCategories",
      title: "Show homepage cuisines/cravings section",
      description:
        "Disable this until there are enough recipes for the section to be useful.",
      type: "boolean",
      initialValue: false,
      fieldset: "homepageCategories",
    }),
    defineField({
      name: "homepageCategoryCards",
      title: "Homepage category cards",
      type: "array",
      fieldset: "homepageCategories",
      of: [
        defineArrayMember({
          name: "homepageCategoryCard",
          title: "Category card",
          type: "object",
          fields: [
            localizedStringField("title", "Title"),
            defineField({
              name: "href",
              title: "Link",
              type: "string",
            }),
            localizedTextField("copy", "Copy", {rows: 3}),
            defineField({
              name: "image",
              title: "Image",
              type: "image",
              options: {hotspot: true},
              fields: [
                defineField({
                  name: "alt",
                  title: "Alt text",
                  type: "string",
                }),
              ],
            }),
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "copy",
              media: "image",
            },
          },
        }),
      ],
    }),
    localizedStringField("homepageAboutEyebrow", "About eyebrow", {
      fieldset: "homepageAbout",
    }),
    localizedStringField("homepageAboutHeading", "About heading", {
      fieldset: "homepageAbout",
    }),
    localizedRichTextField("homepageAboutText", "About text", {
      description: "Editorial body copy for the homepage about section.",
      fieldset: "homepageAbout",
    }),
    localizedStringField("homepageNewsletterEyebrow", "Newsletter eyebrow", {
      fieldset: "homepageNewsletter",
    }),
    localizedStringField("homepageNewsletterHeading", "Newsletter heading", {
      fieldset: "homepageNewsletter",
    }),
    localizedRichTextField("homepageNewsletterText", "Newsletter text", {
      description: "Supporting body copy for the newsletter section.",
      fieldset: "homepageNewsletter",
    }),
    localizedStringField("homepageNewsletterButtonLabel", "Newsletter button label", {
      fieldset: "homepageNewsletter",
    }),
    defineField({
      name: "newsletterCtaText",
      title: "Newsletter CTA text",
      type: "string",
    }),
    defineField({
      name: "aboutIntroText",
      title: "About intro text",
      type: "text",
      rows: 5,
    }),
    defineField({
      name: "instagramUrl",
      title: "Instagram URL",
      type: "url",
    }),
    defineField({
      name: "tiktokUrl",
      title: "TikTok URL",
      type: "url",
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Site Settings",
      };
    },
  },
});
