# DubaiJob — Android Course-Selling App, Project Context for AI Assistants

> **Read this file first** when starting a new chat about this repo. It captures the
> app's purpose, monetization, architecture, design system ("Midnight Gold" luxury
> language), the social-proof + discount psychology engines, the storage layout,
> and what NOT to do.

---

## 1. What this app is

**DubaiJob** — an Expo SDK 57 (React Native 0.86, React 19) **Android-only**
app that sells a single paid **"Dubai Job" career course** plus paid add-on
packages. The course teaches the user how to get a job in Dubai.

- **Platform**: Android only. `platforms: ["android"]` in `app.json`. iOS and web
  configs, web-only template files, `react-dom`, `react-native-web`, iOS icon
  dir, and favicon were all removed. No `ios/` or `web` blocks may be
  re-added. Remaining `Platform.OS === 'web'` branches in template example
  screens are dead code on Android — remove on sight when touching those files.
- **Pricing**: course full price **₹6,000 INR**. Limited-time discounted price:
  **TBD — owner must set** (placeholder `DISCOUNT_PRICE` in `src/data/offers.ts`
  when built; e.g. ₹3,999).
- **Monetization**: Google Play In-App products via `expo-iap`
  (REAL billing, consumables/non-consumables per product decision below).
- **100% content-curated, effectively offline-first**: course catalog, packages,
  reviews, social-proof seeds all live in local data files. No course-content
  backend. User profile data goes to Firebase Firestore (see §6).
- **Login**: Google Sign-In (`@react-native-google-signin/google-signin`),
  **dev build required** (does NOT work in Expo Go). Name/email/photo prefill
  the profile form; phone/address are always entered manually (Google profile
  has no phone/address).

The app is a **high-trust conversion machine**, not just a video player.
Journey: install → trust → buy ₹6,000 → learn. Every screen must build trust
or remove friction.

---

## 2. Tech stack & commands

|                       |                                                        |
| --------------------- | ------------------------------------------------------ |
| Framework             | Expo SDK 57 (`expo`, `expo-router`), Android-only      |
| React                 | 19.2.3                                                 |
| React Native          | 0.86.3                                                 |
| Auth                  | `@react-native-google-signin/google-signin` (native, dev build only) + `@react-native-firebase/auth` (exchanges Google credential → Firebase session; REQUIRED, Firestore rules depend on it) |
| Profile storage       | Firebase Firestore (`@react-native-firebase/app` + `firestore`) + AsyncStorage cache |
| Video                 | YouTube embeds via `react-native-webview` (iframe player) + `expo-image` thumbnails (`https://i.ytimg.com/vi/{id}/hqdefault.jpg`) |
| Payment               | REAL Google Play Billing via `expo-iap` (see §8)       |
| Storage               | `@react-native-async-storage/async-storage`            |
| Animations            | `react-native-reanimated` + press springs              |
| Icons                 | `@expo/vector-icons`                                   |
| Fonts                 | `expo-font` — **serif display (Playfair Display)** for headlines/hero numbers/prices; system/Inter for UI body (see §4) |
| TypeScript            | 6.0.3, strict                                          |

**Commands**

```bash
npm install                  # install deps
npx expo install --check     # MUST report "up to date" (SDK-57 matched)
npx tsc --noEmit             # typecheck — MUST pass before shipping any change
npx expo run:android         # dev build (REQUIRED for Google Sign-In + expo-iap; Expo Go can't do either)
```

**Typecheck is the source of truth.** No Jest, no Detox, no E2E.

### Required owner-provided items (blockers, not code)

1. Firebase project + `google-services.json` in repo root (gitignored) + Firestore rules (§6)
2. Google OAuth Android client ID + SHA-1 fingerprints (upload key + Play signing key) from Play Console → **Release > Setup > App Integrity**
3. Play Console IAP products (prices set in Console, IDs below in §8)
4. Course video YouTube links (unlisted) + real thumbnails preference
5. Real review content, face photos, success images (offer letters, Dubai photos)
6. **Discounted price** (full price fixed ₹6,000)
7. **Playfair Display font files** (OFL-licensed `.ttf`, regular + bold for headlines/prices)

---

## 3. App structure (planned file map)

