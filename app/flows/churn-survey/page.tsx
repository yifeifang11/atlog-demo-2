"use client";

import { useState } from "react";
import ConsentForm from "../../consent/ConsentForm";

export default function ChurnSurveyFlowPage() {
  const [submitted, setSubmitted] = useState(false);
  const [showConsent, setShowConsent] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">
          We&apos;re sorry to see you go
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Help us understand how we can improve by answering a few quick
          questions.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4 text-sm text-slate-700"
        >
          <div className="space-y-2">
            <p className="font-medium">
              What is the main reason for canceling?
            </p>
            {[
              "Pricing is too high",
              "Missing features",
              "Switching to a competitor",
              "Low usage",
              "Other",
            ].map((option) => (
              <label key={option} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="reason"
                  required
                  className="h-4 w-4 text-blue-600"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
          <div>
            <label className="block font-medium">
              What would bring you back?
            </label>
            <textarea
              rows={3}
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Share feedback"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Submit survey
          </button>
        </form>
      </section>

      {submitted && !showConsent && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-base font-semibold text-blue-900">
                Notify me about improvements
              </h2>
              <p className="text-sm text-blue-900/80">
                Stay in the loop when we release features that address your
                feedback.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowConsent(true)}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Opt in
            </button>
          </div>
        </div>
      )}

      {showConsent && (
        <ConsentForm
          channel="churn-survey"
          onCancel={() => setShowConsent(false)}
          onSubmitted={() => setShowConsent(false)}
        />
      )}
    </div>
  );
}
