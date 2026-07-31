// google-ads.js
// Cuida SÓ da tag do Google Ads (gtag.js + conversão).

import { getConsent } from './consent.js';

// TODO: substituir pelo ID real do Google Ads (formato AW-XXXXXXXXX).
const GOOGLE_ADS_ID = 'REPLACE_ME';

let isLoaded = false;

function injectGoogleAdsScript() {
  if (isLoaded || GOOGLE_ADS_ID === 'REPLACE_ME') return;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', GOOGLE_ADS_ID);

  isLoaded = true;
}

export function initGoogleAds() {
  if (getConsent() === 'accepted') {
    injectGoogleAdsScript();
  }

  window.addEventListener('consentchange', (e) => {
    if (e.detail?.value === 'accepted') {
      injectGoogleAdsScript();
    }
  });
}

export function trackGoogleConversion(conversionLabel, params = {}) {
  if (!isLoaded || typeof window.gtag !== 'function') return;
  window.gtag('event', 'conversion', {
    send_to: `${GOOGLE_ADS_ID}/${conversionLabel}`,
    ...params,
  });
}