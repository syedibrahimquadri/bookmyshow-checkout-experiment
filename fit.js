// Scale the phone mock-up and the guide panel down on short desktop windows,
// so both are fully visible without scrolling.
// On phones (760px wide or less, or held sideways) the prototype fills the screen instead, so nothing is scaled.

// Must match the phone media query in responsive.css.
const MOBILE_QUERY = window.matchMedia('(max-width: 760px), (max-height: 500px)');
const PAGE_PADDING = 64; // body has 32px padding top and bottom

function fitHeight(element, minScale) {
  element.style.zoom = '';
  if (MOBILE_QUERY.matches) return;
  const naturalHeight = element.getBoundingClientRect().height;
  const scale = Math.min(1, (window.innerHeight - PAGE_PADDING) / naturalHeight);
  if (scale < 1) element.style.zoom = String(Math.max(scale, minScale));
}

export function initFitToScreen() {
  const device = document.querySelector('.device');
  const rail = document.querySelector('.rail');

  const fit = () => {
    if (device) fitHeight(device, 0.5);
    if (rail) fitHeight(rail, 0.72); // keep the guide text readable
  };

  fit();
  window.addEventListener('resize', fit);
  MOBILE_QUERY.addEventListener('change', fit);
}
