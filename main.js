import './index.css';

import { DEMO_SEATS } from './data.js';
import { initNavigation, onScreenChange } from './navigation.js';
import { state } from './state.js';
import { renderShows } from './shows.js';
import { closeQtySheet, initSeats, openQtySheet, renderSeats } from './seats.js';
import { initCheckout, renderCheckout, startConfirmMoments, stopConfirmMoments } from './checkout.js';
import { initPayment, renderPayment, resetHold, startHold, stopHold } from './payment.js';
import { initPaying, renderPaying, startPaying, stopPaying } from './paying.js';
import { renderTicket } from './ticket.js';
import { toast } from './toast.js';
import { initFitToScreen } from './fit.js';

const ensureSeats = () => {
  if (state.seats.length === 0) {
    state.seats = [...DEMO_SEATS];
    state.qty = DEMO_SEATS.length;
  }
};

function renderAll() {
  renderShows();
  renderSeats();
  if (state.seats.length) {
    renderCheckout();
    renderPayment();
    renderPaying();
    renderTicket();
  }
}

/** Start or stop timers and carousels for whichever screen is showing. */
function onScreen(screen) {
  document.querySelector('.screen-wrap').dataset.screen = screen;
  if (screen !== 'seats') closeQtySheet();

  if (screen === 'summary' || screen === 'payment') startHold();
  else stopHold();

  if (screen === 'summary') startConfirmMoments();
  else stopConfirmMoments();

  if (screen === 'paying') startPaying();
  else stopPaying();

  if (screen === 'ticket') resetHold();
}

initSeats();
initCheckout();
initPayment({ onChange: renderAll });
initPaying();

initNavigation({
  beforeShow(screenId, trigger) {
    if (screenId === 'seats' && trigger.dataset.cinema) {
      if (trigger.dataset.cinema !== state.cinemaId) state.seats = [];
      state.cinemaId = trigger.dataset.cinema;
      state.time = trigger.dataset.time;
      state.seats = [];
      renderSeats();
      openQtySheet(); // like the real app, ask how many seats before showing the map
    }
    if (screenId === 'summary' && state.seats.length === 0) return false;
    if (screenId !== 'seats') renderAll();
    return true;
  },
  beforeJump(screenId) {
    if (screenId === 'seats' && state.seats.length === 0) openQtySheet();
    else closeQtySheet();
    if (['summary', 'payment', 'paying', 'ticket'].includes(screenId)) ensureSeats();
    renderAll();
  },
  onReset() {
    state.seats = [];
    resetHold();
    renderAll();
  },
});

onScreenChange(onScreen);

document.addEventListener('click', (event) => {
  const trigger = event.target.closest('[data-toast]');
  if (trigger) toast(trigger.dataset.toast || 'Not connected in this prototype.');
});

renderAll();
initFitToScreen();
