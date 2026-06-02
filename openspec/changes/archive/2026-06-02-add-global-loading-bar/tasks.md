## 1. Loading Bar Component

- [x] 1.1 Create `app/components/ui/LoadingBar.tsx` with a fixed-position bar at the top of the viewport, 3px height, accent color at partial opacity, and an indeterminate CSS sliding animation
- [x] 1.2 Add the CSS `@keyframes` animation to `app/tailwind.css` for the indeterminate sliding effect

## 2. Root Layout Integration

- [x] 2.1 Import `useNavigation` and `LoadingBar` in `app/root.tsx`
- [x] 2.2 Render `LoadingBar` conditionally in the `App` component based on `navigation.state !== "idle"`

## 3. Verification

- [x] 3.1 Run `typecheck` to ensure no type errors
- [x] 3.2 Run `lint` to ensure no lint errors