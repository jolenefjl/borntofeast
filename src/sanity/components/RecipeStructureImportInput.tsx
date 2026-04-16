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
  type ParsedRecipeStructure,
} from "@/sanity/lib/recipeStructureParser";

type PatchOperation =
  | {set: Record<string, unknown>}
  | {unset: string[]};

function hasItems(value: unknown) {
  return Array.isArray(value) && value.length > 0;
}

function countGroupedIngredients(groups: ParsedRecipeStructure["ingredientGroups"]) {
  return groups?.reduce((total, group) => total + group.ingredients.length, 0) || 0;
}

function ingredientLabel(ingredient: ParsedIngredient) {
  return [
    ingredient.quantity,
    ingredient.unit,
    ingredient.name.en,
    ingredient.note?.en ? `(${ingredient.note.en})` : "",
  ]
    .filter(Boolean)
    .join(" ");
}

function publishedDocumentId(documentId: unknown) {
  return typeof documentId === "string"
    ? documentId.replace(/^drafts\./, "")
    : undefined;
}

export function RecipeStructureImportInput(props: TextInputProps) {
  const {onChange, readOnly, value} = props;
  const [message, setMessage] = useState("");
  const documentId = publishedDocumentId(useFormValue(["_id"]));
  const operations = useDocumentOperation(documentId || "", "recipe");
  const existingIngredients = useFormValue(["ingredients"]);
  const existingIngredientGroups = useFormValue(["ingredientGroups"]);
  const existingMethodSteps = useFormValue(["methodSteps"]);
  const draftText = typeof value === "string" ? value : "";
  const parsed = useMemo(() => parseRecipeStructure(draftText), [draftText]);
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

  function handleImport() {
    if (!canImport) {
      setMessage("Paste ingredients, method, or both before importing.");
      return;
    }

    if (existingStructuredFields.length) {
      const confirmed = window.confirm(
        [
          "This will replace existing structured recipe draft fields:",
          existingStructuredFields.join(", "),
          "",
          "It will not publish the recipe. Continue?",
        ].join("\n"),
      );

      if (!confirmed) {
        return;
      }
    }

    const patches: PatchOperation[] = [];

    if (parsed.ingredientGroups?.length) {
      patches.push({set: {ingredientGroups: parsed.ingredientGroups}});
      patches.push({unset: ["ingredients"]});
    } else if (parsed.ingredients?.length) {
      patches.push({set: {ingredients: parsed.ingredients}});
      patches.push({unset: ["ingredientGroups"]});
    }

    if (parsed.methodSteps?.length) {
      patches.push({set: {methodSteps: parsed.methodSteps}});
    }

    if (!patches.length) {
      setMessage("Nothing structured could be parsed from that text.");
      return;
    }

    operations.patch.execute(patches);
    setMessage(
      "Imported as draft structure. Review quantities, filter keys, and Norwegian fields before publishing.",
    );
  }

  return (
    <div style={{display: "grid", gap: 12}}>
      <textarea
        aria-label="Paste raw ingredients and method"
        disabled={readOnly}
        onChange={handleTextChange}
        placeholder={[
          "Ingredients",
          "Burger Patties",
          "500 g minced beef",
          "1 tsp salt",
          "",
          "Garnish",
          "4 slices cheese",
          "",
          "Method",
          "1. Mix the patties.",
          "2. Fry until browned.",
        ].join("\n")}
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
        <strong>Parsed preview</strong>
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
                {group.groupTitle.en}: {group.ingredients.length} ingredient
                {group.ingredients.length === 1 ? "" : "s"}
              </li>
            ))}
          </ul>
        ) : parsed.ingredients?.length ? (
          <ul style={{margin: 0, paddingLeft: 18}}>
            {parsed.ingredients.slice(0, 5).map((ingredient) => (
              <li key={ingredient._key}>{ingredientLabel(ingredient)}</li>
            ))}
          </ul>
        ) : null}

        <small>
          Imports English draft fields only. Norwegian ingredient names, group
          titles, units, and method text stay empty for manual entry.
        </small>
      </div>

      <button
        disabled={readOnly || !canImport}
        onClick={handleImport}
        style={{
          alignSelf: "start",
          background: canImport && !readOnly ? "#240B36" : "#c8cdd6",
          border: 0,
          borderRadius: 4,
          color: "#fff",
          cursor: canImport && !readOnly ? "pointer" : "not-allowed",
          font: "inherit",
          fontWeight: 700,
          minHeight: 40,
          padding: "9px 14px",
        }}
        type="button"
      >
        Import ingredient + method draft
      </button>

      {message ? <small>{message}</small> : null}
    </div>
  );
}
