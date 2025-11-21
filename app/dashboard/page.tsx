"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  exportConsentEventsAsCsv,
  summarizeCustomers,
  CONSENT_EVENTS_KEY,
  CUSTOMERS_KEY,
  type ConsentState,
  type ConsentEvent,
  type Customer,
} from "../utils/consent";
import EventDetailModal from "./components/EventDetailModal";

interface EnrichedCustomer extends Customer {
  lastEvent?: ConsentEvent;
}

interface SummaryData {
  customers: Customer[];
  events: ConsentEvent[];
  consentStateCounts: Record<ConsentState, number>;
  channelCounts: Record<string, number>;
  verificationCounts: Record<string, number>;
}

const consentStateLabels: Record<ConsentState, string> = {
  unknown: "Unknown",
  pending_verification: "Pending Verification",
  valid: "Valid",
  revoked: "Revoked",
};

const lineTypeOptions = [
  { value: "", label: "All line types" },
  { value: "valid", label: "Valid" },
  { value: "invalid", label: "Invalid" },
  { value: "voip", label: "VoIP" },
  { value: "landline", label: "Landline" },
];

const consentStateOptions = [
  { value: "", label: "All consent states" },
  ...Object.entries(consentStateLabels).map(([value, label]) => ({
    value,
    label,
  })),
];

const EMPTY_SUMMARY: SummaryData = {
  customers: [],
  events: [],
  consentStateCounts: {
    unknown: 0,
    pending_verification: 0,
    valid: 0,
    revoked: 0,
  },
  channelCounts: {},
  verificationCounts: {
    valid: 0,
    invalid: 0,
    voip: 0,
    landline: 0,
  },
};

