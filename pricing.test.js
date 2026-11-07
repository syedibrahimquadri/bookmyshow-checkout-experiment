import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  breakdown, formatClock, formatINR, fromPriceLabel, priceJump, seatBarAmount, seatCodeLine, seatPriceLabel, summaryLines,
} from './pricing.js';
import { nextSelection, pickBlock, sectionStatus } from './seatpick.js';

const SEATS = ['D6', 'D7']; // two Classic seats at ₹150

test('formatINR uses Indian grouping', () => {
  assert.equal(formatINR(398), '₹398');
  assert.equal(formatINR(123456), '₹1,23,456');
  assert.equal(formatINR(-49), '−₹49');
});

test('breakdown adds a ₹49 fee per ticket', () => {
  assert.deepEqual(breakdown(SEATS), { count: 2, tickets: 300, fee: 98, total: 398 });
  assert.deepEqual(breakdown(['J1']), { count: 1, tickets: 350, fee: 49, total: 399 });
});

test('prices before checkout include the fee and say so', () => {
  assert.deepEqual(seatPriceLabel(150), { price: '₹199', note: 'incl. ₹49 fee' });
  assert.equal(fromPriceLabel(), 'From ₹199 incl. ₹49 fee');
  assert.deepEqual(seatBarAmount(SEATS), { amount: 398, note: 'incl. ₹98 fees' });
});

test('the checkout total matches the seat map, so there is no surprise', () => {
  assert.equal(priceJump(SEATS), 0);
  assert.equal(priceJump(['J1', 'E1', 'A5']), 0);
});

test('summary lines add up to the total, one line per section plus the fee', () => {
  assert.equal(summaryLines(SEATS).reduce((s, l) => s + l.amount, 0), 398);
  assert.deepEqual(summaryLines(['D6', 'J1']).map((l) => l.label), ['1 × Classic', '1 × Recliner', 'Convenience fee (incl. GST)']);
});

test('seat code line groups seats by section', () => {
  const codes = { recliner: 'RC', prime: 'PR', classic: 'CL' };
  assert.equal(seatCodeLine(SEATS, codes), 'CL-D6,D7');
  assert.equal(seatCodeLine(['D6', 'J1', 'D7'], codes), 'CL-D6,D7 | RC-J1');
});

test('formatClock pads seconds', () => {
  assert.equal(formatClock(480), '8:00');
  assert.equal(formatClock(65), '1:05');
  assert.equal(formatClock(-1), '0:00');
});


const sold = (ids) => (id) => ids.includes(id);

test('one tap picks a group of seats side by side', () => {
  assert.deepEqual(pickBlock('D', 6, 2, 12, sold([])), ['D6', 'D7']);
  assert.deepEqual(pickBlock('D', 12, 3, 12, sold([])), ['D10', 'D11', 'D12'], 'end of row: extends left');
  assert.deepEqual(pickBlock('C', 5, 3, 12, sold(['C6'])), ['C3', 'C4', 'C5'], 'blocked on the right: extends left');
  assert.deepEqual(pickBlock('C', 6, 2, 12, sold(['C6'])), [], 'tapping a sold seat picks nothing');
});

test('selection follows the real app rules', () => {
  assert.deepEqual(nextSelection([], 'D6', 2, 12, sold([])), ['D6', 'D7']);
  assert.deepEqual(nextSelection(['D6', 'D7'], 'E1', 2, 12, sold([])), ['E1', 'E2'], 'a full group moves on a new tap');
  assert.deepEqual(nextSelection(['D6', 'D7'], 'D7', 2, 12, sold([])), ['D6'], 'tapping a selected seat removes it');
  assert.deepEqual(nextSelection(['D6'], 'E5', 2, 12, sold([])), ['D6', 'E5'], 'a partial group adds what is missing');
  // Row C has only seat 5 free between sold C4 and C6: the user gets 1 seat and taps again for the rest.
  assert.deepEqual(nextSelection([], 'C5', 2, 12, sold(['C4', 'C6'])), ['C5']);
});

test('section status depends on how full it is', () => {
  assert.equal(sectionStatus(8, 8).label, 'Sold out');
  assert.equal(sectionStatus(5, 8).label, 'Almost full');
  assert.equal(sectionStatus(11, 48).label, 'Filling fast');
  assert.equal(sectionStatus(10, 48).label, 'Available');
});
