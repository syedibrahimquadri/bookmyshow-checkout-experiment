# BookMyShow Checkout Experiment

A clickable concept prototype for one product question: **why do people pick seats but not pay?**

> Personal case study by Syed Ibrahim Quadri. Not affiliated with or endorsed by BookMyShow. The film, its dialogues, scenes, trivia, cinemas and prices are made up, and nothing here takes real payments.

## The problem

Booking abandonment is up 45%. Users select seats, then leave at checkout.

**Hypothesis:** the convenience fee rose from ₹30 to ₹49 a ticket. People expect ₹150 a seat, see ₹398 for two at checkout instead of ₹300, and feel tricked. They can pay; the surprise breaks their trust.

## What the prototype shows

**Fix 1: transparent price.** Every price includes the fee and says so, from the showtimes page onwards: "₹199 incl. ₹49 fee". Two seats show ₹398 on the seat map, and checkout says "Same ₹398 you saw on the seat map. No surprises." Today, the same booking shows ₹300 until the ₹98 fee appears at checkout.

**Fix 2: movie moments.** Auto-rotating cards show the film's viral dialogues, interesting facts and must-watch scenes in two places: the empty space at the bottom of Confirm booking (below the consent line, so nothing pushes the price or Continue out of view), and while the payment processes (the anxious wait for UPI or bank approval). The ticket ends with "3 moments to watch for". The payment options page only gets one short teaser line, so nothing competes with the Pay button.

**What we would measure:** checkout completion with transparent pricing against today's flow, over 3 weeks; for movie moments, the share of people who quit while the payment is processing.

## The flow

1. **Showtimes**: cinemas and times, with "from ₹199 incl. ₹49 fee"
2. **How many seats?**: a bottom sheet over the seat map with 1 to 10 seats and each section's fee-inclusive price and availability
3. **Seats**: one tap picks that many seats side by side; prices include the fee, and the bottom bar shows the full amount
4. **Confirm booking**: laid out like the real screen (summary, cancellation note, tap-to-expand price details, contact, offers, consent), with movie moments in the empty space
5. **Payment options**: amount, one teaser line, UPI, card or pay later, 8-minute seat hold
6. **Paying**: approval status with a 5-minute request timer, seats locked, movie moments carousel
7. **Ticket**: sample QR, total paid, before-you-go moments

On desktop, a guide panel beside the phone lists the six screens, so you can jump to any of them. On phones, the app fills the screen with a slim "concept prototype" note at the top.

## Run it locally

You need Node.js 18 or later.

```bash
npm install
npm run dev      # opens at http://localhost:5173
npm test         # pricing tests
npm run build    # production build in dist/
```

## Files

All files sit in one folder, so the project can be uploaded to GitHub straight from the browser.

```
index.html          All six screens, the seat-count sheet and the guide panel
main.js             Entry point: wires everything together
data.js             The made-up films, shows, seats, fee, contact placeholder and movie moments
pricing.js          Pure logic: totals, fee-inclusive labels, the checkout price check
seatpick.js         Pure logic: picking seats side by side and section availability
pricing.test.js     Unit tests for pricing.js and seatpick.js
state.js            Shared state (moments, show, seat count, seats, payment method)
navigation.js       Screen stack, slide transitions, back and jump
shows.js, seats.js (seat map and seat-count sheet), checkout.js (Confirm booking), payment.js, paying.js, ticket.js   One file per screen
moments.js          Movie moment cards and the auto-rotating carousel
toast.js            Short messages at the bottom of the screen
fit.js              Shrinks the phone and guide panel to fit short desktop windows
index.css           Imports the stylesheets below
base.css, rail.css, phone.css, responsive.css
shows.css, seats.css, sheet.css, checkout.css (Confirm booking and Payment options), paying.css, ticket.css
favicon.svg, og-image.png   Tab icon and social preview image
```

## Deploy on Vercel

1. Upload all files to a new GitHub repository (everything at the top level, no folders).
2. On vercel.com: **Add New → Project**, import the repository, keep the defaults (Vite), and click **Deploy**.

Every push to the main branch redeploys the site. The social preview image uses the production URL automatically; for a custom domain, set a `SITE_URL` environment variable in Vercel.
