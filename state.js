import { CINEMAS, SHOW } from './data.js';

// One shared, mutable state object for the whole prototype.
export const state = {
  moments: true, // movie moments on or off
  cinemaId: SHOW.cinemaId,
  time: SHOW.time,
  qty: 2, // how many seats the user asked for in the "How many seats?" sheet
  seats: [], // selected seat ids
  method: 'upi',
};

export const currentCinema = () => CINEMAS.find((c) => c.id === state.cinemaId);
