## Context

The K108 Torneo app is a Remix + Tailwind CSS v3 family tournament management tool. The entire UI layer (5 components, 12 route files) currently uses a flat white/gray Tailwind palette with no custom theme configuration. The tailwind.config.ts has an empty `extend: {}` block. All pages use `bg-white`, `bg-gray-50`, `text-gray-*`, `shadow`, and `border` utilities — effectively an unstyled wireframe.

Users are family members checking scores on phones at the tournament venue. The admin is a single organizer managing teams, matches, and scores. The app needs to feel like a premium sports experience, not a developer prototype.

## Goals / Non-Goals

**Goals:**
- Transform the entire UI to a dark sports-themed aesthetic with amber/gold accents
- Make scores, standings, and match status instantly readable at a glance
- Provide a responsive mobile experience with bottom tab navigation for spectators
- Ensure admin pages are equally usable in dark theme with proper form styling
- Create a coherent design token system in Tailwind config for maintainability
- Keep all existing functionality intact — this is purely visual

**Non-Goals:**
- No light mode or theme toggle — dark only
- No new features, pages, or data model changes
- No new npm dependencies — use existing Tailwind v3 utilities
- No logo or brand imagery — the app name in text is sufficient
- No animation libraries or complex transitions

## Decisions

### 1. Color Architecture: Slate + Amber Token System

**Decision**: Define custom color tokens in `tailwind.config.ts` using semantic names (`base`, `surface`, `elevated`, `inset`, `accent`, `primary`, `secondary`, `muted`) mapped to Tailwind's slate and amber scales.

**Rationale**: Hardcoding `slate-900` and `amber-400` in every component creates maintenance burden and inconsistency. Semantic tokens let us change the entire palette from one place and ensure all components stay coherent.

**Alternatives considered**:
- Raw Tailwind color classes everywhere: rejected — inconsistent, hard to change globally
- CSS custom properties only: rejected — harder to use with Tailwind's utility-first approach
- Both tokens in config AND CSS vars: chosen — tokens in config for Tailwind utilities, CSS vars for `tailwind.css` base styles

### 2. Navigation: Top Bar Desktop + Bottom Tabs Mobile

**Decision**: Public layout uses a sticky top navigation bar on desktop (md+) and a fixed bottom tab bar on mobile (<md). Admin uses a horizontal tab bar instead of a sidebar on mobile.

**Rationale**: Family members watching a game hold their phone in one hand. Bottom tabs are thumb-reachable and match the mental model of sports apps (FotMob, ESPN). The current top nav with text links vanishes or wraps awkwardly on small screens.

**Alternatives considered**:
- Hamburger menu: rejected — hides navigation, requires extra tap, not the sports app pattern
- Persistent sidebar on all sizes: rejected — wastes mobile screen space
- Top-only nav: current approach, rejected for mobile UX reasons

### 3. Standings Table: Horizontal Scroll on Mobile, Playoff Cutoff Line

**Decision**: The standings table preserves full column layout and uses `overflow-x-auto` for mobile. A visual separator (amber dashed border) appears after the playoff cutoff position (based on `playoffCutoff` from tournament data).

**Rationale**: Collapsing the table to cards on mobile loses the at-a-glance comparison that makes standings valuable. Horizontal scroll is the standard pattern in sports apps. The cutoff line adds meaning — spectators immediately see who qualifies.

**Alternatives considered**:
- Card-based layout on mobile: rejected — loses column comparison, requires significant responsive logic
- Responsive columns (hide GF/GC on mobile): rejected — family members care about goal difference

### 4. Form Inputs: Dark Mode with color-scheme

**Decision**: All form inputs use `bg-inset` (slate-950, darker than card surface), `border-default` (slate-700), and `color-scheme: dark` in the base CSS. Focus states use amber rings. Primary buttons have amber background with dark text.

**Rationale**: Default browser inputs on a dark page render with white backgrounds unless `color-scheme: dark` is set. Making inputs slightly darker than the card surface creates visual depth. Amber focus rings match the accent system.

**Alternatives considered**:
- White inputs on dark background: rejected — jarring, breaks visual flow
- Custom input components: rejected — unnecessary complexity for form inputs, native elements work fine with proper styling

### 5. Component Surface Layering: Three-Level Depth System

**Decision**: Use three surface levels: `base` (page bg, slate-950), `surface` (cards/nav, slate-900), `elevated` (hover/active, slate-800). Cards use `border border-default` by default and `border-accent/30` on hover or for highlighted elements (top standings rows).

**Rationale**: In dark themes, depth is communicated by darkness level, not shadows. A three-level system is simple to maintain and creates clear visual hierarchy without resorting to shadow utilities that look odd on dark backgrounds.

**Alternatives considered**:
- Shadow-based depth: rejected — shadows are barely visible on dark surfaces
- More granular levels (4-5): rejected — creates complexity without proportional value

### 6. Status Indicators: Color-Coded Dots + Labels

**Decision**: Match status uses colored dot + text: emerald-400 for "En juego" (live), emerald-500 for "Completado" (completed), slate-500 for "Programado" (scheduled). Withdrawn teams use red-400. Score numbers use amber-400 bold.

**Rationale**: Dots are universally understood in sports apps. The current approach uses colored pill backgrounds which work on white but look muddy on dark surfaces. Simple colored text + dot is cleaner and higher contrast.

### 7. Admin Layout: Same Dark Theme with Mobile-Aware Adjustments

**Decision**: Admin pages share identical color tokens and surface layering. The sidebar transforms to a horizontal tab bar on mobile. All forms, buttons, and tables use the same dark styling as public views.

**Rationale**: Maintaining two visual systems doubles the design surface. A single dark theme is simpler to maintain and the organizer is also a user — they should have the same premium experience.

## Risks / Trade-offs

- **[Accessibility on dark]** → Mitigation: All text meets WCAG AA contrast ratios against dark backgrounds. Slate-50 on slate-950 is ~15:1 ratio. Amber-400 on slate-950 is ~8:1. Both exceed AA requirements.
- **[Form input UX on mobile]** → Mitigation: Use `color-scheme: dark` globally and ample touch targets (min 44px height). Input text size at least 16px prevents iOS zoom-on-focus.
- **[Large scope — every UI file changes]** → Mitigation: Design tokens centralize decisions. Implementation proceeds component-by-component with visual verification. No logic changes, so existing tests remain valid.
- **[Emoji flags render differently across platforms]** → Mitigation: This is a pre-existing condition. The change does not alter flag rendering, only the surfaces around them. No regression risk.