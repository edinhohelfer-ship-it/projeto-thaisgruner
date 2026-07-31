// meta-pixel.js
// Cuida SÓ do Meta Pixel (Facebook/Instagram).

import { getConsent } from './consent.js';

// TODO: substituir pelo Pixel ID real quando as conversões estiverem definidas.
const META_PIXEL_ID = 'REPLACE_ME';

let isLoaded = false;

function injectMetaPixelScript() {
  if (isLoaded || META_PIXEL_ID === 'REPLACE_ME') return;

  /* eslint-disable */
  !function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = '2.0';
    n.queue = [];
    t = b.createElement(e);
    t.async = true;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  /* eslint-enable */

  window.fbq('init', META_PIXEL_ID);
  window.fbq('track', 'PageView');

  isLoaded = true;
}

export function initMetaPixel() {
  if (getConsent() === 'accepted') {
    injectMetaPixelScript();
  }

  window.addEventListener('consentchange', (e) => {
    if (e.detail?.value === 'accepted') {
      injectMetaPixelScript();
    }
  });
}

export function trackMetaEvent(eventName, params = {}) {
  if (!isLoaded || typeof window.fbq !== 'function') return;
  window.fbq('track', eventName, params);
}