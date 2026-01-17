import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

const Skills = () => {

  useGSAP(() => {
    gsap.to("#skill-1", {
      xPercent: 20,
      scrollTrigger: {
        target: "#skill-1",
        scrub: true,
      },
    });

    gsap.to("#skill-2", {
      xPercent: -30,
      scrollTrigger: {
        target: "#skill-2",
        scrub: true,
      },
    });
    
    gsap.to("#skill-3", {
      xPercent: 80,
      scrollTrigger: {
        target: "#skill-3",
        scrub: true,
      },
    });
    
    gsap.to("#skill-4", {
      xPercent: -50,
      scrollTrigger: {
        target: "#skill-4",
        scrub: true,
      },
    });
  });

  return (
    <section id="skills" className="mt-20 overflow-hidden font-light leading-snug text-center mb-42 contact-text-responsive">
      
      <div id="skill-1" className="flex items-center justify-center gap-3 translate-x-0">
        <p className="font-normal">React</p>
        <div className="w-10 h-1 md:w-32 bg-gold" />
        <p>Tailwind</p>
      </div>
      
      <div
        id="skill-2"
        className="flex items-center justify-center gap-3 translate-x-10"
      >
        <p>C/C++</p>
        <div className="w-10 h-1 md:w-32 bg-gold" />
        <p className="italic">Java</p>
        <div className="w-10 h-1 md:w-32 bg-gold" />
        <p>Python</p>
      </div>
      
      <div
        id="skill-3"
        className="flex items-center justify-center gap-3 -translate-x-15"
      >
        <p>CUDA</p>
        <div className="w-10 h-1 md:w-32 bg-gold" />
        <p className="italic">openacc</p>
      </div>
      
      <div id="skill-4" className="flex items-center justify-center gap-3 translate-x-25">
        <p>SQL</p>
        <div className="w-10 h-1 md:w-32 bg-gold" />
        <p>JavaScript</p>
      </div>
    
    </section>
  );
};

export default Skills;
