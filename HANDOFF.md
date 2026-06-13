# Born to Feast Handoff

Last updated: 2026-04-16

## Project Summary

Born to Feast is an Asian and fusion recipe site for English and Norwegian readers. The goal is to publish practical Asian comfort-food recipes, with a bold retro visual identity and CMS-editable content.

The project is a standalone codebase, separate from The Stavanger List.

### Stack

- Framework: Next.js 16 App Router
- Language: TypeScript
- Styling: Tailwind CSS v4 plus `src/app/globals.css`
- CMS: Sanity, embedded at `/studio`
- Hosting: Vercel
- Repository: `jolenefjl/borntofeast`
- Production URL: `https://borntofeast.vercel.app`
- Sanity project fallback ID: `umeduino`
- Sanity dataset fallback: `production`

### Architecture

Public routes are locale-based:

- `/en`
- `/no`
- `/en/about`
- `/no/about`
- `/en/search`
- `/no/search`
- `/en/recipes/[slug]`
- `/no/recipes/[slug]`

`/studio` stays outside locale routing.

Root `/` redirects to `/en` through `src/proxy.ts`.

Core folders:

- `src/app/[locale]`: localized public pages and localized root layout
- `src/app/components`: shared UI components
- `src/app/studio`: embedded Sanity Studio
- `src/i18n`: locale config, dictionaries, URL helpers, localized-field helpers
- `src/sanity/schemaTypes`: Sanity schemas
- `src/sanity/lib`: Sanity client and image URL builder

## Current Status

### Done

- Locale-based routing exists for `/en/...` and `/no/...`.
- `/` redirects deterministically to `/en`.
- `html lang` is dynamic in `src/app/[locale]/layout.tsx`.
- Header is locale-aware and includes an EN/NO switcher.
- UI copy has been moved into dictionaries in `src/i18n/dictionaries`.
- Recipe pages normalize localized Sanity content on the server before passing props to the client component.
- Recipe structured data JSON-LD exists.
- Per-page metadata includes canonical and hreflang alternates.
- Sitemap exists at `/sitemap.xml`.
- Sanity schemas now include localized field shapes for recipes, categories, site settings, and about page.
- Sanity schema was deployed after the bilingual foundation commit.

### Important Behavior

- English recipe pages continue to work using legacy English fields during migration.
- Norwegian recipe pages intentionally return `404` when translated Norwegian content is missing. This avoids mixed-language pages.
- Shared recipe slugs are used for phase 1:
  - `/en/recipes/kimchi-bacon-fried-rice`
  - `/no/recipes/kimchi-bacon-fried-rice`
- Localized slugs are not implemented yet.

### Pending Items From Product Notes

- Migrate existing English Sanity content into the new localized `en` fields.
- Add Norwegian translations into `no` fields.
- Revisit mobile header: current language switcher and nav work, but a hamburger menu is likely better.
- Build real `/[locale]/recipes` index with filters.
- Build real `/[locale]/ingredients` page with ingredient filters.
- Expand CMS coverage so all public copy is editable, including header and eventual footer.
- Improve TikTok embed dimensions.
- Create a proper footer.
- Hide or CMS-toggle homepage "cuisines and cravings" until there is enough content.
- Remove step-level ingredient fields from schema or redesign them. They are no longer rendered because the current implementation did not match the desired inline style.
- Add localized recipe slugs later if SEO needs justify it.

## Milestones

### Milestone 1: Content Migration Safety

Goal: get existing content into the new bilingual schema without breaking English pages.

Tasks:

- Write a Sanity migration script that copies legacy values into localized `en` fields:
  - `recipe.title -> recipe.title.en`
  - `recipe.intro -> recipe.intro.en`
  - `recipe.tipsAndNotes -> recipe.tipsAndNotes.en`
  - `recipe.methodSteps[].content -> recipe.methodSteps[].content.en`
  - `recipe.ingredients[].name -> recipe.ingredients[].name.en`
  - `recipe.ingredients[].note -> recipe.ingredients[].note.en`
  - equivalent homepage/site settings fields into `.en`
- Keep existing slugs unchanged.
- Do not auto-fill Norwegian fields with English.
- Validate `/en/recipes/kimchi-bacon-fried-rice` after migration.
- Confirm `/no/recipes/kimchi-bacon-fried-rice` remains hidden until `no` content exists.

Acceptance criteria:

