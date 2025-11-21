"use client";

import { useState } from "react";
import ConsentForm from "../../consent/ConsentForm";

export default function CheckInFlowPage() {
  const [showConsent, setShowConsent] = useState(false);

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">
          Check-in for appointment
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Confirm your details before you take a seat.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-700">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Appointment with
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-900">
              Dr. Patel
            </p>
            <p className="text-xs text-slate-500">General Medicine</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-700">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Scheduled
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-900">
              Jan 16 · 3:30 PM
            </p>
            <p className="text-xs text-slate-500">Arrive 10 minutes early</p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Enable automated wait time updates
            </h2>
            <p className="text-sm text-slate-600">
              Receive text alerts when your provider is running ahead or behind
              schedule.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowConsent(true)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Turn on updates
          </button>
        </div>
      </section>

      {showConsent && (
        <ConsentForm
          channel="check-in"
          onCancel={() => setShowConsent(false)}
          onSubmitted={() => setShowConsent(false)}
        />
      )}
    </div>
  );
}
