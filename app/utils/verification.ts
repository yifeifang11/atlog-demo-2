export type VerificationResult = "valid" | "invalid" | "voip" | "landline";

export function mockLookupVerification(
  phoneNumber: string
): VerificationResult {
  const digits = phoneNumber.replace(/\D/g, "");
  const lastDigitChar = digits.slice(-1);
  const lastDigit = Number(lastDigitChar);

  if (!lastDigitChar) {
    return "invalid";
  }

  if (lastDigitChar === "0") {
    return "landline";
  }
  if (lastDigitChar === "2") {
    return "voip";
  }
  if (lastDigitChar === "4") {
    return "invalid";
  }
  if (lastDigit % 2 === 1) {
    return "valid";
  }

  return "valid";
}
