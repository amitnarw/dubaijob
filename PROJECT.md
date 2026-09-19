# DubaiJob — Android Course App (Podcast-Style Masterclasses), Project Context for AI Assistants

> **Read this file first** when starting a new chat about this repo. It captures the
> app's purpose, monetization, architecture, the podcast-reference design system
> ("Midnight Studio"), the i18n system (6 languages), the social-proof + discount
> psychology engines, the storage layout, and what NOT to do.

---

## 1. What this app is

**DubaiJob** — an Expo SDK 57 (React Native 0.86, React 19) **Android-only** app
that sells a single paid **"Dubai Job" 25-step video course** (₹6,000 INR) plus
paid add-on packages, presented as a **premium podcast/masterclass app**.

- **Platform**: Android only. `platforms: ["android"]` in `app.json`. Never
  re-add iOS/web configs, `react-dom`, `react-native-web`, or `.web.` files.
- **Design reference**: dark podcast app (near-black canvas, tonal cards, white
  primary actions, colorful concentric-ring artwork). Gold reserved for
  COMMERCE ONLY (price, badges, discount timer).
- **Tabs**: Home, Radio, **Podcast (index — main tab)**, Search.
  `packages` and `proof` tabs exist but are hidden from the tab bar
  (`href: null`), reachable from Home.
- **Monetization**: Google Play In-App products via `expo-iap` (see §8).
- **i18n**: 6 languages — English, Hindi, Sinhala, Tamil, Urdu, Bengali (§5).
- **Login**: Google Sign-In with **demo-mode mock fallback** (§6).

Journey: install → language → login → trust → buy ₹6,000 → learn.

---

## 2. Tech stack & commands

|                       |                                                        |
| --------------------- | ------------------------------------------------------ |
| Framework             | Expo SDK 57 (`expo`, `expo-router`), Android-only      |
| React                 | 19.2.3 / RN 0.86.3                                     |
| Auth                  | `@react-native-google-signin/google-signin` (lazy, guarded) + `@react-native-firebase/auth` |
| Profile storage       | Firestore (`@react-native-firebase/*`) + AsyncStorage cache |
| Video                 | YouTube embeds via `react-native-webview` iframe; thumbnails `i.ytimg.com` |
| Payment               | REAL Google Play Billing via `expo-iap` (lazy, guarded) |
| Storage               | `@react-native-async-storage/async-storage`            |
| Animations            | `react-native-reanimated`                              |
| Font                  | **Inter** (variable TTF bundled, 4 family names), splash-gated with 5s timeout |
| i18n                  | `expo-localization` + custom `LocaleContext` (§5)      |
| TypeScript            | 6.0.3, strict                                          |

```bash
npm install
npx expo install --check     # must be "up to date"
npx tsc --noEmit             # MUST pass before shipping
npx expo run:android         # dev build (Google Sign-In + IAP need this)
```

**Typecheck + manual smoke list = verification.** tsc alone does NOT catch
native-module runtime crashes — see §11 for the Expo Go guard rule.

---

## 3. Architecture & file map

