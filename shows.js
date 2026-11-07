// Showtimes: cinemas and times, with the "from" price that already includes the fee.

import { CINEMAS } from './data.js';
import { fromPriceLabel } from './pricing.js';

const $ = (id) => document.getElementById(id);

export function renderShows() {
  $('fromPrice').textContent = `Tickets ${fromPriceLabel().replace('From', 'from')}`;
  $('cinemas').innerHTML = CINEMAS.map(
    (cinema) => `
      <article class="cinema">
        <h3>${cinema.name}</h3>
        <p>${cinema.note}</p>
        <div class="time-list">
          ${cinema.times
            .map(
              (time) => `<button class="time${cinema.fastFilling === time ? ' filling' : ''}" data-go="seats" data-cinema="${cinema.id}" data-time="${time}">${time}${cinema.fastFilling === time ? '<small>Fast filling</small>' : ''}</button>`,
            )
            .join('')}
        </div>
      </article>`,
  ).join('');
}
