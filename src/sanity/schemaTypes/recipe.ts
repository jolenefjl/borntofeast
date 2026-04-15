import {defineArrayMember, defineField, defineType} from "sanity";

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
    type: "string",
    validation: (rule) => rule.required(),
  }),
  defineField({
    name: "note",
    title: "Optional note",
    type: "string",
  }),
];

function prepareIngredientPreview({
  quantity,
  unit,
  title,
  note,
}: {
  quantity?: number;
  unit?: string;
  title?: string;
  note?: string;
}) {
  const amount = [quantity, unit].filter(Boolean).join(" ");

  return {
    title: [amount, title].filter(Boolean).join(" "),
    subtitle: note,
  };
}

export const recipeType = defineType({
  name: "recipe",
  title: "Recipe",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Recipe title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "cuisineType",
      title: "Cuisine type",
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
    defineField({
      name: "intro",
      title: "Short description / intro",
      description: "Personal, conversational, and why you love this dish.",
      type: "text",
      rows: 5,
      validation: (rule) => rule.required(),
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
            defineField({
              name: "content",
              title: "Step",
              type: "array",
              of: [defineArrayMember({type: "block"})],
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "ingredients",
              title: "Ingredients used in this step",
              description:
                "Optional. Add ingredients here when you want them to appear inside the method. Quantities scale with the servings buttons.",
              type: "array",
              of: [
                defineArrayMember({
                  name: "stepIngredient",
                  title: "Step ingredient",
                  type: "object",
                  fields: ingredientFields,
                  preview: {
                    select: {
                      quantity: "quantity",
                      unit: "unit",
                      title: "name",
                      note: "note",
                    },
                    prepare: prepareIngredientPreview,
                  },
                }),
              ],
            }),
          ],
          preview: {
            select: {
              blocks: "content",
            },
            prepare({blocks}) {
              const block = Array.isArray(blocks) ? blocks[0] : undefined;
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
    defineField({
      name: "tipsAndNotes",
      title: "Tips & notes",
      type: "array",
      of: [defineArrayMember({type: "block"})],
    }),
    defineField({
      name: "tiktokUrl",
      title: "TikTok video URL",
      type: "url",
    }),
    defineField({
      name: "tags",
      title: "Tags",
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
  },
});
