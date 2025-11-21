"use client";

import { useState } from "react";
import ConsentForm from "../../consent/ConsentForm";

export default function WifiFlowPage() {
  const [consent, setConsent] = useState(false);
  const [connected, setConnected] = useState(false);
  const [showConsent, setShowConsent] = useState(false);

  const handleConnect = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setConnected(true);
    setShowConsent(consent);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">
          Welcome to Atlog Guest WiFi
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Connect instantly and opt in to VIP offers if you would like.
        </p>

        <form
          onSubmit={handleConnect}
          className="mt-6 space-y-4 text-sm text-slate-700"
        >
          <div>
            <label className="block font-medium">Email (optional)</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
            />
            <span>
              Send me automated offers and store events while I&apos;m
              connected.
            </span>
          </label>
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Connect now
          </button>
        </form>
      </section>

      {connected && !consent && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          You&apos;re online. Toggle marketing updates any time from Portal
          Settings.
        </div>
      )}

      {showConsent && (
        <ConsentForm
          channel="wifi"
          onCancel={() => setShowConsent(false)}
          onSubmitted={() => setShowConsent(false)}
        />
      )}
    </div>
  );
}