```
src/
├── app/
│   ├── _layout.tsx              # root: splash + auth gate (logged-in? → tabs : login)
│   ├── login.tsx                # Google button + profile form + trust strip
│   ├── video/[id].tsx           # player screen: WebView YouTube iframe + details
│   │                             (WebView cannot report watch progress → mark lesson
│   │                             done on player exit AND via manual "Mark complete")
│   ├── account.tsx                # presented as sheet from course-tab avatar: edit profile,
│   │                              # owned-products list, Restore Purchases, Sign out
│   │                              # (NO 4th tab — sheet keeps tab bar at 3)
│   ├── checkout/[productId].tsx # order summary + rating-beside-price + pay CTA (Baymard pattern)
│   ├── success.tsx              # celebratory purchase confirmation (Peak-End peak)
│   └── (tabs)/
│       ├── _layout.tsx          # floating glass tab bar (ONLY shadow besides modals/back)
│       ├── index.tsx            # TAB 1 Course: sticky progress hero + video list + unlock bar
│       ├── packages.tsx         # TAB 2 Packages: premium add-on cards
│       └── proof.tsx            # TAB 3 Proof: stats band → reviews → gallery → timeline → hero story
├── components/
│   ├── GoldButton.tsx           # THE primary CTA (gold gradient pill, black text, ≥48dp)
│   ├── TrustStrip.tsx           # "4,800+ students · 4.9★ · since 2019" one-liner
│   ├── VideoRow.tsx             # thumbnail + title + duration + lock state + Show more
│   ├── PackageCard.tsx          # name + bullets + gold price + single CTA
│   ├── StatBand.tsx             # 3 serif count-up numbers
│   ├── ReviewCard.tsx           # face + name + city + outcome + stars
│   ├── SuccessGallery.tsx       # horizontal snap pager, full-bleed image cards
│   ├── GlassToast.tsx           # social-proof floating toast
│   ├── DiscountModal.tsx        # countdown + strike price + CTA
│   ├── CountdownTimer.tsx       # ticking offer timer
│   ├── ProgressRing.tsx         # course completion ring
│   └── SplashScreenView.tsx
├── constants/
│   └── theme.ts                 # Midnight Gold tokens (see §4)
├── context/
│   ├── AuthContext.tsx          # Google session + profile
│   └── PurchaseContext.tsx      # owned products (course + packages), restored on boot
└── services/
    ├── authService.ts           # Google Sign-In in/out, session persist
    ├── profileService.ts        # Firestore save/load + local cache
    ├── billingService.ts        # expo-iap: products, purchase, VERIFY + token anti-replay
    ├── courseService.ts         # video catalog access, progress marks
    ├── discountService.ts       # homepage-visit counter, modal scheduling (see §7)
    ├── socialProofEngine.ts     # toast scheduler, seeded fake-activity feed (see §7)
    └── youtubeService.ts        # videoId → thumbnail/embed URLs
└── data/  (ALL owner-editable content lives here — single place to edit)
    ├── courseVideos.ts          # [{ id(youtubeId), title, duration, description, freePreview }]
    ├── packages.ts              # [{ productId, name, bullets[], price, badge? }]
    ├── reviews.ts               # [{ name, city, photo, outcome, stars, text }]
    ├── stats.ts                 # { students, rating, years, placements }
    ├── socialProof.ts           # toast seed names/cities/actions (see §7)
    └── offers.ts                # FULL_PRICE=6000, DISCOUNT_PRICE=TBD, seat counts
```

---

## 4. Design System — "Midnight Gold"

Dark-first luxury. Cardinal rule (shared with sibling project): **no decorative
borders; no decorative shadows**. Depth from tonal layering, not strokes.

### Tokens (`src/constants/theme.ts` — to be created)

- Canvas: `#0A0A0C`; surfaces `#141416 / #1C1C1F / #242428`
- **Gold gradient**: `#D4AF37 → #F5D97A → #B8860B` — used ONLY for: price,
  GoldButton CTA, owned/VIP badges, discount timer, timeline dots.
  Gold everywhere = gold nowhere (isolation effect).
- Text: white `#FFFFFF`, secondary `rgba(255,255,255,0.6)`
- Radii: cards 20–24, buttons pill. Screen padding 24, card gaps 16.

