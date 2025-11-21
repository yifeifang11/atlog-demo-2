"use client";

import { useState } from "react";
import ConsentForm from "../../consent/ConsentForm";
import PhoneNumberInput from "../../consent/PhoneNumberInput";

export default function IntakeFormFlowPage() {
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showConsent, setShowConsent] = useState(false);
  const phoneValid = phone.replace(/\D/g, "").length === 10;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    setShowConsent(consent && phoneValid);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">
          Patient intake
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Share contact details in advance so our team can prepare for your
          visit.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4 text-sm text-slate-700"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block font-medium">First name</label>
              <input
                type="text"
                required
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="block font-medium">Last name</label>
              <input
                type="text"
                required
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>
          <div>
            <label className="block font-medium">Email</label>
            <input
              type="email"
              required
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="block font-medium">Mobile phone</label>
            <PhoneNumberInput value={phone} onChange={setPhone} required />
            <label className="mt-3 flex items-start gap-3">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                checked={consent}
                onChange={(event) => setConsent(event.target.checked)}
              />
              <span>
                Keep me updated on my visit via automated text updates.
              </span>
            </label>
          </div>
          <div>
            <label className="block font-medium">Reason for visit</label>
            <textarea
              rows={3}
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Optional"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Submit intake
          </button>
        </form>
      </section>

      {showConsent && (
        <ConsentForm
          channel="intake-form"
          preFilledPhone={phone}
          onCancel={() => setShowConsent(false)}
          onSubmitted={() => setShowConsent(false)}
        />
      )}
      {submitted && consent && !phoneValid && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 shadow-sm">
          Add a valid phone number to enroll in visit updates.
        </div>
      )}
    </div>
  );
}
