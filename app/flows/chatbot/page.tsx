"use client";

import { useState } from "react";
import ConsentForm from "../../consent/ConsentForm";
import { formatPhoneNumber } from "../../consent/PhoneNumberInput";
import {
  getCustomers,
  saveCustomers,
  type Customer,
} from "../../utils/consent";

interface Message {
  id: string;
  author: "bot" | "user";
  text: string;
}

const consentPrompt =
  "Would you like automated updates about this conversation?";

export default function ChatbotFlowPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: generateId(),
      author: "bot",
      text: "Hi! You are now connected to Ava from Atlog support.",
    },
    {
      id: generateId(),
      author: "bot",
      text: "Please provide your phone number so we can assist you.",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [knownPhoneNumber, setKnownPhoneNumber] = useState<string | null>(null);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [ctaVisible, setCtaVisible] = useState(false);
  const [showConsentForm, setShowConsentForm] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSendMessage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) {
      return;
    }

    const userMessage: Message = {
      id: generateId(),
      author: "user",
      text: trimmed,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    const digits = trimmed.replace(/\D/g, "").slice(0, 10);

    if (!knownPhoneNumber) {
      if (digits.length === 10) {
        const customerRecord = upsertCustomer(digits);
        setKnownPhoneNumber(customerRecord.phoneNumber);
        setCustomerId(customerRecord.id);

        const acknowledgement: Message = {
          id: generateId(),
          author: "bot",
          text: `Thanks! We'll use ${formatPhoneNumber(
            digits
          )} to reach you with updates.`,
        };
        const prompt: Message = {
          id: generateId(),
          author: "bot",
          text: consentPrompt,
        };
        setMessages((prev) => [...prev, acknowledgement, prompt]);
        setCtaVisible(true);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: generateId(),
            author: "bot",
            text: "Please provide your phone number so we can assist you.",
          },
        ]);
      }
      return;
    }

    const acknowledgement: Message = {
      id: generateId(),
      author: "bot",
      text: "Thanks for the update. Our team will follow up shortly.",
    };
    const prompt: Message = {
      id: generateId(),
      author: "bot",
      text: consentPrompt,
    };
    setMessages((prev) => [...prev, acknowledgement, prompt]);
    setCtaVisible(true);
  };

  const openConsentForm = () => {
    if (!knownPhoneNumber) {
      return;
    }
    setIsOpen(true);
    setShowConsentForm(true);
  };

  return (
    <div className="relative space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Chat Support</h1>
        <p className="mt-2 text-sm text-slate-600">
          Click the chat bubble to open a simulated support conversation that
          showcases proactive consent capture.
        </p>
      </section>

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`fixed bottom-8 right-8 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition hover:bg-blue-700 ${
          isOpen ? "scale-90" : "scale-100"
        }`}
        aria-expanded={isOpen}
        aria-controls="chatbot-widget"
      >
        {isOpen ? (
          <svg
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M6 6L18 18M6 18L18 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg
            className="h-7 w-7"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M21 11.5C21 6.80558 16.9706 3 12 3C7.02944 3 3 6.80558 3 11.5C3 16.1944 7.02944 20 12 20C13.3009 20 14.537 19.7509 15.6607 19.2965L20 21L18.8792 16.7173C20.2058 15.2123 21 13.4422 21 11.5Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
        <span className="sr-only">{isOpen ? "Close chat" : "Open chat"}</span>
      </button>

      {isOpen && (
        <div
          id="chatbot-widget"
          className="fixed bottom-28 right-8 z-20 flex w-full max-w-sm flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-slate-200 bg-blue-600 px-4 py-3 text-white">
            <div>
              <p className="text-sm font-semibold">Ava · Atlog Support</p>
              <p className="text-xs text-blue-100">
                Ask a question to see how consent is captured inline.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-md px-2 py-1 text-xs font-medium text-white/80 hover:bg-white/10 hover:text-white"
            >
              Hide
            </button>
          </div>
          <div className="flex h-96 flex-col bg-slate-50">
            {showConsentForm ? (
              <div className="flex-1 overflow-y-auto px-4 py-4">
                <ConsentForm
                  channel="chatbot"
                  customerId={customerId ?? undefined}
                  preFilledPhone={knownPhoneNumber ?? undefined}
                  onCancel={() => setShowConsentForm(false)}
                  onSubmitted={() => setShowConsentForm(false)}
                />
              </div>
            ) : (
              <>
                <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.author === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-3 text-sm shadow-sm ${
                          message.author === "user"
                            ? "bg-blue-600 text-white"
                            : "bg-white text-slate-700"
                        }`}
                      >
                        {message.text}
                      </div>
                    </div>
                  ))}

                  {ctaVisible && knownPhoneNumber && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] space-y-3 rounded-lg bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
                        <p>{consentPrompt}</p>
                        <button
                          type="button"
                          onClick={openConsentForm}
                          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                          Enable Automated Updates
                        </button>
                        <p className="text-xs text-slate-500">
                          Phone on file: {formatPhoneNumber(knownPhoneNumber)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <form
                  onSubmit={handleSendMessage}
                  className="flex items-center gap-3 border-t border-slate-200 bg-white px-4 py-3"
                >
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(event) => setInputValue(event.target.value)}
                    placeholder="Type a message"
                    className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    Send
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function upsertCustomer(phoneNumber: string): Customer {
  const customers = getCustomers();
  const existing = customers.find(
    (customer) => customer.phoneNumber === phoneNumber
  );

  if (existing) {
    return existing;
  }

  const newCustomer: Customer = {
    id: generateId(),
    phoneNumber,
    consentState: "unknown",
    lastConsentEventId: null,
  };

  customers.push(newCustomer);
  saveCustomers(customers);
  return newCustomer;
}

function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2, 10);
}
