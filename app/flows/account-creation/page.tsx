"use client";

import { useState } from "react";
import ConsentForm from "../../consent/ConsentForm";
import PhoneNumberInput from "../../consent/PhoneNumberInput";

export default function AccountCreationFlowPage() {
  const [phone, setPhone] = useState("");
  const [includeConsent, setIncludeConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showConsent, setShowConsent] = useState(false);
  const phoneIsValid = phone.replace(/\D/g, "").length === 10;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    setShowConsent(includeConsent && phoneIsValid);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Complete your profile details to unlock personalized communications
          and offers.
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
              placeholder="Jordan Lee"
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
              placeholder="jordan@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Mobile phone
            </label>
            <PhoneNumberInput value={phone} onChange={setPhone} required />
            <label className="mt-3 flex items-start gap-3 text-sm text-slate-700">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                checked={includeConsent}
                onChange={(event) => setIncludeConsent(event.target.checked)}
              />
              <span>
                Yes, send me automated onboarding updates at this number.
              </span>
            </label>
          </div>
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Create account
          </button>
        </form>
      </section>

      {showConsent && (
        <ConsentForm
          channel="account-creation"
          preFilledPhone={phone}
          onCancel={() => setShowConsent(false)}
          onSubmitted={() => setShowConsent(false)}
        />
      )}
      {submitted && includeConsent && !phoneIsValid && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 shadow-sm">
          Please provide a valid phone number to continue with SMS
          notifications.
        </div>
      )}
    </div>
  );
}
