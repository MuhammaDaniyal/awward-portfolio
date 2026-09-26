import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { skillsData } from "../constants";
import { prefersReducedMotion } from "../utils/motion";

gsap.registerPlugin(ScrollTrigger);

// Per-row starting offset and parallax travel. One entry per group in
// skillsData — alternating direction so the rows read as a drifting field.
// Drift is a percentage of the row's own width, and rows are capped at 82% of
// the container — so even at full travel a skill cannot leave the viewport.
const ROWS = [
  { start: "translate-x-0", drift: 8 },
  { start: "translate-x-4", drift: -10 },
  { start: "-translate-x-6", drift: 11 },
  { start: "translate-x-8", drift: -9 },
  { start: "-translate-x-4", drift: 10 },
  { start: "translate-x-6", drift: -11 },
];

const Skills = () => {
  useGSAP(() => {
    if (prefersReducedMotion()) return;

    skillsData.forEach((_, index) => {
      const selector = `#skill-${index + 1}`;
      gsap.to(selector, {
        xPercent: ROWS[index % ROWS.length].drift,
        ease: "none",
        scrollTrigger: {
          // `trigger` is the actual ScrollTrigger property — `target` is ignored,
          // which silently left these relying on the tween's default element.
          trigger: selector,
          scrub: true,
        },
      });
    });
  }, []);

  return (
    <section
      id="skills"
      className="mt-20 overflow-hidden font-light leading-snug text-center mb-42"
    >
      {skillsData.map((group, index) => (
        <div key={group.label} className="mb-2 sm:mb-3">
          {/* The tag sits outside the drifting row on purpose: rows wider than
              the viewport would otherwise carry their own label off-screen. */}
          <p className="text-[10px] sm:text-xs tracking-[0.3em] uppercase text-black/35">
            {group.label}
          </p>

          <div
            id={`skill-${index + 1}`}
            className={`mx-auto flex max-w-[82%] flex-wrap items-center justify-center gap-x-3 gap-y-1 ${
              ROWS[index % ROWS.length].start
            }`}
          >
            {group.items.map((skill, skillIndex) => (
              <div key={skill.name} className="flex items-center gap-3">
                <p
                  className={`skills-text-responsive ${
                    skill.strong ? "font-normal" : ""
                  } ${skill.italic ? "italic" : ""}`}
                >
                  {skill.name}
                </p>
                {/* Divider trails its name rather than leading the next one, so a
                    wrapped line starts with a skill instead of a stray dash. */}
                {skillIndex < group.items.length - 1 && (
                  <div className="w-6 h-1 md:w-20 bg-gold shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};

export default Skills;
