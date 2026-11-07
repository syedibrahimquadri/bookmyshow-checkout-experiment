// The ticket: show details, a sample QR code, the amount paid, and "before you go" moments.

import { DIALOGUES, MUST_WATCH } from './data.js';
import { breakdown, formatINR } from './pricing.js';
import { currentCinema, state } from './state.js';

const $ = (id) => document.getElementById(id);

/** Draw a QR-like pattern. It's decorative: it doesn't encode anything. */
function drawSampleQr(canvas, seed) {
  const ctx = canvas.getContext('2d');
  const cells = 25;
  const size = canvas.width / cells;
  let n = seed;
  const random = () => {
    n = (n * 9301 + 49297) % 233280;
    return n / 233280;
  };
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#1B1A24';
  const finder = (x, y) => {
    ctx.fillRect(x * size, y * size, 7 * size, 7 * size);
    ctx.fillStyle = '#fff';
    ctx.fillRect((x + 1) * size, (y + 1) * size, 5 * size, 5 * size);
    ctx.fillStyle = '#1B1A24';
    ctx.fillRect((x + 2) * size, (y + 2) * size, 3 * size, 3 * size);
  };
  const inFinder = (x, y) => (x < 8 && y < 8) || (x > cells - 9 && y < 8) || (x < 8 && y > cells - 9);
  for (let y = 0; y < cells; y += 1) {
    for (let x = 0; x < cells; x += 1) {
      if (!inFinder(x, y) && random() > 0.52) ctx.fillRect(x * size, y * size, size, size);
    }
  }
  finder(0, 0);
  finder(cells - 7, 0);
  finder(0, cells - 7);
}

export function renderTicket() {
  const b = breakdown(state.seats);
  $('tkWhen').textContent = `Sun, 8 Nov, ${state.time}`;
  $('tkWhere').textContent = currentCinema().name;
  $('tkSeats').textContent = state.seats.join(', ');
  $('tkTotal').textContent = formatINR(b.total);
  $('tkNote').textContent = `${formatINR(b.tickets)} tickets + ${formatINR(b.fee)} convenience fee`;

  $('before').hidden = !state.moments;
  $('beforeList').innerHTML = MUST_WATCH.map(
    (m) => `<li><span class="at">${m.time}</span><div><b>${m.title}</b><p>${m.text}</p></div></li>`,
  ).join('');
  const line = DIALOGUES[2];
  $('shout').innerHTML = `<p class="kicker">The line to shout with the theatre</p><blockquote lang="hi">${line.hindi}</blockquote><p class="english">${line.english}</p>`;

  drawSampleQr($('qr'), state.seats.join('').length * 7919 + 17);
}
