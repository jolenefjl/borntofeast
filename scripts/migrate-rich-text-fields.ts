import {getCliClient} from "sanity/cli";

type SanityDocument = {
  _id: string;
  _type: string;
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
const richTextFieldsByType: Record<string, string[]> = {
  aboutPage: ["heroIntro", "storyBody", "nextText"],
  category: ["description"],
  cuisine: ["description"],
  recipe: ["intro", "tipsAndNotes"],
  siteSettings: [
    "homepageHeroIntro",
    "homepageAboutText",
    "homepageNewsletterText",
    "footerIntro",
  ],
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasRichText(value: unknown) {
  return Array.isArray(value) && value.length > 0;
}

function block(field: string, locale: string, index: number, text: string) {
  return {
    _key: `${field}-${locale}-${index + 1}`,
    _type: "block",
    style: "normal",
    markDefs: [],
    children: [
      {
        _key: `${field}-${locale}-${index + 1}-span`,
        _type: "span",
        marks: [],
        text,
      },
    ],
  } satisfies PortableTextBlock;
}

function stringToBlocks(field: string, locale: string, value: string) {
  return value
    .split(/\n\s*\n/g)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph, index) => block(field, locale, index, paragraph));
}

function migrateLocalizedRichText(value: unknown, field: string) {
  if (typeof value === "string" && value.trim()) {
    return {
      changed: true,
      value: {en: stringToBlocks(field, "en", value)},
      changedFields: [`${field}.en`],
    };
  }

  if (!isObject(value)) {
    return {changed: false, value, changedFields: []};
  }

  const next = {...value};
  const changedFields: string[] = [];

  for (const locale of ["en", "no"]) {
    const localized = value[locale];

    if (hasRichText(localized)) {
      continue;
    }

    if (typeof localized === "string" && localized.trim()) {
      next[locale] = stringToBlocks(field, locale, localized);
      changedFields.push(`${field}.${locale}`);
    }
  }

  return {
    changed: changedFields.length > 0,
    value: next,
    changedFields,
  };
}

function migrateMethodSteps(value: unknown) {
  if (!Array.isArray(value)) {
    return {changed: false, value, changedFields: []};
  }

  let changed = false;
  const steps = value.map((step, index) => {
    if (!isObject(step)) {
      return step;
    }

    const result = migrateLocalizedRichText(
      step.content,
      `methodSteps-${index + 1}-content`,
    );

    if (!result.changed) {
      return step;
    }

    changed = true;
    return {...step, content: result.value};
  });

  return {
    changed,
    value: steps,
    changedFields: changed ? ["methodSteps[].content"] : [],
  };
}

function buildPatch(document: SanityDocument) {
  const set: Record<string, unknown> = {};
  const fieldsChanged: string[] = [];
  const richTextFields = richTextFieldsByType[document._type] || [];

  for (const field of richTextFields) {
    const result = migrateLocalizedRichText(document[field], field);

    if (result.changed) {
      set[field] = result.value;
      fieldsChanged.push(...result.changedFields);
    }
  }

  if (document._type === "recipe") {
    const methodSteps = migrateMethodSteps(document.methodSteps);

    if (methodSteps.changed) {
      set.methodSteps = methodSteps.value;
      fieldsChanged.push(...methodSteps.changedFields);
    }
  }

  return {set, fieldsChanged};
}

async function run() {
  const client = getCliClient({
    apiVersion: "2026-04-15",
  });
  const documents = await client.fetch<SanityDocument[]>(
    `*[
      _type in ["aboutPage", "category", "cuisine", "recipe", "siteSettings"] &&
      !(_id in path("versions.**"))
    ]`,
  );
  const patches = documents
    .map((document) => ({document, patch: buildPatch(document)}))
    .filter(({patch}) => patch.fieldsChanged.length > 0);

  console.log(`${applyChanges ? "Applying" : "Dry run"} rich text migration`);
  console.log(`Documents scanned: ${documents.length}`);
  console.log(`Documents with changes: ${patches.length}`);

  for (const {document, patch} of patches) {
    console.log(`- ${document._id} (${document._type})`);
    for (const field of patch.fieldsChanged) {
      console.log(`  - ${field}`);
    }
  }

  if (!applyChanges) {
    console.log("No changes written. Re-run with --apply to mutate content.");
    return;
  }

  for (const {document, patch} of patches) {
    await client.patch(document._id).set(patch.set).commit();
  }

  console.log(`Migration complete. Documents updated: ${patches.length}`);
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
