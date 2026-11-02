# Blog audience measurement

## Current contract — 2026-11-02 cookieless page views

The owner explicitly requested direct page-view measurement without requiring a consent click. Production now uses official `@vercel/analytics` (2.x), enabled on the existing free Hobby project. The GA4 tag and consent banner have been removed. Legacy GA4 details below are historical and must not be used as the current page-view source.

Source: Vercel project `prj_QsIovdNRLwXiX6Zt7L0WqOGMLNQD`, team `team_wyBBG6cAf8OiJrmDJxWEvRsY`. Count production pages automatically, excluding settings pages, owner-marked browsers, explicit opt-outs, DNT/GPC, and preview/local hosts. Page URL queries/fragments are stripped. No analytics cookies or advertising tags are used; Vercel processes request metadata and uses a short-lived hash. Do not call this proof of real humans or zero data processing. This source does not supply the previous GA4 engagement-time metric.

An isolated first-time browser with no consent preference, no banner and no Google tag sent `/_vercel/insights/view` with HTTP 200. This is a known installation test, not an external reader. The official Vercel report API returned one page view and one estimated visitor for `/` during verification. Keep test context visible; do not subtract an unproven constant from future totals.

Token creation was initially rejected by automatic approval review because of control permissions. The owner then explicitly authorized a Robotail-scoped 90-day token and completed Vercel reauthentication. The actual selected scope was narrowed further to **auto-blog-system only**. It is stored solely in ignored `.local/vercel-analytics-token.json`, mode 600, expiring 2027-01-31. Never print, commit, copy into a dashboard, export or expose that file. It is used only for official report GETs. No paid plan upgrade or credit-card addition occurred.

`scripts/blog-analytics.js` now dispatches to `scripts/blog-analytics-vercel.js` for the new provider. Daily/page/referrer aggregates come from the official API. Requested ranges are clamped to the activation date; pre-activation periods are unavailable, not zero. Reporting uses UTC and can include partial current-day data. Do not sum daily unique visitors. PV is additive and is the primary headline. API errors preserve the previous valid cloud bundle; missing API authorization is explicit, never substituted with GA4 values.

The unified cloud page remains https://longxiaohecoder.github.io/robotail-shopify-dashboard/#blog. Its existing daily update/publish pipeline refreshes this source. Hobby history is limited to 30 days and capped at 50,000 events/month. Official references: https://vercel.com/docs/analytics/privacy-policy and https://vercel.com/docs/analytics/web-analytics-api.

## Historical GA4 setup (superseded)

Configured on 2026-10-31, with explicit owner authorization to create blog-specific analytics. Existing Shopify/site analytics are separate.

- GA account: Robotail, `411765814`.
- Dedicated property: Robotail Journal - Blog, `561695779`.
- Web stream: Robotail Journal Web, `16240819909`.
- Measurement ID: `G-MRVLWE5V3G` (public configuration, not a credential).
- Production host only: `auto-blog-system-omega.vercel.app`.
- Reporting time zone: `America/New_York`; currency USD. Business category Pets & Animals; owner supplied business size 1–10 employees.
- Basic consent: no Google tag before opt-in; advertising storage, advertising user data, personalization and Google signals are disabled. Browser DNT/GPC is respected. These measurements cover consenting, non-excluded browsers, not all readers or verified humans.
- The privacy/settings page is `/analytics-settings/`. Browser exclusion is local to that browser and origin. `?robotail_internal=1` sets the exclusion before any analytics tag loads and removes the parameter from the visible URL. Other browsers/devices need separate exclusion; no retrospective removal.
- New property Internal Traffic filter is **Active**, operation Exclude, `traffic_type` exactly `internal`. The diagnostic session flag `sessionStorage['robotail-analytics-test']='1'` marks the isolated test browser with `debug_mode=true` and `traffic_type=internal`.

## Verification and limitations

Production deployment `a45abec` succeeded in Vercel. A consenting, explicitly internal debug article-page request received Google HTTP 204 at `2026-10-31T04:44:34.175Z`. It used the correct measurement ID, `page_view`, and `traffic_type=internal`. This establishes transport receipt, not proof that daily reporting has processed data or that an external reader visited. The user's existing Chrome read back browser exclusion `1` and no loaded Google tag. Raw device identifiers/cookies are not stored in evidence.

No historic browser tracking was found in the deployed source or homepage before setup. The earlier existing-property report had no blog-host records. This does not prove zero historical readers. Do not backfill traffic, reading time or human counts. Earliest repository commit 2026-09-22 is only a query start reference, not a verified launch date.

## Local dashboard

Read-only collector: `node scripts/blog-analytics.js`. It uses the local Google OAuth credentials from the sibling Shopify SEO project, but queries only the dedicated blog property and exact blog hostname. Credentials are never included in the frontend or committed. Admin API was unavailable; property/stream creation and filter activation were performed through the user's authenticated Google UI.

The collector writes only `output/blog-analytics/` snapshots and evidence. Preserve dashboard identity on refresh, then build the same Data app and reload its localhost preview. `output/` is intentionally excluded from commits for this task. Preview: `http://127.0.0.1:60785/` on this machine. There is no new scheduled job; refreshing the page does not rerun Google queries.

Daily reporting ends yesterday in the property timezone. New current-day collection will not appear in that daily view immediately. `totalUsers` is deduplicated over each selected period; never sum daily unique users. Effective engagement per session is `userEngagementDuration / sessions`, not the duration an idle tab stays open. No external human count can be inferred from total users alone.
