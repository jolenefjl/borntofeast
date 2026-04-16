import {getCliClient} from "sanity/cli";

type SanityDocument = {
  _id: string;
  _type: string;
  [key: string]: unknown;
};

type MigrationResult<T> = {
  changed: boolean;
  value: T;
};

const applyChanges = process.argv.includes("--apply");

const localizedSiteSettingsFields = [
  "homepageHeroLine1",
  "homepageHeroLine2",
  "homepageHeroLine3",
  "homepageHeroIntro",
  "homepageHeroCtaLabel",
  "homepageRecipesEyebrow",
  "homepageRecipesHeading",
  "homepageRecipesCtaLabel",
  "homepageCategoriesEyebrow",
  "homepageCategoriesHeading",
  "homepageAboutEyebrow",
  "homepageAboutHeading",
  "homepageAboutText",
  "homepageNewsletterEyebrow",
  "homepageNewsletterHeading",
  "homepageNewsletterText",
  "homepageNewsletterButtonLabel",
] as const;

const localizedCategoryFields = ["name", "description"] as const;

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasValue(value: unknown) {
  return value !== undefined && value !== null && value !== "";
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getEnglishString(value: unknown) {
  if (typeof value === "string") {
    return value;
  }

  if (isObject(value) && typeof value.en === "string") {
    return value.en;
  }

  return "";
}

function migrateLocalizedField(value: unknown): MigrationResult<unknown> {
  if (typeof value === "string" && value.trim()) {
    return {
      changed: true,
      value: {en: value},
    };
  }

  if (Array.isArray(value) && value.length > 0) {
    return {
      changed: true,
      value: {en: value},
    };
  }

  return {changed: false, value};
}

function migrateLocalizedObject(value: unknown): MigrationResult<unknown> {
  if (!isObject(value)) {
    return migrateLocalizedField(value);
  }

  if (hasValue(value.en)) {
    return {changed: false, value};
  }

  return {changed: false, value};
}

function migrateObjectFields<T extends Record<string, unknown>>(
  object: T,
  fields: readonly string[],
) {
  let changed = false;
  const next = {...object};
  const fieldsChanged: string[] = [];

  for (const field of fields) {
    const result = migrateLocalizedObject(object[field]);
    if (result.changed) {
      next[field as keyof T] = result.value as T[keyof T];
      changed = true;
      fieldsChanged.push(field);
    }
  }

  return {changed, value: next, fieldsChanged};
}

function migrateIngredients(value: unknown) {
  if (!Array.isArray(value)) {
    return {changed: false, value, fieldsChanged: []};
  }

  let changed = false;
  const fieldsChanged = new Set<string>();

  const ingredients = value.map((ingredient) => {
    if (!isObject(ingredient)) {
      return ingredient;
    }

    let next = ingredient;

    for (const field of ["name", "note"]) {
      const result = migrateLocalizedObject(next[field]);
      if (result.changed) {
        next = {...next, [field]: result.value};
        changed = true;
        fieldsChanged.add(`ingredients[].${field}`);
      }
    }

    if (!hasValue(next.filterKey)) {
      const filterKey = slugify(getEnglishString(next.name));

      if (filterKey) {
        next = {...next, filterKey};
        changed = true;
        fieldsChanged.add("ingredients[].filterKey");
      }
    }

    return next;
  });

  return {changed, value: ingredients, fieldsChanged: [...fieldsChanged]};
}

function migrateMethodSteps(value: unknown) {
  if (!Array.isArray(value)) {
    return {changed: false, value, fieldsChanged: []};
  }

  let changed = false;

  const methodSteps = value.map((step) => {
    if (!isObject(step)) {
      return step;
    }

    const result = migrateLocalizedObject(step.content);
    if (!result.changed) {
      return step;
    }

    changed = true;
    return {...step, content: result.value};
  });

  return {
    changed,
    value: methodSteps,
    fieldsChanged: changed ? ["methodSteps[].content"] : [],
  };
}

function migrateHomepageCategoryCards(value: unknown) {
  if (!Array.isArray(value)) {
    return {changed: false, value, fieldsChanged: []};
  }

  let changed = false;
  const fieldsChanged = new Set<string>();

  const cards = value.map((card) => {
    if (!isObject(card)) {
      return card;
    }

    let next = card;

    for (const field of ["title", "copy"]) {
      const result = migrateLocalizedObject(next[field]);
      if (result.changed) {
        next = {...next, [field]: result.value};
        changed = true;
        fieldsChanged.add(`homepageCategoryCards[].${field}`);
      }
    }

    return next;
  });

  return {changed, value: cards, fieldsChanged: [...fieldsChanged]};
}

function buildRecipePatch(document: SanityDocument) {
  const set: Record<string, unknown> = {};
  const fieldsChanged: string[] = [];

  for (const field of ["title", "intro", "tipsAndNotes"]) {
    const result = migrateLocalizedObject(document[field]);
    if (result.changed) {
      set[field] = result.value;
      fieldsChanged.push(field);
    }
  }

  const ingredients = migrateIngredients(document.ingredients);
  if (ingredients.changed) {
    set.ingredients = ingredients.value;
    fieldsChanged.push(...ingredients.fieldsChanged);
  }

  const methodSteps = migrateMethodSteps(document.methodSteps);
  if (methodSteps.changed) {
    set.methodSteps = methodSteps.value;
    fieldsChanged.push(...methodSteps.fieldsChanged);
  }

  return {set, fieldsChanged};
}

function buildSiteSettingsPatch(document: SanityDocument) {
  const set: Record<string, unknown> = {};
  const fieldsChanged: string[] = [];
  const localizedFields = migrateObjectFields(
    document,
    localizedSiteSettingsFields,
  );

  for (const field of localizedFields.fieldsChanged) {
    set[field] = localizedFields.value[field];
  }

  fieldsChanged.push(...localizedFields.fieldsChanged);

  const cards = migrateHomepageCategoryCards(document.homepageCategoryCards);
  if (cards.changed) {
    set.homepageCategoryCards = cards.value;
    fieldsChanged.push(...cards.fieldsChanged);
  }

  return {set, fieldsChanged};
}

function buildCategoryPatch(document: SanityDocument) {
  const localizedFields = migrateObjectFields(document, localizedCategoryFields);
  const set: Record<string, unknown> = {};

  for (const field of localizedFields.fieldsChanged) {
    set[field] = localizedFields.value[field];
  }

  return {set, fieldsChanged: localizedFields.fieldsChanged};
}

function buildPatch(document: SanityDocument) {
  if (document._type === "recipe") {
    return buildRecipePatch(document);
  }

  if (document._type === "siteSettings") {
    return buildSiteSettingsPatch(document);
  }

  if (document._type === "category") {
    return buildCategoryPatch(document);
  }

  return {set: {}, fieldsChanged: []};
}

async function run() {
  const client = getCliClient({
    apiVersion: "2026-04-15",
  });

  const documents = await client.fetch<SanityDocument[]>(
    `*[
      _type in ["recipe", "siteSettings", "category"] &&
      !(_id in path("versions.**"))
    ]`,
  );

  const patches = documents
    .map((document) => ({
      document,
      patch: buildPatch(document),
    }))
    .filter(({patch}) => patch.fieldsChanged.length > 0);

  console.log(
    `${applyChanges ? "Applying" : "Dry run"} localized English migration`,
  );
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
