# CaseQuery AI — Design System

## Design Philosophy: Legal Brutalism

A bold, authoritative interface that merges Swiss design precision with courtroom gravitas. This isn't your typical AI chat interface—it's a research tool that commands respect.

---

## Visual Identity

### Aesthetic Direction
**Legal Brutalism Meets Modern Precision**

- Stark contrasts and bold typography
- Dramatic use of negative space
- Geometric accents and angular elements
- Authoritative, unforgettable presence

### Core Differentiators

1. **Distinctive Typography**
   - Display: Playfair Display (900 weight) for dramatic headings
   - Mono: IBM Plex Mono for precision and legibility
   - No generic sans-serif fonts

2. **Bold Color Palette**
   - Ink: `#0A0A0A` (near-black for authority)
   - Paper: `#FFFEF9` (cream for warmth)
   - Verdict: `#C41E3A` (crimson red for emphasis)
   - Stone/Slate/Mercury: Supporting grays

3. **Geometric Language**
   - Hard edges and straight lines
   - Offset box shadows (8px offset standard)
   - 2px borders throughout
   - Minimal border radius (2px)

4. **Dramatic Interactions**
   - Offset shadow on hover (transforms + shadow growth)
   - Sliding animations (cubic-bezier timing)
   - Q: and A: prefix markers on messages
   - Custom cursor with red dot

---

## Component Anatomy

### Header
- Black background with 4px red border bottom
- § symbol with rotation animation
- Italic/regular weight contrast in title
- Tagline with uppercase tracking

### Chat Messages
- **User Messages**: Black background, red shadow, left-aligned "Q:" marker
- **Assistant Messages**: White background, gray shadow, right-aligned "A:" marker
- **Code Blocks**: Terminal-style with line numbers and "CODE" label
- 75% max-width with 20% side margins

### Input Bar
- Black background with 4px red border top
- Elevated shadow on input field hover
- Dramatic "QUERY" button with uppercase display font
- Shine animation on button hover

### Empty State
- Hero-style centered layout
- Massive display typography (6rem max)
- Red underline animation on title
- Interactive example queries with arrow reveal

### Tables
- Brutalist aesthetic with double shadows
- Red/black offset shadow (8px)
- Black header with red accent strip
- Hover reveals left-edge red gradient

---

## Animation Language

### Timing Functions
- Primary: `cubic-bezier(0.4, 0, 0.2, 1)` (smooth deceleration)
- Duration: 300-600ms for interactions, 800-1200ms for page loads

### Key Animations

1. **Message Entry**: Slide from side with fade
2. **Header Load**: Slide down from top
3. **Hero Elements**: Staggered fade-up (0.3s delays)
4. **Hover States**: Transform translate + shadow growth
5. **Thinking Dots**: Bouncing opacity cycle
6. **Button Shine**: Gradient sweep on hover

---

## Typography Scale

```
Hero Title:     clamp(3rem, 8vw, 6rem)    | Playfair 900
Page Title:     clamp(2rem, 5vw, 3.5rem)  | Playfair 900
Body:           0.9375rem (15px)          | IBM Plex Mono 400
Small:          0.875rem (14px)           | IBM Plex Mono 400
Tiny:           0.75rem (12px)            | IBM Plex Mono 600
```

---

## Spacing System

```
--space-xs:  0.5rem  (8px)
--space-sm:  1rem    (16px)
--space-md:  2rem    (32px)
--space-lg:  4rem    (64px)
--space-xl:  6rem    (96px)
```

---

## Shadow System

### Offset Shadows (Brutalist Style)
- Small: `4px 4px 0 color`
- Medium: `6px 6px 0 color`
- Large: `8px 8px 0 color`
- Compound: `8px 8px 0 red, 8px 8px 0 2px black`

### Usage
- Chat container: Large compound shadow
- Messages: Medium shadows (red for user, gray for assistant)
- Input field: Small → large progression on hover/focus
- Buttons: Medium shadow with transform on hover

---

## Responsive Breakpoints

- Mobile: `max-width: 768px`
  - Reduce font sizes (clamp functions handle most)
  - Stack footer elements vertically
  - Reduce shadow offsets (6px → 4px)
  - Adjust message margins (20% → 10%)

---

## Accessibility Features

- High contrast ratios (black on cream, white on black)
- Focus states with red accent borders
- Large touch targets (min 44px height)
- Semantic HTML structure
- Keyboard navigation support
- Print-friendly styles

---

## Technical Implementation

### Font Loading
- Google Fonts API with `display=swap`
- CSS variables for font families
- Fallback to system fonts

### Performance
- CSS-only animations (no JavaScript)
- Hardware-accelerated transforms
- Prefers-reduced-motion support (TODO)

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS Grid and Flexbox
- CSS custom properties
- Webkit scrollbar styling

---

## Brand Voice

**Authoritative. Precise. Unflinching.**

Copy should reflect the visual boldness:
- Direct, active voice
- Legal terminology where appropriate
- No hedging or uncertainty
- Confidence without arrogance

Examples:
- ✅ "Interrogate the Law"
- ✅ "Analyzing precedent..."
- ❌ "Let me try to help you..."
- ❌ "I think this might be..."

---

## Future Enhancements

1. **Dark Mode**: Invert to cream text on black with red accents
2. **Sound Design**: Subtle clicks and whooshes for interactions
3. **Advanced Tables**: Sortable columns, filtering
4. **Cite Extraction**: Hover-to-preview case citations
5. **Timeline View**: Chronological case history visualization
6. **Print Optimized**: Court-ready document exports

---

**This design system is a living document. Update as patterns evolve.**
