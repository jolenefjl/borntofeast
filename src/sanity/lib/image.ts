import {createImageUrlBuilder} from "@sanity/image-url";

import {dataset, projectId} from "@/sanity/env";

const builder = createImageUrlBuilder({projectId, dataset});

type ImageSource = Parameters<typeof builder.image>[0];

export function urlFor(source: ImageSource) {
  return builder.image(source);
}
