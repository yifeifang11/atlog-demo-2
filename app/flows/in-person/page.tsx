"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { recordConsentEvent } from "../../utils/consent";

export default function InPersonFlowPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const digits = phone.replace(/\D/g, "").slice(0, 10);
    if (digits.length !== 10) {
      setError("Enter a valid phone number.");
      return;
    }

    if (!accepted) {
      setError("Please confirm you agree to automated updates.");
      return;
    }

    setSubmitting(true);
    try {
      recordConsentEvent({
        channel: "in-person",
        phoneNumber: digits,
        action: "opt-in",
      });
      router.push("/confirmation?flow=in-person&status=success");
    } catch (submitError) {
      console.error(submitError);
      router.push("/confirmation?flow=in-person&status=error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900 px-4 py-10 text-white">
      <div className="w-full max-w-xl rounded-3xl bg-slate-800 p-10 text-center shadow-2xl">
        <h1 className="text-3xl font-semibold">
          Please review and confirm your communication preferences.
        </h1>
        <p className="mt-4 text-lg text-slate-200">
          Enter your mobile number to receive pickup alerts, appointment
          reminders, and personalized offers.
        </p>
        <form onSubmit={handleSubmit} className="mt-10 space-y-6 text-left">
          <div>
            <label className="block text-sm font-semibold uppercase tracking-wide text-slate-300">
              Mobile number
            </label>
            <input
              type="tel"
              inputMode="tel"
              value={formatPhone(phone)}
              onChange={(event) => setPhone(event.target.value)}
              className="mt-3 w-full rounded-2xl border-2 border-transparent bg-white/10 px-6 py-4 text-2xl tracking-widest text-white placeholder:text-slate-400 focus:border-blue-400 focus:outline-none"
              placeholder="(555) 123-4567"
              disabled={submitting}
            />
          </div>
          <label className="flex items-start gap-4 text-left text-lg text-slate-100">
            <input
              type="checkbox"
              className="mt-2 h-6 w-6 rounded border-slate-500 text-blue-400 focus:ring-blue-400"
              checked={accepted}
              onChange={(event) => setAccepted(event.target.checked)}
              disabled={submitting}
            />
            <span>
              I agree to receive automated SMS and voice updates and understand
              that message and data rates may apply.
            </span>
          </label>
          {error && <p className="text-base text-red-300">{error}</p>}
          <button
            type="submit"
            className="mt-4 w-full rounded-2xl bg-blue-500 py-4 text-2xl font-semibold text-white shadow-lg hover:bg-blue-400 disabled:cursor-not-allowed disabled:bg-blue-800"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Confirm preferences"}
          </button>
        </form>
      </div>
    </div>
  );
}

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  const part1 = digits.slice(0, 3);
  const part2 = digits.slice(3, 6);
  const part3 = digits.slice(6);
  if (digits.length <= 3) {
    return part1;
  }
  if (digits.length <= 6) {
    return `(${part1}) ${part2}`;
  }
  return `(${part1}) ${part2}-${part3}`;
}
