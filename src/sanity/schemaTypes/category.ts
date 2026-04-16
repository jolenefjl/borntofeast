import {defineField, defineType} from "sanity";

import {
  localizedRichTextField,
  localizedStringField,
} from "@/sanity/schemaTypes/localized";

export const categoryType = defineType({
  name: "category",
  title: "Category",
  type: "document",
  fields: [
    localizedStringField("name", "Category name"),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name.en",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    localizedRichTextField("description", "Description", {
      description: "Optional editorial copy for future category pages.",
    }),
    defineField({
      name: "heroImage",
      title: "Hero image",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "heroImage",
    },
    prepare({title, media}) {
      const resolvedTitle =
        typeof title === "object" && title ? title.en : title;

      return {
        title: resolvedTitle || "Category",
        media,
      };
    },
  },
});