- Existing English recipe pages render from localized `en` fields.
- No user-visible English appears on Norwegian recipe pages unless explicitly translated.
- Sanity previews remain usable.

### Milestone 2: CMS-Backed Global Copy

Goal: make public site chrome editable without touching code.

Tasks:

- Extend `siteSettings` or create a `navigationSettings` singleton for:
  - header nav labels
  - header nav destinations
  - language switcher labels if needed
  - footer copy and links
- Keep dictionaries for stable UI labels such as "Prep", "Cook", and "Servings".
- Add a footer component and make it locale-aware.
- Add a CMS flag to hide/show homepage category/cuisine section.

Acceptance criteria:

- Header/footer editorial copy can be edited in Sanity.
- Stable UI labels still come from dictionaries.
- Missing CMS values fall back cleanly to dictionary defaults.

### Milestone 3: Recipe Index

Goal: replace homepage-anchor recipe nav with a real recipe browsing page.

Route:

- `/[locale]/recipes`

Tasks:

- Create route and metadata.
- Query Sanity recipes for the active locale only.
- Add filters:
  - cuisine
  - difficulty
  - total time
  - tags
- Use shared recipe card component if duplication appears.
- Update header `recipes` link to `/[locale]/recipes`.

Acceptance criteria:

- `/en/recipes` and `/no/recipes` return 200.
- Norwegian index only shows recipes with enough Norwegian content.
- Filter state is linkable, likely with query params for filters only, not language.

### Milestone 4: Ingredients Page

Goal: support browsing/filtering by ingredient.

Route:

- `/[locale]/ingredients`

Schema options:

- Simple phase: derive ingredients from recipe ingredient names.
- Better phase: create an `ingredient` document with localized name, slug, description, aliases, and image.

Recommendation:

- Start simple if there are few recipes.
- Move to ingredient documents once ingredient pages need SEO value.

Acceptance criteria:

- Header `ingredients` link goes to `/[locale]/ingredients`.
- Page can filter recipes by ingredient.
- Ingredient names are localized.

### Milestone 5: Mobile Navigation

Goal: make the header feel intentional on phones.

Tasks:

- Replace wrapped mobile nav with a hamburger menu.
- Keep desktop nav inline.
- Keep language switcher visible or inside the menu.
- Ensure tap targets are stable and large enough.

Acceptance criteria:

- Header does not wrap awkwardly on narrow screens.
- Cards and nav links are clickable on mobile.
- No horizontal overflow.

### Milestone 6: Recipe Page Polish

Goal: finish the recipe UX.

Tasks:

- Improve TikTok embed sizing.
- Implement print styles for print recipe button.
- Implement cooking mode or remove the button until ready.
- Decide whether servings scaler should support fractions/units more elegantly.
- Remove `methodSteps.ingredients` from schema if the inline ingredient concept is abandoned.

Acceptance criteria:

- TikTok embeds fit the recipe column on mobile and desktop.
- Print recipe button works.
- No unused UI buttons remain.

### Milestone 7: Localized Slugs

Goal: improve Norwegian SEO later without blocking current bilingual support.

Possible future URL shape:

- `/en/recipes/hainanese-chicken-rice`
- `/no/recipes/hainan-kyllingris`

Tasks:

- Add `slug.en` and `slug.no`, or a separate `localizedSlug` object.
- Update language switcher to resolve equivalent slug from the same document.
- Add redirects from old shared slugs if needed.

Acceptance criteria:

- Both languages can use localized recipe slugs.
- Old shared slugs do not break.
- hreflang alternates point to the correct localized URLs.

## Key Resources

### Important Files

- Locale config: `src/i18n/config.ts`
- Dictionaries: `src/i18n/dictionaries/en.ts`, `src/i18n/dictionaries/no.ts`
- Localized field helpers: `src/i18n/localized.ts`
- URL helpers: `src/i18n/urls.ts`
- Root redirect/proxy: `src/proxy.ts`
- Localized layout: `src/app/[locale]/layout.tsx`
- Homepage: `src/app/[locale]/page.tsx`
- About page: `src/app/[locale]/about/page.tsx`
- Search page: `src/app/[locale]/search/page.tsx`
- Recipe route: `src/app/[locale]/recipes/[slug]/page.tsx`
- Recipe client component: `src/app/[locale]/recipes/[slug]/RecipeContent.tsx`
- Header: `src/app/components/SiteHeader.tsx`
- Sitemap: `src/app/sitemap.ts`
- Sanity config: `sanity.config.ts`
- Recipe schema: `src/sanity/schemaTypes/recipe.ts`
- Site settings schema: `src/sanity/schemaTypes/siteSettings.ts`
- About page schema: `src/sanity/schemaTypes/aboutPage.ts`
- Category schema: `src/sanity/schemaTypes/category.ts`
- Shared localized schema helpers: `src/sanity/schemaTypes/localized.ts`

