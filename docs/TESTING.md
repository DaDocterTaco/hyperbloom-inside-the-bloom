# Submission readiness

Checked October 19, 2026 before the 5 PM EDT deadline.

## Automated checks

- `npm test`: 25 passing tests. Covers hero and benefits motion bounds and exact reversal, original article routing, search normalization, event filters and the precise submission cutoff, calendar output, plus the retained worker/static packaging behavior.
- `npm run build`: production compilation succeeds.
- `npm run check:release`: verifies all compiled image/font/script/style references, dynamically assembled partner logos, the Firebase public output and SPA fallback, and exclusion of private/development content. The source PNG fallback for the hero is retained.
- The October 19 project-notice update also verifies `/terms` routing (including a trailing slash and unknown subpath), readable 320px Terms layout, direct refresh, privacy navigation, all-page footer disclosures and the separate creator-contact path. Live validation checks 13 direct routes and 64 exact-match build assets. Drafting is not an attorney review or a guarantee of legal protection.

## Browser coverage

Responsive views were inspected at 320, 390, 768, 901 and 1440 CSS pixels. The checked states had no horizontal page overflow. The primary phone action stays visible. These checks use Chromium responsive emulation; they are not physical-device or Safari/Firefox certification.

The homepage, benefits, community, all six events, mission/profiles, FAQ and contact were reviewed. Blog search and filtering, all four local guides and their official sources, Gallery/V1, both original video streams, closed-event and missing-page paths were exercised. Both recordings reached readyState 4 without an error.

The seven-partner carousel pauses, exposes a stationary View all list, opens that view on keyboard entry, and suspends its animation offscreen. Duplicate visual groups have no duplicate interactive links. Global pause preserves a stable decorative scene while navigating. The document camera returns to the identical artwork transforms at the same scroll coordinate. Dialogs close with Escape and return focus to their triggers.

The compiled build was checked for direct reader refresh, search, carousel pause/keyboard access, gallery media and contact dialog focus return. No browser console errors were observed in those checks.

## Public release checks

The public Firebase release passed `npm run check:live`: all 11 direct app routes return the current app shell, and all 64 checked scripts, styles, fonts, images and the calendar match the local production bytes. HTML revalidation and immutable caching for hashed bundles are verified. See [live deployment evidence](LIVE-CHECK.md).

The deployed browser session additionally passed search and query refresh, direct reader refresh, partner pause/keyboard access, phone navigation and contact arrival, pause persistence, and both original video streams reaching readyState 4. No browser console errors were observed. The Discord invitation resolves to the genuine Hyperbloom community without requiring this test to join or create an account.

Firebase Hosting is configured to publish only `dist/client`, with direct-route rewrites and appropriate caching. Repository publication excludes local QA screenshots/traces, design exploration, caches, credentials and other workspace projects. The public repository includes the working app, production assets, credits and reproducible commands.

## Practical limits

- The original full articles, Wix accounts/conversations/live chat and Devpost registration/submission remain explicit official-service handoffs. No backend migration is claimed.
- Original video streams require internet access and have no supplied caption tracks/transcripts.
- System reduced motion is implemented in CSS and JavaScript. Manual pause was exercised; OS preference emulation was unavailable in the test environment.
- The Devpost project entry and final submission remain a separate participant action. Deployment is not a Devpost submission.
