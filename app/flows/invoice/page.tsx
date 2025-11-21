"use client";

import { useState } from "react";
import ConsentForm from "../../consent/ConsentForm";

const invoiceItems = [
  { description: "Monthly subscription", quantity: 1, amount: 89.0 },
  { description: "Usage overage", quantity: 1200, amount: 0.03 },
  { description: "SMS add-on", quantity: 1, amount: 15.0 },
];

export default function InvoiceFlowPage() {
  const [showConsent, setShowConsent] = useState(false);
  const subtotal = invoiceItems.reduce(
    (sum, item) => sum + item.quantity * item.amount,
    0
  );
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Invoice #1234
            </h1>
            <p className="text-sm text-slate-500">
              Issued May 2024 · Due upon receipt
            </p>
          </div>
          <div className="text-right text-sm text-slate-600">
            <p>Acme Freight</p>
            <p>123 Harbor Way</p>
            <p>San Diego, CA</p>
          </div>
        </header>

        <table className="mt-6 w-full text-sm text-slate-700">
          <thead className="text-xs uppercase tracking-wide text-slate-500">
            <tr className="border-b border-slate-200">
              <th className="py-3 text-left">Description</th>
              <th className="py-3 text-right">Qty</th>
              <th className="py-3 text-right">Rate</th>
              <th className="py-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {invoiceItems.map((item) => (
              <tr key={item.description}>
                <td className="py-3 text-slate-900">{item.description}</td>
                <td className="py-3 text-right">
                  {item.quantity.toLocaleString()}
                </td>
                <td className="py-3 text-right">${item.amount.toFixed(2)}</td>
                <td className="py-3 text-right">
                  ${(item.quantity * item.amount).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 space-y-2 text-sm text-slate-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-semibold text-slate-900">
            <span>Total due</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-900">
                Get automated updates about receipts and service status
              </p>
              <p className="text-xs text-blue-900/80">
                Subscribe once and stay informed whenever payments post or
                delivery dates change.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowConsent(true)}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Enable notifications
            </button>
          </div>
        </div>
      </div>

      {showConsent && (
        <ConsentForm
          channel="invoice"
          onCancel={() => setShowConsent(false)}
          onSubmitted={() => setShowConsent(false)}
        />
      )}
    </div>
  );
}
