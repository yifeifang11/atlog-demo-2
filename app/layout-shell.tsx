"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const flowLinks = [
  { label: "Invoice", href: "/flows/invoice" },
  { label: "Checkout", href: "/flows/checkout" },
  { label: "Warranty Lookup", href: "/flows/warranty" },
  { label: "Contact Form", href: "/flows/contact-form" },
  { label: "Chatbot", href: "/flows/chatbot" },
  { label: "Churn Survey", href: "/flows/churn-survey" },
  { label: "Account Creation", href: "/flows/account-creation" },
  { label: "Portal Settings", href: "/flows/portal-settings" },
  { label: "In-Person Tablet", href: "/flows/in-person" },
  { label: "Appointment", href: "/flows/appointment" },
  { label: "Intake Form", href: "/flows/intake-form" },
  { label: "Check-In", href: "/flows/check-in" },
  { label: "QR Landing", href: "/flows/qr" },
  { label: "Rewards", href: "/flows/rewards" },
  { label: "Feedback", href: "/flows/feedback" },
  { label: "WiFi Portal", href: "/flows/wifi" },
];

const tabletPath = "/flows/in-person";

export default function LayoutShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isTablet = pathname.startsWith(tabletPath);

  if (isTablet) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-semibold text-slate-900">
            Atlog Consent Demo
          </Link>
          <div className="flex items-center gap-4 text-sm font-medium text-slate-600">
            <Link
              href="/dashboard"
              className={
                pathname === "/dashboard"
                  ? "text-blue-600"
                  : "hover:text-slate-900"
              }
            >
              Dashboard
            </Link>
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                onBlur={() => setTimeout(() => setOpen(false), 150)}
                className="flex items-center gap-1 rounded-md border border-transparent px-3 py-2 hover:border-slate-200 hover:bg-slate-50"
              >
                <span>Consent Flows</span>
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 7L10 12L15 7"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {open && (
                <div className="absolute right-0 z-20 mt-2 w-56 rounded-lg border border-slate-200 bg-white shadow-lg">
                  <ul className="py-2 text-sm">
                    {flowLinks.map((flow) => {
                      const active = pathname === flow.href;
                      return (
                        <li key={flow.href}>
                          <Link
                            href={flow.href}
                            className={`block px-4 py-2 ${
                              active
                                ? "bg-blue-50 text-blue-600"
                                : "hover:bg-slate-50"
                            }`}
                          >
                            {flow.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-10 font-sans">{children}</main>
    </div>
  );
}
