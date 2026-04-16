import {defineArrayMember, defineField} from "sanity";

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

export function localizedBlockField(name: string, title: string) {
  return defineField({
    name,
    title,
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
  });
}
