"use client";

import { useEffect, useMemo, useRef } from "react";
import type { ConsentEvent } from "@/app/utils/consent";

interface EventDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: ConsentEvent | null;
}

const focusableSelectors = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

export default function EventDetailModal({
  isOpen,
  onClose,
  event,
}: EventDetailModalProps) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previouslyFocusedElement =
      document.activeElement as HTMLElement | null;

    const focusInitialElement = () => {
      const dialog = dialogRef.current;
      if (!dialog) {
        return;
      }
      const focusable =
        dialog.querySelectorAll<HTMLElement>(focusableSelectors);
      const firstFocusable = focusable[0] ?? dialog;
      firstFocusable.focus();
    };

    const handleKeyDown = (keyboardEvent: KeyboardEvent) => {
      if (keyboardEvent.key === "Escape") {
        keyboardEvent.preventDefault();
        onClose();
        return;
      }

      if (keyboardEvent.key === "Tab") {
        const dialog = dialogRef.current;
        if (!dialog) {
          return;
        }
        const focusableEls = Array.from(
          dialog.querySelectorAll<HTMLElement>(focusableSelectors)
        ).filter((element) => !element.hasAttribute("disabled"));

        if (focusableEls.length === 0) {
          keyboardEvent.preventDefault();
          dialog.focus();
          return;
        }

        const first = focusableEls[0];
        const last = focusableEls[focusableEls.length - 1];
        const activeElement = document.activeElement as HTMLElement;

        if (keyboardEvent.shiftKey) {
          if (activeElement === first || !dialog.contains(activeElement)) {
            keyboardEvent.preventDefault();
            last.focus();
          }
        } else {
          if (activeElement === last) {
            keyboardEvent.preventDefault();
            first.focus();
          }
        }
      }
    };

    focusInitialElement();
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocusedElement?.focus();
    };
  }, [isOpen, onClose, event]);

  const metadata = useMemo(() => {
    if (!event) {
      return [];
    }

    return [
      { label: "Event ID", value: event.id },
      { label: "Customer ID", value: event.customerId ?? "--" },
      { label: "Phone number", value: formatPhone(event.phoneNumber) },
      {
        label: "Timestamp",
        value: new Date(event.timestamp).toLocaleString(),
      },
      { label: "Channel", value: event.channel },
      { label: "Action", value: event.action },
      { label: "Verification result", value: event.verificationResult },
      { label: "IP address", value: event.ip },
      { label: "Disclosure text version", value: event.disclosureTextVersion },
    ];
  }, [event]);

  if (!isOpen || !event) {
    return null;
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      role="presentation"
      onMouseDown={(mouseEvent) => {
        if (mouseEvent.target === overlayRef.current) {
          onClose();
        }
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-detail-title"
        className="relative w-full max-w-2xl rounded-xl bg-white p-6 shadow-lg focus:outline-none"
        tabIndex={-1}
        onMouseDown={(eventInside) => eventInside.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-md border border-transparent p-2 text-slate-500 transition hover:border-slate-200 hover:text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <span className="sr-only">Close</span>
          <svg
            className="h-4 w-4"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 4L12 12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M12 4L4 12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <h2
          id="event-detail-title"
          className="pr-10 text-xl font-semibold text-slate-900"
        >
          Consent event details
        </h2>

        <div className="mt-6 grid gap-x-6 gap-y-4 text-sm text-slate-700 sm:grid-cols-2">
          {metadata.map((item) => (
            <div key={item.label}>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {item.label}
              </p>
              <p className="mt-1 wrap-break-word text-slate-900">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(-10);
  if (digits.length !== 10) {
    return raw;
  }
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}
