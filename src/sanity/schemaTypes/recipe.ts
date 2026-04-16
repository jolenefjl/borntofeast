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
    title: "Ingredient name (English + Norwegian)",
    description:
      "Open this field to enter the English and Norwegian display names shown in the ingredients list.",
    type: "object",
    fields: [
      defineField({name: "en", title: "English ingredient name", type: "string"}),
      defineField({name: "no", title: "Norwegian ingredient name", type: "string"}),
    ],
  }),
  defineField({
    name: "note",
    title: "Optional ingredient note (English + Norwegian)",
    description:
      "Open this field to enter optional English and Norwegian notes, for example finely sliced or toasted.",
    type: "object",
    fields: [
      defineField({name: "en", title: "English ingredient note", type: "string"}),
      defineField({name: "no", title: "Norwegian ingredient note", type: "string"}),
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
  const norwegianTitle = typeof title === "object" ? title.no : undefined;
  const resolvedNote = typeof note === "object" ? note.en : note;
  const norwegianStatus = norwegianTitle ? "Norwegian added" : "Norwegian missing";

  return {
    title: [amount, resolvedTitle].filter(Boolean).join(" "),
    subtitle: [norwegianStatus, filterKey, resolvedNote]
      .filter(Boolean)
      .join(" | "),
  };
}

function plainTextFromBlocks(blocks: unknown) {
  if (!Array.isArray(blocks)) {
    return "";
  }

  return blocks
    .map((block) => {
      if (!block || typeof block !== "object" || !("children" in block)) {
        return "";
      }

      const children = (block as {children?: {text?: string}[]}).children;

      return children
        ?.map((child) => child.text)
        .filter(Boolean)
        .join("");
    })
    .filter(Boolean)
    .join(" ");
}

export const recipeType = defineType({
  name: "recipe",
  title: "Recipe",
  type: "document",
  fields: [
    localizedStringField("title", "Recipe title"),
    defineField({
      name: "slug",
      title: "Shared slug",
      description:
        "Current public recipe URL slug used for both languages. Keep this stable until localized slugs are ready to replace it.",
      type: "slug",
      options: {
        source: "title.en",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "localizedSlug",
      title: "Localized slugs",
      description:
        "Optional future-ready URL slugs per language. Shared slug still works as the fallback for phase 1.",
      type: "object",
      fields: [
        defineField({
          name: "en",
          title: "English slug",
          type: "slug",
          options: {source: "title.en", maxLength: 96},
        }),
        defineField({
          name: "no",
          title: "Norwegian slug",
          type: "slug",
          options: {source: "title.no", maxLength: 96},
        }),
      ],
    }),
    defineField({
      name: "cuisine",
      title: "Localized cuisine",
      description:
        "Preferred cuisine taxonomy for filtering and bilingual display. Create or select a Cuisine document with English and Norwegian names.",
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
      title: "Ingredients (English + Norwegian names)",
      description:
        "Each ingredient has shared quantity/unit/filter key fields, plus localized English and Norwegian display name and note fields.",
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
      title: "Method steps (English + Norwegian)",
      description:
        "Open each step and fill in both English and Norwegian step text. Norwegian recipe pages only render when Norwegian method content exists.",
      type: "array",
      of: [
        defineArrayMember({
          name: "methodStep",
          title: "Method step",
          type: "object",
          fields: [
            localizedRichTextField("content", "Step text (English + Norwegian)", {
              description:
                "Open this field to enter English step text and Norwegian step text.",
              simple: true,
            }),
          ],
          preview: {
            select: {
              blocks: "content",
            },
            prepare({blocks}) {
              const englishBlocks =
                blocks && !Array.isArray(blocks) ? blocks.en : blocks;
              const norwegianBlocks =
                blocks && !Array.isArray(blocks) ? blocks.no : undefined;
              const title = plainTextFromBlocks(englishBlocks);
              const hasNorwegian = Boolean(plainTextFromBlocks(norwegianBlocks));

              return {
                title: title || "Method step",
                subtitle: hasNorwegian ? "Norwegian added" : "Norwegian missing",
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
      name: "guidanceCards",
      title: "Recipe guidance photo cards",
      description:
        "Optional cooking-help cards for this recipe only, such as texture cues, folding/rolling notes, doneness checks, or prep visuals. Leave empty to show nothing.",
      type: "array",
      of: [
        defineArrayMember({
          name: "recipeGuidanceCard",
          title: "Recipe guidance card",
          type: "object",
          fields: [
            defineField({
              name: "image",
              title: "Guidance image",
              description: "Use a specific visual cue that helps with this recipe.",
              type: "image",
              options: {hotspot: true},
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
            localizedStringField("title", "Guidance title", {
              description:
                "Short recipe-help title, for example Sauce texture, Fold like this, or When the rice is ready.",
            }),
            localizedRichTextField("body", "Guidance body", {
              description:
                "Optional supporting copy for the visual cue. Keep this practical and recipe-specific.",
              simple: true,
            }),
          ],
          preview: {
            select: {
              title: "title.en",
              media: "image",
            },
            prepare({title, media}) {
              return {
                title: title || "Recipe guidance card",
                media,
              };
            },
          },
        }),
      ],
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
