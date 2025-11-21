import { readJSON, writeJSON } from "./localStorage";
import {
  mockLookupVerification,
  type VerificationResult,
} from "./verification";

export type ConsentAction = "opt-in" | "opt-out";
export type ConsentState =
  | "unknown"
  | "pending_verification"
  | "valid"
  | "revoked";

export interface ConsentEvent {
  id: string;
  customerId: string | null;
  phoneNumber: string;
  timestamp: string;
  ip: string;
  channel: string;
  disclosureTextVersion: "v1";
  verificationResult: VerificationResult;
  action: ConsentAction;
}

export interface Customer {
  id: string;
  phoneNumber: string;
  consentState: ConsentState;
  lastConsentEventId: string | null;
}

export const CONSENT_EVENTS_KEY = "consent_events";
export const CUSTOMERS_KEY = "customers";

export function getConsentEvents(): ConsentEvent[] {
  return readJSON<ConsentEvent[]>(CONSENT_EVENTS_KEY, []);
}

export function saveConsentEvents(events: ConsentEvent[]): void {
  writeJSON(CONSENT_EVENTS_KEY, events);
}

export function getCustomers(): Customer[] {
  return readJSON<Customer[]>(CUSTOMERS_KEY, []);
}

export function saveCustomers(customers: Customer[]): void {
  writeJSON(CUSTOMERS_KEY, customers);
}

export function recordConsentEvent(input: {
  channel: string;
  phoneNumber: string;
  action: ConsentAction;
  customerId?: string | null;
  verificationResult?: VerificationResult;
}): { event: ConsentEvent; customer: Customer } {
  const phoneNumber = normalizePhoneNumber(input.phoneNumber);
  const events = getConsentEvents();
  const customers = getCustomers();

  const { customer, index } = ensureCustomer(customers, {
    customerId: input.customerId,
    phoneNumber,
  });

  const verificationResult =
    input.action === "opt-in"
      ? input.verificationResult ?? mockLookupVerification(phoneNumber)
      : deriveOptOutVerification(
          events,
          customer ? customer.lastConsentEventId : null
        );

  if (customer && customer.phoneNumber !== phoneNumber) {
    customer.phoneNumber = phoneNumber;
    customer.consentState = "unknown";
    customer.lastConsentEventId = null;
  }

  const event: ConsentEvent = {
    id: generateId(),
    customerId: customer?.id ?? null,
    phoneNumber,
    timestamp: new Date().toISOString(),
    ip: createMockIpAddress(customer?.id ?? "anon"),
    channel: input.channel,
    disclosureTextVersion: "v1",
    verificationResult,
    action: input.action,
  };

  events.push(event);
  saveConsentEvents(events);

  if (customer) {
    customer.lastConsentEventId = event.id;
    customer.consentState = deriveConsentState(
      event.action,
      verificationResult
    );
    customers[index] = customer;
  } else if (input.action === "opt-in") {
    const newCustomer: Customer = {
      id: input.customerId ?? generateId(),
      phoneNumber,
      consentState: deriveConsentState(event.action, verificationResult),
      lastConsentEventId: event.id,
    };
    customers.push(newCustomer);
    event.customerId = newCustomer.id;
  }

  saveCustomers(customers);

  return { event, customer: customer ?? customers[customers.length - 1] };
}

function deriveConsentState(
  action: ConsentAction,
  verification: VerificationResult
): ConsentState {
  if (action === "opt-out") {
    return "revoked";
  }

  if (verification === "valid") {
    return "valid";
  }

  if (
    verification === "invalid" ||
    verification === "voip" ||
    verification === "landline"
  ) {
    return "pending_verification";
  }

  return "pending_verification";
}

function deriveOptOutVerification(
  events: ConsentEvent[],
  lastEventId: string | null
): VerificationResult {
  if (!lastEventId) {
    return "valid";
  }

  const lastEvent = events.find((event) => event.id === lastEventId);
  return lastEvent?.verificationResult ?? "valid";
}

function ensureCustomer(
  customers: Customer[],
  input: { customerId?: string | null; phoneNumber: string }
): { customer: Customer | null; index: number } {
  if (input.customerId) {
    const customerIndex = customers.findIndex(
      (item) => item.id === input.customerId
    );
    if (customerIndex >= 0) {
      return { customer: customers[customerIndex], index: customerIndex };
    }
  }

  const phoneIndex = customers.findIndex(
    (item) => item.phoneNumber === input.phoneNumber
  );
  if (phoneIndex >= 0) {
    return { customer: customers[phoneIndex], index: phoneIndex };
  }

  return { customer: null, index: -1 };
}

function normalizePhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, "");
  return digits.slice(-10);
}

function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2, 10);
}

function createMockIpAddress(seed: string): string {
  const hash = Array.from(seed)
    .reduce((acc, char) => acc + char.charCodeAt(0), 0)
    .toString()
    .padEnd(3, "0");
  const segment = Number(hash.slice(0, 3)) % 255;
  return `192.168.${segment}.${(segment * 7) % 255}`;
}

export function exportConsentEventsAsCsv(): string {
  const events = getConsentEvents();
  const headers = [
    "id",
    "customerId",
    "phoneNumber",
    "timestamp",
    "ip",
    "channel",
    "disclosureTextVersion",
    "verificationResult",
    "action",
  ];

  const rows = events.map((event) =>
    [
      event.id,
      event.customerId ?? "",
      event.phoneNumber,
      event.timestamp,
      event.ip,
      event.channel,
      event.disclosureTextVersion,
      event.verificationResult,
      event.action,
    ]
      .map((value) => `"${value.replace(/"/g, '""')}"`)
      .join(",")
  );

  return [headers.join(","), ...rows].join("\n");
}

export function summarizeCustomers() {
  const customers = getCustomers();
  const events = getConsentEvents();

  const consentStateCounts: Record<ConsentState, number> = {
    unknown: 0,
    pending_verification: 0,
    valid: 0,
    revoked: 0,
  };

  const channelCounts: Record<string, number> = {};
  const verificationCounts: Record<VerificationResult, number> = {
    valid: 0,
    invalid: 0,
    voip: 0,
    landline: 0,
  };

  events.forEach((event) => {
    channelCounts[event.channel] = (channelCounts[event.channel] ?? 0) + 1;
    verificationCounts[event.verificationResult] += 1;
  });

  customers.forEach((customer) => {
    consentStateCounts[customer.consentState] += 1;
  });

  return {
    customers,
    events,
    consentStateCounts,
    channelCounts,
    verificationCounts,
  };
}