### Typography

- **Display**: Playfair Display (via `expo-font`, loaded in `_layout` with
  splash gate) — hero headlines, stat numbers, prices, package names.
- **UI**: system/Inter — body, bullets, buttons, microcopy.
- Serif is the single biggest "premium website" signal. NEVER use serif for
  body copy or tiny labels.

### Allowed shadows (floating layers only)

| Layer | Shadow |
|---|---|
| Bottom tab bar | small lift shadow (see sibling spec) |
| Floating modals/sheets (`DiscountModal`, checkout sheet) | subtle `opacity 0.12–0.32` |
| Back button class | mild |
| `GlassToast` | subtle (it floats above content) |

Everything else flat.

### Motion (reanimated)

- Entrance: fade + slide-up 250–350ms, staggered lists (+60ms per row)
- Press: scale 0.97 spring + `expo-haptics` light tick
- StatBand: count-up on scroll-into-view
- GoldButton: solid, no bounce (bounce = cheap)
- Doherty threshold: every tap acknowledges <100ms

### Noob-friendly guarantees (non-negotiable)

1. **ONE primary action per screen**, ≥48dp gold button (Fitts's Law)
2. Plain-language microcopy, no jargon; helpful empty states
3. Skeleton cards for loading lists (never bare spinners)
4. Max 4–5 package cards (choice-overload guard); details expand in place, max 2 levels
5. Descriptions behind clearly labeled "Show more" (progressive disclosure)

---

## 5. Screens & flows

### Login + Profile (first-run)

```
[dark hero] serif "Get Your Dubai Job."
            sub: "Complete course · 1-1 guidance · placed students"
[gold btn ] Continue with Google   (native Google button styling)
[trust   ] 4,800+ students · 4.9★ · since 2019
──────── profile form (ONE screen, prefilled) ────────
Name [prefilled]   Email [prefilled]   Photo (avatar preview)
Phone [____]       Address [____]      City [____]  PIN [____]
[gold btn] Save & Continue
```

- Google returns name/email/photo only. Phone/address/city/PIN always manual.
- On save: `profileService.save()` → Firestore `users/{uid}` + AsyncStorage
  cache → route to tabs.

### TAB 1 — Course (`(tabs)/index.tsx`, also the "homepage")

- **Sticky mini-hero**: course name + `ProgressRing` + "Lesson 7/20 · 65%".
  Head-start effect: intro module pre-marked complete.
- **Discount pill** (persistent, subtle): "Offer ends in 03:42:11 →" opens `DiscountModal`.
- **Video list** (`VideoRow`): YouTube thumbnail (cached) + title + duration +
  lock state + **Show more** expanding description (2 levels max).
- Tap → `/video/[id]`: WebView iframe player, thumbnail-concealed until first
  frame; details + next-lesson below. Player exit marks lesson done (also a
  manual "Mark complete" — WebView iframe reports no progress events).
- **Course-tab header avatar** → `/account` sheet: edit profile fields, owned
  products list, **Restore Purchases** button (queries Play, reconciles
  entitlements), Sign out (Google + Firebase signOut, clears session keys).
- **If course not owned**: rows show blurred thumbnails + lock; bottom-pinned
  gold bar "Unlock Full Course · ₹6,000 · 4.9★ (2,300+ reviews)" → checkout
  (rating **beside** price — Baymard pattern).

### TAB 2 — Packages (`(tabs)/packages.tsx`)

- 4–5 `PackageCard`s: serif name, 3–4 "what's included" bullets, gold price,
  single CTA. Expandable details in place (2 levels max).
- One card may carry a gold "MOST POPULAR" badge (isolation/anchoring).
- Packages: 1-1 interaction, CV creation, book, Q&A (+1 spare slot). Each =
  separate Play IAP product (§8). CTA → purchase via `billingService` →
  `success.tsx` celebration (confetti + gold check + "What's next").
- Price display rule: package price + its own rating proof; no cross-sell
  clutter near the button.

### TAB 3 — Proof (`(tabs)/proof.tsx`) — top to bottom, engineered order

1. `StatBand`: 3 serif count-up numbers (students, rating, placements)
2. Review carousel: `ReviewCard`s — face photo, name, city, **specific outcome**
   ("Got Dubai job in 3 months"), stars. Specificity > praise.
3. `SuccessGallery`: full-bleed snap pager (offer letters, airport/Dubai
   photos + captions)
4. Timeline: "Running since 2021 → milestones" vertical gold-dotted line
5. **Final full-width hero story** — the single strongest result (Peak-End:
   the ending is what users remember)

### Checkout (`/checkout/[productId].tsx`) + Success (`/success.tsx`)

- Order summary: product name, what's included (3 bullets), rating + review
  count beside price, strike-through full price when discount active, gold Pay
  button, secure-note line ("Secured by Google Play").
- Success: gold celebration (Peak-End peak), receipt line, "Start learning →"
  button. NEVER leave user on a dead-end after payment.

---

## 6. Auth & profile data

- Sign-In: `@react-native-google-signin/google-signin`. Config plugin in
  `app.json`; Android OAuth client ID; SHA-1 (upload + Play signing).
- **Firebase session is MANDATORY, not optional**: after Google sign-in,
  `authService` MUST exchange the Google idToken into a Firebase session via
  `@react-native-firebase/auth` `GoogleAuthProvider.credential()` +
  `signInWithCredential()`. Firestore rules (`request.auth.uid`) fail without
  this — `google-signin` alone gives NO Firebase identity.
- **Dev build only** — both libs dead in Expo Go by design. `authService` must
  degrade: show "Open in dev build" notice, never crash.
- Session persisted in AsyncStorage (`@dubaijob_auth_v1`); photo URL cached.
- Account switching: on logout call BOTH `GoogleSignin.signOut()` and Firebase
  `auth().signOut()`; clear session + profile-cache keys.
- Profile: Firestore `users/{uid}` = `{ name, email, photo, phone, address,
  city, pin, updatedAt }`. Concurrent edits from two devices: last-write-wins
  on `updatedAt`. Firestore rules: users can read/write ONLY their own doc
  (`request.auth.uid == userId`). Local mirror in AsyncStorage so the app works
  offline after first save. Firestore write failure (offline) → keep local
  cache, retry on next save/boot; never block login on it.
- `google-services.json` in repo root, **gitignored** (never commit).

---

## 7. Psychology engines (local, no server)

### A. Frequent Social Proof (`socialProofEngine.ts` + `GlassToast`)

Simulated purchase-activity toasts so the course reads as popular and actively
bought.

- **Source**: `src/data/socialProof.ts` — editable seed arrays
  (`names[]`, `cities[]`, `actions[]` like "purchased the course", "bought CV
  package", "left a 5★ review"). Engine randomizes combos + "N min ago"
  labels. **All toast content comes from this file — owner controls it.**
- **Cadence**: first toast 25–40s after entering tabs; then every 2–4 min;
  max 3 per session; paused while: modal open, video playing, checkout open.
  No name+city combo repeats within a session (session-local seen-set).
- **Visual**: bottom-left floating glass card (BlurView + subtle shadow),
  avatar circle + name/city bold + action + time-ago; slide-in 300ms spring,
  auto-dismiss 5s, tap → proof tab.
- ⚠️ **Policy risk (owner acknowledged)**: fabricated buyer activity violates
  Google Play Deceptive Behavior policy and can get the app removed. Mitigate
  by mixing real reviews and keeping claims modest. Engine is data-driven so
  content can be swapped to real data without code changes.

### B. Limited-time discount (`discountService.ts` + `DiscountModal`)

Homepage (Tab 1) visit-gated offer modal.

- **Counter**: `@dubaijob_home_visits_v1` incremented on Tab-1 focus, but ONLY
  when the focus follows an app-foreground event or a switch from another TAB
  — NOT when returning from the video/checkout/account routes (those would
  inflate the counter and fire the modal far too early).
- **Pattern (deterministic)**: in each 10-visit cycle, show on visits **3 and 8**
  only. Never twice in a row; cycle resets at 10. Modal fires with a 1.5s delay
  after focus so it never interrupts mid-scroll.
- **Modal**: centered, gold countdown (`CountdownTimer`, ends → modal shows
  "Offer extended 24h" once — guarded by `@dubaijob_offer_extended_v1` — then
  full price), strike price ₹6,000 → `DISCOUNT_PRICE`, "Only N seats left at
  this price" (same fabrication policy risk as social-proof toasts — keep the
  number modest/owner-controlled via `offers.ts`), gold CTA → checkout with
  discount SKU (if the discount SKU is missing from `fetchProducts`, CTA falls
  back to the full-price checkout — never a dead button), subtle dismiss
  ("I'll pay full price later"). Pill tap re-opens the modal on demand.
- **Between shows**: persistent slim discount pill on homepage.
- Countdown deadline persisted (`@dubaijob_offer_deadline_v1`) so re-opening
  the app doesn't reset it mid-offer; deadline = first modal show + 48h.
  **Clock safety**: never trust `Date.now()` absolute — compute remaining as
  `deadline - now`, clamp at 0; a user-set-back clock only extends display, a
  set-forward clock only ends it early. Uninstall WIPES AsyncStorage, so the
  deadline does NOT survive uninstall — acceptable, document it, don't fight it.

---

## 8. Payments & billing (REAL Google Play Billing, `expo-iap`)

Single real-money surface, mirroring the proven sibling-project pattern:

- **Products** (create EXACT IDs in Play Console):
  `course_full` (₹6,000), `pkg_1on1`, `pkg_cv`, `pkg_book`, `pkg_qa`
  (prices set in Console).
- **ALL products are NON-CONSUMABLE. No exceptions.** Consumed purchases are
  never restorable — a consumable package would vanish on reinstall/new device
  (the exact piracy scenario this app defends against). Re-buying is not a real
  use case for any of these items.
- **Flow**: `initConnection` → `fetchProducts` (unknown SKUs omitted →
  "Unavailable, try later" state, never a dead button) → `requestPurchase`
  (event-based via listeners, NOT return value).
- **Purchase states** — the listener MUST branch:
  - `purchased` + non-empty token + token NOT in `@dubaijob_play_tokens_v1`
    → grant entitlement in `@dubaijob_entitlements_v1`
    (`{ course: bool, packages: {id: bool} }`) → acknowledge/finish → record
    token (cap 200).
  - `pending` (common in India: UPI/Play-balance payments sit pending for
    minutes/hours) → show "Payment pending — you'll get access automatically"
    state, grant NOTHING. The listener fires again when Play settles it.
  - already-owned token replay → acknowledge without re-crediting (anti-replay).
- **Acknowledgement is load-bearing**: Google auto-refunds non-consumables not
  acknowledged within 3 days. `finishTransaction`/acknowledge must run even if
  the app crashed mid-flow → **boot recovery** (and the manual Restore button)
  must acknowledge every unacknowledged owned purchase it finds.
- **Anti-replay**: a processed token credits at most once, ever.
- **Boot restore**: on launch, query owned purchases and reconcile
  entitlements — covers reinstall, new device, refund-revocation (a refunded
  SKU missing from the owned list loses its entitlement), and multi-account
  devices (entitlements follow the Play account that owns them).
- **Expo Go**: billing dead by design → `billingService` degrades to
  "unavailable" state; never crash.

---

## 9. Storage keys registry (`@dubaijob_*`)

All AsyncStorage keys versioned for safe rollouts.

- `@dubaijob_auth_v1` — Google session (uid, name, email, photo)
- `@dubaijob_profile_v1` — local profile cache mirror
- `@dubaijob_entitlements_v1` — `{ course: bool, packages: {...} }`
- `@dubaijob_play_tokens_v1` — processed Play tokens (anti-replay, cap 200)
- `@dubaijob_home_visits_v1` — Tab-1 focus counter (discount scheduling)
- `@dubaijob_offer_deadline_v1` — active discount deadline ts
- `@dubaijob_offer_extended_v1` — has the one-time 24h extension been used?
- `@dubaijob_course_progress_v1` — `{ [videoId]: 'done' }` (+ intro pre-seeded)
- `@dubaijob_toast_session_v1` — toasts shown this session (cap 3).
  **Session-scoped, not durable**: keep the counter in memory and reset it on
  every cold boot (or delete the key at boot). AsyncStorage persists across
  launches — persisting this counter would permanently cap toasts at 3, forever.

---

## 10. Verification workflow

```bash
npx expo install --check   # must be "up to date"
npx tsc --noEmit           # MUST exit 0 before any code change ships
```

No Jest/Detox/E2E. Manual smoke list:

1. Fresh install dev build → login → Google sheet → allow → profile prefilled
2. Save profile → tabs open, Tab 1 shows progress hero + video list skeletons → rows
3. Tap video → player loads thumbnail → plays (needs internet)
4. Visit Tab 1 three times → `DiscountModal` shows with ticking countdown
5. Stay 1 min → `GlassToast` slides in, max 3, tap → proof tab
6. Proof tab scroll: stats count up → reviews → gallery → timeline → hero story
7. Packages tab → buy (Play test track) → `success.tsx` → entitlement persists relaunch
8. Airplane mode → cached profile + catalog still render; player shows offline note
9. Account sheet → edit phone → saves; Restore Purchases reconciles; Sign out
   clears session (both Google and Firebase) and returns to login
10. Kill app mid-purchase → relaunch → boot recovery grants/acknowledges correctly

---

## 11. Rebuild requirements & gotchas

- **Google Sign-In**: needs config plugin + `google-services.json` + dev build
  (`npx expo run:android`). Dead in Expo Go. SHA-1 must include BOTH upload
  and Play-signing certs or store builds fail auth silently.
- **expo-iap**: native module, needs prebuild + release/dev build. Products
  must exist in Play Console or purchase returns `unavailable`. Test with
  license-tester accounts on a closed track.
- **YouTube embeds**: need internet; unlisted (not private) videos with
  embedding allowed. Thumbnails: try `maxresdefault` → fall back to
  `hqdefault` → `mqdefault` (some videos 404 on maxres). If a video blocks
  embed, fallback: "Watch on YouTube" button via `expo-linking`.
- **WebView fullscreen quirk (portrait-locked app)**: YouTube fullscreen wants
  landscape. Handle `onShouldStartLoadWithRequest`/fullscreen-change in the
  WebView and allow rotation for the player route only (android
  `configChanges`), otherwise the video gets stuck or exits to a black screen.
  Test on a real low-end device, not just emulator.
- **Firebase lib compat (build-time risk, unverified)**: `@react-native-firebase/*`
  on RN 0.86 / SDK 57 must be verified at build time. Fallback if native
  modules break: Firebase JS SDK (`firebase/app` + `firebase/auth` +
  `firebase/firestore`) with web API key — works in the Expo managed flow but
  needs the same SHA-1/OAuth config.
- **Font failure**: if Playfair `.ttf` fails to load, splash gate MUST time out
  (≤5s) and fall back to system serif — never hang on the splash screen.
- **Firestore**: rules locked to own-doc; `google-services.json` gitignored.
  Offline persistence on (default) so cached profile works airplane-mode.
- **BlurView on Android**: needs `blurTarget` ref to actually blur; `GlassToast`
  falls back to semi-transparent fill without it. Overflow + shadow rule:
  never put `overflow: hidden` on a shadow node (wrap instead).
- **Android-only invariant**: never add `ios`/`web` config, deps
  (`react-dom`, `react-native-web`), or `.web.` files. If a library demands
  them, find an alternative.
- **expo-env.d.ts**: auto-generated (`/// <reference types="expo/types" />`),
  gitignored; if typecheck complains about CSS/asset modules, ensure it exists.

---

## 12. What NOT to do

1. No iOS/web targets, ever (see §11 invariant).
2. No borders or decorative shadows (Midnight Gold = tonal layering only).
3. Gold is reserved (§4) — never gold for errors, destructive actions, or body text.
4. Never more than one primary CTA per screen.
5. Never show a purchase button for a Play SKU that `fetchProducts` didn't return.
6. Never invent purchases/reviews anywhere except the `socialProof.ts` seed file.
7. Never put reply timers, purchase logic, or auth logic inside screens — screens
   are thin views over services.
8. Never commit `google-services.json`, tokens, or client secrets.
9. Never reset the discount deadline to manufacture urgency mid-session.
10. Typecheck must pass before any change ships. No exceptions.
