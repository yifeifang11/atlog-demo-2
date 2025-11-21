"use client";

import { useState } from "react";
import ConsentForm from "../../consent/ConsentForm";

export default function QrFlowPage() {
  const [showConsent, setShowConsent] = useState(false);

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-dashed border-blue-300 bg-white p-6 text-center shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-500">
          In-store campaign
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-slate-900">
          Scan QR to receive reminders
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          This landing page simulates the experience after a shopper scans
          signage in-store.
        </p>
        <div className="mt-6 flex justify-center">
          <div className="flex h-40 w-40 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-500">
            QR placeholder
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowConsent(true)}
          className="mt-8 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Notify me about pickup reminders
        </button>
      </section>

      {showConsent && (
        <ConsentForm
          channel="qr"
          onCancel={() => setShowConsent(false)}
          onSubmitted={() => setShowConsent(false)}
        />
      )}
    </div>
  );
}
