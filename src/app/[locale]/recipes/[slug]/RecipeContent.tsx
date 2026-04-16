"use client";

import Image from "next/image";
import {PortableText} from "next-sanity";
import {useEffect, useMemo, useState} from "react";

import type {Dictionary} from "@/i18n/dictionaries";

type PortableBlock = {
  _key: string;
  _type: "block";
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

type RecipeContentProps = {
  dictionary: Dictionary["recipe"];
  baseServings: number;
  ingredients?: Ingredient[];
  methodSteps?: MethodStep[];
  tipsAndNotes?: PortableBlock[];
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
          : "mt-4 divide-y-2 divide-[#240B36] border-2 border-[#240B36] bg-[#fff3c7] p-4"
      }
    >
      {ingredients.map((ingredient) => (
        <li
          key={ingredient._key}
          className={
            compact
              ? "grid grid-cols-[minmax(4.5rem,0.32fr)_1fr] gap-3"
              : "grid grid-cols-[minmax(4.75rem,0.34fr)_1fr] gap-3 py-3 first:pt-0 last:pb-0"
          }
        >
          <span className="font-semibold">
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
      <p className="max-w-md text-2xl font-normal">
        {fallback}
      </p>
    );
  }

  const videoId = url.match(/\/video\/(\d+)/)?.[1];

  return (
    <blockquote
      className="tiktok-embed mx-auto min-w-0 max-w-full bg-[#fff3c7] text-[#240B36]"
      cite={url}
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
  methodSteps,
  tipsAndNotes,
  gallery,
  tiktokUrl,
}: RecipeContentProps) {
  const [servings, setServings] = useState(baseServings);
  const scale = useMemo(() => servings / baseServings, [servings, baseServings]);

  return (
    <section className="bg-[#fff3c7] px-4 py-12 sm:px-8 sm:py-14">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <aside className="h-fit min-w-0 border-4 border-[#240B36] bg-[#f77f1f] p-4 shadow-[6px_6px_0_#240B36] sm:p-5 sm:shadow-[8px_8px_0_#240B36] lg:sticky lg:top-28">
          <div className="mb-5 flex flex-wrap gap-3">
            <button className="border-2 border-[#240B36] bg-[#ffd447] px-4 py-3 text-sm font-medium uppercase leading-[0.9] shadow-[4px_4px_0_#240B36]">
              {dictionary.printRecipe}
            </button>
            <button className="border-2 border-[#240B36] bg-[#fff3c7] px-4 py-3 text-sm font-medium uppercase leading-[0.9] shadow-[4px_4px_0_#240B36]">
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
                className="h-10 w-10 border-2 border-[#240B36] bg-white text-xl font-black"
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
                className="h-10 w-10 border-2 border-[#240B36] bg-white text-xl font-black"
                onClick={() => setServings((current) => current + 1)}
                aria-label="Increase servings"
              >
                +
              </button>
            </div>
          </div>

          <h2 className="font-serif text-4xl font-black lowercase leading-[0.9]">
            {dictionary.ingredients}
          </h2>
          <IngredientRows ingredients={ingredients} scale={scale} />
        </aside>

        <div className="min-w-0 space-y-8">
          <section>
            <div className="mb-5">
              <p className="text-sm font-medium uppercase leading-[0.9] text-[#c7391f]">
                {dictionary.methodEyebrow}
              </p>
              <h2 className="font-serif text-5xl font-black lowercase leading-[0.9]">
                {dictionary.method}
              </h2>
            </div>
            <ol className="border-4 border-[#240B36] bg-white p-4 shadow-[6px_6px_0_#240B36] sm:p-6 sm:shadow-[8px_8px_0_#240B36]">
              {methodSteps?.map((step, index) => (
                <li
                  key={step._key}
                  className="grid gap-4 border-b-2 border-[#240B36] py-6 first:pt-0 last:border-b-0 last:pb-0 md:grid-cols-[2.5rem_1fr]"
                >
                  <span className="flex h-9 w-9 items-center justify-center border-2 border-[#240B36] bg-[#c7391f] text-base font-black text-[#fff3c7]">
                    {index + 1}
                  </span>
                  <div className="min-w-0 text-lg font-normal leading-[1.8rem]">
                    {step.content ? <PortableText value={step.content} /> : null}
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {tipsAndNotes?.length ? (
            <section className="border-4 border-[#240B36] bg-[#e55224] p-5 text-[#fff3c7]">
              <h2 className="font-serif text-4xl font-black lowercase leading-[0.9]">
                {dictionary.tipsNotes}
              </h2>
              <div className="mt-4 space-y-3 text-lg font-normal leading-[1.8rem]">
                <PortableText value={tipsAndNotes} />
              </div>
            </section>
          ) : null}

          <section className="grid gap-4 md:grid-cols-3">
            {gallery.map((image) => (
              <div
                key={image.src}
                className="relative min-h-64 border-4 border-[#240B36] bg-[#ffd447]"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 768px) 30vw, 90vw"
                  className="object-cover"
                />
              </div>
            ))}
          </section>

          <section className="border-4 border-[#240B36] bg-[#240B36] p-5 text-[#fff3c7]">
            <p className="text-sm font-medium uppercase leading-[0.9] text-[#ffd447]">
              {dictionary.tiktok}
            </p>
            <div className="mt-4 flex min-h-64 min-w-0 items-center justify-center overflow-hidden border-2 border-dashed border-[#ffd447] p-4 text-center sm:p-6">
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
