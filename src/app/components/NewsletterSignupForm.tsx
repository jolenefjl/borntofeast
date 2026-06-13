"use client";

import {useState, type FormEvent} from "react";

import type {Locale} from "@/i18n/config";

type NewsletterSignupFormProps = {
  locale: Locale;
  buttonLabel: string;
  firstNameLabel: string;
  firstNamePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  consentLabel: string;
  successMessage: string;
  errorMessage: string;
};

export function NewsletterSignupForm({
  locale,
  buttonLabel,
  firstNameLabel,
  firstNamePlaceholder,
  emailLabel,
  emailPlaceholder,
  consentLabel,
  successMessage,
  errorMessage,
}: NewsletterSignupFormProps) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          firstName: formData.get("firstName"),
          email: formData.get("email"),
          consent: formData.get("consent") === "on",
          website: formData.get("website"),
          locale,
        }),
      });

      if (!response.ok) {
        throw new Error("Newsletter signup failed");
      }

      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form className="grid gap-3" onSubmit={handleSubmit}>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="sr-only" htmlFor="newsletter-first-name">
          {firstNameLabel}
        </label>
        <input
          id="newsletter-first-name"
          name="firstName"
          type="text"
          autoComplete="given-name"
          placeholder={firstNamePlaceholder}
          required
          maxLength={80}
          className="min-h-12 w-full border-2 border-[#240B36] bg-white px-4 text-base font-normal outline-none"
        />
        <label className="sr-only" htmlFor="newsletter-email">
          {emailLabel}
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder={emailPlaceholder}
          required
          className="min-h-12 w-full border-2 border-[#240B36] bg-white px-4 text-base font-normal outline-none"
        />
      </div>
      <div>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="min-h-12 border-2 border-[#240B36] bg-[#ffd447] px-5 text-sm font-medium uppercase leading-[0.9] shadow-[4px_4px_0_#240B36] disabled:cursor-wait disabled:opacity-60"
        >
          {buttonLabel}
        </button>
      </div>

      <label className="flex items-start gap-3 text-sm font-normal leading-5">
        <input
          name="consent"
          type="checkbox"
          required
          className="mt-0.5 h-4 w-4 shrink-0 accent-[#c7391f]"
        />
        <span>{consentLabel}</span>
      </label>

      <div className="hidden" aria-hidden="true">
        <label htmlFor="newsletter-website">Website</label>
        <input
          id="newsletter-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <p aria-live="polite" className="min-h-5 text-sm font-semibold">
        {status === "success" ? successMessage : null}
        {status === "error" ? errorMessage : null}
      </p>
    </form>
  );
}
