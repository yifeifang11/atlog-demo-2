"use client";

import { useMemo, useState } from "react";
import ConsentForm from "../../consent/ConsentForm";
import PhoneNumberInput, {
  formatPhoneNumber,
} from "../../consent/PhoneNumberInput";

const cartItems = [
  { name: "AI Outreach Suite", quantity: 1, price: 189.0 },
  { name: "SMS credits", quantity: 2500, price: 0.025 },
  { name: "Onboarding concierge", quantity: 1, price: 49.0 },
];

export default function CheckoutFlowPage() {
  const [phone, setPhone] = useState("");
  const [wantsUpdates, setWantsUpdates] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [showConsent, setShowConsent] = useState(false);

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0),
    []
  );

  const tax = useMemo(() => subtotal * 0.0825, [subtotal]);
  const total = useMemo(() => subtotal + tax, [subtotal, tax]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setOrderSubmitted(true);
    setShowConsent(wantsUpdates);
  };

  return (
    <div className="space-y-6">
      {!orderSubmitted && (
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <header className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">
                Checkout
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Review your order and submit to finalize enrollment.
              </p>
            </div>
            <p className="text-sm font-semibold text-slate-900">
              {formatCurrency(total)}
            </p>
          </header>

          <div className="mt-6 space-y-4 text-sm text-slate-700">
            <div className="rounded-lg border border-slate-200">
              <table className="w-full text-left">
                <thead className="text-xs uppercase tracking-wide text-slate-500">
                  <tr className="border-b border-slate-200">
                    <th className="px-4 py-3">Item</th>
                    <th className="px-4 py-3 text-right">Qty</th>
                    <th className="px-4 py-3 text-right">Rate</th>
                    <th className="px-4 py-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {cartItems.map((item) => (
                    <tr key={item.name}>
                      <td className="px-4 py-3 text-slate-900">{item.name}</td>
                      <td className="px-4 py-3 text-right">
                        {item.quantity.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {formatCurrency(item.quantity * item.price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm text-slate-600">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600">
                <span>Estimated tax</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-semibold text-slate-900">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Contact details
              </h2>
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Full name
                  </label>
                  <input
                    type="text"
                    required
                    className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="Jamie Rivera"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="jamie@acme.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Mobile phone
                  </label>
                  <PhoneNumberInput
                    value={phone}
                    onChange={setPhone}
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Payment method
              </h2>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div className="rounded-lg border border-dashed border-slate-300 px-4 py-6 text-center">
                  Add your preferred payment method during onboarding.
                </div>
                <label className="flex items-start gap-3 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                    checked={wantsUpdates}
                    onChange={(event) => setWantsUpdates(event.target.checked)}
                  />
                  <span>
                    Receive automated updates about my order or services.
                  </span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Submit Order
            </button>
          </form>
        </section>
      )}

      {orderSubmitted && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Order submitted.
          </h2>
          <p className="mt-2">
            Thanks for your purchase. We sent a receipt to your email and will
            reach out if anything needs attention.
          </p>
          {phone && (
            <p className="mt-2 text-slate-500">
              Phone on file: {formatPhoneNumber(phone)}
            </p>
          )}
        </div>
      )}

      {orderSubmitted && wantsUpdates && !showConsent && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 text-sm text-blue-900 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p>Enable automated updates any time to receive order alerts.</p>
            <button
              type="button"
              onClick={() => setShowConsent(true)}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Reopen consent form
            </button>
          </div>
        </div>
      )}

      {showConsent && (
        <ConsentForm
          channel="checkout"
          preFilledPhone={phone.length === 10 ? phone : undefined}
          onCancel={() => setShowConsent(false)}
          onSubmitted={() => setShowConsent(false)}
        />
      )}
    </div>
  );
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}
