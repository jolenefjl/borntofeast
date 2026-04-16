"use client";

import Image from "next/image";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";

import {RichText} from "@/app/components/RichText";
import type {Dictionary} from "@/i18n/dictionaries";

type PortableBlock = {
  _key: string;
  _type: string;
  alt?: string;
  asset?: unknown;
  children?: {text?: string}[];
};

type Ingredient = {
  _key: string;
  quantity?: number;
  unit?: string;
  name: string;
  note?: string;
};

type MethodStep = {
  _key: string;
  content?: PortableBlock[];
};

type GalleryImage = {
  src: string;
  alt: string;
};

type Nutrition = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

type GuidanceCard = {
  _key: string;
  title: string;
  body?: PortableBlock[];
  image: GalleryImage | null;
};

type RecipeContentProps = {
  dictionary: Dictionary["recipe"];
  baseServings: number;
  ingredients?: Ingredient[];
  nutrition?: Nutrition | null;
  methodSteps?: MethodStep[];
  tipsAndNotes?: PortableBlock[];
  lifeStory?: PortableBlock[];
  guidanceCards?: GuidanceCard[];
  gallery: GalleryImage[];
  tiktokUrl?: string;
};

declare global {
  interface Window {
    tiktokEmbed?: {
      load?: () => void;
    };
  }
}

function formatScaledQuantity(quantity: number, scale: number) {
  const scaled = Math.round(quantity * scale * 100) / 100;
  const whole = Math.trunc(scaled);
  const decimal = Math.round((scaled - whole) * 100) / 100;
  const fractions: Record<string, string> = {
    "0.25": "1/4",
    "0.33": "1/3",
    "0.5": "1/2",
    "0.67": "2/3",
    "0.75": "3/4",
  };
  const fraction = fractions[decimal.toString()];

  if (fraction) {
    return whole ? `${whole} ${fraction}` : fraction;
  }

  return Number.isInteger(scaled) ? `${scaled}` : `${scaled}`;
}

function formatIngredientAmount(
  quantity: number | undefined,
  unit: string | undefined,
  scale: number,
) {
  const amount =
    typeof quantity === "number" ? formatScaledQuantity(quantity, scale) : "";

  return [amount, unit].filter(Boolean).join(" ");
}

