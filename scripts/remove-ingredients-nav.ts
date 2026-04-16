import {getCliClient} from "sanity/cli";

const applyChanges = process.argv.includes("--apply");

type LocalizedString = {
  en?: string;
  no?: string;
};

type NavigationItem = {
  _key?: string;
  label?: LocalizedString;
  href?: string;
  [key: string]: unknown;
};

type SiteSettingsDocument = {
  _id: string;
  headerNavigationItems?: NavigationItem[];
};

function isIngredientsItem(item: NavigationItem) {
  const labels = [item.label?.en, item.label?.no]
    .filter(Boolean)
    .map((label) => label?.toLowerCase().trim());
  const href = item.href?.toLowerCase().trim() || "";

  return (
    labels.includes("ingredients") ||
    labels.includes("ingredienser") ||
    href === "/ingredients" ||
    href === "/en/ingredients" ||
    href === "/no/ingredients"
  );
}

async function run() {
  const client = getCliClient({
    apiVersion: "2026-04-15",
  });
  const document = await client.fetch<SiteSettingsDocument | null>(
    `*[_type == "siteSettings" && _id == "siteSettings"][0]{
      _id,
      headerNavigationItems
    }`,
  );
  const currentItems = document?.headerNavigationItems || [];
  const nextItems = currentItems.filter((item) => !isIngredientsItem(item));
  const removedItems = currentItems.filter(isIngredientsItem);

  console.log(`${applyChanges ? "Applying" : "Dry run"} ingredients nav removal`);
  console.log(`Site settings exists: ${document ? "yes" : "no"}`);
  console.log(`Header navigation items: ${currentItems.length}`);
  console.log(`Items to remove: ${removedItems.length}`);

  for (const item of removedItems) {
    console.log(`- ${item.label?.en || item.label?.no || item.href}`);
  }

  if (!applyChanges) {
    console.log("No changes written. Re-run with --apply to mutate content.");
    return;
  }

  if (!document || removedItems.length === 0) {
    console.log("Nothing to update.");
    return;
  }

  await client.patch("siteSettings").set({headerNavigationItems: nextItems}).commit();
  console.log("Ingredients nav item removed from site settings.");
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
