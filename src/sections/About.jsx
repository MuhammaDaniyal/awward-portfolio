import AnimatedHeaderSection from "../components/AnimatedHeaderSection";
import { AnimatedTextLines } from "../components/AnimatedTextLines";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { aboutData } from "../constants";
import { prefersReducedMotion } from "../utils/motion";

const About = () => {
  useGSAP(() => {
    if (prefersReducedMotion()) return;

    gsap.to("#about", {
      scale: 0.95,
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: "#about",
        start: "bottom 80%",
        end: "bottom 20%",
        scrub: true,
      },
    });
  }, []);

  return (
    <section id="about" className="min-h-screen bg-black rounded-b-4xl">
      <AnimatedHeaderSection
        subTitle={aboutData.tagline}
        title={"About"}
        text={aboutData.subtitle}
        textColor={"text-white"}
        withScrollTrigger={true}
      />
      {/* The portrait now anchors the hero, so this reads as one wide column. */}
      <div className="px-10 pb-20">
        <div className="w-16 h-0.5 mb-10 bg-gold" />
        <AnimatedTextLines
          text={aboutData.text}
          className="max-w-5xl text-base sm:text-lg font-light tracking-normal sm:tracking-wide md:text-2xl lg:text-3xl text-white/60"
        />
      </div>
    </section>
  );
};

export default About;
