import {defineArrayMember, defineField, defineType} from "sanity";

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
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
