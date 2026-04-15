import {defineArrayMember, defineField, defineType} from "sanity";

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
    defineField({
      name: "homepageHeroLine1",
      title: "Hero headline line 1",
      type: "string",
      fieldset: "homepageHero",
    }),
    defineField({
      name: "homepageHeroLine2",
      title: "Hero headline line 2",
      type: "string",
      fieldset: "homepageHero",
    }),
    defineField({
      name: "homepageHeroLine3",
      title: "Hero headline line 3",
      type: "string",
      fieldset: "homepageHero",
    }),
    defineField({
      name: "homepageHeroIntro",
      title: "Hero intro text",
      type: "text",
      rows: 3,
      fieldset: "homepageHero",
    }),
    defineField({
      name: "homepageHeroCtaLabel",
      title: "Hero CTA label",
      type: "string",
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
    defineField({
      name: "homepageRecipesEyebrow",
      title: "Recipes eyebrow",
      type: "string",
      fieldset: "homepageRecipes",
    }),
    defineField({
      name: "homepageRecipesHeading",
      title: "Recipes heading",
      type: "string",
      fieldset: "homepageRecipes",
    }),
    defineField({
      name: "homepageRecipesCtaLabel",
      title: "Recipes CTA label",
      type: "string",
      fieldset: "homepageRecipes",
    }),
    defineField({
      name: "homepageRecipesCtaHref",
      title: "Recipes CTA link",
      type: "string",
      fieldset: "homepageRecipes",
    }),
    defineField({
      name: "homepageCategoriesEyebrow",
      title: "Categories eyebrow",
      type: "string",
      fieldset: "homepageCategories",
    }),
    defineField({
      name: "homepageCategoriesHeading",
      title: "Categories heading",
      type: "string",
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
            defineField({
              name: "title",
              title: "Title",
              type: "string",
            }),
            defineField({
              name: "href",
              title: "Link",
              type: "string",
            }),
            defineField({
              name: "copy",
              title: "Copy",
              type: "text",
              rows: 3,
            }),
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
    defineField({
      name: "homepageAboutEyebrow",
      title: "About eyebrow",
      type: "string",
      fieldset: "homepageAbout",
    }),
    defineField({
      name: "homepageAboutHeading",
      title: "About heading",
      type: "string",
      fieldset: "homepageAbout",
    }),
    defineField({
      name: "homepageAboutText",
      title: "About text",
      type: "text",
      rows: 4,
      fieldset: "homepageAbout",
    }),
    defineField({
      name: "homepageNewsletterEyebrow",
      title: "Newsletter eyebrow",
      type: "string",
      fieldset: "homepageNewsletter",
    }),
    defineField({
      name: "homepageNewsletterHeading",
      title: "Newsletter heading",
      type: "string",
      fieldset: "homepageNewsletter",
    }),
    defineField({
      name: "homepageNewsletterText",
      title: "Newsletter text",
      type: "text",
      rows: 3,
      fieldset: "homepageNewsletter",
    }),
    defineField({
      name: "homepageNewsletterButtonLabel",
      title: "Newsletter button label",
      type: "string",
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
