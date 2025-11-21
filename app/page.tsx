import Link from "next/link";

const highlightedFlows = [
  {
    title: "Invoice Opt-In",
    description:
      "Capture consent from billing communications with a contextual banner.",
    href: "/flows/invoice",
  },
  {
    title: "Portal Settings",
    description:
      "Demonstrate realtime opt-in and opt-out management inside account settings.",
    href: "/flows/portal-settings",
  },
  {
    title: "In-Person Tablet",
    description:
      "Tablet-friendly consent capture for brick-and-mortar experiences.",
    href: "/flows/in-person",
  },
];

export default function Home() {
  return (
    <div className="space-y-10">
      <section className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <span className="text-xs font-semibold uppercase tracking-widest text-blue-600">
          Atlog Demo
        </span>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">
          Consent capture flows for every customer touchpoint
        </h1>
        <p className="mt-4 max-w-2xl text-base text-slate-600">
          Explore pre-built scenarios that show how Atlog records consent
          events, updates customer state, and keeps teams aligned using a
          unified dashboard. Each flow writes to localStorage so you can review
          the resulting data instantly.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/dashboard"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            View Consent Dashboard
          </Link>
          <Link
            href="/flows/invoice"
            className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-gray-200"
          >
            Start with Invoice Flow
          </Link>
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">
            Featured flows
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Jump into a scenario to see how consent is requested in-context.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {highlightedFlows.map((flow) => (
            <Link
              key={flow.href}
              href={flow.href}
              className="flex h-full flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
            >
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {flow.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  {flow.description}
                </p>
              </div>
              <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-blue-600">
                Open flow
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 4H16V13"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16 4L4 16"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">
          What to explore
        </h2>
        <ul className="mt-4 space-y-2 text-sm text-slate-600">
          <li>
            - Submit opt-ins across flows and confirm outcomes on the dashboard.
          </li>
          <li>
            - Toggle opt-outs in portal settings to simulate preference
            revocation.
          </li>
          <li>
            - Export consent events as CSV and inspect the stored payloads.
          </li>
        </ul>
      </section>
    </div>
  );
}
