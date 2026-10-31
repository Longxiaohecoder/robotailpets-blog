/* Robotail Journal: opt-in measurement on the production hostname only. */
(() => {
  'use strict';
  const script = document.currentScript;
  const id = script?.dataset.measurementId;
  const host = 'auto-blog-system-omega.vercel.app';
  if (!/^G-[A-Z0-9]+$/.test(id || '') || location.hostname !== host) return;
  const consentKey = 'robotail-analytics-consent';
  const internalKey = 'robotail-analytics-internal';
  const read = key => { try { return localStorage.getItem(key); } catch { return null; } };
  const write = (key, value) => { try { localStorage.setItem(key, value); return true; } catch { return false; } };
  const params = new URLSearchParams(location.search);
  if (params.get('robotail_internal') === '1') {
    write(internalKey, '1');
    params.delete('robotail_internal');
    history.replaceState(null, '', location.pathname + (params.size ? '?' + params : '') + location.hash);
  }
  const internal = () => read(internalKey) === '1';
  const doNotTrack = navigator.doNotTrack === '1' || navigator.globalPrivacyControl === true;
  const settings = location.pathname.startsWith('/analytics-settings');
  let loaded = false;
  let banner;
  function load() {
    if (loaded || settings || internal() || doNotTrack || read(consentKey) !== 'granted') return;
    loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', {analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
    window.gtag('consent', 'update', {analytics_storage:'granted'});
    window.gtag('js', new Date());
    let referrer = '';
    try { const url = new URL(document.referrer); referrer = url.origin + url.pathname; } catch {}
    let testing = false;
    try { testing = sessionStorage.getItem('robotail-analytics-test') === '1'; } catch {}
    window.gtag('config', id, {
      send_page_view:true,
      page_location:location.origin + location.pathname,
      page_referrer:referrer,
      allow_google_signals:false,
      allow_ad_personalization_signals:false,
      cookie_flags:'SameSite=Lax;Secure',
      ...(testing ? {debug_mode:true,traffic_type:'internal'} : {})
    });
    const tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
    document.head.append(tag);
  }
  function choice(value) {
    if (!write(consentKey, value)) return;
    if (banner) banner.hidden = true;
    if (value === 'granted') load();
    else if (loaded) {
      window.gtag('consent', 'update', {analytics_storage:'denied'});
      location.reload();
    }
  }
  function controls() {
    const status = document.querySelector('[data-analytics-status]');
    if (status) status.textContent = internal() ? 'This browser is excluded from audience measurement.' : doNotTrack ? 'Your browser privacy signal is respected. Analytics is off.' : read(consentKey) === 'granted' ? 'Optional analytics is allowed in this browser.' : 'Optional analytics is off in this browser.';
    document.querySelector('[data-analytics-allow]')?.addEventListener('click', () => { choice('granted'); location.reload(); });
    document.querySelector('[data-analytics-decline]')?.addEventListener('click', () => { choice('denied'); location.reload(); });
    document.querySelector('[data-analytics-exclude]')?.addEventListener('click', () => { if (write(internalKey, '1')) location.reload(); });
    document.querySelector('[data-analytics-include]')?.addEventListener('click', () => { if (write(internalKey, '0')) location.reload(); });
    if (settings || internal() || doNotTrack) return;
    const saved = read(consentKey);
    if (saved === 'granted') { load(); return; }
    if (saved === 'denied') return;
    banner = document.createElement('section');
    banner.className = 'analytics-consent';
    banner.setAttribute('aria-label', 'Optional analytics');
    banner.innerHTML = '<p>May we use optional analytics cookies to understand which stories people read? <a href="/analytics-settings/">Privacy &amp; settings</a></p><div><button type="button" data-consent-yes>Allow analytics</button><button type="button" data-consent-no>No thanks</button></div>';
    document.body.append(banner);
    banner.querySelector('[data-consent-yes]').addEventListener('click', () => choice('granted'));
    banner.querySelector('[data-consent-no]').addEventListener('click', () => choice('denied'));
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', controls, {once:true});
  else controls();
})();
