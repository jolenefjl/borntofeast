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
      of: [
        defineArrayMember({
          type: "reference",
          to: [{type: "recipe"}],
        }),
      ],
      validation: (rule) => rule.max(4),
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
