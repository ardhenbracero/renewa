# Renewa

Local-only subscription tracker for iOS (App Store target). Users add the subscriptions they pay for, see what renews soon, view a calendar and spending insights, and optionally split a subscription's cost with family members. There is no backend, no accounts, no sign-in, no analytics, and no network calls. All data stays on the device.

## Stack

- Expo (managed workflow), React Native, TypeScript, expo-router (file-based routing)
- Data: `expo-sqlite` using the **synchronous API** (`getAllSync`, `runSync`, `execSync`). Not Drizzle, not async.
- Small settings (profile name, onboarded flag, theme preference): `@react-native-async-storage/async-storage`
- Animation: `react-native-reanimated`. Graphics: `react-native-svg`, `expo-linear-gradient`
- Icons: `@expo/vector-icons` (Ionicons) for UI icons, `simple-icons` for brand logos
- Developed in VS Code (no Xcode), tested on a physical iPhone through **Expo Go**. The phone has no console access, so debug by rendering values on screen temporarily.

## Commands

```bash
npx expo start --clear        # dev server, scan the QR in Expo Go
npx expo install <package>    # always use this for Expo/native packages, not npm install
npx tsc --noEmit              # type check
```

Check `package.json` for lint or test scripts before assuming they exist.

## Project layout

Paths reflect the layout at the time of writing. Confirm aliases in `tsconfig.json` (`@/` points to `src/`; `@db/` points to the database folder).

```
src/
  app/                         expo-router screens
    _layout.tsx                providers + Stack.Protected (onboarding vs main app)
    index.tsx                  Vault (home)
    timeline.tsx               month calendar + upcoming renewals
    insights.tsx               category donut, priciest, 6-month outlook, billing cycles
    add-subscription.tsx       modal, create/edit (edit mode via ?id=)
    subscription-details.tsx   details, Renew button, Family Sharing (?id=)
    onboarding.tsx             welcome + name steps
    settings.tsx               appearance (System / Light / Dark)
  components/                  shared components
    subscription-details/  onboarding/  timeline/  insights/
  constants/                   palette.ts, theme.ts, currencies.ts, categories.ts,
                               service-presets.ts, subscription-relevant-icons.ts, all-brand-icons.ts
  context/                     profile-context.tsx, theme-context.tsx
  hooks/                       use-subscriptions, use-members, use-theme, use-themed-styles
  utils/                       date.ts, format.ts, split.ts, insights.ts
@db/                           database.ts, schema.ts, subscriptions.ts, members.ts, dateLogic.ts
```

Routing: `_layout.tsx` wraps everything in `ThemeProvider > ProfileProvider`. `Stack.Protected guard={!onboarded}` shows only `onboarding`; `guard={onboarded}` shows the rest. Tapping a subscription goes to `/subscription-details?id=`; the pencil icon goes to `/add-subscription?id=`. The bottom tab bar (Vault / Timeline / Insights) uses `router.replace`. New screens must be registered in `_layout.tsx` inside the onboarded block.

## Conventions

- Existing files mix kebab-case (`service-icon.tsx`, `use-subscriptions.ts`) and PascalCase (`InitialsAvatar.tsx`, `DetailsCard.tsx`). Follow the folder you are in; use kebab-case for new files.
- Use `ThemedText` and `ThemedView` for text and containers. Use the app's existing fonts. **Never add fonts from Figma screenshots**; copy only layout and colors from designs.
- Screens stay mounted in the stack, so reload data with `useFocusEffect(useCallback(() => refresh(), [refresh]))`.
- Hooks must run before any early return in a component.
- Validate in the form, not by crashing: `handleSave` already checks name, amount, and date.
- Show the file path for every change you propose, and keep edits minimal. Do not remove or rewrite working logic that was not part of the request.

## Theming (migration in progress)

Light and dark mode use tokens from `constants/palette.ts`, read through `useTheme()` and `useThemedStyles()`. `useTheme()` merges the old `Colors` object with the palette, so old keys like `theme.text` and `themeColor="onAccent"` still work.

Component pattern:

```tsx
const makeStyles = (c: ThemeColors) => StyleSheet.create({ card: { backgroundColor: c.surface } });

export function Thing() {
  const styles = useThemedStyles(makeStyles);   // first line in the component
  const theme = useTheme();                      // only for colors used in JSX (icons, placeholders)
}
```

Keep `makeStyles` at the bottom of the file, outside the component.

Hex-to-token mapping when converting a file:

