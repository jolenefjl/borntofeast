export const en = {
  site: {
    title: "Born to Feast",
    description:
      "Asian comfort food wherever you live, with recipes for weeknights, homesick cravings, and big weekend feasts.",
  },
  nav: {
    home: "home",
    recipes: "recipes",
    ingredients: "ingredients",
    about: "about",
    search: "search",
    languageLabel: "language",
  },
  homepage: {
    hero: {
      lines: ["Big bowls.", "Loud flavors.", "No gatekeeping."],
      intro:
        "Easy recipes for Asians abroad who miss home, and for Norwegians discovering the Asian kitchen.",
      ctaLabel: "Explore",
    },
    recipesEyebrow: "homepage picks",
    recipesHeading: "cook this week",
    recipesCtaLabel: "get the feast letter",
    categoriesEyebrow: "browse the pantry",
    categoriesHeading: "cuisines and cravings",
    aboutEyebrow: "about jo",
    aboutHeading: "malaysian roots, norway kitchen.",
    aboutText:
      "Born to Feast is for the homesick, the curious, the hungry, and the people standing in a Norwegian supermarket wondering which chilli paste will get them closest. Come for quick dinners, stay for the recipes that ask for a whole afternoon and reward you properly.",
    newsletterEyebrow: "the feast letter",
    newsletterHeading: "get hungry before friday.",
    newsletterText: "One recipe, one pantry note, and one thing worth eating this week.",
    newsletterButtonLabel: "sign up",
  },
  recipe: {
    prep: "Prep",
    cook: "Cook",
    serves: "Serves",
    difficulty: "Difficulty",
    cuisine: "Cuisine",
    servingsScaler: "servings scaler",
    ingredients: "ingredients",
    methodEyebrow: "step by step",
    method: "method",
    tipsNotes: "tips & notes",
    tiktok: "tiktok",
    tiktokFallback: "TikTok embed appears here when the recipe has a video URL.",
    printRecipe: "print recipe",
    cookingMode: "cooking mode",
    watchOnTiktok: "Watch this recipe on TikTok",
    difficultyLabels: {
      Easy: "Easy",
      Medium: "Medium",
      "Deep Dive": "Deep Dive",
    },
  },
  recipes: {
    metaTitle: "Recipes",
    metaDescription:
      "Browse Born to Feast recipes by cuisine, difficulty, total time, and ingredient.",
    eyebrow: "recipe box",
    title: "find your next feast.",
    intro:
      "Filter by cuisine, effort, time, or the ingredient already waiting in your fridge.",
    all: "all",
    filters: "filters",
    cuisine: "cuisine",
    difficulty: "difficulty",
    totalTime: "total time",
    ingredient: "ingredient",
    clearFilters: "clear filters",
    under30: "under 30 min",
    under60: "under 60 min",
    over60: "over 60 min",
    noResults: "No recipes match those filters yet.",
  },
  about: {
    metaTitle: "About Born to Feast",
    metaDescription:
      "The story behind Born to Feast, an Asian comfort food recipe site for the homesick and the curious.",
    heroEyebrow: "about born to feast",
    heroTitle: "asian comfort food wherever you live.",
    heroIntro:
      "Born to Feast is where Malaysian roots, Chinese home cooking, Korean cravings, and Norwegian supermarket realities meet in one loud, hungry kitchen.",
    storyEyebrow: "the story",
    storyTitle: "food for the homesick and the curious.",
    storyBody: [
      "This is a recipe notebook for the people cooking between places: Asians abroad who miss the food that raised them, and Norwegians discovering the sauces, noodles, rice dishes, broths, snacks, and stews that make Asian cooking feel so generous.",
      "Some recipes are quick enough for a Tuesday. Some ask for a little patience. All of them are written like a friend is standing beside you at the stove, pointing out what matters and what can be relaxed.",
    ],
    valuesEyebrow: "kitchen rules",
    valuesTitle: "no gatekeeping.",
    values: [
      {
        title: "home food travels",
        href: "/search?tag=comfort",
        copy: "Recipes for the meals you miss, the ingredients you can actually find, and the shortcuts that still taste generous.",
      },
      {
        title: "fast is allowed",
        href: "/search?tag=quick",
        copy: "Weeknight bowls, pantry sauces, and low-drama dinners sit next to slower weekend projects.",
      },
      {
        title: "flavour first",
        href: "/search?tag=spicy",
        copy: "Big seasoning, bright heat, texture, crunch, and the small details that make a dish feel alive.",
      },
    ],
    nextEyebrow: "what comes next",
    nextTitle: "quick bowls, deep dives, loud flavours.",
    nextText:
      "Expect Chinese, Korean, Malaysian, and fusion recipes with enough personality to make dinner feel less like maintenance and more like a small event.",
  },
  search: {
    metaTitle: "Search recipes",
    metaDescription: "Search Born to Feast recipes by craving, ingredient, cuisine, or time.",
    eyebrow: "find dinner",
    title: "search recipes.",
    intro:
      "Search by craving, ingredient, cuisine, or the amount of energy you have left after work.",
    inputLabel: "Search recipes",
    placeholder: "kimchi, noodles, sambal...",
    button: "search",
    quickStartsEyebrow: "quick starts",
    quickStartsTitle: "start with a craving.",
    quickSearches: ["noodles", "rice", "quick", "spicy", "vegetarian"],
  },
  fallbacks: {
    missingNorwegianTitle: "Norsk versjon kommer",
    missingNorwegianText: "Denne oppskriften er ikke oversatt til norsk ennå.",
  },
} as const;