export default function DashboardPage() {
  const [summary, setSummary] = useState<SummaryData>(EMPTY_SUMMARY);
  const [consentFilter, setConsentFilter] = useState("");
  const [channelFilter, setChannelFilter] = useState("");
  const [lineTypeFilter, setLineTypeFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<ConsentEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadSummary = useCallback(() => {
    setSummary(buildSummaryData());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const timeout = window.setTimeout(() => {
      loadSummary();
    }, 0);

    window.addEventListener("storage", loadSummary);
    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener("storage", loadSummary);
    };
  }, [loadSummary]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  }, []);

  const enrichedCustomers = useMemo<EnrichedCustomer[]>(() => {
    const eventMap = new Map(summary.events.map((event) => [event.id, event]));
    return summary.customers.map((customer) => ({
      ...customer,
      lastEvent: customer.lastConsentEventId
        ? eventMap.get(customer.lastConsentEventId) ?? undefined
        : undefined,
    }));
  }, [summary.events, summary.customers]);

  const filteredCustomers = useMemo(() => {
    return enrichedCustomers.filter((customer) => {
      if (consentFilter && customer.consentState !== consentFilter) {
        return false;
      }
      if (channelFilter && customer.lastEvent?.channel !== channelFilter) {
        return false;
      }
      if (
        lineTypeFilter &&
        customer.lastEvent?.verificationResult !== lineTypeFilter
      ) {
        return false;
      }
      if (
        dateFrom &&
        (!customer.lastEvent ||
          new Date(customer.lastEvent.timestamp) < new Date(dateFrom))
      ) {
        return false;
      }
      if (
        dateTo &&
        (!customer.lastEvent ||
          new Date(customer.lastEvent.timestamp) > endOfDay(dateTo))
      ) {
        return false;
      }
      return true;
    });
  }, [
    enrichedCustomers,
    consentFilter,
    channelFilter,
    lineTypeFilter,
    dateFrom,
    dateTo,
  ]);

  const filteredEvents = useMemo(() => {
    return summary.events.filter((eventItem) => {
      if (channelFilter && eventItem.channel !== channelFilter) {
        return false;
      }
      if (lineTypeFilter && eventItem.verificationResult !== lineTypeFilter) {
        return false;
      }
      if (dateFrom && new Date(eventItem.timestamp) < new Date(dateFrom)) {
        return false;
      }
      if (dateTo && new Date(eventItem.timestamp) > endOfDay(dateTo)) {
        return false;
      }
      return true;
    });
  }, [summary.events, channelFilter, lineTypeFilter, dateFrom, dateTo]);

  const handleEventRowClick = useCallback((eventItem: ConsentEvent) => {
    setSelectedEvent(eventItem);
    setIsModalOpen(true);
  }, []);

  const channelOptions = useMemo(() => {
    const channels = new Set(summary.events.map((event) => event.channel));
    return ["", ...Array.from(channels)];
  }, [summary.events]);

  const totalCustomers = summary.customers.length;
  const totalEvents = summary.events.length;

  const handleExport = () => {
    const csv = exportConsentEventsAsCsv();
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `consent-events-${new Date().toISOString()}.csv`
    );
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const handleClearData = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.removeItem(CONSENT_EVENTS_KEY);
    window.localStorage.removeItem(CUSTOMERS_KEY);
    setSummary(EMPTY_SUMMARY);
    handleCloseModal();
    loadSummary();
  }, [handleCloseModal, loadSummary]);

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">
            Consent dashboard
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Monitor customer consent states across channels and export raw event
            history.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleClearData}
            className="rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
          >
            Clear demo data
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            disabled={totalEvents === 0}
          >
            Export CSV
          </button>
        </div>
      </header>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Summary
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-4">
          <SummaryCard label="Total customers" value={totalCustomers} />
          <SummaryCard label="Valid" value={summary.consentStateCounts.valid} />
          <SummaryCard
            label="Pending"
            value={summary.consentStateCounts.pending_verification}
          />
          <SummaryCard
            label="Revoked"
            value={summary.consentStateCounts.revoked}
          />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900">
            Events by channel
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            {Object.keys(summary.channelCounts).length === 0 && (
              <li>No events recorded yet.</li>
            )}
            {Object.entries(summary.channelCounts).map(([channel, count]) => (
              <li key={channel} className="flex justify-between">
                <span>{channel}</span>
                <span className="font-semibold text-slate-900">{count}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900">
            Events by line type
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            {lineTypeOptions
              .filter((option) => option.value)
              .map((option) => (
                <li key={option.value} className="flex justify-between">
                  <span>{option.label}</span>
                  <span className="font-semibold text-slate-900">
                    {summary.verificationCounts[option.value] ?? 0}
                  </span>
                </li>
              ))}
          </ul>
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Filters
        </h2>
        <div className="mt-4 grid gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Consent state
            </label>
            <select
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={consentFilter}
              onChange={(event) => setConsentFilter(event.target.value)}
            >
              {consentStateOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Channel
            </label>
            <select
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={channelFilter}
              onChange={(event) => setChannelFilter(event.target.value)}
            >
              <option value="">All channels</option>
              {channelOptions
                .filter((channel) => channel)
                .map((channel) => (
                  <option key={channel} value={channel}>
                    {channel}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Line type
            </label>
            <select
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={lineTypeFilter}
              onChange={(event) => setLineTypeFilter(event.target.value)}
            >
              {lineTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                From
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(event) => setDateFrom(event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                To
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(event) => setDateTo(event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-200"
              />
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Customers
        </h2>
        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Customer ID</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Consent state</th>
                <th className="px-4 py-3">Last event timestamp</th>
                <th className="px-4 py-3">Channel</th>
                <th className="px-4 py-3">AI outreach allowed?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {filteredCustomers.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-6 text-center text-sm text-slate-500"
                  >
                    No customers match the selected filters.
                  </td>
                </tr>
              )}
              {filteredCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">
                    {customer.id}
                  </td>
                  <td className="px-4 py-3">
                    {formatDisplayPhone(customer.phoneNumber)}
                  </td>
                  <td className="px-4 py-3">
                    {consentStateLabels[customer.consentState]}
                  </td>
                  <td className="px-4 py-3">
                    {customer.lastEvent
                      ? new Date(customer.lastEvent.timestamp).toLocaleString()
                      : "--"}
                  </td>
                  <td className="px-4 py-3">
                    {customer.lastEvent?.channel ?? "--"}
                  </td>
                  <td className="px-4 py-3">
                    {customer.consentState === "valid" ? "Yes" : "No"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Consent events
        </h2>
        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Event ID</th>
                <th className="px-4 py-3">Customer ID</th>
                <th className="px-4 py-3">Phone number</th>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Channel</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {filteredEvents.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-6 text-center text-sm text-slate-500"
                  >
                    No consent events captured yet.
                  </td>
                </tr>
              )}
              {filteredEvents.map((eventItem) => (
                <tr
                  key={eventItem.id}
                  tabIndex={0}
                  onClick={() => handleEventRowClick(eventItem)}
                  onKeyDown={(keyboardEvent) => {
                    if (
                      keyboardEvent.key === "Enter" ||
                      keyboardEvent.key === " "
                    ) {
                      keyboardEvent.preventDefault();
                      handleEventRowClick(eventItem);
                    }
                  }}
                  className="cursor-pointer px-4 py-3 transition hover:bg-slate-50 focus:outline-none focus-visible:bg-slate-50 focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">
                    {eventItem.id}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {eventItem.customerId ?? "--"}
                  </td>
                  <td className="px-4 py-3">
                    {formatDisplayPhone(eventItem.phoneNumber)}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {new Date(eventItem.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {eventItem.channel}
                  </td>
                  <td className="px-4 py-3 text-slate-600 capitalize">
                    {eventItem.action}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <EventDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        event={selectedEvent}
      />
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-4 text-3xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function buildSummaryData(): SummaryData {
  const data = summarizeCustomers();
  return {
    customers: data.customers,
    events: data.events,
    consentStateCounts: data.consentStateCounts,
    channelCounts: data.channelCounts,
    verificationCounts: data.verificationCounts,
  };
}

function endOfDay(value: string): Date {
  const date = new Date(value);
  date.setHours(23, 59, 59, 999);
  return date;
}

function formatDisplayPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length !== 10) {
    return raw;
  }
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}
