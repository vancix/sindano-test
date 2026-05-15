export type OperatorName =
  | "Vodacom"
  | "Airtel"
  | "Tigo"
  | "Halotel"
  | "TTCL"
  | "Unknown";

export interface OperatorResult {
  operator: OperatorName;
  normalized: string;
  prefix: string;
}

const PREFIX_MAP: Record<string, OperatorName> = {
  "74": "Vodacom",
  "75": "Vodacom",
  "76": "Vodacom",
  "79": "Vodacom",
  "78": "Airtel",
  "68": "Airtel",
  "69": "Airtel",
  "71": "Tigo",
  "65": "Tigo",
  "67": "Tigo",
  "62": "Halotel",
  "73": "TTCL",
  "77": "TTCL",
};

/** Normalize Tanzanian MSISDN to local 0XXXXXXXXX form. */
export function normalizePhoneNumber(input: string): string {
  let digits = input.replace(/\D/g, "");

  if (digits.startsWith("255")) {
    digits = `0${digits.slice(3)}`;
  } else if (digits.length === 9 && !digits.startsWith("0")) {
    digits = `0${digits}`;
  }

  return digits;
}

export function detectOperator(phone: string): OperatorResult {
  const normalized = normalizePhoneNumber(phone);
  const prefix = normalized.length >= 3 ? normalized.slice(1, 3) : "";
  const operator = PREFIX_MAP[prefix] ?? "Unknown";

  return { operator, normalized, prefix };
}

export function isValidTzMobile(phone: string): boolean {
  const normalized = normalizePhoneNumber(phone);
  return /^0[67]\d{8}$/.test(normalized);
}
