// tiktok-pixel.js
// Cuida SÓ do TikTok Pixel. Pronto pra quando a conta existir.

import { getConsent } from './consent.js';

// TODO: substituir pelo Pixel ID real quando a conta TikTok Ads existir.
const TIKTOK_PIXEL_ID = 'REPLACE_ME';

let isLoaded = false;

function injectTikTokPixelScript() {
  if (isLoaded || TIKTOK_PIXEL_ID === 'REPLACE_ME') return;

  /* eslint-disable */
  !function (w, d, t) {
    w.TiktokAnalyticsObject = t;
    var ttq = w[t] = w[t] || [];
    ttq.methods = ['page', 'track', 'identify', 'instances', 'debug', 'on', 'off', 'once', 'ready', 'alias', 'group', 'enableCookie', 'disableCookie'];
    ttq.setAndDefer = function (t, e) {
      t[e] = function () {
        t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
      };
    };
    for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
    ttq.load = function (e, n) {
      var i = 'https://analytics.tiktok.com/i18n/pixel/events.js';
      ttq._i = ttq._i || {};
      ttq._i[e] = [];
      ttq._i[e]._u = i;
      ttq._t = ttq._t || {};
      ttq._t[e] = +new Date();
      ttq._o = ttq._o || {};
      ttq._o[e] = n || {};
      var o = document.createElement('script');
      o.type = 'text/javascript';
      o.async = true;
      o.src = i + '?sdkid=' + e + '&lib=' + t;
      var a = document.getElementsByTagName('script')[0];
      a.parentNode.insertBefore(o, a);
    };
    ttq.load(TIKTOK_PIXEL_ID);
    ttq.page();
  }(window, document, 'ttq');
  /* eslint-enable */

  isLoaded = true;
}

export function initTikTokPixel() {
  if (getConsent() === 'accepted') {
    injectTikTokPixelScript();
  }

  window.addEventListener('consentchange', (e) => {
    if (e.detail?.value === 'accepted') {
      injectTikTokPixelScript();
    }
  });
}

export function trackTikTokEvent(eventName, params = {}) {
  if (!isLoaded || typeof window.ttq === 'undefined') return;
  window.ttq.track(eventName, params);
}