// track-clicks.js
// Detecta cliques em botões de WhatsApp, Tally e Hotmart automaticamente,
// e dispara o evento correspondente pro Pixel (client) e pra CAPI (server).

import { trackMetaEvent } from './meta-pixel.js';

// ⚠️ TEMPORÁRIO — usado só durante os testes no Events Manager.
// Depois de validar, trocar o valor para null (ou apagar a linha).
const TEST_EVENT_CODE = 'TEST17901';

function gerarEventId() {
  if (window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }
  return 'evt-' + Date.now() + '-' + Math.random().toString(36).slice(2);
}

function enviarParaCapi(eventName, eventId, sourceUrl) {
  const body = {
    event_name: eventName,
    event_id: eventId,
    event_source_url: sourceUrl,
  };

  if (TEST_EVENT_CODE) {
    body.test_event_code = TEST_EVENT_CODE;
  }

  fetch('/api/track-event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    keepalive: true,
  }).catch(() => {});
}

function dispararEvento(eventName, link) {
  const eventId = gerarEventId();
  const sourceUrl = window.location.href;

  trackMetaEvent(eventName, {}, eventId);
  enviarParaCapi(eventName, eventId, sourceUrl);
}

function identificarEvento(href) {
  if (!href) return null;
  if (href.startsWith('https://wa.me/')) return 'Contact';
  if (href.startsWith('https://tally.so/')) return 'Lead';
  if (href.startsWith('https://pay.hotmart.com/')) return 'InitiateCheckout';
  return null;
}

export function initTrackClicks() {
  document.addEventListener('click', function (e) {
    const link = e.target.closest('a');
    if (!link) return;

    const eventName = identificarEvento(link.href);
    if (!eventName) return;

    dispararEvento(eventName, link.href);
  });
}