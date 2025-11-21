"use client";

import { useState } from "react";
import ConsentForm from "../../consent/ConsentForm";

export default function RewardsFlowPage() {
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showConsent, setShowConsent] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    setShowConsent(consent);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">
          Rewards dashboard
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Track progress toward your next perk.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-blue-600 p-4 text-white shadow-sm">
            <p className="text-xs uppercase tracking-wide text-blue-100">
              Points
            </p>
            <p className="mt-3 text-3xl font-semibold">2,480</p>
            <p className="text-xs text-blue-100">520 points until Gold tier</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-700">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Available rewards
            </p>
            <ul className="mt-2 space-y-1">
              <li>- Free drink upgrade</li>
              <li>- 15% off accessories</li>
              <li>- Birthday surprise</li>
            </ul>
          </div>
          <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-700">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Activity
            </p>
            <ul className="mt-2 space-y-1">
              <li>Jan 2 · In-store purchase · +180</li>
              <li>Dec 28 · Mobile order · +90</li>
              <li>Dec 21 · Referral bonus · +500</li>
            </ul>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-4 text-sm text-slate-700"
        >
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
            />
            <span>Get automated reward updates and personalized offers.</span>
          </label>
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Save preferences
          </button>
        </form>
      </section>

      {showConsent && (
        <ConsentForm
          channel="rewards"
          onCancel={() => setShowConsent(false)}
          onSubmitted={() => setShowConsent(false)}
        />
      )}
      {submitted && !consent && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          Preferences saved without SMS updates.
        </div>
      )}
    </div>
  );
}
