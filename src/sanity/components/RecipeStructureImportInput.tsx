"use client";

import {useMemo, useState} from "react";
import {
  PatchEvent,
  set,
  unset,
  useDocumentOperation,
  useFormValue,
  type TextInputProps,
} from "sanity";

import {
  parseRecipeStructure,
  type ParsedIngredient,
  type ParsedIngredientGroup,
  type ParsedMethodStep,
  type ParsedRecipeStructure,
  type RecipeImportLocale,
} from "@/sanity/lib/recipeStructureParser";

type PatchOperation =
  | {set: Record<string, unknown>}
  | {unset: string[]};

type LocalizedValue = {
  en?: string;
  no?: string;
};

type ExistingIngredient = {
  _key?: string;
  _type?: "ingredient";
  quantity?: number;
  unit?: string;
  unitLabel?: LocalizedValue;
  name?: LocalizedValue;
  note?: LocalizedValue;
  filterKey?: string;
};

type ExistingIngredientGroup = {
  _key?: string;
  _type?: "ingredientGroup";
  groupTitle?: LocalizedValue;
  ingredients?: ExistingIngredient[];
};

type ExistingMethodStep = {
  _key?: string;
  _type?: "methodStep";
  content?: {
    en?: unknown[];
    no?: unknown[];
  };
};

function hasItems(value: unknown) {
  return Array.isArray(value) && value.length > 0;
}

function countGroupedIngredients(groups: ParsedRecipeStructure["ingredientGroups"]) {
  return groups?.reduce((total, group) => total + group.ingredients.length, 0) || 0;
}

function ingredientLabel(ingredient: ParsedIngredient, locale: RecipeImportLocale) {
  return [
    ingredient.quantity,
    ingredient.unitLabel?.[locale] || ingredient.unit,
    ingredient.name[locale],
    ingredient.note?.[locale] ? `(${ingredient.note[locale]})` : "",
  ]
    .filter(Boolean)
    .join(" ");
}

function publishedDocumentId(documentId: unknown) {
  return typeof documentId === "string"
    ? documentId.replace(/^drafts\./, "")
    : undefined;
}

function mergeLocalized(
  existing: LocalizedValue | undefined,
  incoming: LocalizedValue | undefined,
  locale: RecipeImportLocale,
) {
  if (!incoming?.[locale]) {
    return existing;
  }

  return {
    ...(existing || {}),
    [locale]: incoming[locale],
  };
}

function mergeIngredient(
  existing: ExistingIngredient | undefined,
  incoming: ParsedIngredient,
  locale: RecipeImportLocale,
): ExistingIngredient {
  const mergedUnitLabel = mergeLocalized(
    existing?.unitLabel,
    incoming.unitLabel,
    locale,
  );

  return {
    _key: existing?._key || incoming._key,
    _type: "ingredient",
    quantity: incoming.quantity ?? existing?.quantity,
    unit: existing?.unit || incoming.unit,
    ...(mergedUnitLabel ? {unitLabel: mergedUnitLabel} : {}),
    name: mergeLocalized(existing?.name, incoming.name, locale),
    ...(mergeLocalized(existing?.note, incoming.note, locale)
      ? {note: mergeLocalized(existing?.note, incoming.note, locale)}
      : {}),
    filterKey: incoming.filterKey || existing?.filterKey,
  };
}

function mergeIngredients(
  existing: ExistingIngredient[] | undefined,
  incoming: ParsedIngredient[] | undefined,
  locale: RecipeImportLocale,
) {
  if (!incoming?.length) {
    return existing;
  }

  return incoming.map((ingredient, index) =>
    mergeIngredient(existing?.[index], ingredient, locale),
  );
}

function mergeIngredientGroups(
  existing: ExistingIngredientGroup[] | undefined,
  incoming: ParsedIngredientGroup[] | undefined,
  locale: RecipeImportLocale,
) {
  if (!incoming?.length) {
    return existing;
  }

  return incoming.map((group, index) => {
    const existingGroup = existing?.[index];
    return {
      _key: existingGroup?._key || group._key,
      _type: "ingredientGroup" as const,
      groupTitle: mergeLocalized(existingGroup?.groupTitle, group.groupTitle, locale),
      ingredients: mergeIngredients(existingGroup?.ingredients, group.ingredients, locale),
    };
  });
}

function mergeMethodSteps(
  existing: ExistingMethodStep[] | undefined,
  incoming: ParsedMethodStep[] | undefined,
  locale: RecipeImportLocale,
) {
  if (!incoming?.length) {
    return existing;
  }

  return incoming.map((step, index) => {
    const existingStep = existing?.[index];
    return {
      _key: existingStep?._key || step._key,
      _type: "methodStep" as const,
      content: {
        ...(existingStep?.content || {}),
        [locale]: step.content[locale],
      },
    };
  });
}

