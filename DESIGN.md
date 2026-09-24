---
name: Apex Storm Tracker
colors:
  surface: '#10131a'
  surface-dim: '#10131a'
  surface-bright: '#363941'
  surface-container-lowest: '#0b0e15'
  surface-container-low: '#191b23'
  surface-container: '#1d1f27'
  surface-container-high: '#272a32'
  surface-container-highest: '#32353d'
  on-surface: '#e1e2ec'
  on-surface-variant: '#cbc3d7'
  inverse-surface: '#e1e2ec'
  inverse-on-surface: '#2d3038'
  outline: '#958ea0'
  outline-variant: '#494454'
  surface-tint: '#d0bcff'
  primary: '#d0bcff'
  on-primary: '#3c0091'
  primary-container: '#a078ff'
  on-primary-container: '#340080'
  inverse-primary: '#6d3bd7'
  secondary: '#4cd7f6'
  on-secondary: '#003640'
  secondary-container: '#03b5d3'
  on-secondary-container: '#00424e'
  tertiary: '#f7be1d'
  on-tertiary: '#3f2e00'
  tertiary-container: '#b68a00'
  on-tertiary-container: '#372700'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e9ddff'
  primary-fixed-dim: '#d0bcff'
  on-primary-fixed: '#23005c'
  on-primary-fixed-variant: '#5516be'
  secondary-fixed: '#acedff'
  secondary-fixed-dim: '#4cd7f6'
  on-secondary-fixed: '#001f26'
  on-secondary-fixed-variant: '#004e5c'
  tertiary-fixed: '#ffdf9a'
  tertiary-fixed-dim: '#f7be1d'
  on-tertiary-fixed: '#251a00'
  on-tertiary-fixed-variant: '#5a4300'
  background: '#10131a'
  on-background: '#e1e2ec'
  surface-variant: '#32353d'
typography:
  display-xl:
    fontFamily: Oswald
    fontSize: 56px
    fontWeight: '700'
    lineHeight: 60px
    letterSpacing: -0.02em
  display-xl-mobile:
    fontFamily: Oswald
    fontSize: 38px
    fontWeight: '700'
    lineHeight: 42px
    letterSpacing: -0.01em
  display-lg:
    fontFamily: Oswald
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.01em
  display-lg-mobile:
    fontFamily: Oswald
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: 0em
  headline-lg:
    fontFamily: Oswald
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: 0.02em
  headline-md:
    fontFamily: Oswald
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: 0.03em
  headline-sm:
    fontFamily: Oswald
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0.04em
  body-lg:
    fontFamily: Space Grotesk
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0em
  label-lg:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.06em
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.08em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '500'
    lineHeight: 12px
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system channels the hyper-kinetic, competitive, and celebratory world of high-stakes battle royale gaming. It merges aggressive, geometric esports UI design with the precision and legibility of a top-tier analytical SaaS dashboard. 

The aesthetic is built on high-contrast cyberpunk and arcade realism: deep space midnight canvases, vibrant neon energy trails, and dynamic visual telemetry. It evokes feelings of triumph, relentless progression, tactical mastery, and competitive pride. 

Key style characteristics:
- **Kinetic Geometry:** Angled accents, chamfered edge hints, and condensed, muscular display typography evoking arcade victory banners.
- **Luminous Hierarchies:** Deep, pitch-black midnight fields cut through by razor-sharp laser accents (violet, radiant cyan, gold).
- **Tactical Modularity:** Information-dense HUD (Heads-Up Display) layout systems, modular telemetry tiles, micro-badges, and circular progress rings designed for rapid scanning under high cognitive load.
- **Dual-State Versatility:** Seamless transition between a high-voltage, dark-room gaming cockpit (Dark Mode) and a high-contrast, broadcast-editorial analytical workspace (Light Mode).

## Colors

The color palette is derived directly from the energetic loot tiers and storm atmospheres of competitive battle royale:

