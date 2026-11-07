// Pure seat-picking logic, like the real app: choose how many seats first,
// then one tap selects that many seats side by side. No DOM access, so it can be unit tested.

/**
 * The longest run of free seats (up to `qty`) around the tapped seat in one row:
 * first to the right of it, then to the left if the row runs out or hits a taken seat.
 * @param {string} row         Row letter, e.g. "D"
 * @param {number} start       Tapped seat number
 * @param {number} qty         How many seats to pick
 * @param {number} rowLength   Seats in the row
 * @param {(id: string) => boolean} isTaken
 */
export function pickBlock(row, start, qty, rowLength, isTaken) {
  if (isTaken(`${row}${start}`)) return [];
  const picked = [start];
  for (let n = start + 1; picked.length < qty && n <= rowLength && !isTaken(`${row}${n}`); n += 1) picked.push(n);
  for (let n = start - 1; picked.length < qty && n >= 1 && !isTaken(`${row}${n}`); n -= 1) picked.unshift(n);
  return picked.map((n) => `${row}${n}`);
}

/**
 * What the selection becomes after tapping a seat.
 * - Tapping a selected seat removes it.
 * - With nothing selected, or a full selection, the tap starts a new group of `qty` seats.
 * - With a partial selection (the row had no room), the tap adds the seats still needed.
 */
export function nextSelection(current, tappedId, qty, rowLength, isSold) {
  if (current.includes(tappedId)) return current.filter((id) => id !== tappedId);
  const row = tappedId[0];
  const start = Number(tappedId.slice(1));
  if (current.length === 0 || current.length >= qty) {
    return pickBlock(row, start, qty, rowLength, isSold);
  }
  const taken = (id) => isSold(id) || current.includes(id);
  return [...current, ...pickBlock(row, start, qty - current.length, rowLength, taken)];
}

/** How full a seat section is, as shown in the "How many seats?" sheet. */
export function sectionStatus(soldCount, totalSeats) {
  const share = soldCount / totalSeats;
  if (share >= 1) return { label: 'Sold out', tone: 'out' };
  if (share >= 0.5) return { label: 'Almost full', tone: 'warn' };
  if (share >= 0.22) return { label: 'Filling fast', tone: 'warn' };
  return { label: 'Available', tone: 'ok' };
}
