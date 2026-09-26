# Portfolio — Muhammad Daniyal

Personal portfolio. React 19 + Vite + Tailwind v4, with GSAP/ScrollTrigger for
scroll animation and Lenis for smooth scrolling.

```bash
npm install
npm run dev      # dev server
npm run build    # production build to dist/
npm run preview  # serve the production build
npm run lint
```

## Layout

```
src/
  components/
    LatticeField.jsx        hero background + intro — raw WebGL, one fragment shader
    Cursor.jsx              dot + trailing ring (fine pointers only)
    AnimatedHeaderSection.jsx
    AnimatedTextLines.jsx
  sections/                 Hero, Skills, About, Experience, Projects, Contact, Navbar
  constants/index.js        all copy and data (nav, skills, experience, projects, contact)
  utils/motion.js           reduced-motion helper
  utils/useMagnetic.js      cursor-magnet hook (fine pointers only)
public/
  Muhammad-Daniyal-CV.pdf   linked from the Contact section
  images/og.png             social share card (1200x630)
  images/portrait.webp      hero portrait (+ @2x), generated from the original
```

Content lives in `src/constants/index.js` — the sections are just renderers, so
adding a project or a job is a data edit, not a JSX edit.

## The hero lattice

`LatticeField.jsx` draws a lattice of cells lit by travelling wavefronts, with a
pointer halo and a click ripple. It is scoped to the hero: absolutely positioned
inside `#home`, so it scrolls away with the section and never appears behind the
rest of the page.

On load it doubles as the intro — cells sample the portrait's luminance and
resolve the face out of the grid before the photo crossfades in. The component
owns that crossfade (it sets the `[data-portrait]` element's opacity itself) so
the halftone and the photo can't drift apart. A safety timeout and every error
path call `finishIntro()`, so the portrait always ends up visible. Bright pixels
make the big cells — inverted, the dark backdrop fills in and the lit face reads
as a hole rather than a portrait.

It pauses when scrolled out of view or when the tab is hidden, caps DPR at 1.5,
renders one static frame under `prefers-reduced-motion`, and falls back to a CSS
lattice if WebGL is unavailable or the context is lost for good. A context loss
*during load* re-arms the intro rather than cancelling it.

## Motion

GSAP 3.14 ships every formerly-premium plugin for free, and the site uses two:

- **SplitText** — section headings split to characters with `mask: "chars"` and
  rise from behind the baseline. `autoSplit` re-splits once Amiamie loads, so the
  glyphs are never measured against fallback metrics. SplitText sets `aria-label`
  on the heading, so screen readers still read the word, not the letters.
- **ScrambleText** — nav links scramble through `01` on hover.

- **Flip** — Projects rows expand one at a time and Flip interpolates the reflow.
  `ScrollTrigger.refresh()` runs on completion: the page just changed height, so
  every trigger below is measuring against a stale position.

Plus `useMagnetic` on the burger and a custom cursor. Every one of these is
skipped under `prefers-reduced-motion`, and the cursor and magnet additionally
require a fine pointer.

## Responsive rules that must not be undone

Three things here are load-bearing — each one fixed a real layout break:

- **The hero is `min-h-[100svh]` below `lg`, `lg:h-[100svh]` above.** A fixed
  height at every size made flexbox shrink the marker and headline blocks below
  their own content on narrow/short viewports; the text then overflowed its box
  and overlapped the next block. Below `lg` the section grows and the page
  scrolls instead. The marker and headline blocks also carry `shrink-0`.
- **`--banner-size` is derived from the available width, not a vw factor.**
  Two traps here. First, `EXPERIENCE` is 6.01em on Amiamie against
  `M.DANIYAL`'s 5.24em, so sizing for the name clips the longer titles. Second,
  the 5rem gutter is a far bigger fraction of a 320px screen than a 1440px one,
  so no single vw number holds a safe margin at both ends. It is now
  `calc((100vw - 5rem) / 6.9)` — widest heading plus ~9% headroom, because
  SplitText puts every character in its own inline-block and renders a few
  percent wider than the raw text measurement. The `h1` also carries
  `whitespace-nowrap` so those characters can never break mid-word.
- **Body copy steps down on phones, and wide tracking is mobile-off.** Section
  intros, project and job titles and their body text all scale from a small base
  up; `tracking-widest` on 20px copy wrapped Experience bullets to five lines on
  a 465px screen. Tracking only widens from `sm`/`md` up.
- **The Contact entrance must finish fast.** It used to run a 0.5s delay plus a
  0.3s stagger over four blocks, so the phone number and socials were still
  invisible ~2.4s after the trigger — arriving via the nav's 2s smooth scroll
  showed an empty section. It now triggers on `#contact` at `top 85%`, `once`.
- **The burger's rings are siblings, not classes on the button.** The button's
  `clipPath` is what shows and hides it, and clipPath clips box-shadows too — a
  Tailwind `ring-*` on the button computes correctly and renders as nothing.
- **Skills rows wrap, are capped at 82% width, and drift at most ~11%.** They
  used to be `whitespace-nowrap` and bleed off both edges, which meant the first
  and last skill in a row were never readable.

## Notes

- `src/cv.md` is the source of truth for the CV; `public/Muhammad-Daniyal-CV.pdf`
  is the generated file the site links to. Regenerate it if the markdown changes.
- The absolute URLs in the Open Graph tags in `index.html` point at the
  production domain — update them if the site moves.
- `images/portrait.webp` was generated from `images/grayscale_pic.png`, which was
  removed from `public/` once nothing referenced it. The original is still in git
  history if you ever need a different crop.
