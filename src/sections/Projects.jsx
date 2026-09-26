import { useLayoutEffect, useRef, useState } from "react";
import AnimatedHeaderSection from "../components/AnimatedHeaderSection";
import { projectsData, projectSubtitle } from "../constants";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "../utils/motion";

gsap.registerPlugin(Flip, ScrollTrigger);

/**
 * Nine stacked descriptions used to be 41% of the page and the least designed
 * part of it. Rows now collapse to a single line and expand one at a time, with
 * GSAP Flip interpolating the reflow so the rows below slide rather than jump.
 */
const Projects = () => {
  const listRef = useRef(null);
  const rowRefs = useRef([]);
  const flipState = useRef(null);
  const [openIndex, setOpenIndex] = useState(0);

  useGSAP(() => {
    if (prefersReducedMotion()) return;

    // One trigger for the whole list, not one per row. Nine separate triggers
    // left rows stranded at opacity 0 whenever the accordion changed the page
    // height underneath them.
    gsap.from(rowRefs.current.filter(Boolean), {
      y: 60,
      opacity: 0,
      duration: 0.8,
      stagger: 0.07,
      ease: "circ.out",
      scrollTrigger: { trigger: listRef.current, start: "top 85%", once: true },
    });
  }, []);

  const toggle = (index) => {
    if (!prefersReducedMotion() && listRef.current) {
      flipState.current = Flip.getState(
        listRef.current.querySelectorAll("[data-flip-id]")
      );
    }
    setOpenIndex((current) => (current === index ? -1 : index));
  };

  // Flip has to read the new layout after React commits it but before paint.
  useLayoutEffect(() => {
    if (!flipState.current) return;
    Flip.from(flipState.current, {
      duration: 0.65,
      ease: "power3.inOut",
      nested: true,
      onEnter: (els) =>
        gsap.fromTo(
          els,
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }
        ),
      onLeave: (els) => gsap.to(els, { opacity: 0, duration: 0.18 }),
      // The page just got taller or shorter, so every ScrollTrigger below this
      // point is now measuring against a stale position.
      onComplete: () => ScrollTrigger.refresh(),
    });
    flipState.current = null;
  }, [openIndex]);

  return (
    <section id="projects" className="bg-[#e5e5e0]">
      <AnimatedHeaderSection
        subTitle={projectSubtitle.tagline}
        title={"Projects"}
        text={projectSubtitle.subtitle}
        textColor={"text-black"}
        withScrollTrigger={true}
      />

      <div ref={listRef}>
        {projectsData.map((project, index) => {
          const links = Object.entries(project.links ?? {});
          const open = index === openIndex;

          return (
            <article
              key={project.title}
              ref={(el) => (rowRefs.current[index] = el)}
              data-flip-id={`row-${index}`}
              className="text-black bg-[#e5e5e0] border-t-2 border-black/20"
            >
              <button
                type="button"
                onClick={() => toggle(index)}
                aria-expanded={open}
                aria-controls={`project-panel-${index}`}
                className="flex items-baseline w-full gap-5 px-10 py-6 text-left transition-colors duration-500 cursor-pointer group/row hover:bg-[#dedeD6]"
              >
                <span className="text-xs tracking-[0.3em] text-black/35 tabular-nums shrink-0">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <h2 className="text-xl sm:text-2xl md:text-3xl font-light transition-transform duration-500 lg:text-5xl group-hover/row:translate-x-2">
                  {project.title}
                </h2>

                <span className="flex-1 hidden text-xs tracking-[0.2em] uppercase text-black/40 lg:block">
                  {project.tech.join("  ·  ")}
                </span>

                <span
                  aria-hidden="true"
                  className={`ml-auto text-2xl font-light transition-transform duration-500 shrink-0 lg:ml-0 ${
                    open ? "rotate-45" : ""
                  }`}
                >
                  +
                </span>
              </button>

              {open && (
                <div
                  id={`project-panel-${index}`}
                  data-flip-id={`detail-${index}`}
                  className="flex flex-col gap-6 px-10 pt-1 pb-12 font-light lg:pl-[4.5rem]"
                >
                  <p className="max-w-4xl text-base sm:text-lg leading-relaxed tracking-normal sm:tracking-wide lg:text-2xl text-black/60 text-pretty">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 text-sm tracking-wide border rounded-full border-black/30"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {links.length > 0 && (
                    <div className="flex flex-wrap items-center gap-6 text-sm">
                      {links.map(([name, url]) => (
                        <a
                          key={name}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 pb-1 uppercase tracking-[0.2em] text-xs transition-colors duration-200 border-b group border-black/25 hover:border-gold hover:text-black text-black/70"
                        >
                          {name}
                          <span
                            aria-hidden="true"
                            className="transition-transform duration-200 group-hover:translate-x-0.5"
                          >
                            ↗
                          </span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default Projects;
