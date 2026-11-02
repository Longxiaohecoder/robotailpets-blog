// Cookieless page counts. Storage is used only for opt-out/owner preferences.
export function startAudience(inject, env = globalThis) {
  const {document, location, localStorage, navigator, history} = env;
  if (location.hostname !== 'auto-blog-system-omega.vercel.app') return;
  const read = key => { try { return localStorage.getItem(key); } catch { return null; } };
  const write = (key, value) => { try { localStorage.setItem(key, value); return true; } catch { return false; } };
  const internalKey = 'robotail-analytics-internal';
  const optoutKey = 'robotail-pageviews-optout';
  const params = new URLSearchParams(location.search);
  if (params.get('robotail_internal') === '1') {
    write(internalKey, '1'); params.delete('robotail_internal');
    history.replaceState(null, '', location.pathname + (params.size ? '?' + params : '') + location.hash);
  }
  const internal = () => read(internalKey) === '1';
  const privacy = navigator.doNotTrack === '1' || navigator.globalPrivacyControl === true;
  const optedOut = () => read(optoutKey) === '1' || (read(optoutKey) === null && read('robotail-analytics-consent') === 'denied');
  const bind = (selector, handler) => document.querySelector(selector)?.addEventListener('click', handler);
  const set = (key, value) => { if (write(key,value)) location.reload(); };
  bind('[data-analytics-allow]', () => set(optoutKey,'0'));
  bind('[data-analytics-decline]', () => set(optoutKey,'1'));
  bind('[data-analytics-exclude]', () => set(internalKey,'1'));
  bind('[data-analytics-include]', () => set(internalKey,'0'));
  const status = document.querySelector('[data-analytics-status]');
  if (status) status.textContent = internal() ? 'This browser is excluded from page counts.' : privacy ? 'Your browser privacy signal is respected. Page counting is off.' : optedOut() ? 'Page counting is off in this browser.' : 'Cookieless page counting is on. No consent click is needed to read any story.';
  if (location.pathname.startsWith('/analytics-settings') || internal() || privacy || optedOut()) return;
  inject({mode:'production',debug:false,beforeSend(event) {
    if (internal() || optedOut()) return null;
    const url = new URL(event.url);
    if (url.hostname !== location.hostname) return null;
    url.search = ''; url.hash = '';
    return {...event,url:url.href};
  }});
}