function importButtonStyle(canImport: boolean, readOnly: boolean, accent: string) {
  return {
    alignSelf: "start" as const,
    background: canImport && !readOnly ? accent : "#c8cdd6",
    border: 0,
    borderRadius: 4,
    color: "#fff",
    cursor: canImport && !readOnly ? "pointer" : "not-allowed",
    font: "inherit",
    fontWeight: 700,
    minHeight: 40,
    padding: "9px 14px",
  };
}

export function RecipeStructureImportInput(props: TextInputProps) {
  const {onChange, readOnly, value} = props;
  const [message, setMessage] = useState("");
  const [previewLocale, setPreviewLocale] = useState<RecipeImportLocale>("en");
  const documentId = publishedDocumentId(useFormValue(["_id"]));
  const operations = useDocumentOperation(documentId || "", "recipe");
  const existingIngredients = useFormValue(["ingredients"]) as ExistingIngredient[] | undefined;
  const existingIngredientGroups = useFormValue([
    "ingredientGroups",
  ]) as ExistingIngredientGroup[] | undefined;
  const existingMethodSteps = useFormValue(["methodSteps"]) as
    | ExistingMethodStep[]
    | undefined;
  const draftText = typeof value === "string" ? value : "";
  const parsed = useMemo(
    () => parseRecipeStructure(draftText, previewLocale),
    [draftText, previewLocale],
  );
  const flatIngredientCount = parsed.ingredients?.length || 0;
  const groupedIngredientCount = countGroupedIngredients(parsed.ingredientGroups);
  const methodStepCount = parsed.methodSteps?.length || 0;
  const hasParsedIngredients = flatIngredientCount > 0 || groupedIngredientCount > 0;
  const hasParsedMethod = methodStepCount > 0;
  const canImport = Boolean(documentId && (hasParsedIngredients || hasParsedMethod));
  const existingStructuredFields = [
    hasItems(existingIngredients) ? "flat ingredients" : "",
    hasItems(existingIngredientGroups) ? "ingredient groups" : "",
    hasItems(existingMethodSteps) ? "method steps" : "",
  ].filter(Boolean);

  function handleTextChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const nextValue = event.currentTarget.value;
    onChange(PatchEvent.from(nextValue ? set(nextValue) : unset()));
    setMessage("");
  }

  function handleImport(locale: RecipeImportLocale) {
    const localizedParsed = parseRecipeStructure(draftText, locale);

    if (
      !documentId ||
      !localizedParsed.ingredients?.length &&
        !localizedParsed.ingredientGroups?.length &&
        !localizedParsed.methodSteps?.length
    ) {
      setMessage("Paste ingredients, method, or both before importing.");
      return;
    }

    if (existingStructuredFields.length) {
      const confirmed = window.confirm(
        [
          `This will import into the ${locale === "en" ? "English" : "Norwegian"} fields for:`,
          existingStructuredFields.join(", "),
          "",
          "Shared structure like quantities, filter keys, and grouping may also be updated.",
          "It will not publish the recipe. Continue?",
        ].join("\n"),
      );

      if (!confirmed) {
        return;
      }
    }

    const patches: PatchOperation[] = [];

    if (localizedParsed.ingredientGroups?.length) {
      patches.push({
        set: {
          ingredientGroups: mergeIngredientGroups(
            existingIngredientGroups,
            localizedParsed.ingredientGroups,
            locale,
          ),
        },
      });
      patches.push({unset: ["ingredients"]});
    } else if (localizedParsed.ingredients?.length) {
      patches.push({
        set: {
          ingredients: mergeIngredients(
            existingIngredients,
            localizedParsed.ingredients,
            locale,
          ),
        },
      });
      patches.push({unset: ["ingredientGroups"]});
    }

    if (localizedParsed.methodSteps?.length) {
      patches.push({
        set: {
          methodSteps: mergeMethodSteps(
            existingMethodSteps,
            localizedParsed.methodSteps,
            locale,
          ),
        },
      });
    }

    if (!patches.length) {
      setMessage("Nothing structured could be parsed from that text.");
      return;
    }

    operations.patch.execute(patches);
    setMessage(
      `Imported as ${locale === "en" ? "English" : "Norwegian"} draft structure. Review group alignment, quantities, units, filter keys, and method wording before publishing.`,
    );
  }

  return (
    <div style={{display: "grid", gap: 12}}>
      <div
        style={{
          background: "#f6f7f9",
          border: "1px solid #d9dee7",
          borderRadius: 4,
          display: "grid",
          gap: 8,
          padding: 12,
        }}
      >
        <strong>Paste guidance</strong>
        <ul style={{margin: 0, paddingLeft: 18}}>
          <li>Paste only ingredients, optional ingredient section headings, and method.</li>
          <li>Use one ingredient per line.</li>
          <li>
            Keep section headings on their own line, ideally with a colon:
            <code> Garnish:</code>, <code>Saus:</code>, <code>Other Essentials:</code>
          </li>
          <li>
            Start ingredient lines with quantity when possible:
            <code> 500 g rice</code>, <code>1 1/2 tbsp soy sauce</code>,
            <code> 2 fedd hvitløk</code>
          </li>
          <li>
            Start method steps as numbered lines, bullets, or clearly separated paragraphs.
          </li>
          <li>
            Import English and Norwegian separately using the matching button below.
          </li>
        </ul>
      </div>

      <div style={{display: "flex", gap: 8, flexWrap: "wrap"}}>
        <button
          type="button"
          onClick={() => setPreviewLocale("en")}
          style={importButtonStyle(true, false, previewLocale === "en" ? "#240B36" : "#5f6c7b")}
        >
          Preview as English
        </button>
        <button
          type="button"
          onClick={() => setPreviewLocale("no")}
          style={importButtonStyle(true, false, previewLocale === "no" ? "#0b5d3b" : "#5f6c7b")}
        >
          Preview as Norwegian
        </button>
      </div>

      <textarea
        aria-label="Paste raw ingredients and method"
        disabled={readOnly}
        onChange={handleTextChange}
        placeholder={
          previewLocale === "en"
            ? [
                "Ingredients",
                "Burger Patties:",
                "500 g minced beef",
                "1 tsp salt",
                "",
                "Garnish:",
                "4 slices cheese",
                "",
                "Method",
                "1. Mix the patties.",
                "2. Fry until browned.",
              ].join("\n")
            : [
                "Ingredienser",
                "Burger Patties:",
                "500 g kjøttdeig",
                "1 ts salt",
                "",
                "Pynt:",
                "4 skiver ost",
                "",
                "Fremgangsmåte",
                "1. Bland burgerne.",
                "2. Stek til de er godt brunet.",
              ].join("\n")
        }
        rows={16}
        style={{
          background: "#fff",
          border: "1px solid #cad1dc",
          borderRadius: 4,
          boxSizing: "border-box",
          color: "inherit",
          font: "inherit",
          lineHeight: 1.5,
          minHeight: 260,
          padding: 12,
          resize: "vertical",
          width: "100%",
        }}
        value={draftText}
      />

      <div
        style={{
          background: "#f6f7f9",
          border: "1px solid #d9dee7",
          borderRadius: 4,
          display: "grid",
          gap: 8,
          padding: 12,
        }}
      >
        <strong>
          Parsed preview for {previewLocale === "en" ? "English" : "Norwegian"}
        </strong>
        <div>
          {parsed.ingredientGroups?.length ? (
            <span>
              {parsed.ingredientGroups.length} ingredient group
              {parsed.ingredientGroups.length === 1 ? "" : "s"} with{" "}
              {groupedIngredientCount} ingredient
              {groupedIngredientCount === 1 ? "" : "s"}
            </span>
          ) : (
            <span>
              {flatIngredientCount} flat ingredient
              {flatIngredientCount === 1 ? "" : "s"}
            </span>
          )}
          <span>{` | ${methodStepCount} method step${
            methodStepCount === 1 ? "" : "s"
          }`}</span>
        </div>

        {parsed.ingredientGroups?.length ? (
          <ul style={{margin: 0, paddingLeft: 18}}>
            {parsed.ingredientGroups.slice(0, 4).map((group) => (
              <li key={group._key}>
                {group.groupTitle[previewLocale]}: {group.ingredients.length} ingredient
                {group.ingredients.length === 1 ? "" : "s"}
              </li>
            ))}
          </ul>
        ) : parsed.ingredients?.length ? (
          <ul style={{margin: 0, paddingLeft: 18}}>
            {parsed.ingredients.slice(0, 5).map((ingredient) => (
              <li key={ingredient._key}>{ingredientLabel(ingredient, previewLocale)}</li>
            ))}
          </ul>
        ) : null}

        <small>
          Importing to one language keeps the opposite language when the structure
          lines up by group, ingredient, and step order.
        </small>
      </div>

      <div style={{display: "flex", gap: 8, flexWrap: "wrap"}}>
        <button
          disabled={readOnly || !canImport}
          onClick={() => handleImport("en")}
          style={importButtonStyle(canImport, Boolean(readOnly), "#240B36")}
          type="button"
        >
          Import to English fields
        </button>
        <button
          disabled={readOnly || !canImport}
          onClick={() => handleImport("no")}
          style={importButtonStyle(canImport, Boolean(readOnly), "#0b5d3b")}
          type="button"
        >
          Import to Norwegian fields
        </button>
      </div>

      {message ? <small>{message}</small> : null}
    </div>
  );
}
