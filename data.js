// Sample movie, shows, seats and movie moments. Everything here is made up for the prototype:
// the film, its dialogues, scenes, trivia, cinemas and prices.

export const MOVIE = {
  title: 'Daroga Dilwala',
  titleHindi: 'दरोगा दिलवाला',
  genre: 'Action, Comedy',
  certificate: 'UA13+',
  language: 'Hindi',
  runtime: '2h 34m',
  rating: '8.6/10',
  votes: '48.2K votes',
};

export const DATES = [
  { id: 'sat', day: 'SAT', date: '7', month: 'NOV' },
  { id: 'sun', day: 'SUN', date: '8', month: 'NOV' },
  { id: 'mon', day: 'MON', date: '9', month: 'NOV' },
];

export const CINEMAS = [
  { id: 'galaxy', name: 'Galaxy Cinemas: Indiranagar', note: 'Cancellation available', times: ['10:30 AM', '2:15 PM', '7:15 PM', '10:40 PM'], fastFilling: '7:15 PM' },
  { id: 'regal', name: 'Regal Multiplex: Koramangala', note: 'Food and beverage', times: ['11:00 AM', '4:30 PM', '9:00 PM'] },
  { id: 'nova', name: 'Nova Screens: MG Road', note: 'Recliners available', times: ['1:00 PM', '6:45 PM'] },
];

/** The show the prototype books. */
export const SHOW = { cinemaId: 'galaxy', dateId: 'sun', time: '7:15 PM', screen: 'Audi 2' };

/** Seat sections, back to front, the way a seat map is drawn. Base prices before the convenience fee. */
export const SECTIONS = [
  { id: 'recliner', name: 'Recliner', price: 350, rows: ['J'], seatsPerRow: 8 },
  { id: 'prime', name: 'Prime', price: 200, rows: ['H', 'G', 'F', 'E'], seatsPerRow: 12 },
  { id: 'classic', name: 'Classic', price: 150, rows: ['D', 'C', 'B', 'A'], seatsPerRow: 12 },
];

/** Seats already sold. */
export const SOLD = new Set([
  'J1', 'J2', 'J3', 'J4', 'J7', 'H5', 'H6', 'H7', 'G1', 'G2', 'G11', 'G12', 'F6', 'F7', 'E3', 'E4', 'E9',
  'D1', 'D2', 'C6', 'C7', 'C8', 'B11', 'B12', 'A1', 'A2',
]);

/** Seats picked automatically when someone jumps ahead from the guide panel. */
export const DEMO_SEATS = ['D6', 'D7'];

/** Convenience fee per ticket, including GST (raised from ₹30 to ₹49 in the scenario). */
export const FEE_PER_TICKET = 49;
export const OLD_FEE_PER_TICKET = 30;

export const MAX_SEATS = 10;
export const DEFAULT_QTY = 2;
export const HOLD_SECONDS = 8 * 60;
export const UPI_REQUEST_SECONDS = 5 * 60;

export const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI', detail: 'Approve in any UPI app' },
  { id: 'card', label: 'Credit or debit card', detail: 'Visa ••4821, saved' },
  { id: 'later', label: 'Pay later', detail: 'Pay in 15 days, no extra fee' },
];

/** Movie moments: shown while the payment processes and on the ticket. */
export const DIALOGUES = [
  {
    id: 'darr',
    hindi: 'डर से नहीं, दिल से चलते हैं। और दिल हमारा थाना है।',
    roman: 'Darr se nahi, dil se chalte hain. Aur dil hamara thana hai.',
    english: 'We run on heart, not fear. And our heart is a police station.',
    buzz: 'Used in 2.1 crore reels since the trailer dropped',
  },
  {
    id: 'naam',
    hindi: 'गोली की ज़रूरत नहीं पड़ती, जब नाम ही काफ़ी हो।',
    roman: 'Goli ki zaroorat nahi padti, jab naam hi kaafi ho.',
    english: 'You don’t need bullets when the name is enough.',
    buzz: '#1 trending dialogue this week',
  },
  {
    id: 'mausam',
    hindi: 'मौसम बदलता है, दरोगा नहीं।',
    roman: 'Mausam badalta hai, daroga nahi.',
    english: 'Seasons change. The inspector doesn’t.',
    buzz: 'The line fans shout in theatres',
  },
];

export const MUST_WATCH = [
  { id: 'interval', time: '1h 12m', title: 'The interval twist', text: 'Don’t step out for popcorn. Fans call it the best interval of the year.' },
  { id: 'rain', time: '1h 48m', title: 'The rain fight on the ghats', text: 'Shot in a single four-minute take, in real monsoon rain.' },
  { id: 'credits', time: 'After the credits', title: 'Stay in your seat', text: 'A 40-second surprise sets up the sequel.' },
];

export const TRIVIA = [
  { id: 'accent', text: 'The lead spent four months learning a Bhojpuri accent for the role.' },
  { id: 'train', text: 'The climax train is a 300-foot set built inside a studio in Hyderabad.' },
  { id: 'dhol', text: 'The title track was recorded in one night with 60 dhol players in the same room.' },
];

const pick = (list, id) => list.find((item) => item.id === id);

/** Cards on the Confirm booking screen: a teaser mix to get people excited before they pay. */
export const CONFIRM_DECK = [
  { kind: 'dialogue', item: pick(DIALOGUES, 'naam') },
  { kind: 'trivia', item: pick(TRIVIA, 'train') },
  { kind: 'scene', item: pick(MUST_WATCH, 'rain') },
  { kind: 'trivia', item: pick(TRIVIA, 'dhol') },
];

/** Cards while the payment processes. Different moments, so nothing repeats straight away. */
export const PAYING_DECK = [
  { kind: 'dialogue', item: pick(DIALOGUES, 'darr') },
  { kind: 'scene', item: pick(MUST_WATCH, 'interval') },
  { kind: 'trivia', item: pick(TRIVIA, 'accent') },
  { kind: 'dialogue', item: pick(DIALOGUES, 'mausam') },
];

/** One short line for the payment options page, so it never competes with the Pay button. */
export const TEASER = 'Fans say the interval twist is unmissable. Your seats are waiting.';

/** Placeholder contact details for the booking (not a real person). */
export const CONTACT = { phone: '+91-90000 00000', email: 'yourname@email.com', state: 'Karnataka' };

/** Short seat-section codes, as shown on the booking summary (e.g. "CL-D6,D7"). */
export const SECTION_CODES = { recliner: 'RC', prime: 'PR', classic: 'CL' };