| Hardcoded | Token |
|---|---|
| `#FFFFFF` card or sheet background | `c.surface` |
| `#FFFFFF` text/icon on a violet fill | `c.onAccent` |
| `#111827` | `c.text` |
| `#374151` `#4B5563` `#6B7280` | `c.textSecondary` |
| `#9CA3AF` `#D1D5DB` | `c.textTertiary` |
| `#F3F4F6` (inputs, tracks, chips) | `c.surfaceMuted` |
| `#E5E7EB` | `c.border` |
| `#F3F1EC` | `c.surfaceWarm` |
| `#5B21B6` / `#4338CA` as a fill | `c.accent` |
| `#5B21B6` / `#4338CA` as text or icon | `c.accentText` |
| `#EDE9FE` | `c.accentSoft` |
| amber `#FEF3C7` `#FDE68A` `#B45309` | `c.amberSoft` `c.amberBorder` `c.amberText` |
| red `#FEE2E2` `#FECACA` `#DC2626` | `c.redSoft` `c.redBorder` `c.redText` |
| green `#ECFDF5` `#A7F3D0` `#047857` | `c.greenSoft` `c.greenBorder` `c.greenText` |
| `rgba(0,0,0,0.4)` backdrops | `c.overlay` |
| card shadows | `c.shadowOpacity`, `c.cardBorder`, `c.cardElevation` (shadows are off in dark; cards get a thin border instead) |

Leave alone: violet gradients, brand badge colors, white text on gradients, and the dark "Selected day" card on Timeline.

Also convert: `themeVariant="dark"` on date pickers becomes `themeVariant={scheme}` (from `useAppTheme()`); add `keyboardAppearance={scheme}` on text inputs; placeholder colors use `theme.textTertiary`.

**New code must use tokens, not hex.** Any file still using a static `StyleSheet.create` with hex will stay light in dark mode. When touching such a file, convert it. Conversion order: add/edit form pieces, Details + Family Sharing, Timeline + Insights, Onboarding, then Vault pieces (`RenewingSoonSection`, `AmountCurrencyCard`, `subscription-row`, `bottom-tab-bar`).

Brand colors: accent `#5B21B6`, gradient `#4338CA` → `#5B21B6` → `#3730A3`, light background `#FAF9F6`.

## Data model

`subscriptions` (camelCase columns): name, amount, currency, billingCycle (`weekly | monthly | yearly | custom`), customIntervalDays, category, notes, isTrial, trialConvertsAt, autoPay, startDate, nextRenewalDate, status, iconSlug, createdAt.

`members` (snake_case columns): id, subscription_id, name, is_manager, paid, created_at. `members.ts` converts rows to the `Member` type with `toMember`.

Database rules:
- Tables are created in `initDatabase()` with `CREATE TABLE IF NOT EXISTS`. Add columns to existing tables with a migration function that checks `PRAGMA table_info` and then runs `ALTER TABLE` (see `migrateAddIconSlugColumn`). Never drop or recreate tables users already have data in.
- SQLite stores booleans as 0/1. Convert at the data-layer boundary.
- Deleting a subscription must also call `deleteMembersForSubscription(id)`, otherwise members are orphaned.

## Dates (easy to get wrong)

- Dates are stored as ISO `YYYY-MM-DD` strings. Use `parseIsoDate` / `toIsoDate` from `utils/date.ts`. Do not do `new Date("YYYY-MM-DD")` directly in UI code: it parses as UTC midnight and can shift a day.
- Compare dates at midnight. `getUpcomingRenewalDate` zeroes `today`'s time; keep it that way, or a subscription renewing today gets rolled a full cycle forward.
- **Two `daysUntil` functions exist.** `@/hooks/use-subscriptions` takes a `Date`; `@/utils/date` takes an ISO string. Check the import before calling.
- `getUpcomingRenewalDate(sub)` rolls a stale `nextRenewalDate` forward to the next future occurrence. `getNextRenewalAfter(sub)` is one cycle past that (used by Renew).
- `renewingSoon` in `useSubscriptions` is anything 7 days out **or overdue** (`<= 7`, including negatives).

## Money

- `toMonthlyAmount(sub)` converts to a monthly equivalent (weekly x 4.345, yearly / 12). Vault total, Insights donut, and "priciest" all use it.
- Totals add amounts across currencies **without conversion**. A known limitation.
- Family splits are computed at render time from the live price (`utils/split.ts`), never stored. Math is in cents; leftover cents go to the manager. The first member added also creates the manager's own row (name from onboarding, "You" if skipped), already marked paid. **Renew resets everyone except the manager to unpaid.**

## Icons

