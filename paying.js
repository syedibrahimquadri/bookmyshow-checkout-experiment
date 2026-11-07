// Payment in progress: the approval status, the request countdown, and the movie moments carousel.

import { PAYING_DECK, UPI_REQUEST_SECONDS } from './data.js';
import { breakdown, formatClock, formatINR } from './pricing.js';
import { createCarousel } from './moments.js';
import { state } from './state.js';

const $ = (id) => document.getElementById(id);
const RING_LENGTH = 2 * Math.PI * 28;

const COPY = {
  upi: (amount) => ({ title: `Approve ${amount} in your UPI app`, sub: 'Open any UPI app on this phone and approve the request.' }),
  card: (amount) => ({ title: `Confirm ${amount} with your bank`, sub: 'Enter the OTP your bank sends to finish paying.' }),
  later: (amount) => ({ title: `Setting up Pay later for ${amount}`, sub: 'This usually takes a few seconds.' }),
};

let requestLeft = UPI_REQUEST_SECONDS;
let requestTimer = null;
let carousel;

export function renderPaying() {
  const amount = formatINR(breakdown(state.seats).total);
  const { title, sub } = COPY[state.method](amount);
  $('payTitle').textContent = title;
  $('paySub').textContent = sub;
  $('lockedSeats').textContent = `Seats ${state.seats.join(', ')} are locked for you while you pay`;
  $('moments').hidden = !state.moments;
  $('plainWait').hidden = state.moments;
  $('reqClock').textContent = formatClock(requestLeft);
}

function drawRing() {
  const arc = document.querySelector('.ring .arc');
  arc.style.strokeDasharray = String(RING_LENGTH);
  arc.style.strokeDashoffset = String(RING_LENGTH * (1 - requestLeft / UPI_REQUEST_SECONDS));
}

/** Called when the paying screen opens. */
export function startPaying() {
  requestLeft = UPI_REQUEST_SECONDS;
  renderPaying();
  drawRing();
  clearInterval(requestTimer);
  requestTimer = setInterval(() => {
    requestLeft = Math.max(0, requestLeft - 1);
    $('reqClock').textContent = formatClock(requestLeft);
    drawRing();
  }, 1000);
  carousel.rewind();
  if (state.moments) carousel.start();
}

/** Called when the paying screen closes. */
export function stopPaying() {
  clearInterval(requestTimer);
  carousel.stop();
}

export function initPaying() {
  carousel = createCarousel($('payingCarousel'), $('payingDots'), PAYING_DECK);
}
