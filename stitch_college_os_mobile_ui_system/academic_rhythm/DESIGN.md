---
name: Academic Rhythm
colors:
  surface: '#f9f9ff'
  surface-dim: '#d2daf0'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f3ff'
  surface-container: '#e9edff'
  surface-container-high: '#e0e8ff'
  surface-container-highest: '#dbe2f9'
  on-surface: '#141b2c'
  on-surface-variant: '#434654'
  inverse-surface: '#293041'
  inverse-on-surface: '#edf0ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#1954d4'
  primary: '#1451d1'
  on-primary: '#ffffff'
  primary-container: '#3b6ceb'
  on-primary-container: '#fefcff'
  inverse-primary: '#b4c4ff'
  secondary: '#006c4e'
  on-secondary: '#ffffff'
  secondary-container: '#77fac7'
  on-secondary-container: '#007353'
  tertiary: '#6d42ba'
  on-tertiary: '#ffffff'
  tertiary-container: '#865cd5'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c4ff'
  on-primary-fixed: '#00174c'
  on-primary-fixed-variant: '#003daa'
  secondary-fixed: '#77fac7'
  secondary-fixed-dim: '#58ddac'
  on-secondary-fixed: '#002115'
  on-secondary-fixed-variant: '#00513a'
  tertiary-fixed: '#ebddff'
  tertiary-fixed-dim: '#d3bbff'
  on-tertiary-fixed: '#260059'
  on-tertiary-fixed-variant: '#5729a3'
  background: '#f9f9ff'
  on-background: '#141b2c'
  surface-variant: '#dbe2f9'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: '0'
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: '0'
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: '0'
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style

This design system establishes an organized, modern academic cockpit tailored for high-agency college and university students. It balances the structural rigor of Material Design 3 with the tactile, fluid polish characteristic of modern Flutter interfaces.

The emotional baseline is calm command over chaotic academic schedules. Rather than overwhelming students with high-stress countdowns, the interface leverages structured color-coding, spacious canvas hierarchy, and smooth visual weight to make course loads, attendance, and exam preparation feel achievable and organized.

### Core Style Tenets
- **Structural Clarity:** Layouts favor clear card boundaries, distinct container contrasts, and clean visual grouping over borderless ambiguity.
- **Contextual Categorization:** Color is functional, strictly mapping semantic intent to specific academic dimensions (schedules, focus, progress, deadlines).
- **Physical Softness:** Tactile interactive states, comfortable 18px corner radii, and gentle ambient elevations produce a tactile, modern handheld utility.

## Colors

The palette organizes student workflows through functional chromatic assignment, maintaining high contrast and immediate readability under sunlight and varying mobile display modes.

### Semantic Domain Mapping
- **Primary Electric Blue (`#4776F6`):** Dedicated to dynamic academic schedules, class chronologies, primary navigational triggers, and core interactive states.
- **Secondary Emerald (`#20B486`):** Communicates positive status, attendance milestones, credit completion, GPA metrics, and successful sync states.
- **Accent Lilac (`#A47AF5`):** Reserved for study mode, Pomodoro timers, flashcards, AI synthesis, and deep work intervals.
- **Warm Amber (`#F5B942`):** Highlights high-priority items, imminent assignment deadlines (<24 hours), exam alerts, and critical schedule collisions.
- **Deep Navy (`#101828`):** Serves as high-contrast structural anchor for high-level headings, key metric values, and primary active indicators.

### Surfaces & Neutral Hierarchy
- **Canvas (`#F5F7FC`):** Soft, cool background preventing eye fatigue across extended study sessions.
- **Card/Surface (`#FFFFFF`):** Pure white modular elevation containers, crisp against the `#F5F7FC` foundation.
- **Borders & Dividers (`#E5EAF2`):** Subtle structural dividing lines maintaining distinct module definitions without visual noise.
- **Typography Primary (`#172033`):** High legibility body text and dense list elements.
- **Typography Secondary (`#667085`):** Subheadings, metadata, course codes, and timestamp labeling.

## Typography

The type system blends the energetic geometry of **Plus Jakarta Sans** for headers, metrics, and interactive tags with the neutral, hyper-legible utility of **Inter** for dense task descriptions, syllabus outlines, and notes.

### Hierarchy & Usage
- **Display & Headings (Plus Jakarta Sans):** Tightly tracked display and section headings communicate modern, forward-leaning momentum. Semi-bold and bold weights prevent visually thin text in mobile portrait layouts.
- **Body & Longform (Inter):** Systemized for rapid horizontal scanning. Heights are calibrated to accommodate dual-language syllabus titles, multi-line assignment briefs, and nested subtasks without crowding.
- **Labels, Badges & Chips (Plus Jakarta Sans):** Set in upper/title-case variants with slight letter-spacing expansions to ensure immediate scannability at 11–12px on small displays.

## Layout & Spacing

This design system uses an 8-point spatial model with 4-point micro-steps for compact data rows, cards, and floating elements.