- `BrandIcon` resolves a simple-icons export as `si` + slug with only the first letter capitalized (`applemusic` -> `siApplemusic`). Slugs are lowercase and must match the library's `.slug`.
- `ServiceIcon` renders the brand logo, or falls back to `InitialsAvatar` (colored circle + initials) when `iconSlug` is empty or unknown. Always use `ServiceIcon` for subscription icons, never `BrandIcon` directly.
- `colorForName` is exported from `InitialsAvatar.tsx` and gives a stable color per name.
- Quick pick shows the first 6 of `SERVICE_PRESETS`; "See all" opens a searchable picker over the curated list (`CURATED_BRAND_ICONS`), with a fallback search of every icon. Curated entries in `subscription-relevant-icons.ts` carry a `category`, which must be one of the names in `constants/categories.ts` (includes "Other").
- UI icons: Ionicons. Type icon names as `ComponentProps<typeof Ionicons>["name"]`.

## React Native gotchas learned here

- Never nest a `View` inside a `Text`: it breaks layout and overlaps text. Make them siblings.
- `borderRadius`, `borderWidth`, and `padding` on a `Text` are unreliable. Build pills as a `View` (box styling) containing a `Text` (font styling).
- `fontWeight` must be a string (`"600"`), not a number.
- Date picker: use `display="default"` on iOS (the `spinner` and `inline` styles rendered badly). `onChange` logs a deprecation warning in v9+; it still works.
- Wrap screens with a text input in `KeyboardAvoidingView` (`behavior="padding"` on iOS) and set `keyboardShouldPersistTaps="handled"` on scroll views.
- `FadeUp` / `FadeUpGroup` (`components/fade-up.tsx`): wrap a **column of sections**, never a whole screen container (it collapses layout and kills the stagger). Wrap an entire row as one child, not its pieces. List rows beyond the first few should use `delay={0}`.
- A function called in a component body (instead of inside a handler) causes "Too many re-renders". Check for `onPress={fn()}` and stray setters during render.
- Expo Go limits: native modules not bundled in Expo Go will fail and need an EAS dev build. Face ID is unsupported in Expo Go on iOS (and is out of scope for this app).
- No `localStorage`/`sessionStorage`; use AsyncStorage or SQLite.

## Product decisions (do not reverse without asking)

- No accounts, sign-in, or sign-up. First launch shows a two-step onboarding (welcome, then optional first name). No app lock.
- No cloud sync, backend, analytics, or trackers. Privacy copy says "on-device only". Do not claim "encrypted"; the app does not do its own encryption.
- Family Sharing only tracks who owes what. The app never moves money, so avoid words like "payment request" in the UI.
- Insights "6-Month Outlook" shows **scheduled** charges per month, not history. No payment history is stored.
- Free trial and auto-pay are independent toggles. The Amount card shows one combined pill: "Trial - auto-renews", "Trial - won't auto-renew", or "Auto-Pay active".

## Known issues and TODO

- `addInterval` uses `setMonth(+1)`, so Jan 31 rolls to Mar 3 instead of Feb 28. Fix in `dateLogic.ts` (clamp to the last day of the month).
- Notifications are not built. The onboarding card says "Timely Pings - Alerts before billing"; build it or change the copy before release.
- Optional: store a payment record on Renew to turn the Insights outlook into real history; custom per-member split amounts; a Settings field to change the name after onboarding.
- Remove leftovers before release: the `// TEMP` `AsyncStorage.multiRemove` line in `profile-context.tsx`, any `DEBUG:` text on screens, and the stale `// TEMPORARY` comment in `RenewingSoonSection.tsx`.

## Release checklist (App Store)

1. `app.json`: name, slug, permanent bundle identifier (e.g. `com.yourname.renewa`), version, `userInterfaceStyle: "automatic"`.
2. App icon (1024x1024 PNG) and splash screen.
3. Apple Developer account ($99/year).
4. `npx eas-cli login`, `eas build:configure`, then `eas build --platform ios` (preview profile first, production after).
5. `eas submit --platform ios`, then test through TestFlight on a real device.
6. App Store Connect: screenshots, description, keywords, support URL, privacy policy URL (state that no data is collected), age rating.
7. Review-rejection risks: placeholder text, broken links, crash on launch, features promised in copy but not built.

## Working with the developer

- Say which file each change goes in, and whether it is a new file or an edit.
- Explain the cause of a bug in a sentence or two before the fix.
- Figma prompts for design tools must stay under 2,000 characters and describe the existing app style (violet accent, white cards with soft shadows, 20px radii) so output matches the app.
