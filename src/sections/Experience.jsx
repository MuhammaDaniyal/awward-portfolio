import { useRef } from "react";
import AnimatedHeaderSection from "../components/AnimatedHeaderSection";
import { experienceData, experienceSubtitle } from "../constants";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { prefersReducedMotion } from "../utils/motion";

const Experience = () => {
  const experienceRefs = useRef([]);

  useGSAP(() => {
    if (prefersReducedMotion()) return;

    experienceRefs.current.forEach((el) => {
      if (!el) return;
      gsap.from(el, {
        y: 120,
        opacity: 0,
        duration: 1,
        ease: "circ.out",
        scrollTrigger: { trigger: el, start: "top 85%" },
      });
    });
  }, []);

  return (
    <section id="experience" className="bg-[#e5e5e0] rounded-t-4xl">
      <AnimatedHeaderSection
        subTitle={experienceSubtitle.tagline}
        title={"Experience"}
        text={experienceSubtitle.subtitle}
        textColor={"text-black"}
        withScrollTrigger={true}
      />

      {experienceData.map((job, index) => (
        <div
          ref={(el) => (experienceRefs.current[index] = el)}
          key={`${job.company}-${job.role}`}
          className="px-10 pt-6 pb-12 text-black bg-[#e5e5e0] border-t-2 border-black/20"
        >
          <div className="flex flex-col gap-6 font-light">
            <div className="flex flex-col gap-2">
              <h2 className="text-4xl lg:text-5xl">{job.role}</h2>
              <p className="text-xl tracking-widest lg:text-2xl text-black/60">
                {job.company} — {job.location}
              </p>
            </div>

            <p className="text-sm tracking-[0.3rem] uppercase text-black/50">
              {job.period}
            </p>

            <ul className="flex flex-col gap-3">
              {job.points.map((point, pointIndex) => (
                <li
                  key={pointIndex}
                  className="text-xl leading-relaxed tracking-widest lg:text-2xl text-black/60 text-pretty"
                >
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </section>
  );
};

export default Experience;
