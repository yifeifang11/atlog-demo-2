"use client";

import { useState } from "react";
import ConsentForm from "../../consent/ConsentForm";

export default function ContactFormFlowPage() {
  const [wantsUpdates, setWantsUpdates] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showConsent, setShowConsent] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    setShowConsent(wantsUpdates);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">
          Contact support
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Submit a ticket and our team will reach out within one business day.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Full name
            </label>
            <input
              type="text"
              required
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Jane Smith"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              type="email"
              required
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="jane@company.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              How can we help?
            </label>
            <textarea
              required
              rows={4}
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Describe the issue you are facing"
            />
          </div>
          <label className="flex items-start gap-3 text-sm text-slate-700">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
              checked={wantsUpdates}
              onChange={(event) => setWantsUpdates(event.target.checked)}
            />
            <span>Receive automated updates about my request</span>
          </label>
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Submit ticket
          </button>
        </form>
      </section>

      {submitted && wantsUpdates && showConsent && (
        <ConsentForm
          channel="contact-form"
          onCancel={() => setShowConsent(false)}
          onSubmitted={() => setShowConsent(false)}
        />
      )}
      {submitted && wantsUpdates && !showConsent && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-blue-900">
              Opt-in canceled. You can reopen the consent form to finish
              enrollment.
            </p>
            <button
              type="button"
              onClick={() => setShowConsent(true)}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Try again
            </button>
          </div>
        </div>
      )}
      {submitted && !wantsUpdates && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          Thanks for contacting us. You can always opt into updates later from
          the Portal Settings flow.
        </div>
      )}
    </div>
  );
}
