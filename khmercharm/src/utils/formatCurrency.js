// ─────────────────────────────────────────────
//  Currency formatting helpers
//  1 USD ≈ 4,000 KHR
// ─────────────────────────────────────────────
export const USD_TO_KHR = 4000;

export function formatUSD(value) {
  const n = Number(value) || 0;
  return `$${n.toFixed(2)}`;
}

export function formatKHR(value) {
  const n = Math.round(Number(value) || 0);
  return `${n.toLocaleString()}៛`;
}

// Display dual price like "$12.00 / 48,000៛"
export function formatDualPrice(usd, khr) {
  const khrFinal = khr ?? Math.round(Number(usd) * USD_TO_KHR);
  return `${formatUSD(usd)} / ${formatKHR(khrFinal)}`;
}

// Convert USD → KHR if KHR not provided
export function usdToKhr(usd) {
  return Math.round(Number(usd) * USD_TO_KHR);
}
