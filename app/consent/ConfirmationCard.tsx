"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function ConfirmationCard() {
  const params = useSearchParams();
  const flow = params.get("flow") ?? "";
  const status = params.get("status") ?? "success";
  const isSuccess = status === "success";

  return (
    <div className="mx-auto max-w-xl rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <div
        className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${
          isSuccess ? "bg-green-100" : "bg-red-100"
        }`}
      >
        {isSuccess ? (
          <svg
            className="h-6 w-6 text-green-600"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 12.5L9.5 17L19 7.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg
            className="h-6 w-6 text-red-600"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 8L16 16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16 8L8 16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      <h1 className="mt-4 text-2xl font-semibold text-slate-900">
        {isSuccess ? "Preferences Updated" : "Request Failed"}
      </h1>
      <p className="mt-3 text-sm text-slate-600">
        {isSuccess
          ? "Your communication preferences have been updated."
          : "We could not process your request."}
      </p>
      {flow && (
        <p className="mt-1 text-xs uppercase tracking-wide text-slate-400">
          Flow: {flow}
        </p>
      )}
      <div className="mt-8 flex justify-center gap-3">
        <Link
          href="/dashboard"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          View Dashboard
        </Link>
        <Link
          href="/"
          className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-gray-200"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
