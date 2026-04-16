import {nutritionData} from "@/lib/nutritionData";

export type NutritionIngredient = {
  filterKey?: string;
  quantity?: number;
  unit?: string;
  unitLabel?: {
    en?: string;
    no?: string;
  } | string | null;
};

export type RecipeNutrition = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

type NutritionRecipe = {
  servings?: number;
  ingredients?: NutritionIngredient[];
};

const unitAliases: Record<string, string> = {
  gram: "g",
  grams: "g",
  kg: "kg",
  kilogram: "kg",
  kilograms: "kg",
  tbsp: "tbsp",
  tablespoon: "tbsp",
  tablespoons: "tbsp",
  ss: "tbsp",
  tsp: "tsp",
  teaspoon: "tsp",
  teaspoons: "tsp",
  ts: "tsp",
  cup: "cup",
  cups: "cup",
  clove: "clove",
  cloves: "clove",
  fedd: "clove",
  piece: "piece",
  pieces: "piece",
  stk: "piece",
};

// Approximate gram conversions for nutrition estimates.
// Spoon/cup conversions use water-like density; ingredient-specific precision can be added later.
const gramsPerUnit: Record<string, number> = {
  g: 1,
  kg: 1000,
  tbsp: 15,
  tsp: 5,
  cup: 240,
  clove: 5,
  piece: 50,
};

function normalizeUnit(unit?: string) {
  const normalized = unit?.toLowerCase().trim().replace(/\./g, "");

  if (!normalized) {
    return "";
  }

  return unitAliases[normalized] || normalized;
}

export function ingredientQuantityToGrams(
  quantity: number | undefined,
  unit: string | undefined,
) {
  if (typeof quantity !== "number" || quantity <= 0) {
    return null;
  }

  const normalizedUnit = normalizeUnit(unit);

  if (!normalizedUnit) {
    return null;
  }

  const grams = gramsPerUnit[normalizedUnit];

  return grams ? quantity * grams : null;
}

function roundMacro(value: number) {
  return Math.round(value * 10) / 10;
}

export function calculateRecipeNutrition(
  recipe: NutritionRecipe,
): RecipeNutrition | null {
  const servings = recipe.servings || 0;

  if (servings <= 0 || !recipe.ingredients?.length) {
    return null;
  }

  let matchedIngredients = 0;
  const totals = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  };

  for (const ingredient of recipe.ingredients) {
    if (!ingredient.filterKey) {
      continue;
    }

    const nutrition = nutritionData[ingredient.filterKey];
    const grams = ingredientQuantityToGrams(
      ingredient.quantity,
      ingredient.unit ||
        (typeof ingredient.unitLabel === "object"
          ? ingredient.unitLabel?.en || ingredient.unitLabel?.no
          : ingredient.unitLabel),
    );

    if (!nutrition || !grams) {
      continue;
    }

    const multiplier = grams / 100;
    matchedIngredients += 1;
    totals.calories += nutrition.calories * multiplier;
    totals.protein += nutrition.protein * multiplier;
    totals.carbs += nutrition.carbs * multiplier;
    totals.fat += nutrition.fat * multiplier;
  }

  if (matchedIngredients === 0) {
    return null;
  }

  return {
    calories: Math.round(totals.calories / servings),
    protein: roundMacro(totals.protein / servings),
    carbs: roundMacro(totals.carbs / servings),
    fat: roundMacro(totals.fat / servings),
  };
}
