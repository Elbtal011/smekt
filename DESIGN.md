# Design Rules

## Buttons

- Default site buttons on light surfaces use `#0A1B2E`.
- Buttons placed on dark hero/image surfaces use white fill with dark text.
- Do not reuse dark filled buttons directly on dark photographic overlays.

## Typography

- Use shared type roles from `src/index.css` instead of ad hoc sizes:
  - `type-eyebrow`
  - `type-hero-title`
  - `type-hero-lead`
  - `type-section-title`
  - `type-section-lead`
  - `type-card-title`
  - `type-card-body`
  - `type-detail-title`
  - `type-detail-body`

## Color

- Main dark brand/button color: `#0A1B2E`
- Homepage hero overlay: `#0A1B2E`
- Footer background: `#0A1B2E`

## Dark Surface Treatment

- On dark/photo backgrounds the visual order should be:
  - background image
  - dark overlay
  - readable text
  - white CTA buttons

## Consistency

- Card titles within the same sidebar/group must use one shared title size.
- Avoid mixing multiple heading scales in adjacent cards or repeated sections.
