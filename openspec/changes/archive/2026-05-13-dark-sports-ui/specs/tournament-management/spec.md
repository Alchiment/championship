## MODIFIED Requirements

### Requirement: Tournament settings
The system SHALL allow admins to configure per-tournament settings including playoff cutoff (number of teams advancing to playoffs, default 4), group phase toggle, and 3rd place match toggle. The visual presentation of the admin settings form SHALL use dark surface containers, dark input fields with amber focus rings, and properly styled checkboxes and labels.

#### Scenario: Admin configures tournament on dark theme
- **WHEN** an admin views the tournament settings form
- **THEN** the form renders with dark surface container, inputs with slate-950 backgrounds and slate-700 borders, amber focus rings on focus, and checkboxes with amber accent when checked