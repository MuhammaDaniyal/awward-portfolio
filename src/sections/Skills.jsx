import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { skillsData } from "../constants";
import { prefersReducedMotion } from "../utils/motion";

gsap.registerPlugin(ScrollTrigger);

// Per-row starting offset and parallax travel.
const ROWS = [
  { start: "translate-x-0", drift: 20 },
  { start: "translate-x-10", drift: -30 },
  { start: "-translate-x-15", drift: 80 },
  { start: "translate-x-25", drift: -50 },
];

const Skills = () => {
  useGSAP(() => {
    if (prefersReducedMotion()) return;

    ROWS.forEach((row, index) => {
      const selector = `#skill-${index + 1}`;
      gsap.to(selector, {
        xPercent: row.drift,
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
      className="mt-20 overflow-hidden font-light leading-snug text-center mb-42 contact-text-responsive"
    >
      {skillsData.map((row, index) => (
        <div
          key={index}
          id={`skill-${index + 1}`}
          className={`flex items-center justify-center gap-3 ${ROWS[index].start}`}
        >
          {row.map((skill, skillIndex) => (
            <div key={skill.name} className="flex items-center gap-3">
              {skillIndex > 0 && <div className="w-10 h-1 md:w-32 bg-gold" />}
              <p
                className={`${skill.strong ? "font-normal" : ""} ${
                  skill.italic ? "italic" : ""
                }`}
              >
                {skill.name}
              </p>
            </div>
          ))}
        </div>
      ))}
    </section>
  );
};

export default Skills;
