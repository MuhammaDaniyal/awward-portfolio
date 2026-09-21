import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import AnimatedHeaderSection from "../components/AnimatedHeaderSection";
import ComputeField from "../components/ComputeField";
import { heroData, heroActions } from "../constants";
import { prefersReducedMotion } from "../utils/motion";

const Hero = () => {
  const portraitRef = useRef(null);

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

    // Same wipe the About image uses, so the two reveals feel related.
    gsap.set(portraitRef.current, {
      clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)",
    });
    gsap.to(portraitRef.current, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      duration: 1.6,
      ease: "power4.out",
      delay: 0.4,
    });
  }, []);

  return (
    <section
      id="home"
      // A constrained height (not min-height) is what lets the portrait band
      // flex-shrink on short viewports instead of pushing the headline down.
      className="relative flex flex-col h-[100svh] min-h-[40rem] overflow-hidden"
    >
      <ComputeField />

      {/* Identity block. Stacks on phones, where the fixed burger would
          otherwise sit on top of the availability line. */}
      <div className="relative z-10 flex flex-col gap-3 px-10 pt-8 pr-24 sm:flex-row sm:items-start sm:justify-between sm:gap-6 sm:pr-28 md:pr-36">
        <div className="font-light leading-relaxed hero-marker">
          <p className="text-xs tracking-[0.3em] uppercase text-black/70 sm:text-sm">
            {heroData.marker}
          </p>
          <p className="text-xs tracking-[0.2em] uppercase text-black/45">
            {heroData.role}
          </p>
          <p className="text-xs tracking-[0.2em] uppercase text-black/45">
            {heroData.education}
            <span className="hidden sm:inline"> · {heroData.location}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 hero-marker shrink-0 sm:pt-1">
          <span className="relative flex w-2 h-2">
            <span className="absolute inline-flex w-full h-full rounded-full opacity-60 animate-ping bg-gold" />
            <span className="relative inline-flex w-2 h-2 rounded-full bg-gold" />
          </span>
          <p className="text-[10px] sm:text-xs tracking-[0.2em] uppercase text-black/60 sm:text-right">
            {heroData.status}
          </p>
        </div>
      </div>

      {/* The portrait is right-aligned, which leaves the whole left half of this
          band empty — so the stack and the calls to action live here rather than
          under the headline, where they would cost vertical space. */}
      <div className="relative z-10 flex flex-col items-center flex-1 min-h-0 gap-6 px-10 pt-6 pb-6 sm:flex-row sm:items-center sm:justify-between sm:gap-10 md:pt-12">
        <div className="order-2 flex w-full flex-col gap-5 sm:order-1 sm:w-auto sm:max-w-[22rem] lg:max-w-[38rem]">
          <ul className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] sm:text-xs tracking-[0.2em] uppercase text-black/55 hero-cta">
            {heroData.stack.map((tech, index) => (
              <li key={tech} className="flex items-center gap-3">
                {index > 0 && (
                  <span
                    aria-hidden="true"
                    className="w-1 h-1 rounded-full bg-gold"
                  />
                )}
                {tech}
              </li>
            ))}
          </ul>

          <ul className="flex flex-wrap items-center gap-x-5 gap-y-3">
            {heroActions.map((action) => (
              <li key={action.label} className="hero-cta">
                <a
                  href={action.href}
                  {...(action.download ? { download: "" } : {})}
                  {...(action.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="inline-flex items-center gap-1.5 pb-1 text-xs tracking-[0.2em] uppercase transition-colors duration-200 border-b group border-black/25 hover:border-gold hover:text-black text-black/70"
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
          ref={portraitRef}
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

      <div className="relative z-10">
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
