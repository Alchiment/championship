## ADDED Requirements

### Requirement: Dark form inputs
All form input elements SHALL use `bg-inset border border-default rounded-lg text-primary placeholder:text-muted focus:border-accent focus:ring-1 focus:ring-accent/50` styling. The `color-scheme: dark` CSS property SHALL be set globally in the base layer to ensure native form controls (date pickers, number spinners, checkboxes) render in dark mode.

#### Scenario: Text input focus state
- **WHEN** a user focuses a text input in admin settings
- **THEN** the input border transitions from slate-700 to amber-500 with a subtle amber ring, and the cursor is visible against the dark background

#### Scenario: Number input for match scores
- **WHEN** an admin focuses the score input field on the matches page
- **THEN** the number input renders with dark background, amber focus ring, and properly styled increment/decrement buttons matching the dark theme

### Requirement: Dark button styles
The system SHALL define three button variants: Primary (`bg-accent hover:bg-accent-600 text-slate-950 font-medium rounded-lg`), Secondary (`bg-elevated hover:bg-slate-700 text-primary font-medium rounded-lg`), and Destructive (`bg-red-500/10 text-red-400 hover:bg-red-500/20 font-medium rounded-lg`). All buttons SHALL have `disabled:opacity-50 disabled:cursor-not-allowed` and minimum height of 40px (py-2.5).

#### Scenario: Primary button hover
- **WHEN** a user hovers over a "Guardar" button
- **THEN** the button background transitions from amber-500 to amber-600 with dark text remaining readable

#### Scenario: Destructive button appearance
- **WHEN** a "Retirar" action button renders
- **THEN** it uses a transparent red-tinted background (red-500/10) with red-400 text, and on hover shifts to red-500/20

### Requirement: Dark form labels and helpers
Form labels SHALL use `text-secondary text-sm font-medium`. Helper and hint text SHALL use `text-muted text-xs`. Error messages SHALL use `text-red-400 text-sm`. Form sections SHALL use `bg-surface border border-default rounded-xl p-6` containers with `space-y-4` inner spacing.

#### Scenario: Form with validation error
- **WHEN** a form submission returns an error
- **THEN** the error message displays in red-400 text-sm below or near the relevant field, and the input border does NOT change to red (this would conflict with focus states)

### Requirement: Checkbox styling
Checkboxes SHALL use `h-4 w-4 rounded border-default bg-inset text-accent focus:ring-accent/50` and render properly in dark mode via the global `color-scheme: dark` setting. Checkbox labels SHALL use `text-secondary text-sm`.

#### Scenario: Tournament settings checkboxes
- **WHEN** an admin views the tournament settings form
- **THEN** the "Fase de grupos" and "Partido 3er puesto" checkboxes render with dark backgrounds, amber accent when checked, and amber focus ring