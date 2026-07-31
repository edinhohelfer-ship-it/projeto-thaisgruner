// consent.js
// Módulo único responsável por saber se o visitante aceitou ou recusou
// cookies de marketing/analytics. Todos os scripts de tracking (Meta,
// Google, TikTok) leem a decisão salva aqui — ninguém pergunta duas vezes.

const STORAGE_KEY = 'cookie_consent'; // valores possíveis: 'accepted' | 'rejected'

export function getConsent() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch (e) {
    // WebView do Instagram/Facebook pode bloquear localStorage.
    console.warn('[consent] localStorage indisponível:', e);
    return null;
  }
}

export function setConsent(value) {
  if (value !== 'accepted' && value !== 'rejected') {
    console.error('[consent] valor inválido:', value);
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch (e) {
    console.warn('[consent] não foi possível salvar consentimento:', e);
  }

  window.dispatchEvent(
    new CustomEvent('consentchange', { detail: { value } })
  );
}

export function hasAcceptedMarketing() {
  return getConsent() === 'accepted';
}