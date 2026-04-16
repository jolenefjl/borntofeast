import {defineField, defineType} from "sanity";

import {
  localizedStringField,
  localizedTextField,
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
    localizedTextField("description", "Description", {
      description: "Optional short context for browsing/filter pages later.",
      rows: 3,
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
