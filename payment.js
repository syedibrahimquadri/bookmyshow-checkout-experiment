// Payment options: amount, one short movie teaser, payment methods, and the seat-hold countdown.

import { HOLD_SECONDS, PAYMENT_METHODS, TEASER } from './data.js';
import { breakdown, formatClock, formatINR } from './pricing.js';
import { state } from './state.js';
import { toast } from './toast.js';

const $ = (id) => document.getElementById(id);

let holdLeft = HOLD_SECONDS;
let holdTimer = null;

export function renderPayment() {
  const total = formatINR(breakdown(state.seats).total);
  $('payStripAmount').textContent = total;
  $('teaser').hidden = !state.moments;
  $('teaserText').textContent = TEASER;
  $('methods').innerHTML = PAYMENT_METHODS.map(
    (m) => `<button class="method" role="radio" aria-checked="${m.id === state.method}" data-method="${m.id}"><span class="radio" aria-hidden="true"></span><span><b>${m.label}</b><small>${m.detail}</small></span></button>`,
  ).join('');
  $('payAmount').textContent = total;
  $('payCta').textContent = `Pay ${total}`;
  $('holdClock').textContent = formatClock(holdLeft);
}

function tick() {
  holdLeft -= 1;
  $('holdClock').textContent = formatClock(holdLeft);
  $('holdTimer').classList.toggle('low', holdLeft <= 60);
  if (holdLeft <= 0) {
    stopHold();
    holdLeft = HOLD_SECONDS;
    toast('Seat hold ran out. In the real app your seats would be released.');
  }
}

/** The seat hold runs on Confirm booking and Payment options, and pauses while paying. */
export function startHold() {
  if (holdTimer) return;
  holdTimer = setInterval(tick, 1000);
}

export function stopHold() {
  clearInterval(holdTimer);
  holdTimer = null;
}

export function resetHold() {
  stopHold();
  holdLeft = HOLD_SECONDS;
  $('holdClock').textContent = formatClock(holdLeft);
  $('holdTimer').classList.remove('low');
}

/** @param {{ onChange: () => void }} handlers */
export function initPayment({ onChange }) {
  $('methods').addEventListener('click', (event) => {
    const option = event.target.closest('[data-method]');
    if (!option) return;
    state.method = option.dataset.method;
    onChange();
  });
}