function NutritionCard({
  dictionary,
  nutrition,
}: {
  dictionary: Dictionary["recipe"];
  nutrition?: Nutrition | null;
}) {
  if (!nutrition) {
    return null;
  }

  return (
    <section className="mt-5 border-2 border-[#240B36] bg-[#ffd447] p-4">
      <h3 className="font-serif text-2xl font-black lowercase leading-[0.95]">
        {dictionary.nutritionPerServing}
      </h3>
      <dl className="mt-4 grid gap-2 text-sm font-medium uppercase leading-[0.95]">
        {[
          [dictionary.calories, `${nutrition.calories} kcal`],
          [dictionary.protein, `${nutrition.protein} g`],
          [dictionary.carbohydrates, `${nutrition.carbs} g`],
          [dictionary.fat, `${nutrition.fat} g`],
        ].map(([label, value]) => (
          <div key={label} className="flex items-baseline justify-between gap-4">
            <dt className="text-[#7b2418]">{label}</dt>
            <dd className="text-base font-black text-[#240B36]">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function IngredientRows({
  ingredients,
  scale,
  compact = false,
}: {
  ingredients?: Ingredient[];
  scale: number;
  compact?: boolean;
}) {
  if (!ingredients?.length) {
    return null;
  }

  return (
    <ul
      className={
        compact
          ? "mt-4 grid gap-2 border-2 border-[#240B36] bg-[#fff3c7] p-3 text-base"
          : "mt-4 divide-y-2 divide-[#240B36] border-2 border-[#240B36] bg-[#fff3c7] p-3 sm:p-4"
      }
    >
      {ingredients.map((ingredient) => (
        <li
          key={ingredient._key}
          className={
            compact
              ? "grid grid-cols-[minmax(4.5rem,0.32fr)_1fr] gap-3"
              : "grid gap-1 py-3 first:pt-0 last:pb-0 sm:grid-cols-[minmax(4.75rem,0.34fr)_1fr] sm:gap-3"
          }
        >
          <span className="font-semibold text-[#7b2418] sm:text-[#240B36]">
            {formatIngredientAmount(ingredient.quantity, ingredient.unit, scale)}
          </span>
          <span>
            <span className="font-normal">{ingredient.name}</span>
            {ingredient.note ? (
              <span className="block text-sm font-normal text-[#7b2418]">
                {ingredient.note}
              </span>
            ) : null}
          </span>
        </li>
      ))}
    </ul>
  );
}

function GalleryLightbox({
  images,
  dictionary,
}: {
  images: GalleryImage[];
  dictionary: Dictionary["recipe"];
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const activeImage = activeIndex === null ? null : images[activeIndex];

  const close = useCallback(() => setActiveIndex(null), []);
  const previous = useCallback(() => {
    setActiveIndex((current) =>
      current === null ? current : (current - 1 + images.length) % images.length,
    );
  }, [images.length]);
  const next = useCallback(() => {
    setActiveIndex((current) =>
      current === null ? current : (current + 1) % images.length,
    );
  }, [images.length]);

  useEffect(() => {
    if (activeIndex === null) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        close();
      }

      if (event.key === "ArrowLeft") {
        previous();
      }

      if (event.key === "ArrowRight") {
        next();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeIndex, close, next, previous]);

  return (
    <>
      <section className="grid gap-4 sm:grid-cols-2">
        {images.map((image, index) => (
          <button
            key={image.src}
            type="button"
            className="relative aspect-[4/3] min-h-0 border-4 border-[#240B36] bg-[#ffd447] text-left shadow-[5px_5px_0_#240B36] sm:shadow-[8px_8px_0_#240B36] lg:first:col-span-2 lg:first:aspect-[16/9]"
            onClick={() => setActiveIndex(index)}
            aria-label={`${dictionary.openImage}: ${image.alt}`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes={
                index === 0
                  ? "(min-width: 1024px) 54vw, 90vw"
                  : "(min-width: 640px) 26vw, 90vw"
              }
              className="object-cover"
            />
          </button>
        ))}
      </section>

      {activeImage ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-[#240B36]/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={activeImage.alt}
          onClick={close}
          onTouchStart={(event) => {
            touchStartX.current = event.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={(event) => {
            if (touchStartX.current === null) {
              return;
            }

            const delta = event.changedTouches[0]?.clientX - touchStartX.current;
            touchStartX.current = null;

            if (Math.abs(delta) < 40) {
              return;
            }

            if (delta > 0) {
              previous();
            } else {
              next();
            }
          }}
        >
          <button
            type="button"
            className="absolute right-4 top-4 z-[82] h-11 w-11 border-2 border-[#fff3c7] bg-[#ffd447] text-2xl font-black text-[#240B36]"
            onClick={close}
            aria-label={dictionary.closeGallery}
          >
            ×
          </button>
          {images.length > 1 ? (
            <>
              <button
                type="button"
                className="absolute left-3 top-1/2 z-[82] h-12 w-12 -translate-y-1/2 border-2 border-[#fff3c7] bg-[#ffd447] text-3xl font-black text-[#240B36]"
                onClick={(event) => {
                  event.stopPropagation();
                  previous();
                }}
                aria-label={dictionary.previousImage}
              >
                ‹
              </button>
              <button
                type="button"
                className="absolute right-3 top-1/2 z-[82] h-12 w-12 -translate-y-1/2 border-2 border-[#fff3c7] bg-[#ffd447] text-3xl font-black text-[#240B36]"
                onClick={(event) => {
                  event.stopPropagation();
                  next();
                }}
                aria-label={dictionary.nextImage}
              >
                ›
              </button>
            </>
          ) : null}
          <div
            className="relative h-[82vh] w-full max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={activeImage.src}
              alt={activeImage.alt}
              fill
              sizes="96vw"
              className="object-contain"
              priority
            />
          </div>
        </div>
      ) : null}
    </>
  );
}

function TikTokEmbed({
  url,
  fallback,
  watchLabel,
}: {
  url?: string;
  fallback: string;
  watchLabel: string;
}) {
  useEffect(() => {
    if (!url) {
      return;
    }

    if (window.tiktokEmbed?.load) {
      window.tiktokEmbed.load();
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://www.tiktok.com/embed.js"]',
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => window.tiktokEmbed?.load?.());
      return;
    }

    const script = document.createElement("script");
    script.src = "https://www.tiktok.com/embed.js";
    script.async = true;
    document.body.appendChild(script);
  }, [url]);

  if (!url) {
    return (
      <p className="max-w-md text-xl font-normal leading-[1.6rem] sm:text-2xl">
        {fallback}
      </p>
    );
  }

  const videoId = url.match(/\/video\/(\d+)/)?.[1];

  return (
    <blockquote
      className="tiktok-embed mx-auto min-w-0 max-w-[325px] bg-[#fff3c7] text-[#240B36]"
      cite={url}
      style={{minWidth: 0, width: "100%", maxWidth: 325}}
      {...(videoId ? {"data-video-id": videoId} : {})}
    >
      <section>
        <a href={url}>{watchLabel}</a>
      </section>
    </blockquote>
  );
}

export function RecipeContent({
  dictionary,
  baseServings,
  ingredients,
  nutrition,
  methodSteps,
  tipsAndNotes,
  lifeStory,
  guidanceCards,
  gallery,
  tiktokUrl,
}: RecipeContentProps) {
  const [servings, setServings] = useState(baseServings);
  const scale = useMemo(() => servings / baseServings, [servings, baseServings]);

  return (
    <section className="bg-[#fff3c7] px-4 py-10 sm:px-8 sm:py-14">
      <div className="mx-auto grid max-w-7xl gap-7 lg:grid-cols-[0.85fr_1.15fr]">
        <aside className="h-fit min-w-0 border-4 border-[#240B36] bg-[#f77f1f] p-4 shadow-[6px_6px_0_#240B36] sm:p-5 sm:shadow-[8px_8px_0_#240B36] lg:sticky lg:top-28">
          <div className="mb-5 grid gap-3 sm:flex sm:flex-wrap">
            <button className="min-h-11 border-2 border-[#240B36] bg-[#ffd447] px-4 py-3 text-sm font-medium uppercase leading-[0.9] shadow-[4px_4px_0_#240B36]">
              {dictionary.printRecipe}
            </button>
            <button className="min-h-11 border-2 border-[#240B36] bg-[#fff3c7] px-4 py-3 text-sm font-medium uppercase leading-[0.9] shadow-[4px_4px_0_#240B36]">
              {dictionary.cookingMode}
            </button>
          </div>

          <div className="mb-5 border-2 border-[#240B36] bg-[#fff3c7] p-4">
            <p className="text-sm font-medium uppercase leading-[0.9] text-[#c7391f]">
              {dictionary.servingsScaler}
            </p>
            <div className="mt-3 flex items-center gap-3">
              <button
                type="button"
                className="h-11 w-11 border-2 border-[#240B36] bg-white text-xl font-black"
                onClick={() => setServings((current) => Math.max(1, current - 1))}
                aria-label="Decrease servings"
              >
                -
              </button>
              <span className="min-w-8 text-center text-3xl font-black">
                {servings}
              </span>
              <button
                type="button"
                className="h-11 w-11 border-2 border-[#240B36] bg-white text-xl font-black"
                onClick={() => setServings((current) => current + 1)}
                aria-label="Increase servings"
              >
                +
              </button>
            </div>
          </div>

          <h2 className="font-serif text-3xl font-black lowercase leading-[0.95] sm:text-4xl sm:leading-[0.9]">
            {dictionary.ingredients}
          </h2>
          <IngredientRows ingredients={ingredients} scale={scale} />
          <NutritionCard dictionary={dictionary} nutrition={nutrition} />
        </aside>

        <div className="min-w-0 space-y-7 sm:space-y-8">
          <section>
            <div className="mb-5">
              <p className="text-sm font-medium uppercase leading-[0.9] text-[#c7391f]">
                {dictionary.methodEyebrow}
              </p>
              <h2 className="font-serif text-4xl font-black lowercase leading-[0.95] sm:text-5xl sm:leading-[0.9]">
                {dictionary.method}
              </h2>
            </div>
            <ol className="bg-white p-4 shadow-[5px_5px_0_#240B36] sm:p-6 sm:shadow-[8px_8px_0_#240B36]">
              {methodSteps?.map((step, index) => (
                <li
                  key={step._key}
                  className="grid gap-3 py-5 first:pt-0 last:pb-0 sm:gap-4 sm:py-6 md:grid-cols-[2rem_1fr]"
                >
                  <span className="flex h-7 w-7 items-center justify-center border-2 border-[#240B36] bg-[#c7391f] text-sm font-black text-[#fff3c7]">
                    {index + 1}
                  </span>
                  <RichText
                    value={step.content}
                    className="min-w-0 max-w-prose space-y-3 text-base font-normal leading-[1.65rem] sm:text-lg sm:leading-[1.8rem]"
                  />
                </li>
              ))}
            </ol>
          </section>

          {guidanceCards?.length ? (
            <section className="border-4 border-[#240B36] bg-[#ffd447] p-4 shadow-[5px_5px_0_#240B36] sm:p-5 sm:shadow-[8px_8px_0_#240B36]">
              <p className="text-sm font-medium uppercase leading-[0.9] text-[#c7391f]">
                {dictionary.guidanceEyebrow}
              </p>
              <h2 className="mt-2 font-serif text-3xl font-black lowercase leading-[0.95] sm:text-4xl sm:leading-[0.9]">
                {dictionary.guidance}
              </h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {guidanceCards.map((card) =>
                  card.image ? (
                    <article
                      key={card._key}
                      className="border-2 border-[#240B36] bg-[#fff3c7]"
                    >
                      <div className="relative aspect-[4/3] border-b-2 border-[#240B36]">
                        <Image
                          src={card.image.src}
                          alt={card.image.alt || card.title}
                          fill
                          sizes="(min-width: 768px) 32vw, 90vw"
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-serif text-2xl font-black lowercase leading-[0.95] sm:text-3xl sm:leading-[0.9]">
                          {card.title}
                        </h3>
                        {card.body?.length ? (
                          <RichText
                            value={card.body}
                            className="mt-3 space-y-3 text-base font-normal leading-[1.6rem]"
                          />
                        ) : null}
                      </div>
                    </article>
                  ) : null,
                )}
              </div>
            </section>
          ) : null}

          {tipsAndNotes?.length ? (
            <section className="border-4 border-[#240B36] bg-[#e55224] p-4 text-[#fff3c7] sm:p-5">
              <h2 className="font-serif text-3xl font-black lowercase leading-[0.95] sm:text-4xl sm:leading-[0.9]">
                {dictionary.tipsNotes}
              </h2>
              <RichText
                value={tipsAndNotes}
                className="mt-4 max-w-prose space-y-3 text-base font-normal leading-[1.65rem] sm:text-lg sm:leading-[1.8rem]"
              />
            </section>
          ) : null}

          <GalleryLightbox images={gallery} dictionary={dictionary} />

          {lifeStory?.length ? (
            <section className="border-y-4 border-[#240B36] py-6 sm:py-8">
              <h2 className="font-serif text-3xl font-black lowercase leading-[0.95] sm:text-4xl sm:leading-[0.9]">
                {dictionary.lifeStory}
              </h2>
              <RichText
                value={lifeStory}
                className="mt-5 max-w-2xl space-y-5 text-lg font-normal leading-[1.75rem]"
              />
            </section>
          ) : null}

          <section className="border-4 border-[#240B36] bg-[#240B36] p-4 text-[#fff3c7] sm:p-5">
            <p className="text-sm font-medium uppercase leading-[0.9] text-[#ffd447]">
              {dictionary.tiktok}
            </p>
            <div className="mt-4 flex min-h-[32rem] min-w-0 items-start justify-center overflow-hidden border-2 border-dashed border-[#ffd447] p-3 text-center sm:min-h-[36rem] sm:p-6">
              <TikTokEmbed
                url={tiktokUrl}
                fallback={dictionary.tiktokFallback}
                watchLabel={dictionary.watchOnTiktok}
              />
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
