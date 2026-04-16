import {defineField, defineType} from "sanity";

import {
  localizedRichTextField,
  localizedStringField,
} from "@/sanity/schemaTypes/localized";

export const cuisineType = defineType({
  name: "cuisine",
  title: "Cuisine",
  type: "document",
  fields: [
    localizedStringField("name", "Cuisine name"),
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
      description: "Optional short context for browsing/filter pages later.",
    }),
  ],
  preview: {
    select: {
      title: "name.en",
      subtitle: "slug.current",
    },
    prepare({title, subtitle}) {
      return {
        title: title || "Cuisine",
        subtitle,
      };
    },
  },
});