### Commands

```bash
npm run lint
npm run build
npm run sanity:schema:validate
npm run sanity:schema:deploy
npm run dev
npm run sanity
```

### External Services

- Vercel project: `borntofeast`
- Sanity project fallback ID: `umeduino`
- GitHub repository: `https://github.com/jolenefjl/borntofeast`

## Risks and Known Issues

### Sanity Migration Risk

The schemas now expect localized objects for many fields, but existing documents may still contain legacy strings or arrays. The frontend tolerates this for English, but Sanity editing experience may be inconsistent until content is migrated.

Keep migration scripts small and reversible. Do not delete legacy values until the localized fields are verified.

### Norwegian Content Visibility

Norwegian recipe pages return `404` when required Norwegian content is missing. This is intentional. Avoid changing this to silent English fallback unless the editorial decision changes.

### Mixed Type Shapes

During migration, some fields can be either:

- legacy string/array values
- localized `{ en, no }` objects

The helpers in `src/i18n/localized.ts` exist to keep this complexity out of components. Keep using them until the migration is complete.

### Step Ingredients

The schema still contains the recent step-ingredient concept only if not fully removed in a later pass. It is not currently rendered. The product preference is to either blend ingredients inline with method text or remove this concept.

### TikTok Embeds

The TikTok embed loads via TikTok's script in the client component. Third-party scripts, blockers, and responsive iframe behavior can cause inconsistent display. Treat TikTok sizing as a separate UI task.

### Header on Mobile

The current header is improved but not final. It can still feel crowded on small screens. A hamburger menu is the likely next step.

### SEO Slugs

Shared slugs are a deliberate phase-1 compromise. Localized slugs need a dedicated migration and redirect strategy later.

### CMS Scope

Some copy is still dictionary-driven or hard-coded as fallback. Do not rush everything into Sanity. Use CMS for editorial content; keep stable UI labels in dictionaries.

## Next Steps

Use these prompts to start immediately.

### Prompt 1: Migration Script

```txt
Create a Sanity migration script for Born to Feast that copies existing legacy English recipe fields into the new localized `en` fields without overwriting existing localized content. Cover title, intro, tipsAndNotes, methodSteps.content, ingredients.name, ingredients.note, and relevant siteSettings fields. Do not fill `no`. Run a dry-read first, then apply the mutation safely.
```

### Prompt 2: Recipe Index

```txt
Build `/[locale]/recipes` for Born to Feast. Query Sanity recipes, normalize localized content by locale, hide incomplete Norwegian recipes, and add filters for cuisine, difficulty, total time, and tags. Update the header recipes link to point to the new route.
```

### Prompt 3: Mobile Header

```txt
Refactor `SiteHeader` so mobile uses a hamburger menu while desktop keeps inline nav. Keep locale-aware links and the EN/NO switcher. Ensure no horizontal overflow and preserve current visual style.
```

### Prompt 4: About Page CMS Completion

```txt
Finish the CMS-backed about page. Query the `aboutPage` singleton, normalize localized fields, fall back to dictionaries where fields are empty, and ensure metadata uses CMS content when available.
```

### Prompt 5: Recipe UX Polish

```txt
Polish the recipe page: fix TikTok embed dimensions, implement print recipe behavior and print styles, decide whether cooking mode should be built or hidden, and remove unused step-ingredient schema/rendering if the product decision is to abandon it.
```

## Principles for Future Work

- KISS: Prefer small helpers and direct queries over complex localization frameworks.
- YAGNI: Do not build localized slugs, ingredient documents, or full-text search until the content volume needs them.
- SOLID: Keep content selection on the server, UI labels in dictionaries, editorial content in Sanity, and interactive-only logic in client components.
- Avoid mixed-language pages. Missing Norwegian content should be handled intentionally.
- Keep `/studio` outside locale routing.
