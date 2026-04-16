import {defineArrayMember, defineField, defineType} from "sanity";

import {
  localizedStringField,
  localizedTextField,
} from "@/sanity/schemaTypes/localized";

export const aboutPageType = defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  fields: [
    localizedStringField("heroEyebrow", "Hero eyebrow"),
    localizedStringField("heroTitle", "Hero title"),
    localizedTextField("heroIntro", "Hero intro", {rows: 4}),
    defineField({
      name: "heroImage",
      title: "Hero image",
      type: "image",
      options: {hotspot: true},
      fields: [defineField({name: "alt", title: "Alt text", type: "string"})],
    }),
    localizedStringField("storyEyebrow", "Story eyebrow"),
    localizedStringField("storyTitle", "Story title"),
    defineField({
      name: "storyBody",
      title: "Story body",
      type: "object",
      fields: [
        defineField({
          name: "en",
          title: "English",
          type: "array",
          of: [defineArrayMember({type: "block"})],
        }),
        defineField({
          name: "no",
          title: "Norwegian",
          type: "array",
          of: [defineArrayMember({type: "block"})],
        }),
      ],
    }),
    localizedStringField("valuesEyebrow", "Values eyebrow"),
    localizedStringField("valuesTitle", "Values title"),
    defineField({
      name: "values",
      title: "Value cards",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            localizedStringField("title", "Title"),
            defineField({name: "href", title: "Link", type: "string"}),
            localizedTextField("copy", "Copy", {rows: 3}),
          ],
          preview: {
            select: {title: "title", subtitle: "href"},
            prepare({title, subtitle}) {
              return {
                title: title?.en || "Value card",
                subtitle,
              };
            },
          },
        }),
      ],
    }),
    localizedStringField("nextEyebrow", "Next section eyebrow"),
    localizedStringField("nextTitle", "Next section title"),
    localizedTextField("nextText", "Next section text", {rows: 4}),
    defineField({
      name: "nextImage",
      title: "Next section image",
      type: "image",
      options: {hotspot: true},
      fields: [defineField({name: "alt", title: "Alt text", type: "string"})],
    }),
  ],
  preview: {
    prepare() {
      return {title: "About Page"};
    },
  },
});
