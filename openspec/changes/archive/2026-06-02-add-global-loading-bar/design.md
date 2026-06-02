## Context

The app uses React Router v7 with server-side form actions. All mutations go through `<Form method="post">` and page navigations through normal links. Currently, `useNavigation()` is used in some routes (`admin.matches`, `admin.teams`, `admin.settings`, `_auth.login`) to detect `navigation.state === "submitting"` and disable buttons with text like "Generando..." or "...". However, the verify page and several other buttons have no feedback at all. The approach is inconsistent and provides no visual indicator to the user that the app is processing their request.

The app uses Tailwind CSS with a dark theme (base: `#020617`, accent: `#f59e0b` amber).

## Goals / Non-Goals

**Goals:**
- Show a thin animated progress bar at the top of the viewport during any navigation state (loading, submitting)
- Mount once in `root.tsx`, apply globally to all routes without per-page changes
- Keep existing `disabled={isSubmitting}` on buttons — they complement the bar, no conflict

**Non-Goals:**
- Per-form granularity (useFetcher migration)
- Modifying, replacing, or removing existing button disabled states
- Error toast/notification system
- Overlay or modal-style loaders

## Decisions

### 1. Top progress bar (NProgress-style) over other approaches

**Chosen:** Thin horizontal bar at the top of the viewport, fixed position.

**Alternatives considered:**
- Full overlay spinner: Too heavy for quick form submissions, blocks the view
- Per-button spinner: Requires refactoring all buttons, doesn't cover page transitions
- Bottom bar: Less convention, less visible

**Rationale:** Top progress bars are the established pattern (YouTube, GitHub, NProgress). They're visible without being intrusive and work well on mobile.

### 2. CSS-only animation over JS-driven animation

**Chosen:** Pure CSS `@keyframes` with Tailwind + a small custom animation in `tailwind.css`.

**Alternatives considered:**
- JS-driven width animation (like NProgress library): Overkill, adds a dependency
- CSS transition on width: Needs JS to set width values

**Rationale:** For a simple indeterminate bar, a CSS animation that slides across and back is sufficient. No JS beyond toggling a class.

### 3. Show on both "loading" and "submitting" states

**Chosen:** Show the bar for both `navigation.state === "loading"` and `navigation.state === "submitting"`.

**Rationale:** Users expect feedback for any network activity, not just form posts. Fast navigations may flash briefly, which is acceptable.

### 4. Use accent color for the bar

**Chosen:** The bar uses the existing `accent` color (`#f59e0b` amber) at reduced opacity.

**Rationale:** Consistent with the app's visual language. The accent color is already used for interactive elements, so the bar feels native.

## Risks / Trade-offs

- **Fast navigations may cause a brief flash**: The bar appears and disappears quickly on SSR page transitions. This is acceptable — it confirms the app is responsive. If it becomes annoying, a minimum display time can be added later.
- **Bar doesn't indicate progress percentage**: It's an indeterminate animation. For form submissions, the server responds quickly so this is fine. No percentage-based progress is needed.
- **Global `useNavigation` in root.tsx**: This detects navigation for the current route match. It won't fire for cross-route navigations that React Router handles internally, but those are fast enough not to need a bar.