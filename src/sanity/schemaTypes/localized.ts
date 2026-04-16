import {defineArrayMember, defineField} from "sanity";

const richTextBlock = defineArrayMember({
  type: "block",
  styles: [
    {title: "Paragraph", value: "normal"},
    {title: "Heading 2", value: "h2"},
    {title: "Heading 3", value: "h3"},
  ],
  lists: [
    {title: "Bullet list", value: "bullet"},
    {title: "Numbered list", value: "number"},
  ],
  marks: {
    decorators: [
      {title: "Bold", value: "strong"},
      {title: "Italic", value: "em"},
    ],
    annotations: [],
  },
});

const simpleRichTextBlock = defineArrayMember({
  type: "block",
  styles: [{title: "Paragraph", value: "normal"}],
  lists: [],
  marks: {
    decorators: [
      {title: "Bold", value: "strong"},
      {title: "Italic", value: "em"},
    ],
    annotations: [],
  },
});

export function localizedStringField(
  name: string,
  title: string,
  options: {description?: string; fieldset?: string} = {},
) {
  return defineField({
    name,
    title,
    description: options.description,
    fieldset: options.fieldset,
    type: "object",
    fields: [
      defineField({name: "en", title: "English", type: "string"}),
      defineField({name: "no", title: "Norwegian", type: "string"}),
    ],
  });
}

export function localizedTextField(
  name: string,
  title: string,
  options: {description?: string; fieldset?: string; rows?: number} = {},
) {
  return defineField({
    name,
    title,
    description: options.description,
    fieldset: options.fieldset,
    type: "object",
    fields: [
      defineField({
        name: "en",
        title: "English",
        type: "text",
        rows: options.rows ?? 3,
      }),
      defineField({
        name: "no",
        title: "Norwegian",
        type: "text",
        rows: options.rows ?? 3,
      }),
    ],
  });
}

export function localizedRichTextField(
  name: string,
  title: string,
  options: {
    description?: string;
    fieldset?: string;
    simple?: boolean;
  } = {},
) {
  const block = options.simple ? simpleRichTextBlock : richTextBlock;

  return defineField({
    name,
    title,
    description: options.description,
    fieldset: options.fieldset,
    type: "object",
    fields: [
      defineField({
        name: "en",
        title: "English",
        type: "array",
        of: [block],
      }),
      defineField({
        name: "no",
        title: "Norwegian",
        type: "array",
        of: [block],
      }),
    ],
  });
}

export const localizedBlockField = localizedRichTextField;