### Layout Philosophy & Screen Adaptation
- **Mobile First Focus (Width < 600px):** Single-column layout with fixed outer margins of `1rem` (16px). All dashboard sections collapse into vertical stack containers. Horizontally swipeable rails (e.g., today's timeline, pending quizzes) use edge-to-edge negative margins with `16px` lead-in padding.
- **Large Handsets & Small Tablets (Width 600px - 840px):** Two-column split-view where the primary schedule timeline is persistent on the left (spanning 5 columns) and context-driven widgets (assignments, focus stats) fill the remaining 7 columns with a `1.25rem` gutter.
- **Internal Card Density:** Component-internal padding adheres to a strict standard:
  - Default card padding: `1.25rem` (20px).
  - Compact widget/list item padding: `0.75rem` (12px) vertical, `1rem` (16px) horizontal.
  - Floating trigger offsets: `1rem` (16px) above safe-area bottom bars.

## Elevation & Depth

Depth is established via soft, atmospheric ambient shadows layered atop low-contrast structural borders. Pure heavy drop shadows are avoided to keep the interface light and breezy.

### Elevation Levels

- **Level 0 (Flat Canvas):** `#F5F7FC` base canvas with zero shadow.
- **Level 1 (Card & Module Surface):**
  - Background: `#FFFFFF`
  - Border: 1px solid `#E5EAF2`
  - Shadow: `0px 2px 8px -2px rgba(16, 24, 40, 0.04), 0px 1px 4px -1px rgba(16, 24, 40, 0.02)`
  - Use case: Class schedule blocks, grade overview cards, standard list tiles.
- **Level 2 (Interactive Floating / Active State):**
  - Background: `#FFFFFF`
  - Border: 1px solid rgba(71, 118, 246, 0.12)
  - Shadow: `0px 8px 20px -4px rgba(71, 118, 246, 0.08), 0px 4px 8px -2px rgba(16, 24, 40, 0.04)`
  - Use case: Active cards in swipe decks, hovered elements, bottom navigation sheets.
- **Level 3 (Contextual Action / FAB):**
  - Background: `#4776F6` (or brand accent)
  - Border: None
  - Shadow: `0px 12px 24px -4px rgba(71, 118, 246, 0.30), 0px 6px 12px -2px rgba(71, 118, 246, 0.15)`
  - Use case: Floating action buttons (quick task add, study session starter), modal action triggers.

## Shapes

The interface embraces a unified soft geometry. The signature card radius is strictly anchored at `18px`, delivering a balanced balance between Material Design 3 and handheld iOS/Flutter micro-radii.

### Shape Geometry Mapping
- **Primary Cards & Containers:** `18px` border radius across all main feature widgets, course schedules, and modal sheets.
- **Segmented Control Pills & Badges:** Full-pill geometry (`9999px`) for filters, tags, and category selectors.
- **Action Triggers & Buttons:** `14px` border radius for standard height buttons (48px–52px) to match card ergonomics; `9999px` for contextual circular or extended pill FABs.
- **Input Fields & Text Areas:** `14px` border radius to maintain harmony with button profiles.

## Components

### Buttons
- **Primary Action Button:** 48px height, rounded to 14px. Background `#4776F6`, text `#FFFFFF`, label set in `label-lg`. Pressed state applies scale transform (`0.98`) with 8% darker background overlay.
- **Secondary / Soft Button:** Background tinted at 10% opacity of the associated functional color (e.g., `#4776F6` with 10% opacity produces a light blue fill), paired with `#4776F6` typography.
- **Floating Contextual Trigger (FAB):** 56px extended pill or circular trigger positioned 16px above the navigation bar. Colored `#4776F6` with Level 3 elevation. On scroll, collapses into a circular icon-only trigger.

### Cards & Modular Containers
- **Standard Card:** 18px radius, white fill, 1px `#E5EAF2` border, Level 1 elevation.
- **Urgent/Deadline Card:** White fill, 18px radius, with an integrated 4px vertical accent bar on the left border colored in Warm Amber (`#F5B942`).
- **Active Class Card:** Filled with a soft gradient (`#FFFFFF` to `#F5F8FF`), framed with a 1.5px border of `#4776F6`. Displays time, lecture hall room number, and professor avatar stack.

### Segmented Pills & Chips
- **Segmented Control:** Contained within a `#E5EAF2` track with 4px inner padding. Selected segment: `#FFFFFF` pill with Level 1 shadow and `#172033` label. Inactive segment: Transparent background with `#667085` label.
- **Category Badges:** 24px height, full-pill (`9999px`), 8px horizontal padding. Features light tint background (12% opacity) paired with high-contrast text:
  - *Attendance/Passing:* Emerald background (`#E8F7F3`), text `#20B486`.
  - *Focus/Deep Work:* Purple background (`#F5F0FE`), text `#A47AF5`.
  - *Due Soon:* Amber background (`#FEF8EC`), text `#D99414`.

### Lists & Timetable Items
- **Schedule Timeline Row:** Left-aligned time indicator in `label-md` (`#667085`). Connected via a 2px vertical stroke in `#E5EAF2`. Active session node marked with a 10px `#4776F6` circular dot with a 4px white ring.
- **Task Row:** 56px minimum height. Features an interactive 20px checkbox, `body-md` title, and right-aligned priority badge. Swiping left reveals quick actions (postpone, delete).

### Form Inputs & Checkboxes
- **Text Inputs:** 48px height, 14px radius, filled with `#FFFFFF`, 1px border in `#E5EAF2`. Focus state shifts border to 2px solid `#4776F6` and adds an ultra-subtle primary shadow glow.
- **Checkboxes:** 20px rounded square (6px radius). Unchecked: 1.5px border `#E5EAF2`. Checked: Solid `#20B486` fill with white checkmark glyph.

### Academic-Specific Widgets
- **GPA & Progress Arc:** Circular progress indicators utilizing Secondary Green (`#20B486`) for target marks and a track colored in `#E5EAF2`.
- **Focus Pomodoro Pill:** Floating banner with Accent Purple (`#A47AF5`) micro-animation, displaying remaining study minutes and quick-pause toggles.