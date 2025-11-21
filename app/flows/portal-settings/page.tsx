"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ConsentForm from "../../consent/ConsentForm";
import PhoneNumberInput from "../../consent/PhoneNumberInput";
import {
  getCustomers,
  recordConsentEvent,
  saveCustomers,
  type ConsentState,
  type Customer,
} from "../../utils/consent";

const PORTAL_CUSTOMER_ID = "portal-customer";
const DEFAULT_PHONE = "5558675309";

export default function PortalSettingsFlowPage() {
  const initialCustomer = ensurePortalCustomerRecord();
  const [customer, setCustomer] = useState<Customer | null>(initialCustomer);
  const [showConsent, setShowConsent] = useState(false);
  const [phoneInput, setPhoneInput] = useState(initialCustomer.phoneNumber);
  const [feedback, setFeedback] = useState<string | null>(null);
  const router = useRouter();

  const syncFromStorage = () => {
    const updated = ensurePortalCustomerRecord();
    setCustomer(updated);
    setPhoneInput(updated.phoneNumber);
  };

  const consentLabel = useMemo(() => {
    if (!customer) {
      return "Unknown";
    }
    return consentStateCopy[customer.consentState];
  }, [customer]);

  const isOptedIn = Boolean(
    customer &&
      (customer.consentState === "valid" ||
        customer.consentState === "pending_verification")
  );

  const handleToggle = () => {
    if (!customer) {
      return;
    }
    if (isOptedIn) {
      recordConsentEvent({
        channel: "portal-settings",
        phoneNumber: customer.phoneNumber,
        customerId: customer.id,
        action: "opt-out",
      });
      router.push("/confirmation?flow=portal-settings&status=success");
      syncFromStorage();
    } else {
      setShowConsent(true);
    }
  };

  const handlePhoneSave = () => {
    if (!customer) {
      return;
    }

    setFeedback(null);
    const digits = phoneInput.replace(/\D/g, "").slice(0, 10);
    if (digits.length !== 10) {
      setFeedback("Enter a valid 10-digit phone number.");
      return;
    }

    const customers = getCustomers();
    const index = customers.findIndex((item) => item.id === customer.id);
    if (index >= 0) {
      customers[index] = {
        ...customers[index],
        phoneNumber: digits,
        consentState: "unknown",
        lastConsentEventId: null,
      };
      saveCustomers(customers);
      setFeedback("Phone number updated. Consent state reset to unknown.");
      setCustomer({ ...customers[index] });
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">
          Communication preferences
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Manage consent for account notifications, billing alerts, and product
          updates.
        </p>

        <div className="mt-6 space-y-4">
          <div className="rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <div className="flex items-center justify-between">
              <span className="font-medium">Phone on file</span>
              <span>{formatDisplayPhone(phoneInput)}</span>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <PhoneNumberInput
                value={phoneInput}
                onChange={setPhoneInput}
                disabled={showConsent}
              />
              <button
                type="button"
                onClick={handlePhoneSave}
                className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-gray-200"
                disabled={showConsent}
              >
                Save
              </button>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Changing your phone resets consent until a new opt-in is
              submitted.
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Consent status
                </p>
                <p className="text-xs text-slate-500">{consentLabel}</p>
              </div>
              <button
                role="switch"
                aria-checked={Boolean(isOptedIn)}
                onClick={handleToggle}
                className={`relative inline-flex h-8 w-16 items-center rounded-full border transition ${
                  isOptedIn
                    ? "border-blue-600 bg-blue-600"
                    : "border-slate-300 bg-slate-200"
                }`}
              >
                <span
                  className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-white transition ${
                    isOptedIn ? "translate-x-8" : "translate-x-0"
                  }`}
                />
                <span className="sr-only">Toggle consent</span>
              </button>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              Toggle on to submit a new opt-in. Toggle off to immediately revoke
              consent.
            </p>
          </div>
        </div>

        {feedback && <p className="mt-4 text-sm text-blue-600">{feedback}</p>}
      </section>

      {showConsent && customer && (
        <ConsentForm
          channel="portal-settings"
          customerId={customer.id}
          preFilledPhone={customer.phoneNumber}
          onSubmitted={() => {
            setShowConsent(false);
            syncFromStorage();
          }}
          onCancel={() => setShowConsent(false)}
        />
      )}
    </div>
  );
}

const consentStateCopy: Record<ConsentState, string> = {
  unknown: "Unknown",
  pending_verification: "Pending verification",
  valid: "Valid opt-in",
  revoked: "Revoked",
};

function ensurePortalCustomerRecord(): Customer {
  const customers = getCustomers();
  let current =
    customers.find((item) => item.id === PORTAL_CUSTOMER_ID) ?? null;

  if (!current) {
    current = {
      id: PORTAL_CUSTOMER_ID,
      phoneNumber: DEFAULT_PHONE,
      consentState: "unknown",
      lastConsentEventId: null,
    };
    customers.push(current);
    saveCustomers(customers);
  }

  return { ...current };
}

function formatDisplayPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length !== 10) {
    return raw;
  }
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}
