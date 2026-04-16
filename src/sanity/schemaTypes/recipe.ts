import {defineArrayMember, defineField, defineType} from "sanity";

import {
  localizedRichTextField,
  localizedStringField,
} from "@/sanity/schemaTypes/localized";

const cuisineOptions = [
  "Chinese",
  "Korean",
  "Malaysian",
  "Fusion",
  "Japanese",
  "Other",
];

const ingredientFields = [
  defineField({
    name: "quantity",
    title: "Quantity",
    type: "number",
    validation: (rule) => rule.min(0),
  }),
  defineField({
    name: "unit",
    title: "Unit",
    type: "string",
  }),
  defineField({
    name: "name",
    title: "Ingredient name",
    description: "The display name shown in the recipe, localized for readers.",
    type: "object",
    fields: [
      defineField({name: "en", title: "English", type: "string"}),
      defineField({name: "no", title: "Norwegian", type: "string"}),
    ],
  }),
  defineField({
    name: "note",
    title: "Optional note",
    description: "Optional display note, for example finely sliced or toasted.",
    type: "object",
    fields: [
      defineField({name: "en", title: "English", type: "string"}),
      defineField({name: "no", title: "Norwegian", type: "string"}),
    ],
  }),
  defineField({
    name: "filterKey",
    title: "Ingredient filter key",
    description:
      "Normalized ingredient identifier for recipe filtering. Use lowercase singular slugs such as spring-onion, soy-sauce, kimchi, egg. Keep this stable even if display names change.",
    type: "string",
    validation: (rule) =>
      rule
        .required()
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
          name: "slug",
          invert: false,
        })
        .error("Use lowercase letters/numbers separated by hyphens."),
  }),
];

function prepareIngredientPreview({
  quantity,
  unit,
  title,
  note,
  filterKey,
}: {
  quantity?: number;
  unit?: string;
  title?: string | {en?: string; no?: string};
  note?: string | {en?: string; no?: string};
  filterKey?: string;
}) {
  const amount = [quantity, unit].filter(Boolean).join(" ");
  const resolvedTitle = typeof title === "object" ? title.en : title;
  const resolvedNote = typeof note === "object" ? note.en : note;

  return {
    title: [amount, resolvedTitle].filter(Boolean).join(" "),
    subtitle: [filterKey, resolvedNote].filter(Boolean).join(" | "),
  };
}

export const recipeType = defineType({
  name: "recipe",
  title: "Recipe",
  type: "document",
  fields: [
    localizedStringField("title", "Recipe title"),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title.en",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "cuisine",
      title: "Cuisine",
      description:
        "Preferred for filtering and editor-friendly taxonomy. Keep the legacy cuisine type filled until existing content is migrated.",
      type: "reference",
      to: [{type: "cuisine"}],
    }),
    defineField({
      name: "cuisineType",
      title: "Legacy cuisine type",
      description:
        "Legacy fixed dropdown used as a fallback while cuisine references are being migrated.",
      type: "string",
      options: {
        list: cuisineOptions.map((title) => ({title, value: title})),
        layout: "dropdown",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "difficulty",
      title: "Difficulty",
      type: "string",
      options: {
        list: [
          {title: "Easy", value: "Easy"},
          {title: "Medium", value: "Medium"},
          {title: "Deep Dive", value: "Deep Dive"},
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "prepTime",
      title: "Prep time in minutes",
      type: "number",
      validation: (rule) => rule.required().integer().min(0),
    }),
    defineField({
      name: "cookTime",
      title: "Cook time in minutes",
      type: "number",
      validation: (rule) => rule.required().integer().min(0),
    }),
    defineField({
      name: "servings",
      title: "Servings",
      type: "number",
      validation: (rule) => rule.required().integer().min(1),
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
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "gallery",
      title: "Photo gallery",
      type: "array",
      of: [
        defineArrayMember({
          name: "galleryImage",
          title: "Gallery image",
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
    }),
    localizedRichTextField("intro", "Short description / intro", {
      description: "Personal, conversational, and why you love this dish.",
    }),
    defineField({
      name: "ingredients",
      title: "Ingredients",
      type: "array",
      of: [
        defineArrayMember({
          name: "ingredient",
          title: "Ingredient",
          type: "object",
          fields: ingredientFields,
          preview: {
            select: {
              quantity: "quantity",
              unit: "unit",
              title: "name",
              note: "note",
              filterKey: "filterKey",
            },
            prepare: prepareIngredientPreview,
          },
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "methodSteps",
      title: "Method steps",
      type: "array",
      of: [
        defineArrayMember({
          name: "methodStep",
          title: "Method step",
          type: "object",
          fields: [
            localizedRichTextField("content", "Step", {
              simple: true,
            }),
          ],
          preview: {
            select: {
              blocks: "content",
            },
            prepare({blocks}) {
              const localizedBlocks =
                blocks && !Array.isArray(blocks) ? blocks.en : blocks;
              const block = Array.isArray(localizedBlocks)
                ? localizedBlocks[0]
                : undefined;
              const title = block?.children
                ?.map((child: {text?: string}) => child.text)
                .filter(Boolean)
                .join("");

              return {
                title: title || "Method step",
              };
            },
          },
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
    localizedRichTextField("tipsAndNotes", "Tips & notes", {
      description:
        "Use this for extra context, substitutions, storage notes, or serving ideas.",
    }),
    defineField({
      name: "tiktokUrl",
      title: "TikTok video URL",
      type: "url",
    }),
    defineField({
      name: "tags",
      title: "Tags",
      description:
        "Optional editorial tags for mood, format, diet, or practical use. Tags are not cuisine (use Cuisine), not difficulty (use Difficulty), and not ingredients (use ingredient filter keys). Use lowercase hyphenated tags such as weeknight, comfort-food, one-pot, spicy, vegetarian.",
      type: "array",
      of: [defineArrayMember({type: "string"})],
      options: {
        layout: "tags",
      },
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "publishedAt",
      title: "Published date",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
  ],
  orderings: [
    {
      title: "Published date, newest first",
      name: "publishedAtDesc",
      by: [{field: "publishedAt", direction: "desc"}],
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "cuisineType",
      media: "heroImage",
    },
    prepare({title, subtitle, media}) {
      const resolvedTitle =
        typeof title === "object" && title ? title.en : title;

      return {
        title: resolvedTitle || "Recipe",
        subtitle,
        media,
      };
    },
  },
});
