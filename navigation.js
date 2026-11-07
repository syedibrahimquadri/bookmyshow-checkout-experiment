// Screen stack with slide transitions, plus the guide panel that jumps between steps.

export const FLOW = ['shows', 'seats', 'summary', 'payment', 'paying', 'ticket'];

const $ = (id) => document.getElementById(id);
let stack = ['shows'];
const listeners = new Set();

export const currentScreen = () => stack[stack.length - 1];

/** Run a callback whenever the visible screen changes. */
export const onScreenChange = (fn) => listeners.add(fn);

function changed() {
  const current = currentScreen();
  document.querySelectorAll('#steps button').forEach((button) => {
    if (button.dataset.go === current) button.setAttribute('aria-current', 'step');
    else button.removeAttribute('aria-current');
  });
  listeners.forEach((fn) => fn(current));
}

/** Slide forward to a screen, or back to the previous one. */
export function show(id, { back = false } = {}) {
  const current = currentScreen();
  if (id === current) return;
  const from = $(current);
  const to = $(id);
  if (back) {
    from.classList.add('off-right');
    from.classList.remove('off-left');
    to.classList.remove('off-left', 'off-right');
    stack.pop();
  } else {
    to.classList.remove('off-right', 'off-left');
    to.scrollTop = 0;
    from.classList.add('off-left');
    stack.push(id);
  }
  changed();
}

export const goBack = () => show(stack[stack.length - 2] ?? 'shows', { back: true });

/** Jump straight to a step, rebuilding the stack along the main flow so Back still works. */
export function jump(id) {
  const index = FLOW.indexOf(id);
  stack = FLOW.slice(0, index + 1);
  FLOW.forEach((screenId, i) => {
    const el = $(screenId);
    el.classList.remove('off-left', 'off-right');
    if (i < index) el.classList.add('off-left');
    else if (i > index) el.classList.add('off-right');
  });
  $(id).scrollTop = 0;
  changed();
}

/**
 * Wire up guide buttons, back buttons and in-screen links.
 * @param {{ beforeShow?: (id: string, trigger: HTMLElement) => boolean | void, beforeJump?: (id: string) => void, onReset?: () => void }} hooks
 *   beforeShow can return false to cancel the move.
 */
export function initNavigation({ beforeShow, beforeJump, onReset } = {}) {
  document.querySelectorAll('#steps button').forEach((button) => {
    button.addEventListener('click', () => {
      beforeJump?.(button.dataset.go);
      jump(button.dataset.go);
    });
  });

  document.addEventListener('click', (event) => {
    if (event.target.closest('[data-back]')) {
      goBack();
      return;
    }
    if (event.target.closest('[data-reset]')) {
      onReset?.();
      jump('shows');
      return;
    }
    const link = event.target.closest('.screen [data-go]');
    if (!link || link.disabled) return;
    if (beforeShow?.(link.dataset.go, link) === false) return;
    show(link.dataset.go);
  });

  changed();
}