```
src/
├── app/
│   ├── _layout.tsx              # LocaleProvider > AuthProvider > PurchaseProvider > PlayerProvider
│   │                            # auth gate: signed-in ? tabs : login
│   ├── login.tsx                # Google btn (mock fallback) + prefilled profile form
│   ├── language.tsx             # language picker (modal)
│   ├── account.tsx              # profile edit + language chips + owned list + restore + signout (modal)
│   ├── video/[id].tsx           # WebView YouTube player + localized title + done-marking
│   ├── checkout/[productId].tsx # order summary + rating-beside-price + pending state
│   ├── success.tsx              # celebratory confirmation
│   └── (tabs)/
│       ├── _layout.tsx          # 4 tabs (home/radio/podcast/search) + FloatingMiniPlayer + SocialProofHost
│       ├── index.tsx            # PODCAST (main): top carousel, chapter tiles, mentors,
│       │                        # curriculum accordion (25 steps/5 chapters/2 sections),
│       │                        # progress strip, discount pill+modal, unlock bar
│       ├── home.tsx             # links to packages/proof/language
│       ├── radio.tsx            # simulated radio stations
│       ├── search.tsx           # search over TOP_PODCASTS
│       ├── packages.tsx         # add-on IAP cards (hidden tab)
│       └── proof.tsx            # stats/reviews/gallery/timeline/hero story (hidden tab)
├── components/
│   ├── GoldButton.tsx           # white primary btn (dark variant = tonal/gold)
│   ├── VideoRow.tsx             # localized lesson row: thumb + step + lock + done + expand
│   ├── PackageCard.tsx, ReviewCard.tsx, StatBand.tsx, TrustStrip.tsx
│   ├── DiscountModal.tsx        # countdown offer modal
│   ├── GlassToast.tsx           # localized social-proof toast
│   ├── SocialProofHost.tsx      # toast scheduler (25-40s first, 2-4min, max 3)
│   ├── ProgressRing.tsx
│   └── podcast/
│       ├── ConcentricArtwork.tsx  # colorful ring artwork (5 themes)
│       ├── FloatingMiniPlayer.tsx # docked above tab bar
│       └── AnimatedPressableCard.tsx
├── constants/
│   └── theme.ts                 # ⭐ SINGLE SOURCE OF TRUTH — all tokens (§4)
├── i18n/
│   ├── LocaleContext.tsx        # LocaleProvider, useLocale(), t(), Lang type
│   └── strings/{en,hi,si,ta,ur,bn}.ts   # ~110 keys each; en.ts defines keys
├── context/
│   ├── AuthContext.tsx, PurchaseContext.tsx
│   └── PlayerContext.tsx        # simulated player state (track/progress)
├── data/  (ALL owner-editable content)
│   ├── courseVideos.ts          # 25 steps, owner's EN+HI titles verbatim, real YT ids
│   ├── courseChapters.ts        # 5 chapters, L10n titles
│   ├── podcastData.ts           # TOP_PODCASTS / CATEGORIES / AUTHORS / CATEGORY_DETAILS
│   ├── packages.ts, reviews.ts, offers.ts, socialProof.ts, storageKeys.ts
└── services/
    ├── env.ts                   # ⭐ isExpoGo() — THE native-module guard (§11)
    ├── authService.ts, profileService.ts, billingService.ts  (all guarded)
    ├── courseService.ts, discountService.ts, socialProofEngine.ts
    ├── fontService.ts           # Inter loading (5s timeout, never hangs splash)
    ├── tabFocus.ts, toastControl.ts, storage.ts, appConfig.ts, youtubeService.ts
```

---

## 4. Design system — "Midnight Studio" (token-first, Tailwind-style)

**Cardinal rule: NOTHING is hardcoded outside `src/constants/theme.ts`.**
No hex/rgba in screens. Screens compose `Colors`, `Type`, `Spacing`, `Radii`,
`Shadows`, `Presets` — exactly like Tailwind utility classes.

- **Palette**: `canvas #111215`, `surface #18181D`, `surfaceAlt #141519`,
  `elevated #1E1F25`, `trackBg #32333B`; text `#FFFFFF` / `muted` / `faint` /
  `faintest`; hairline strokes 5-10% white (the ONLY borders allowed)
- **Accent artwork set**: peach/teal/crimson/purple/blue (+light variants)
- **Gold (commerce only)**: `gold/goldLight/goldDeep/goldTint/goldBorder` —
  price, owned badges, discount timer, curriculum step tags. NEVER body text
  or errors.
- **Type presets** (`Type.*`): pageTitle 28/-0.5, sectionLabel 14/600,
  cardTitle 15.5/-0.3, chapterTitle 16, body 14, small 12, caption 11,
  micro 10.5, price 26/-0.5 — all Inter, reference-matched.
