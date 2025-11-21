"use client";

import { useState } from "react";
import ConsentForm from "../../consent/ConsentForm";

const availableSlots = [
  { date: "2025-01-16", label: "Thu, Jan 16" },
  { date: "2025-01-17", label: "Fri, Jan 17" },
  { date: "2025-01-20", label: "Mon, Jan 20" },
];

const times = ["9:00 AM", "11:30 AM", "2:00 PM", "4:30 PM"];

export default function AppointmentFlowPage() {
  const [date, setDate] = useState(availableSlots[0].date);
  const [time, setTime] = useState(times[0]);
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
          Schedule your appointment
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Select a date and time, then confirm to reserve your spot.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-6 text-sm text-slate-700"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Choose a day
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {availableSlots.map((slot) => {
                const isActive = slot.date === date;
                return (
                  <button
                    key={slot.date}
                    type="button"
                    onClick={() => setDate(slot.date)}
                    className={`rounded-lg border px-4 py-3 font-medium transition ${
                      isActive
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-slate-200 hover:border-blue-200"
                    }`}
                  >
                    {slot.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Time
            </label>
            <select
              value={time}
              onChange={(event) => setTime(event.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              {times.map((slot) => (
                <option key={slot}>{slot}</option>
              ))}
            </select>
          </div>

          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
            />
            <span>Receive automated appointment reminders</span>
          </label>

          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Confirm appointment
          </button>
        </form>

        <p className="mt-4 text-xs text-slate-500">
          Booking for {new Date(date).toLocaleDateString()} at {time}
        </p>
      </section>

      {showConsent && (
        <ConsentForm
          channel="appointment"
          onCancel={() => setShowConsent(false)}
          onSubmitted={() => setShowConsent(false)}
        />
      )}
      {submitted && !consent && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          Appointment scheduled. Update your preferences anytime from Portal
          Settings.
        </div>
      )}
    </div>
  );
}
