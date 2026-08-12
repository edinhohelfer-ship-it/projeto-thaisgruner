// meta-pixel.js
// Cuida SÓ do Meta Pixel (Facebook/Instagram).

import { getConsent } from './consent.js';

const META_PIXEL_ID = '1689331022448426';

let isLoaded = false;
let eventQueue = [];

function fireEvent(eventName, params, eventId) {
  if (eventId) {
    window.fbq('track', eventName, params, { eventID: eventId });
  } else {
    window.fbq('track', eventName, params);
  }
}

function flushQueue() {
  eventQueue.forEach(({ eventName, params, eventId }) => {
    fireEvent(eventName, params, eventId);
  });
  eventQueue = [];
}

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
  flushQueue();
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

export function trackMetaEvent(eventName, params = {}, eventId = null) {
  if (isLoaded && typeof window.fbq === 'function') {
    fireEvent(eventName, params, eventId);
  } else {
    eventQueue.push({ eventName, params, eventId });
  }
}