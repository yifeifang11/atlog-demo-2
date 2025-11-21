"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import DisclosureText from "@/app/consent/DisclosureText";
import PhoneNumberInput, {
  formatPhoneNumber,
} from "@/app/consent/PhoneNumberInput";
import { recordConsentEvent } from "@/app/utils/consent";

interface ConsentFormProps {
  channel: string;
  customerId?: string;
  preFilledPhone?: string;
  onSubmitted?: () => void;
  onCancel?: () => void;
}

export default function ConsentForm({
  channel,
  customerId,
  preFilledPhone,
  onSubmitted,
  onCancel,
}: ConsentFormProps) {
  const router = useRouter();
  const initialPhone = preFilledPhone
    ? preFilledPhone.replace(/\D/g, "").slice(0, 10)
    : "";
  const [phone, setPhone] = useState(initialPhone);
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const hasPhoneInput = !preFilledPhone;
  const displayPhone = useMemo(
    () => formatPhoneNumber(preFilledPhone ?? phone),
    [preFilledPhone, phone]
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!accepted) {
      setError("Please confirm your consent to proceed.");
      return;
    }

    if (hasPhoneInput && phone.replace(/\D/g, "").length !== 10) {
      setError("Enter a valid 10-digit US phone number.");
      return;
    }

    setSubmitting(true);

    try {
      recordConsentEvent({
        channel,
        customerId: customerId ?? null,
        phoneNumber: phone,
        action: "opt-in",
      });
      onSubmitted?.();
      router.push(
        `/confirmation?flow=${encodeURIComponent(channel)}&status=success`
      );
    } catch (submitError) {
      console.error(submitError);
      setError("Something went wrong. Please try again.");
      router.push(
        `/confirmation?flow=${encodeURIComponent(channel)}&status=error`
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-xl font-semibold text-slate-900">
        Update Preferences
      </h2>
      <p className="mt-2 text-sm text-slate-600">
        Confirm the phone number we should use and opt in to automated updates.
      </p>

      {hasPhoneInput ? (
        <div className="mt-6">
          <label className="block text-sm font-medium text-slate-700">
            Mobile phone number
          </label>
          <PhoneNumberInput
            value={phone}
            onChange={setPhone}
            required
            disabled={submitting}
          />
        </div>
      ) : (
        <div className="mt-6 rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-700">
          <span className="font-medium">Phone on file:</span> {displayPhone}
        </div>
      )}

      <div className="mt-6 flex items-start gap-3">
        <input
          id="consent"
          type="checkbox"
          className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
          checked={accepted}
          onChange={(event) => setAccepted(event.target.checked)}
          disabled={submitting}
        />
        <label htmlFor="consent" className="text-sm text-slate-700">
          I agree to receive automated communications at the number provided.
        </label>
      </div>

      <div className="mt-6 text-sm text-slate-500">
        <DisclosureText />
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <div className="mt-6 flex gap-3">
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit"}
        </button>
        <button
          type="button"
          onClick={() => {
            if (onCancel) {
              onCancel();
              return;
            }
            router.back();
          }}
          className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-gray-200"
          disabled={submitting}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