- **Font**: Inter variable TTF (`assets/fonts/Inter-Variable.ttf`) registered
  as 4 families (Regular/Medium/SemiBold/Bold) pointing at the one file.
  Loaded in root layout with 5s timeout — splash NEVER hangs on font failure.
- **Component presets** (`Presets.*`): card, tile, pill, pillActive, input,
  sectionHeader, primaryBtn — compose, don't redefine.
- **Shadows**: tab bar + modals + toast + mini-player only.
- Motion: FadeInDown entrances (400-450ms, staggered 60-90ms), Layout
  springs on accordion, press scale 0.93-0.97 + haptics.

---

## 5. i18n system (6 languages)

- **Core**: `src/i18n/LocaleContext.tsx` — `LocaleProvider` wraps the app;
  `useLocale()` returns `{ lang, setLang, t }`. `t(key, vars)` interpolates
  `{name}`-style vars; falls back to English then the key itself.
- **Persistence**: `@dubaijob_locale_v1`. Default: device language if
  supported, else English.
- **Strings**: `strings/en.ts` defines the `StringKey` set (~110 keys);
  `hi/si/ta/ur/bn.ts` implement the exact same shape (TypeScript-enforced —
  a missing key is a compile error, not a runtime blank).
- **Register**: modern colloquial per language (Hindi = Hinglish-flavored to
  match the creator's own titles; Urdu = RTL text, LTR layout per spec).
- **Data model**: chapter titles are `L10n = Record<Lang,string>`
  (`courseChapters.ts`); lesson titles likewise (`courseVideos.ts`). The video
  screen shows the localized title + owner's Hindi title + a note
  (`course_note_nonhindi`) for non-Hindi locales: videos ARE Hindi-spoken.
- **Pickers**: first-run via Home → Language; persistent via Account sheet
  chips (native-script labels: हिंदी, සිංහල, தமிழ், اردو, বাংলা).
- **Owner task**: review/tweak AI-written translations in the 6 strings files.

---

## 5. Course data (owner's exact content)

- **25 steps**, 2 sections (India Prep 1-10; Dubai Visit 11-15),
  5 chapters: ch1 Steps 1-4, ch2 5-10, ch3 11-17, ch4 18-21, ch5 22-25.
- Every lesson: real YouTube ID, owner's English title, owner's Hindi title
  (verbatim, e.g. "दुबई में कोनसी भाषा बोली जाती है?"), localized titles for
  all 6 languages, duration, English description, freePreview flag
  (Step 1 free; rest locked until purchase).
- `podcastData.ts` TOP_PODCASTS reference steps 1/5/12 with real videoIds.

---

## 6. Auth & profile

- Google Sign-In (`@react-native-google-signin/google-signin`), LAZY-loaded,
  Expo Go-guarded (§11). Placeholder OAuth ID → **demo-mode mock login**
  (`signInMock`, uid `mock-user`, `mock: true` chip). Real path auto-takes
  over when configured — never remove the mock.
- Firebase session MANDATORY for Firestore rules: `GoogleAuthProvider
  .credential(idToken)` → `signInWithCredential`. Both firebase imports are
  lazy AND behind `isExpoGo()`.
- Profile: Firestore `users/{uid}` + AsyncStorage mirror; offline writes stay
  local and retry on next save/boot. Rules: own-doc only.
- `google-services.json` in repo root, gitignored, never committed.

---

## 7. Psychology engines

### A. Social proof toasts (`socialProofEngine` + `SocialProofHost` + `GlassToast`)
- First toast 25-40s after tabs mount, then every 2-4 min, max 3/session,
  session-local seen-set (no name+city repeats), paused while
  video/modal/checkout active (`toastControl.paused`).
- Content from `socialProof.ts` seeds; actions localized via
  `toast_purchased`-family keys. Owner-controlled, modest claims (policy risk
  acknowledged).

### B. Discount modal (`discountService` + `DiscountModal`, mounted in index.tsx)
- Visit counter `@dubaijob_home_visits_v1` — counted ONLY on fresh tab
  arrivals (other tab / app foreground; NOT route returns) via `tabFocus.ts`.
- Shows on visits 3 and 8 of each 10-cycle, 1.5s delay after focus.
- 48h deadline (`@dubaijob_offer_deadline_v1`), clock-clamped; one-time 24h
  extension (`@dubaijob_offer_extended_v1`). Strike price ₹6,000 →
  `DISCOUNT_PRICE_INR` (owner TBD in `offers.ts`).

---

## 8. Payments (REAL Play Billing, `expo-iap`, LAZY + guarded)

- Products: `course_full` (₹6,000) + `pkg_1on1`, `pkg_cv`, `pkg_book`,
  `pkg_qa`. **ALL non-consumable** (consumed = unrestorable on reinstall).
- State machine: `purchased` → verify token unseen → grant
  (`@dubaijob_entitlements_v1`) → finishTransaction → record token (cap 200).
  `pending` (common in India/UPI) → grant NOTHING, listener re-fires.
  Replay token → acknowledge only. 3-day acknowledgement rule → boot
  recovery + Restore button acknowledge leftovers.
- Storefront: `fetchProducts` first; unknown SKUs omitted → checkout shows
  "unavailable, try later", never a dead button.
- Expo Go: `ensureConnection()` returns false before any import → graceful
  "unavailable" everywhere.

---

## 9. Storage keys (`@dubaijob_*`)

`auth_v1` (session), `profile_v1` (cache), `entitlements_v1`, `play_tokens_v1`,
`home_visits_v1`, `offer_deadline_v1`, `offer_extended_v1`,
`course_progress_v1`, `locale_v1`. Toast session counter is in-memory
(never persisted — it's per-launch by definition).

---

## 10. Verification workflow

```bash
npx tsc --noEmit        # types
npx expo install --check
```

Manual smoke (Expo Go): mock login → profile → tabs → progress strip shows
0/25 → play Step 1 (free) → mark done → progress updates → locked rows show
locks + unlock bar → visit Podcast tab 3× → discount modal + countdown →
toast appears within ~40s → Account: language chips switch all UI → packages
→ checkout shows unavailable-state gracefully (Expo Go).

---

## 11. Expo Go native-module guard (READ THIS BEFORE TOUCHING SERVICES)

Expo Go's binary contains NO third-party native modules. Their JS wrappers
throw AT MODULE EVALUATION — try/catch around `import()` is NOT enough.

**THE RULE**: any touchpoint of `@react-native-google-signin/*`,
`expo-iap`, `@react-native-firebase/*` must FIRST check `isExpoGo()` from
`src/services/env.ts` and return early — BEFORE `require()`/`import()` is
even evaluated. Static imports of these libs are FORBIDDEN (type-only
imports are fine — they're erased at runtime).

Current safe touchpoints: `authService.loadGoogleSignin` + `firebaseSignIn`
+ `signOutEverywhere` (guarded), `billingService.ensureConnection` (guarded),
`profileService.firestoreAvailable` (guarded). If you add a native-lib call
site, add the guard FIRST or it will crash in Expo Go.

---

## 12. What NOT to do

1. No iOS/web targets, deps, or `.web.` files.
2. No hardcoded hex/rgba outside `theme.ts` (the whole point of §4).
3. Gold = commerce only. Never errors, body text, or decorative fills.
4. No static imports of native-only libs (§11) — lazy + `isExpoGo()` first.
5. Never more than one primary CTA per screen.
6. Never show purchase buttons for SKUs missing from the storefront.
7. Screens are thin views over services; no business logic in screens.
8. Never commit `google-services.json` or secrets.
9. Never reset the discount deadline mid-session; never trust absolute clock.
10. `tsc --noEmit` must pass AND the §10 smoke list must run before shipping.
11. Never remove the demo-mode mock login (it's the Expo Go story).
12. Never let font loading hang the splash (5s timeout stays).