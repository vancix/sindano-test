/** Build a tel: URI with proper USSD encoding (* and #). */
export function buildTelUri(code: string): string {
  const trimmed = code.trim();
  if (trimmed.startsWith("tel:")) return trimmed;
  if (/[*#]/.test(trimmed)) {
    return `tel:${encodeURIComponent(trimmed)}`;
  }
  return `tel:${trimmed.replace(/\D/g, "") || trimmed}`;
}

export function dial(code: string): void {
  window.location.href = buildTelUri(code);
}

/** Vodacom-style recharge: *104*{15-digit voucher}# */
export function buildRechargeUssd(voucherCode: string): string {
  const digits = voucherCode.replace(/\D/g, "");
  return `*104*${digits}#`;
}

export function dialRecharge(voucherCode: string): void {
  dial(buildRechargeUssd(voucherCode));
}
