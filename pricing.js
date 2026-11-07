// Pure pricing logic. No DOM access, so it can be unit tested.
// Transparent pricing: every price shown before checkout already includes the convenience fee,
// so the amount at checkout matches what the user saw on the seat map.

import { FEE_PER_TICKET, SECTIONS } from './data.js';

const inr = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });

/** 1234 -> "₹1,234". All prices in this prototype are whole rupees. */
export const formatINR = (amount) => `${amount < 0 ? '−' : ''}₹${inr.format(Math.abs(Math.round(amount)))}`;

/** 125 -> "2:05". */
export function formatClock(seconds) {
  const s = Math.max(0, Math.floor(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export const sectionOfRow = (row) => SECTIONS.find((s) => s.rows.includes(row));
export const basePrice = (seatId) => sectionOfRow(seatId[0]).price;
export const lowestBasePrice = () => Math.min(...SECTIONS.map((s) => s.price));

/** Totals for a set of seat ids like ["D6","D7"]. */
export function breakdown(seatIds) {
  const tickets = seatIds.reduce((sum, id) => sum + basePrice(id), 0);
  const fee = FEE_PER_TICKET * seatIds.length;
  return { count: seatIds.length, tickets, fee, total: tickets + fee };
}

/** One seat's price as shown before checkout: ticket plus fee, and it says so. */
export const seatPriceLabel = (base) => ({ price: formatINR(base + FEE_PER_TICKET), note: `incl. ${formatINR(FEE_PER_TICKET)} fee` });

/** "From ₹199 incl. ₹49 fee" on the showtimes page. */
export function fromPriceLabel() {
  const { price, note } = seatPriceLabel(lowestBasePrice());
  return `From ${price} ${note}`;
}

/** What the seat-map bottom bar shows: the full amount, fees included. */
export function seatBarAmount(seatIds) {
  const b = breakdown(seatIds);
  return { amount: b.total, note: `incl. ${formatINR(b.fee)} fees` };
}

/** The lines on the booking summary: one per seat section, then the fee. */
export function summaryLines(seatIds) {
  const bySection = new Map();
  for (const id of seatIds) {
    const section = sectionOfRow(id[0]);
    const line = bySection.get(section.id) ?? { label: section.name, count: 0, amount: 0 };
    line.count += 1;
    line.amount += section.price;
    bySection.set(section.id, line);
  }
  const ticketLines = [...bySection.values()].map((l) => ({ label: `${l.count} × ${l.label}`, amount: l.amount }));
  return [...ticketLines, { label: 'Convenience fee (incl. GST)', amount: breakdown(seatIds).fee, isFee: true }];
}

/** Seats grouped by section code, as on the booking summary: "CL-D6,D7" or "CL-D6 | RC-J1". */
export function seatCodeLine(seatIds, codes) {
  const groups = new Map();
  for (const id of seatIds) {
    const code = codes[sectionOfRow(id[0]).id];
    groups.set(code, [...(groups.get(code) ?? []), id]);
  }
  return [...groups].map(([code, ids]) => `${code}-${ids.join(',')}`).join(' | ');
}

/** How much the price grows between the seat map and checkout. Zero means no surprise. */
export const priceJump = (seatIds) => breakdown(seatIds).total - seatBarAmount(seatIds).amount;
