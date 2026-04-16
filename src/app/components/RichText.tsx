import {PortableText, type PortableTextComponents} from "next-sanity";

export type PortableBlock = {
  _key: string;
  _type: "block";
  style?: string;
  children?: {text?: string}[];
};

export type RichTextValue = PortableBlock[] | string | null | undefined;

const components: PortableTextComponents = {
  block: {
    normal: ({children}) => <p>{children}</p>,
    h2: ({children}) => (
      <h2 className="font-serif text-3xl font-black lowercase leading-[0.95] sm:text-4xl">
        {children}
      </h2>
    ),
    h3: ({children}) => (
      <h3 className="font-serif text-2xl font-black lowercase leading-[1] sm:text-3xl">
        {children}
      </h3>
    ),
  },
  list: {
    bullet: ({children}) => (
      <ul className="list-disc space-y-2 pl-5">{children}</ul>
    ),
    number: ({children}) => (
      <ol className="list-decimal space-y-2 pl-5">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({children}) => <li>{children}</li>,
    number: ({children}) => <li>{children}</li>,
  },
  marks: {
    strong: ({children}) => <strong className="font-bold">{children}</strong>,
    em: ({children}) => <em>{children}</em>,
  },
};

export function richTextToPlainText(value: RichTextValue) {
  if (typeof value === "string") {
    return value;
  }

  return (
    value
      ?.map((block) => block.children?.map((child) => child.text).join(""))
      .filter(Boolean)
      .join(" ") || ""
  );
}

export function paragraphsToRichText(paragraphs: readonly string[]) {
  return paragraphs.map((paragraph, index) => ({
    _key: `paragraph-${index + 1}`,
    _type: "block" as const,
    style: "normal",
    children: [
      {
        text: paragraph,
      },
    ],
  }));
}

export function hasRichText(value: RichTextValue) {
  return Boolean(richTextToPlainText(value).trim());
}

export function RichText({
  value,
  className,
}: {
  value: RichTextValue;
  className?: string;
}) {
  if (!hasRichText(value)) {
    return null;
  }

  if (typeof value === "string") {
    return (
      <div className={className}>
        <p>{value}</p>
      </div>
    );
  }

  const blocks = value || [];

  return (
    <div className={className}>
      <PortableText value={blocks} components={components} />
    </div>
  );
}