- **Primary (`#8B5CF6` - Storm Violet):** The signature thematic anchor. Used for primary interactive actions, high-tier status elements, active tabs, and primary weapon-tier metrics.
- **Secondary (`#06B6D4` - Shield Cyan):** A vibrant neon electric cyan used for telemetry highlights, shield/defense counters, live status pings, and secondary data visualizations.
- **Tertiary (`#EAB308` - Victory Gold):** A luminous crown gold reserved strictly for top placements ("Victory Royale", #1 podium stats, K/D ratio highlights, and rare achievements).
- **Neutral Dark (`#0A0D14` - Midnight Slate):** The primary canvas background in dark mode, supplemented by layered surface steps:
  - Surface Tier 1 (Canvas): `#0A0D14`
  - Surface Tier 2 (Card / Metric Container): `#111622`
  - Surface Tier 3 (Elevated HUD / Popover): `#182032`
  - Subtle Border / Division: `#232D42`
- **Neutral Light Mode Equivalents:**
  - Surface Tier 1 (Canvas): `#F8FAFC` (Crisp Slate)
  - Surface Tier 2 (Card Container): `#FFFFFF` (Pure White)
  - Surface Tier 3 (Elevated Panels): `#F1F5F9`
  - Border Outline: `#E2E8F0`
  - Text Primary: `#0F172A` (Deep Indigo-Slate)
  - Text Secondary: `#64748B`

### Semantic & Accents
- **Elimination Crimson (`#F43F5E`):** Direct headshot or elimination feed tracking.
- **Success Green (`#10B981`):** Positive win-rate deltas and upward trend arrows.

## Typography

The typography structure enforces a sharp, battle-ready hierarchy between aggressive broadcast titles, readable body metrics, and monospaced telemetry:

- **Headlines & Big Counters (`Oswald`):** Condensed, punchy, and vertical. Rendered in uppercase with slight tracking for major match counters, player tags, Victory banners, and section dividers. Evokes sports broadcasting and competitive gaming overlays.
- **Body & Secondary Copy (`Space Grotesk`):** A modern geometric sans-serif that retains a tech-forward voice while ensuring rapid legibility across dense comparison matrices and player biographies.
- **Data HUD & Monospace (`JetBrains Mono`):** Dedicated to technical data, match timestamps, win percentages, K/D ratios, ping rates, rank tiers, and micro-counters. The fixed-width character grid guarantees clean tabular alignment across tables and telemetry widgets.

## Layout & Spacing

This design system uses a 12-column dynamic fluid grid architecture designed for maximum telemetry density without visual clutter:

- **Desktop (>= 1200px):** 12-column grid with `2.5rem` margins and `1.5rem` gutters. Accommodates multi-tier dashboards featuring an overview sidebar (player banner, season rank), a central stat canvas (performance rings, K/D delta graphs), and secondary feeds (recent matches, weapon masteries).
- **Tablet (768px - 1199px):** 8-column layout with `1.5rem` margins and `1rem` gutters. Metric cards stack into 2-by-2 clusters, and platform selector tabs collapse into an inline horizontal scroll segment.
- **Mobile (< 768px):** 4-column layout with `1rem` margins and `1rem` gutters. Stat modules reflow to full-width card stacks with sticky platform/game mode filter tabs anchored beneath the app header.

Spacing rhythm is strictly anchored to an 8-point base grid:
- `space-xs` (4px): Micro gaps within chip badges, icon-to-label gaps, and pill tags.
- `space-sm` (8px): Internal compact padding for inputs, buttons, and segmented controller tabs.
- `space-md` (16px): Standard internal padding for cards and stat container blocks.
- `space-lg` (24px): Inter-card gaps and component header-to-content separators.
- `space-xl` (40px): Section-to-section layout jumps and seasonal hero splits.

## Elevation & Depth

Visual hierarchy uses a hybrid approach of **Tonal Layers** combined with **Luminous Glassmorphism** and **Chroma Glows**:

- **Dark Mode Depth:**
  - **Level 0 (Canvas):** Pure `#0A0D14` background with a subtle ambient radial gradient (`#8B5CF6` at 4% opacity centered top-right, `#06B6D4` at 3% opacity bottom-left).
  - **Level 1 (Telemetry Cards):** Background `#111622` with a 1px crisp outline (`#232D42`). No heavy muddy shadows; depth is achieved via edge contrast.
  - **Level 2 (Hover & Active Focus):** Background `#182032` with a perimeter glow: `box-shadow: 0 0 16px -2px rgba(139, 92, 246, 0.25)`.
  - **Level 3 (Modal / Overlays):** Background `#0E131F` with backdrop blur of `16px` and subtle outer shadow `0 20px 40px -10px rgba(0, 0, 0, 0.7)`.

- **Light Mode Depth:**
  - **Level 0 (Canvas):** Crisp `#F8FAFC`.
  - **Level 1 (Cards):** Pure White `#FFFFFF` with a razor-thin border `1px solid #E2E8F0` and micro-shadow: `0 1px 3px rgba(15, 23, 42, 0.05)`.
  - **Level 2 (Hover & Focused Tiles):** White `#FFFFFF` with `0 10px 25px -5px rgba(15, 23, 42, 0.08)` and active border in `#8B5CF6`.

## Shapes

The design system employs a **Soft (`1`)** shape language (`4px` base border radius, `8px` for larger containers) combined with angular accents. This maintains a crisp, technological, and tactical HUD feel rather than an overly soft or generic app style.

- **Micro Components (Badges, Pills, Buttons):** `4px` (`rounded`) for a precise, sharp edge.
- **Cards & Data Modules:** `8px` (`rounded-lg`), balancing modern ergonomics with industrial discipline.
- **Stat Progress Rings & Circular Meters:** Full circles (`rounded-full`) engineered to contrast against the hard rectangular grid of surrounding telemetry tiles.

## Components

### Buttons & Interactive Controls
- **Primary Button (Victory State):** Bold violet gradient (`linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)`) with white condensed uppercase text (`Oswald`), 4px border radius, and active-state electric cyan rim glow.
- **Secondary / Ghost Button:** Transparent background with a `1px` high-contrast border (`#232D42` in dark mode, `#CBD5E1` in light mode), shifting to cyan hover border and text.

### Segmented Tabs (Platform & Game Modes)
- Encapsulated within a 4px surface tray.
- **Platform Selector (All, KBM, Gamepad, Touch):** Uses minimal iconography (mouse/keyboard, controller, mobile icon) paired with `JetBrains Mono` uppercase labels. Active tab features solid fill (`#8B5CF6`) with bold white text; inactive tabs feature muted slate text (`#64748B`) with instant hover brightening.
- **Mode Selector (Overall, Solo, Duo, Squad, LTM):** Inline ribbon featuring high-contrast pill toggles. Active selection displays a subtle bottom laser accent line in `#06B6D4`.

### Stat Cards & Progress Rings
- **Stat Tile:** Minimalist container featuring a micro-label (`label-md`) at the top, a massive condensed number (`display-lg`) in `Oswald`, and a bottom delta tag (e.g., `+2.4% vs last season` in green or red).
- **Progress Rings:** SVG circular stroke meters featuring a `stroke-width` of 6px, track background in `#1E293B`, and dynamic stroke gradients:
  - Win Rate: `#EAB308` (Victory Gold)
  - K/D Ratio: `#8B5CF6` (Storm Violet)
  - Top 10 Rate: `#06B6D4` (Shield Cyan)

### Badges & Tier Counters
- Pill shapes with 2px padding, uppercase `JetBrains Mono` (`label-sm`).
- Champion/Unreal rank badges include animated neon gradient borders or gold metallic edge highlights.

### Form Inputs & Search Fields
- Inset gaming look: Deep `#0B0F19` field, crisp `#232D42` border, with monospace text. Focus triggers an instant electric violet outline (`#8B5CF6`) with zero layout shift.
