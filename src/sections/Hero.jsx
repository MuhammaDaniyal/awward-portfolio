import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import AnimatedHeaderSection from "../components/AnimatedHeaderSection";
import LatticeField from "../components/LatticeField";
import { heroData, heroActions } from "../constants";
import { prefersReducedMotion } from "../utils/motion";

const Hero = () => {
  useGSAP(() => {
    if (prefersReducedMotion()) return;

    gsap.from(".hero-marker", {
      y: -14,
      opacity: 0,
      duration: 0.9,
      stagger: 0.12,
      ease: "circ.out",
      delay: 0.25,
    });

    gsap.from(".hero-cta", {
      y: 20,
      opacity: 0,
      duration: 0.8,
      stagger: 0.08,
      ease: "circ.out",
      delay: 0.7,
    });

    // The portrait's reveal is owned by LatticeField's halftone intro.
  }, []);

  return (
    <section
      id="home"
      // Below lg the marker and headline blocks are genuinely taller than a
      // short screen, so the section grows and the page scrolls. A fixed height
      // there made flexbox shrink them below their own content, which overflowed
      // the box and overlapped the next block. From lg up the layout is compact
      // enough that a fixed height is safe, and the portrait band absorbs the
      // slack instead of pushing the intro off-screen.
      className="relative flex flex-col min-h-[100svh] lg:h-[100svh] overflow-hidden"
    >
      <LatticeField />

      {/* Identity block. Stacks on phones, where the fixed burger would
          otherwise sit on top of the availability line. */}
      <div // Stacked until lg: side by side, the role and the availability pill split
        // the width and the role wrapped to two lines at 640-768px.
        className="relative z-10 shrink-0 flex flex-col gap-3 px-10 pt-8 pr-24 sm:pr-28 md:pr-36 lg:flex-row lg:items-start lg:justify-between lg:gap-6">
        {/* No name here — the headline below already says it, at 152px. What a
            recruiter needs first is the role, so it is set as a statement
            rather than the wide-tracked micro-caps used elsewhere. */}
        <div className="leading-snug hero-marker">
          <span aria-hidden="true" className="block w-10 h-0.5 mb-3 bg-gold" />
          <p className="text-base font-normal tracking-[0.06em] uppercase text-black sm:text-lg lg:text-xl">
            {heroData.role}
          </p>
          <p className="mt-1.5 text-[11px] font-light tracking-[0.18em] uppercase text-black/65 sm:text-xs">
            {heroData.education}
            <span className="hidden sm:inline"> · {heroData.location}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 hero-marker shrink-0 lg:pt-1">
          <span className="relative flex w-2 h-2">
            <span className="absolute inline-flex w-full h-full rounded-full opacity-60 animate-ping bg-gold" />
            <span className="relative inline-flex w-2 h-2 rounded-full bg-gold" />
          </span>
          <p className="text-[10px] sm:text-xs tracking-[0.2em] uppercase text-black/70 lg:text-right">
            {heroData.status}
          </p>
        </div>
      </div>

      {/* The portrait is right-aligned, which leaves the whole left half of this
          band empty — so the stack and the calls to action live here rather than
          under the headline, where they would cost vertical space. */}
      <div className="relative z-10 flex flex-col items-center flex-1 min-h-0 gap-6 px-10 pt-6 pb-6 sm:flex-row sm:items-center sm:justify-between sm:gap-10 md:pt-12">
        <div className="order-2 flex w-full flex-col sm:order-1 sm:w-auto sm:max-w-[22rem] lg:max-w-[40rem]">
          <ul className="flex flex-wrap items-center gap-x-3 gap-y-2 lg:gap-x-5 lg:gap-y-3">
            {heroActions.map((action) => (
              <li key={action.label} className="hero-cta">
                <a
                  href={action.href}
                  {...(action.download ? { download: "" } : {})}
                  {...(action.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  // Solid fills, not underlines: the lattice behind these is busy
                  // enough that thin rules and 70% text blended straight into it.
                  className={`group inline-flex items-center gap-2 rounded-full px-3 py-1.5 lg:px-4 lg:py-2 text-[11px] sm:text-xs tracking-[0.2em] uppercase transition-colors duration-200 ${
                    action.primary
                      ? "bg-black text-white hover:bg-DarkLava"
                      : "bg-primary text-black border border-black/40 hover:border-gold hover:bg-white"
                  }`}
                >
                  {action.label}
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  >
                    {action.icon}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <img
          data-portrait
          src="/images/portrait.webp"
          srcSet="/images/portrait.webp 1x, /images/portrait@2x.webp 2x"
          alt="Muhammad Daniyal"
          width="520"
          height="650"
          fetchPriority="high"
          decoding="async"
          // Always cap height, never width: a width cap fights aspect-[4/5] and
          // object-cover would crop the face to a strip. The sm cap keeps the
          // portrait from eating the width the CTA column needs on tablets.
          className="order-1 w-[58%] max-w-[260px] h-auto shrink-0 max-h-[min(calc((100vw-5rem)*1.25),70vh)] sm:order-2 sm:h-full sm:w-auto sm:max-w-none sm:max-h-[min(70vh,47.5vw)] lg:max-h-[70vh] aspect-[4/5] object-cover object-top rounded-3xl"
        />
      </div>

      <div className="relative z-10 shrink-0">
        <AnimatedHeaderSection
          subTitle={heroData.tagline}
          title={heroData.name}
          text={heroData.subtitle}
          textColor={"text-black"}
          compact
        />
      </div>
    </section>
  );
};

export default Hero;
