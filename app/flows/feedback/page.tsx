"use client";

import { useState } from "react";
import ConsentForm from "../../consent/ConsentForm";

export default function FeedbackFlowPage() {
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
          Post-purchase feedback
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Tell us how the product worked for you so we can improve future
          launches.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4 text-sm text-slate-700"
        >
          <div>
            <label className="block font-medium">Overall satisfaction</label>
            <select
              required
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value="">Select rating</option>
              <option>5 - Loved it</option>
              <option>4 - Great</option>
              <option>3 - It was ok</option>
              <option>2 - Needs work</option>
              <option>1 - Not for me</option>
            </select>
          </div>
          <div>
            <label className="block font-medium">What did you like most?</label>
            <textarea
              rows={3}
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="block font-medium">
              Anything we should improve?
            </label>
            <textarea
              rows={3}
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Submit feedback
          </button>
        </form>
      </section>

      {submitted && !showConsent && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-base font-semibold text-blue-900">
                Send me updates about similar products
              </h2>
              <p className="text-sm text-blue-900/80">
                Opt in to be first to know about upcoming launches and limited
                drops.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowConsent(true)}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Subscribe
            </button>
          </div>
        </div>
      )}

      {showConsent && (
        <ConsentForm
          channel="feedback"
          onCancel={() => setShowConsent(false)}
          onSubmitted={() => setShowConsent(false)}
        />
      )}
    </div>
  );
}
