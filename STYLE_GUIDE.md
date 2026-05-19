# Style Guide

Rules for any agent working on jessahn.com. This file is the source of truth for how to make visual and styling decisions. The companion file `project_jessahn_site.md` (in the user's memory directory, outside this repo) contains the *why* behind these decisions.

If anything in this guide conflicts with `Layout.astro`, **this guide wins** — update `Layout.astro` to match.

## Design philosophy

Editorial minimalism with one quiet hand-drawn accent. The serif headline and warm cream background do the credibility-and-taste work; a single squiggly blue underline carries the personality. Restraint is the whole game — when in doubt, remove an element rather than add one.

Priority order for what a visitor should feel in the first 5 seconds: **sharp/credible, then taste, then warm.**

## Color

Six values total. Nothing else gets used anywhere on the site.

```css
:root {
  --bg: #FAF8F3;        /* warm cream — full page background */
  --ink: #1a1a1a;       /* near-black — headings and primary text */
  --body: #2a2a2a;      /* slightly lighter — paragraph copy */
  --muted: #6a6a6a;     /* captions, metadata, secondary info */
  --accent: #1B4FCC;    /* the only accent color — used sparingly */
  --hairline: rgba(26, 26, 26, 0.15);  /* 0.5px dividers, never thicker */
}
```

**Rules:**

- Never use pure white (`#fff`) or pure black (`#000`).
- Never introduce a second accent color. If a design problem seems to need one, the answer is more whitespace.
- The accent blue is used for: the squiggle, link underlines, the "Say hi" nav item, and a single highlighted phrase per paragraph if needed. Nowhere else.

## Typography

Two font families only:

- **Serif** — transitional serif (Source Serif Pro, Crimson Pro, or EB Garamond). Used for h1, h2, h3, and highlighted phrases in body copy. Pick one and don't mix.
- **Sans** — Inter or system-ui. Used for body, nav, labels, UI.

No monospace anywhere on the site.

```css
:root {
  --serif: 'Source Serif Pro', Georgia, serif;
  --sans: 'Inter', system-ui, -apple-system, sans-serif;
}
```

**Two weights only: 400 and 500.** Never 600 or 700. Bold weights feel heavy against cream and break the editorial tone.

**Sentence case everywhere.** No Title Case, no ALL CAPS — except small uppercase eyebrow labels (11–12px, letter-spacing 0.15em).

### Type scale

| Use            | Size    | Weight | Family | Line-height | Letter-spacing       |
| -------------- | ------- | ------ | ------ | ----------- | -------------------- |
| H1 hero        | 46px    | 400    | serif  | 1.15        | -0.015em             |
| H2 section     | 32px    | 400    | serif  | 1.1         | -0.01em              |
| H3 item        | 17px    | 400    | serif  | 1.35        | -0.005em             |
| Body           | 16px    | 400    | sans   | 1.7         | normal               |
| Body large     | 17px    | 400    | sans   | 1.6         | normal               |
| Nav / links    | 14px    | 400    | sans   | 1.5         | normal               |
| Eyebrow label  | 11–12px | 500    | sans   | 1.5         | 0.15em, uppercase    |
| Caption / meta | 13px    | 400    | sans   | 1.55        | normal               |

## The squiggle (signature accent)

Hand-drawn blue squiggly underline beneath one phrase per page — the most important phrase. Inline SVG with `preserveAspectRatio="none"` so it stretches to fit the underlined text.

```html
<span class="squiggle-wrap">
  <em>PHRASE HERE</em>
  <svg class="squiggle" viewBox="0 0 260 18" preserveAspectRatio="none" aria-hidden="true">
    <path d="M 4 10 Q 16 3, 28 10 T 52 10 T 76 10 T 100 10 T 124 10 T 148 10 T 172 10 T 196 10 T 220 10 T 244 10 T 256 10"
          fill="none" stroke="#1B4FCC" stroke-width="3"
          stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</span>
```

```css
.squiggle-wrap {
  position: relative;
  display: inline-block;
}

.squiggle-wrap em {
  font-style: italic;
  position: relative;
  z-index: 2;
}

.squiggle {
  position: absolute;
  left: -6px;
  bottom: -14px;
  width: calc(100% + 12px);
  height: 18px;
  z-index: 1;
}
```

**Rules:**

- One squiggle per page maximum. Two squiggles means none of them matter.
- Never combine with other hand-drawn marks (no circles + underlines + arrows together).
- Stroke stays 3px. Do not increase.
- 10 waves, fixed. Do not change the path data.

## Highlighted phrases in body text

One phrase per paragraph maximum can be highlighted. Treatment: weight 500 + accent blue color, inheriting the surrounding font, upright (not italic), no underline.

```html
<span class="highlight">crazy (good)</span>
```

```css
.highlight {
  font-weight: 500;
  color: var(--accent);
}
```

The medium weight + blue combination is itself the highlight. Adding italic would be redundant.

## Italic serif

Reserved for emphasis inside headlines only (e.g., the word "GTM systems" in the h1). Do not use italic in body copy. Do not use italic outside headlines.

## Links

All links use one treatment: black text with a 2px blue underline, offset 6px below the baseline.

```css
a {
  color: var(--ink);
  text-decoration: underline;
  text-decoration-color: var(--accent);
  text-underline-offset: 6px;
  text-decoration-thickness: 2px;
}
```

No filled-background buttons anywhere on the site. Every clickable thing is an underlined link, including primary CTAs. The visual equality between primary and secondary actions is intentional.

**Exception:** the "Say hi" nav item uses accent blue text, no underline, because it's a nav item rather than an inline link.

## Layout

Page structure:

- Single-column reading flow (max 540–600px paragraph width). On the homepage, a 100px left gutter holds optional marginal eyebrow labels for major sections (see "Marginal eyebrow labels").
- Horizontal padding: 64px on desktop, 24px on mobile.
- Max content width varies by context: homepage About section prose is 668px (offset by 132px to sit in the section's content column). Sub-page article bodies are left-anchored to the container edge at 800px max width, matching the homepage hero intro's right edge. The hero intro paragraph is 800px wide. All three end at approximately the same X position, creating a consistent right edge down the page and across pages.
- Section vertical padding: 56–80px top and bottom.
- Space between nav and hero content: 120px. Do not tighten.

Section dividers: 0.5px horizontal lines using `var(--hairline)`. No thicker rules, no filled bars.

Cards / tiles: avoid them. Prefer flat lists with hairline dividers between items. If a card is genuinely needed, give it the cream background, a 0.5px hairline border, and 12px corner radius. No drop shadows.

## Marginal eyebrow labels

For section markers on the homepage (Artifacts, Writing, About), the label sits in a 100px gutter to the left of the content column. This is marginalia, not a content column — the reading column itself stays single-column at 540–600px max width.

- Gutter width: 100px
- Gap between gutter and content: 32px
- Label style: 11–12px sans, weight 500, 0.15em letter-spacing, uppercase, `var(--muted)`
- Label aligns to the first line of the section content
- On narrow viewports (< 720px), labels collapse above content (single column)

## Navigation

Top of every page.

- Left: "Jess Ahn" wordmark — 14px sans, weight 500, letter-spacing 0.02em.
- Right: nav items in this exact order: Artifacts, Writing, About, Say hi.
- 28px gap between nav items.
- "Say hi" rendered in `var(--accent)`, no underline. The other three are `var(--ink)`, no underline.
- 120px space below the nav before hero content.

## Homepage hero (locked)

- Nav
- 120px space
- Serif H1, two lines, with one squiggle under "GTM systems": *Hi, I'm Jess. I build and operate `<squiggle>GTM systems</squiggle>` & the tools behind them.*
- 40px space
- Body paragraph (max 540px), with "crazy (good)" highlighted: *Currently building for and advising startups — and, most importantly, parenting a spicy little one. Sharing what I've made to help anyone navigating the `<highlight>crazy (good)</highlight>` of GTM and parenthood. I love wandering, house tour vlogs, and motion picture soundtracks. Based in San Francisco.*
- 32px space
- Two inline underline links, 28px apart: "Message me on LinkedIn" and "More about me".

The eyebrow label "GTM Operator & Builder · SF" is removed — redundant with the headline.

## Things to never do

- Pure white backgrounds
- Pure black text
- A second accent color
- Gradients, drop shadows, glows, blurs
- Font weights heavier than 500
- Italic in body copy
- Title Case headings or ALL CAPS body
- More than one squiggle per page
- Multiple hand-drawn accents on one page
- Filled-background buttons
- Rounded corners larger than 12px
- Icon-heavy UI (favor text labels)
- Stock photography
- Emojis in body copy or headings
- Monospace fonts (the previous IBM Plex Mono is gone)

## When adding new pages or components

1. Start with the navigation pattern and the 120px breathing room below it.
2. Identify the most important phrase on the page — that's the squiggle candidate, or skip the squiggle if no phrase earns it.
3. Use serif for headlines, sans for everything else.
4. Use accent blue only for: the squiggle, link underlines, the "Say hi" nav item, and a single highlighted phrase in body if needed.
5. Read the page back and ask: "is there any element here not pulling its weight?" If yes, remove it.
6. If you find yourself reaching for a new color, font, or graphic element, the answer is almost always more whitespace instead.

## Superseded decisions

These were in earlier versions of the spec and should be removed from the codebase if found:

- Inter + IBM Plex Mono pairing — replaced by transitional serif + Inter. Mono is gone entirely.
- 14px body — now 16px.
- `<mark>` element repurposed for highlights — replaced by `<span class="highlight">`.

If existing markup uses `<mark>`, update it to `<span class="highlight">`.
