/** Extract Tanzanian airtime voucher digits (typically 12–16 digits). */
export function extractVoucherCode(ocrText: string): string | null {
  const cleaned = ocrText.replace(/[OIl|]/g, (c) => {
    if (c === "O" || c === "o") return "0";
    if (c === "I" || c === "l" || c === "|") return "1";
    return c;
  });

  const candidates = cleaned.match(/\d{12,16}/g);
  if (!candidates?.length) return null;

  return candidates.sort((a, b) => b.length - a.length)[0] ?? null;
}

export function formatVoucherDisplay(code: string): string {
  const d = code.replace(/\D/g, "");
  return d.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}
