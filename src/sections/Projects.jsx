import { useRef } from "react";
import AnimatedHeaderSection from "../components/AnimatedHeaderSection";
import { projectsData, projectSubtitle } from "../constants";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { prefersReducedMotion } from "../utils/motion";

const Projects = () => {
  const projectRefs = useRef([]);

  useGSAP(() => {
    if (prefersReducedMotion()) return;

    projectRefs.current.forEach((el) => {
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
    <section id="projects" className="bg-[#e5e5e0]">
      <AnimatedHeaderSection
        subTitle={projectSubtitle.tagline}
        title={"Projects"}
        text={projectSubtitle.subtitle}
        textColor={"text-black"}
        withScrollTrigger={true}
      />

      {projectsData.map((project, index) => {
        const links = Object.entries(project.links ?? {});

        return (
          <div
            ref={(el) => (projectRefs.current[index] = el)}
            key={project.title}
            className="px-10 pt-6 pb-12 text-black bg-[#e5e5e0] border-t-2 border-black/20 transition-colors duration-500 group/row hover:bg-[#dedeD6]"
          >
            <div className="flex items-center justify-between gap-4 font-light">
              <div className="flex flex-col gap-6">
                <div className="flex items-baseline gap-5">
                  <span className="text-xs tracking-[0.3em] text-black/35 tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h2 className="text-4xl transition-transform duration-500 lg:text-5xl group-hover/row:translate-x-2">
                    {project.title}
                  </h2>
                </div>

                <p className="text-xl leading-relaxed tracking-widest lg:text-2xl text-black/60 text-pretty">
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
              </div>
            </div>

            {links.length > 0 && (
              <div className="flex flex-wrap items-center gap-6 mt-6 text-sm">
                {links.map(([name, url]) => (
                  <a
                    key={name}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline transition-opacity underline-offset-4 opacity-70 hover:opacity-100"
                  >
                    {name}
                  </a>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
};

export default Projects;
