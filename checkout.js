// Confirm booking: mirrors the real screen (summary, cancellation note, price details, contact,
// offers, consent) and uses its empty space for movie moments before the user pays.

import { CONFIRM_DECK, CONTACT, FEE_PER_TICKET, SECTION_CODES } from './data.js';
import { breakdown, formatINR, seatBarAmount, seatCodeLine, summaryLines } from './pricing.js';
import { createCarousel } from './moments.js';
import { currentCinema, state } from './state.js';

const $ = (id) => document.getElementById(id);
let carousel;

export function renderCheckout() {
  const b = breakdown(state.seats);
  $('sumWhen').textContent = `Sun, 8 Nov, 2026 | ${state.time}`;
  $('sumSeats').textContent = seatCodeLine(state.seats, SECTION_CODES);
  $('sumWhere').textContent = `${currentCinema().name} (AUDI 2)`;
  $('sumCount').textContent = String(b.count);

  $('sumTickets').textContent = formatINR(b.tickets);
  $('sumFee').textContent = formatINR(b.fee);
  $('sumTotal').textContent = formatINR(b.total);
  $('ticketsBreak').innerHTML = summaryLines(state.seats)
    .filter((l) => !l.isFee)
    .map((l) => `<div class="line"><span>${l.label}</span><span class="num">${formatINR(l.amount)}</span></div>`)
    .join('');
  $('feeBreak').innerHTML = `<div class="line"><span>${formatINR(FEE_PER_TICKET)} × ${b.count}, incl. GST</span><span class="num">${formatINR(b.fee)}</span></div>`;
  $('sumNote').textContent = `Same ${formatINR(seatBarAmount(state.seats).amount)} you saw on the seat map. No surprises.`;

  $('contactLine').textContent = `${CONTACT.phone} | ${CONTACT.email}`;
  $('contactState').textContent = `${CONTACT.state} (for GST purposes)`;

  $('confirmMoments').hidden = !state.moments;
  $('confirmAmount').textContent = formatINR(b.total);
}

/** Called when the Confirm booking screen opens or closes. */
export function startConfirmMoments() {
  if (!state.moments) return;
  carousel.rewind();
  carousel.start();
}
export const stopConfirmMoments = () => carousel.stop();

export function initCheckout() {
  carousel = createCarousel($('confirmCarousel'), $('confirmDots'), CONFIRM_DECK);

  // Tap "Ticket(s) price" or "Convenience fees" to see the breakdown, as in the real app.
  document.querySelectorAll('#summary [data-expand]').forEach((row) => {
    row.addEventListener('click', () => {
      const panel = $(row.dataset.expand);
      panel.hidden = !panel.hidden;
      row.setAttribute('aria-expanded', String(!panel.hidden));
    });
  });
}
