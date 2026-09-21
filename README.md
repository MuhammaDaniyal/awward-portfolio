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
    ComputeField.jsx        hero background — raw WebGL, one fragment shader
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

## Hero background

`ComputeField.jsx` draws a lattice of cells lit by travelling wavefronts, with a
pointer halo and a click ripple. It is deliberately dependency-free: a single
full-screen fragment shader, no geometry, no textures, no 3D library.

It also pauses its render loop when scrolled out of view or when the tab is
hidden, caps device pixel ratio at 1.5, renders a single static frame under
`prefers-reduced-motion`, and falls back to a CSS lattice if WebGL is
unavailable or the context is lost and never restored.

## Motion

GSAP 3.14 ships every formerly-premium plugin for free, and the site uses two:

- **SplitText** — section headings split to characters with `mask: "chars"` and
  rise from behind the baseline. `autoSplit` re-splits once Amiamie loads, so the
  glyphs are never measured against fallback metrics. SplitText sets `aria-label`
  on the heading, so screen readers still read the word, not the letters.
- **ScrambleText** — nav links scramble through `01` on hover.

Plus `useMagnetic` on the burger, and a scroll-velocity `uSurge` uniform that
speeds the hero lattice up while the page is moving. Every one of these is
skipped under `prefers-reduced-motion`.

## Notes

- `src/cv.md` is the source of truth for the CV; `public/Muhammad-Daniyal-CV.pdf`
  is the generated file the site links to. Regenerate it if the markdown changes.
- The absolute URLs in the Open Graph tags in `index.html` point at the
  production domain — update them if the site moves.
- `images/portrait.webp` was generated from `images/grayscale_pic.png`, which was
  removed from `public/` once nothing referenced it. The original is still in git
  history if you ever need a different crop.
