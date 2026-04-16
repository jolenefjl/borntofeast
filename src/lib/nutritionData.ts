export type NutritionValues = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
};

// Baseline values are approximate per 100g edible ingredient weight.
// Add new recipe ingredient filterKey entries here as content grows.
export const nutritionData: Record<string, NutritionValues> = {
  bacon: {calories: 541, protein: 37, carbs: 1.4, fat: 42},
  butter: {calories: 717, protein: 0.9, carbs: 0.1, fat: 81},
  carrot: {calories: 41, protein: 0.9, carbs: 9.6, fat: 0.2, fiber: 2.8},
  chicken: {calories: 165, protein: 31, carbs: 0, fat: 3.6},
  "chicken-thigh": {calories: 209, protein: 26, carbs: 0, fat: 10.9},
  "chili-oil": {calories: 884, protein: 0, carbs: 0, fat: 100},
  egg: {calories: 143, protein: 12.6, carbs: 0.7, fat: 9.5},
  garlic: {calories: 149, protein: 6.4, carbs: 33, fat: 0.5},
  ginger: {calories: 80, protein: 1.8, carbs: 17.8, fat: 0.8},
  kimchi: {calories: 21, protein: 1.7, carbs: 4, fat: 0.8},
  noodles: {calories: 138, protein: 4.5, carbs: 25, fat: 2.1},
  onion: {calories: 40, protein: 1.1, carbs: 9.3, fat: 0.1},
  rice: {calories: 130, protein: 2.7, carbs: 28, fat: 0.3},
  "sesame-oil": {calories: 884, protein: 0, carbs: 0, fat: 100},
  shrimp: {calories: 99, protein: 24, carbs: 0.2, fat: 0.3},
  "soy-sauce": {calories: 53, protein: 8.1, carbs: 4.9, fat: 0.6, sodium: 5493},
  "spring-onion": {calories: 32, protein: 1.8, carbs: 7.3, fat: 0.2, fiber: 2.6},
  tofu: {calories: 76, protein: 8, carbs: 1.9, fat: 4.8},
  "vegetable-oil": {calories: 884, protein: 0, carbs: 0, fat: 100},
};
