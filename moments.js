// Movie moment cards (dialogues, must-watch scenes, trivia) and a small auto-rotating carousel.
// Used on the Confirm booking screen and while the payment processes.

const ADVANCE_MS = 5000;

export function cardMarkup({ kind, item }) {
  if (kind === 'dialogue') {
    return `
      <article class="moment dialogue">
        <p class="kicker">Viral dialogue</p>
        <blockquote lang="hi">${item.hindi}</blockquote>
        <p class="roman">${item.roman}</p>
        <p class="english">${item.english}</p>
        <p class="buzz">${item.buzz}</p>
      </article>`;
  }
  if (kind === 'scene') {
    return `
      <article class="moment scene">
        <p class="kicker">Must watch <span class="at">${item.time}</span></p>
        <h4>${item.title}</h4>
        <p>${item.text}</p>
      </article>`;
  }
  return `
    <article class="moment trivia">
      <p class="kicker">Did you know?</p>
      <p class="fact">${item.text}</p>
    </article>`;
}

/**
 * Fill a carousel and its dots, and return controls to start, stop and rewind it.
 * Swiping by hand pauses auto-advance for a while and keeps the dots in step.
 */
export function createCarousel(track, dots, cards) {
  track.innerHTML = cards.map(cardMarkup).join('');
  dots.innerHTML = cards.map(() => '<span></span>').join('');
  let active = 0;
  let timer = null;
  let resumeTimer = null;

  const markDots = () => [...dots.children].forEach((dot, i) => dot.classList.toggle('on', i === active));

  const goTo = (index, smooth = true) => {
    active = (index + cards.length) % cards.length;
    const card = track.children[active];
    track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: smooth ? 'smooth' : 'auto' });
    markDots();
  };

  const stop = () => {
    clearInterval(timer);
    clearTimeout(resumeTimer);
  };

  const start = () => {
    stop();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    timer = setInterval(() => goTo(active + 1), ADVANCE_MS);
  };

  let scrollIdle;
  track.addEventListener('scroll', () => {
    clearTimeout(scrollIdle);
    scrollIdle = setTimeout(() => {
      const index = Math.round(track.scrollLeft / track.clientWidth);
      if (index !== active) {
        active = index;
        markDots();
      }
    }, 120);
  });
  track.addEventListener('pointerdown', () => {
    stop();
    resumeTimer = setTimeout(start, ADVANCE_MS * 2);
  });

  return {
    start,
    stop,
    rewind: () => goTo(0, false),
  };
}
