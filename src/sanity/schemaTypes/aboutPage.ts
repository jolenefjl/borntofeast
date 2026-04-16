import {defineArrayMember, defineField, defineType} from "sanity";

import {
  localizedRichTextField,
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
    localizedRichTextField("heroIntro", "Hero intro", {
      description: "Introductory body copy below the main title.",
    }),
    localizedStringField("heroCtaLabel", "Hero CTA label"),
    defineField({
      name: "heroCtaHref",
      title: "Hero CTA link",
      description: "Use an internal path such as /recipes or an external URL.",
      type: "string",
    }),
    defineField({
      name: "heroImage",
      title: "Hero image",
      type: "image",
      options: {hotspot: true},
      fields: [defineField({name: "alt", title: "Alt text", type: "string"})],
    }),
    localizedStringField("storyEyebrow", "Story eyebrow"),
    localizedStringField("storyTitle", "Story title"),
    localizedRichTextField("storyBody", "Story body"),
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
    localizedRichTextField("nextText", "Next section text", {
      description: "Longer supporting body copy for the closing section.",
    }),
    localizedStringField("nextCtaLabel", "Next section CTA label"),
    defineField({
      name: "nextCtaHref",
      title: "Next section CTA link",
      description: "Use an internal path such as /recipes or an external URL.",
      type: "string",
    }),
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
