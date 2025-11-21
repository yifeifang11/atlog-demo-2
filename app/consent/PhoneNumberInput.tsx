"use client";

import type { ChangeEvent } from "react";

interface PhoneNumberInputProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
}

export default function PhoneNumberInput({
  value,
  onChange,
  required,
  disabled,
}: PhoneNumberInputProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const digits = event.target.value.replace(/\D/g, "").slice(0, 10);
    onChange(digits);
  };

  return (
    <input
      type="tel"
      inputMode="tel"
      value={formatPhoneNumber(value)}
      required={required}
      disabled={disabled}
      onChange={handleChange}
      placeholder="(555) 123-4567"
      className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-base shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-slate-100"
    />
  );
}

export function formatPhoneNumber(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 10);
  const part1 = digits.slice(0, 3);
  const part2 = digits.slice(3, 6);
  const part3 = digits.slice(6, 10);

  if (digits.length <= 3) {
    return part1;
  }
  if (digits.length <= 6) {
    return `(${part1}) ${part2}`;
  }
  return `(${part1}) ${part2}-${part3}`;
}
