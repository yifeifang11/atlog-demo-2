"use client";

import { useState } from "react";
import ConsentForm from "../../consent/ConsentForm";

export default function WarrantyFlowPage() {
  const [showConsent, setShowConsent] = useState(false);

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">
          Warranty status
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Product serial:{" "}
          <span className="font-mono text-slate-900">AT-4938-112</span>
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Coverage
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-900">
              Extended protection
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Expires
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-900">
              Jan 14, 2026
            </p>
          </div>
        </div>
        <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-lg border border-blue-200 bg-blue-50 p-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-sm font-semibold text-blue-900">
              Enable automated warranty reminders
            </h2>
            <p className="mt-1 text-xs text-blue-900/80">
              Opt in to receive 30, 14, and 3-day notifications before your
              coverage expires.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowConsent(true)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Enable reminders
          </button>
        </div>
      </section>

      {showConsent && (
        <ConsentForm
          channel="warranty"
          onCancel={() => setShowConsent(false)}
          onSubmitted={() => setShowConsent(false)}
        />
      )}
    </div>
  );
}
