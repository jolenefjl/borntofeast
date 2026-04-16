import {visionTool} from "@sanity/vision";
import {defineConfig} from "sanity";
import {structureTool, type StructureResolver} from "sanity/structure";

import {apiVersion, dataset, projectId} from "@/sanity/env";
import {schemaTypes} from "@/sanity/schemaTypes";

const singletonActions = new Set(["publish", "discardChanges", "restore"]);

const structure: StructureResolver = (S) =>
  S.list()
    .title("Born to Feast")
    .items([
      S.listItem()
        .title("Site Settings")
        .id("siteSettings")
        .child(
          S.document()
            .schemaType("siteSettings")
            .documentId("siteSettings")
            .title("Site Settings"),
        ),
      S.listItem()
        .title("About Page")
        .id("aboutPage")
        .child(
          S.document()
            .schemaType("aboutPage")
            .documentId("aboutPage")
            .title("About Page"),
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => !["siteSettings", "aboutPage"].includes(item.getId() || ""),
      ),
    ]);

export default defineConfig({
  name: "born-to-feast",
  title: "Born to Feast",
  projectId,
  dataset,
  basePath: "/studio",
  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter(
        ({schemaType}) => !["siteSettings", "aboutPage"].includes(schemaType),
      ),
  },
  document: {
    actions: (actions, context) =>
      context.schemaType === "siteSettings"
        ? actions.filter(({action}) => action && singletonActions.has(action))
        : context.schemaType === "aboutPage"
          ? actions.filter(({action}) => action && singletonActions.has(action))
        : actions,
  },
  plugins: [structureTool({structure}), visionTool({defaultApiVersion: apiVersion})],
});
