## Why

Users have no visual feedback during HTTP requests. Form submissions, page navigations, and mutations proceed silently — the only indication is text swaps like "Generando..." that are inconsistently applied. This creates uncertainty about whether an action was registered.

## What Changes

- Add a global loading bar component that appears at the top of the viewport whenever React Router navigation is active (submitting or loading)
- Mount it in `root.tsx` so it applies to all routes automatically
- Use `useNavigation()` to detect state transitions

## Capabilities

### New Capabilities
- `loading-indicator`: Global visual feedback for in-progress navigation and form submissions via a top loading bar

### Modified Capabilities

## Impact

- `app/root.tsx` — add navigation state detection and render the loading bar
- New component `app/components/ui/LoadingBar.tsx`
- Existing per-button `disabled={isSubmitting}` patterns remain unchanged but can be cleaned up later