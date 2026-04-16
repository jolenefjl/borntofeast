type LocalizedString = {
  en?: string;
  no?: string;
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

export type ParsedIngredient = {
  _key: string;
  _type: "ingredient";
  quantity?: number;
  unit?: string;
  name: LocalizedString;
  note?: LocalizedString;
  filterKey: string;
};

export type ParsedIngredientGroup = {
  _key: string;
  _type: "ingredientGroup";
  groupTitle: LocalizedString;
  ingredients: ParsedIngredient[];
};

export type ParsedMethodStep = {
  _key: string;
  _type: "methodStep";
  content: {
    en: PortableTextBlock[];
  };
};

export type ParsedRecipeStructure = {
  ingredients?: ParsedIngredient[];
  ingredientGroups?: ParsedIngredientGroup[];
  methodSteps?: ParsedMethodStep[];
};

const unitWords = new Set([
  "g",
  "gram",
  "grams",
  "kg",
  "ml",
  "l",
  "cup",
  "cups",
  "tbsp",
  "tablespoon",
  "tablespoons",
  "ss",
  "tsp",
  "teaspoon",
  "teaspoons",
  "ts",
  "clove",
  "cloves",
  "fedd",
  "piece",
  "pieces",
  "stk",
  "pinch",
  "handful",
  "bunch",
  "can",
  "cans",
  "slice",
  "slices",
]);

const ingredientSectionHeadings = new Set([
  "ingredient",
  "ingredients",
  "ingredient list",
  "ingredienser",
]);

const methodSectionHeadings = new Set([
  "method",
  "steps",
  "instructions",
  "directions",
  "fremgangsm\u00e5te",
  "fremgangsmate",
  "slik gj\u00f8r du",
  "slik gjor du",
]);

function key(prefix: string, index: number) {
  return `${prefix}-${index + 1}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeLine(line: string) {
  return line
    .trim()
    .replace(/^[-*\u2022]\s+/, "")
    .replace(/^\d+[.)]\s+/, "")
    .trim();
}

function normalizeHeading(line: string) {
  return normalizeLine(line).replace(/:$/, "").toLowerCase();
}

function startsLikeStep(line: string) {
  return /^([-*\u2022]|\d+[.)])\s+/.test(line.trim());
}

function parseFraction(value: string) {
  const unicodeFractions: Record<string, number> = {
    "\u00bc": 0.25,
    "\u00bd": 0.5,
    "\u00be": 0.75,
    "\u2153": 1 / 3,
    "\u2154": 2 / 3,
  };

  if (unicodeFractions[value]) {
    return unicodeFractions[value];
  }

  if (value.includes("/")) {
    const [top, bottom] = value.split("/").map(Number);
    return top && bottom ? top / bottom : undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseQuantity(tokens: string[]) {
  const [first, second] = tokens;

  if (!first) {
    return {quantity: undefined, consumed: 0};
  }

  const range = first.match(/^(\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)$/);
  if (range) {
    return {quantity: Number(range[1]), consumed: 1};
  }

  const firstValue = parseFraction(first);
  if (firstValue === undefined) {
    return {quantity: undefined, consumed: 0};
  }

  const secondValue = second ? parseFraction(second) : undefined;

  if (secondValue !== undefined && second?.includes("/")) {
    return {quantity: firstValue + secondValue, consumed: 2};
  }

  return {quantity: firstValue, consumed: 1};
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/\([^)]*\)/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isLikelyIngredientLine(line: string) {
  const cleaned = normalizeLine(line);

  if (!cleaned) {
    return false;
  }

  if (/^(\d|[\u00bc\u00bd\u00be\u2153\u2154])/.test(cleaned)) {
    return true;
  }

  if (/\b(to taste|for frying|as needed)\b/i.test(cleaned)) {
    return true;
  }

  return /^(salt|pepper|msg|water|oil|neutral oil|cooking oil)\b/i.test(
    cleaned,
  );
}

function splitNote(name: string) {
  const parenthetical = name.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
  if (parenthetical) {
    return {
      name: parenthetical[1].trim(),
      note: parenthetical[2].trim(),
    };
  }

  const commaParts = name.split(",");
  if (commaParts.length > 1) {
    return {
      name: commaParts[0].trim(),
      note: commaParts.slice(1).join(",").trim(),
    };
  }

  return {name: name.trim(), note: ""};
}

function parseIngredient(line: string, index: number): ParsedIngredient | null {
  const cleaned = normalizeLine(line);

  if (!cleaned) {
    return null;
  }

  const tokens = cleaned.split(/\s+/);
  const {quantity, consumed} = parseQuantity(tokens);
  const unitCandidate = tokens[consumed]?.toLowerCase().replace(/\.$/, "");
  const hasUnit = unitCandidate ? unitWords.has(unitCandidate) : false;
  const unit = hasUnit ? tokens[consumed] : undefined;
  const nameStart = consumed + (hasUnit ? 1 : 0);
  const rawName = tokens.slice(nameStart).join(" ") || cleaned;
  const {name, note} = splitNote(rawName);
  const filterKey = slugify(name);

  if (!name || !filterKey) {
    return null;
  }

  return {
    _key: key("ingredient", index),
    _type: "ingredient",
    quantity,
    unit,
    name: {en: name},
    ...(note ? {note: {en: note}} : {}),
    filterKey,
  };
}

function splitSections(raw: string) {
  const ingredientLines: string[] = [];
  const methodLines: string[] = [];
  let mode: "ingredients" | "method" = "ingredients";

  for (const line of raw.replace(/\r\n/g, "\n").split("\n")) {
    const heading = normalizeHeading(line);

    if (!heading) {
      if (mode === "method") {
        methodLines.push("");
      }
      continue;
    }

    if (ingredientSectionHeadings.has(heading)) {
      mode = "ingredients";
      continue;
    }

    if (methodSectionHeadings.has(heading)) {
      mode = "method";
      continue;
    }

    if (
      mode === "ingredients" &&
      startsLikeStep(line) &&
      !isLikelyIngredientLine(line)
    ) {
      mode = "method";
      methodLines.push(line);
    } else if (mode === "method") {
      methodLines.push(line);
    } else {
      ingredientLines.push(line);
    }
  }

  return {ingredientLines, methodText: methodLines.join("\n")};
}

function parseIngredients(lines: string[]) {
  const cleanedLines = lines.map((line) => line.trim()).filter(Boolean);
  const groups: ParsedIngredientGroup[] = [];
  const flatIngredients: ParsedIngredient[] = [];
  let currentGroup: ParsedIngredientGroup | null = null;

  cleanedLines.forEach((line, index) => {
    const normalized = normalizeLine(line);
    const nextLine = cleanedLines[index + 1] || "";
    const looksLikeHeading =
      !isLikelyIngredientLine(normalized) && isLikelyIngredientLine(nextLine);

    if (looksLikeHeading) {
      currentGroup = {
        _key: key("ingredient-group", groups.length),
        _type: "ingredientGroup",
        groupTitle: {en: normalized.replace(/:$/, "")},
        ingredients: [],
      };
      groups.push(currentGroup);
      return;
    }

    const ingredient = parseIngredient(normalized, index);

    if (!ingredient) {
      return;
    }

    if (currentGroup) {
      currentGroup.ingredients.push(ingredient);
    } else {
      flatIngredients.push(ingredient);
    }
  });

  const populatedGroups = groups.filter((group) => group.ingredients.length);

  if (populatedGroups.length && flatIngredients.length === 0) {
    return {ingredientGroups: populatedGroups};
  }

  const fallbackIngredients =
    flatIngredients.length || !populatedGroups.length
      ? cleanedLines
          .map((line, index) => parseIngredient(line, index))
          .filter((ingredient): ingredient is ParsedIngredient => Boolean(ingredient))
      : [];

  return fallbackIngredients.length ? {ingredients: fallbackIngredients} : {};
}

function blockFromText(text: string, index: number): PortableTextBlock {
  return {
    _key: key("method-block", index),
    _type: "block",
    style: "normal",
    markDefs: [],
    children: [
      {
        _key: key("method-span", index),
        _type: "span",
        marks: [],
        text,
      },
    ],
  };
}

function parseMethodSteps(methodText: string) {
  const lines = methodText.replace(/\r\n/g, "\n").split("\n");
  const steps: string[] = [];
  let current = "";

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      if (current) {
        steps.push(current.trim());
        current = "";
      }
      continue;
    }

    const startsNewStep = startsLikeStep(trimmed);
    const cleaned = normalizeLine(trimmed);

    if (startsNewStep) {
      if (current) {
        steps.push(current.trim());
      }
      current = cleaned;
    } else if (current) {
      current = `${current} ${cleaned}`;
    } else {
      current = cleaned;
    }
  }

  if (current) {
    steps.push(current.trim());
  }

  return steps
    .filter(Boolean)
    .map((step, index) => ({
      _key: key("method-step", index),
      _type: "methodStep" as const,
      content: {
        en: [blockFromText(step, index)],
      },
    }));
}

export function parseRecipeStructure(raw: string): ParsedRecipeStructure {
  const {ingredientLines, methodText} = splitSections(raw);
  const parsedIngredients = parseIngredients(ingredientLines);
  const methodSteps = parseMethodSteps(methodText);

  return {
    ...parsedIngredients,
    ...(methodSteps.length ? {methodSteps} : {}),
  };
}
