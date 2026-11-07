// Seat map with the "How many seats?" sheet. The sheet opens when the user arrives from showtimes;
// after choosing a number, one tap on the map selects that many seats side by side.

import { MAX_SEATS, SECTIONS, SOLD } from './data.js';
import { formatINR, seatBarAmount, seatPriceLabel, sectionOfRow } from './pricing.js';
import { nextSelection, sectionStatus } from './seatpick.js';
import { currentCinema, state } from './state.js';

const $ = (id) => document.getElementById(id);
const SLOTS = 12; // seats per full row; shorter rows are centred
const isSold = (id) => SOLD.has(id);
const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

let draftQty = state.qty; // the number highlighted in the sheet before "Select seats"

function seatButton(id) {
  const sold = isSold(id);
  const selected = state.seats.includes(id);
  const cls = sold ? 'seat sold' : selected ? 'seat sel' : 'seat';
  return `<button class="${cls}" data-seat="${id}" ${sold ? 'disabled' : ''} aria-pressed="${selected}" aria-label="Seat ${id}${sold ? ', sold' : ''}">${id.slice(1)}</button>`;
}

function rowMarkup(row, count) {
  const offset = (SLOTS - count) / 2;
  const cells = [];
  for (let slot = 1; slot <= SLOTS; slot += 1) {
    const n = slot - offset;
    if (slot === SLOTS / 2 + 1) cells.push('<span class="aisle"></span>');
    cells.push(n >= 1 && n <= count ? seatButton(`${row}${n}`) : '<span class="gap"></span>');
  }
  return `<div class="row"><span class="row-id">${row}</span>${cells.join('')}</div>`;
}

/** Seats sold in a section, for its "Almost full" or "Filling fast" label. */
function soldIn(section) {
  let sold = 0;
  for (const row of section.rows) for (let n = 1; n <= section.seatsPerRow; n += 1) if (isSold(`${row}${n}`)) sold += 1;
  return sold;
}

/** A row of cinema seats that grows with the number chosen: an original illustration. */
function seatArt(n) {
  const seat = (i) => `
    <svg viewBox="0 0 40 40" class="art-seat" style="animation-delay:${i * 30}ms"><path d="M8 18a4 4 0 0 1 4-4h16a4 4 0 0 1 4 4v8H8z" fill="#E8374F"/><rect x="6" y="24" width="28" height="7" rx="3" fill="#B91E36"/><rect x="9" y="31" width="3" height="5" rx="1" fill="#1E2235"/><rect x="28" y="31" width="3" height="5" rx="1" fill="#1E2235"/></svg>`;
  return Array.from({ length: n }, (_, i) => seat(i)).join('');
}

function renderSheet() {
  $('qtyArt').innerHTML = seatArt(draftQty);
  $('qtyRow').innerHTML = Array.from({ length: MAX_SEATS }, (_, i) => i + 1)
    .map((n) => `<button role="radio" aria-checked="${n === draftQty}" data-qty="${n}">${n}</button>`)
    .join('');
  $('qtySections').innerHTML = SECTIONS.map((section) => {
    const { price, note } = seatPriceLabel(section.price);
    const status = sectionStatus(soldIn(section), section.rows.length * section.seatsPerRow);
    return `<div class="qty-section ${status.tone}"><span class="nm">${section.name}</span><b class="num">${price}</b><small>${note}</small><span class="st">${status.label}</span></div>`;
  }).join('');
}

export function openQtySheet() {
  draftQty = state.qty;
  renderSheet();
  $('qtySheet').hidden = false;
  $('qtyConfirm').focus({ preventScroll: true });
}

export function closeQtySheet() {
  $('qtySheet').hidden = true;
}

export function renderSeats() {
  const cinema = currentCinema();
  $('seatShowLine').textContent = `${cinema.name}, Sun 8 Nov`;
  $('qtyPillText').textContent = plural(state.qty, 'ticket');
  $('seatTimes').innerHTML = cinema.times
    .map((t) => `<button class="time${t === state.time ? ' on' : ''}" data-time="${t}" aria-pressed="${t === state.time}">${t}</button>`)
    .join('');

  $('seatmap').innerHTML = SECTIONS.map((section) => {
    const { price, note } = seatPriceLabel(section.price);
    return `
      <div class="section">
        <p class="section-head">${section.name} <b class="num">${price}</b> <span>${note}</span></p>
        ${section.rows.map((row) => rowMarkup(row, section.seatsPerRow)).join('')}
      </div>`;
  }).join('');

  const count = state.seats.length;
  const missing = state.qty - count;
  if (count === 0) {
    $('seatAmount').textContent = '';
    $('seatNote').textContent = `Tap a seat to pick ${plural(state.qty, 'seat')}`;
  } else {
    const { amount, note } = seatBarAmount(state.seats);
    $('seatAmount').textContent = formatINR(amount);
    $('seatNote').textContent = missing > 0 ? `Pick ${plural(missing, 'more seat')}` : `${note} · ${state.seats.join(', ')}`;
  }
  $('seatCta').disabled = count === 0 || missing !== 0;
}

export function initSeats() {
  $('seatmap').addEventListener('click', (event) => {
    const seat = event.target.closest('[data-seat]');
    if (!seat || seat.disabled) return;
    const rowLength = sectionOfRow(seat.dataset.seat[0]).seatsPerRow;
    state.seats = nextSelection(state.seats, seat.dataset.seat, state.qty, rowLength, isSold);
    renderSeats();
  });

  $('seatTimes').addEventListener('click', (event) => {
    const button = event.target.closest('[data-time]');
    if (!button) return;
    state.time = button.dataset.time;
    renderSeats();
  });

  $('qtyPill').addEventListener('click', openQtySheet);

  $('qtyRow').addEventListener('click', (event) => {
    const button = event.target.closest('[data-qty]');
    if (!button) return;
    draftQty = Number(button.dataset.qty);
    renderSheet();
  });

  $('qtyConfirm').addEventListener('click', () => {
    if (draftQty !== state.qty) state.seats = [];
    state.qty = draftQty;
    closeQtySheet();
    renderSeats();
  });

  // Tapping the dimmed seat map closes the sheet without changing anything.
  $('qtySheet').addEventListener('click', (event) => {
    if (event.target === $('qtySheet')) closeQtySheet();
  });
}
