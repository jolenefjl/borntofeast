import {getCliClient} from "sanity/cli";

import {en} from "../src/i18n/dictionaries/en";
import {no} from "../src/i18n/dictionaries/no";

type LocalizedString = {
  en?: string;
  no?: string;
};

type AboutPageDocument = {
  _id: string;
  _type: "aboutPage";
  [key: string]: unknown;
};

type PortableTextBlock = {
  _key: string;
  _type: "block";
  style: "normal";
  markDefs: [];
  children: {
    _key: string;
    _type: "span";
    marks: [];
    text: string;
  }[];
};

const applyChanges = process.argv.includes("--apply");

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasText(value: unknown) {
  return typeof value === "string" && value.trim().length > 0;
}

function localizedValue(enValue: string, noValue: string): LocalizedString {
  return {
    en: enValue,
    no: noValue,
  };
}

function block(key: string, text: string): PortableTextBlock {
  return {
    _key: key,
    _type: "block",
    style: "normal",
    markDefs: [],
    children: [
      {
        _key: `${key}-span`,
        _type: "span",
        marks: [],
        text,
      },
    ],
  };
}

function portableText(enParagraphs: readonly string[], noParagraphs: readonly string[]) {
  return {
    en: enParagraphs.map((paragraph, index) =>
      block(`en-story-${index + 1}`, paragraph),
    ),
    no: noParagraphs.map((paragraph, index) =>
      block(`no-story-${index + 1}`, paragraph),
    ),
  };
}

const aboutSeed = {
  heroEyebrow: localizedValue(en.about.heroEyebrow, no.about.heroEyebrow),
  heroTitle: localizedValue(en.about.heroTitle, no.about.heroTitle),
  heroIntro: localizedValue(en.about.heroIntro, no.about.heroIntro),
  storyEyebrow: localizedValue(en.about.storyEyebrow, no.about.storyEyebrow),
  storyTitle: localizedValue(en.about.storyTitle, no.about.storyTitle),
  storyBody: portableText(en.about.storyBody, no.about.storyBody),
  valuesEyebrow: localizedValue(en.about.valuesEyebrow, no.about.valuesEyebrow),
  valuesTitle: localizedValue(en.about.valuesTitle, no.about.valuesTitle),
  values: en.about.values.map((value, index) => ({
    _key: `value-${index + 1}`,
    title: localizedValue(value.title, no.about.values[index]?.title || ""),
    href: value.href,
    copy: localizedValue(value.copy, no.about.values[index]?.copy || ""),
  })),
  nextEyebrow: localizedValue(en.about.nextEyebrow, no.about.nextEyebrow),
  nextTitle: localizedValue(en.about.nextTitle, no.about.nextTitle),
  nextText: localizedValue(en.about.nextText, no.about.nextText),
};

function mergeLocalizedField(
  current: unknown,
  seed: LocalizedString,
  fieldName: string,
) {
  const currentValue = isObject(current) ? current : {};
  const next = {...currentValue};
  const changedFields: string[] = [];

  if (!hasText(currentValue.en) && seed.en) {
    next.en = seed.en;
    changedFields.push(`${fieldName}.en`);
  }

  if (!hasText(currentValue.no) && seed.no) {
    next.no = seed.no;
    changedFields.push(`${fieldName}.no`);
  }

  return {
    changed: changedFields.length > 0,
    value: next,
    changedFields,
  };
}

function hasPortableText(value: unknown) {
  return Array.isArray(value) && value.length > 0;
}

function mergePortableTextField(
  current: unknown,
  seed: {en: PortableTextBlock[]; no: PortableTextBlock[]},
  fieldName: string,
) {
  const currentValue = isObject(current) ? current : {};
  const next = {...currentValue};
  const changedFields: string[] = [];

  if (!hasPortableText(currentValue.en)) {
    next.en = seed.en;
    changedFields.push(`${fieldName}.en`);
  }

  if (!hasPortableText(currentValue.no)) {
    next.no = seed.no;
    changedFields.push(`${fieldName}.no`);
  }

  return {
    changed: changedFields.length > 0,
    value: next,
    changedFields,
  };
}

function buildPatch(document: AboutPageDocument | null) {
  const set: Record<string, unknown> = {};
  const fieldsChanged: string[] = [];
  const current = document || ({_id: "aboutPage", _type: "aboutPage"} as AboutPageDocument);

  for (const field of [
    "heroEyebrow",
    "heroTitle",
    "heroIntro",
    "storyEyebrow",
    "storyTitle",
    "valuesEyebrow",
    "valuesTitle",
    "nextEyebrow",
    "nextTitle",
    "nextText",
  ] as const) {
    const result = mergeLocalizedField(current[field], aboutSeed[field], field);

    if (result.changed) {
      set[field] = result.value;
      fieldsChanged.push(...result.changedFields);
    }
  }

  const storyBody = mergePortableTextField(
    current.storyBody,
    aboutSeed.storyBody,
    "storyBody",
  );

  if (storyBody.changed) {
    set.storyBody = storyBody.value;
    fieldsChanged.push(...storyBody.changedFields);
  }

  if (!Array.isArray(current.values) || current.values.length === 0) {
    set.values = aboutSeed.values;
    fieldsChanged.push("values");
  }

  return {set, fieldsChanged};
}

async function run() {
  const client = getCliClient({
    apiVersion: "2026-04-15",
  });
  const document = await client.fetch<AboutPageDocument | null>(
    `*[_type == "aboutPage" && _id == "aboutPage"][0]`,
  );
  const patch = buildPatch(document);

  console.log(`${applyChanges ? "Applying" : "Dry run"} about page seed`);
  console.log(`Document exists: ${document ? "yes" : "no"}`);
  console.log(`Fields with changes: ${patch.fieldsChanged.length}`);

  for (const field of patch.fieldsChanged) {
    console.log(`- ${field}`);
  }

  if (!applyChanges) {
    console.log("No changes written. Re-run with --apply to mutate content.");
    return;
  }

  if (patch.fieldsChanged.length === 0) {
    console.log("Nothing to seed.");
    return;
  }

  await client
    .transaction()
    .createIfNotExists({_id: "aboutPage", _type: "aboutPage"})
    .patch("aboutPage", (builder) => builder.set(patch.set))
    .commit();

  console.log("About page seed complete.");
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
