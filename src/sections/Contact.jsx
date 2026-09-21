import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import AnimatedHeaderSection from "../components/AnimatedHeaderSection";
import { socials, contactData, resume } from "../constants";
import { prefersReducedMotion } from "../utils/motion";

const Contact = () => {
  useGSAP(() => {
    if (prefersReducedMotion()) return;

    gsap.from(".social-link", {
      y: 100,
      opacity: 0,
      delay: 0.5,
      duration: 1,
      stagger: 0.3,
      ease: "back.out",
      scrollTrigger: { trigger: ".social-link" },
    });
  }, []);

  return (
    <section id="contact" className="flex flex-col justify-between bg-black">
      <div>
        <AnimatedHeaderSection
          subTitle={contactData.tagline}
          title={"Contact"}
          text={contactData.text}
          textColor={"text-white"}
          withScrollTrigger={true}
        />
        <div className="flex px-10 font-light text-white uppercase lg:text-[32px] text-[26px] leading-none mb-10">
          <div className="flex flex-col w-full gap-10">
            <div className="social-link">
              <h2>E-mail</h2>
              <div className="w-full h-px my-2 bg-white/30" />
              <a
                href={`mailto:${contactData.email}`}
                className="text-xl tracking-wider lowercase transition-colors duration-200 md:text-2xl lg:text-3xl hover:text-gold"
              >
                {contactData.email}
              </a>
            </div>

            <div className="social-link">
              <h2>Phone</h2>
              <div className="w-full h-px my-2 bg-white/30" />
              <a
                href={`tel:${contactData.phone.replace(/\s/g, "")}`}
                className="text-xl tracking-wider transition-colors duration-200 md:text-2xl lg:text-3xl hover:text-gold"
              >
                {contactData.phone}
              </a>
            </div>

            <div className="social-link">
              <h2>Résumé</h2>
              <div className="w-full h-px my-2 bg-white/30" />
              <a
                href={resume.href}
                download
                className="text-xl tracking-wider transition-colors duration-200 md:text-2xl lg:text-3xl hover:text-gold"
              >
                {resume.label} ↓
              </a>
            </div>

            <div className="social-link">
              <h2>Social Media</h2>
              <div className="w-full h-px my-2 bg-white/30" />
              <div className="flex flex-wrap gap-2">
                {socials.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs leading-loose tracking-widest uppercase transition-colors duration-200 md:text-sm hover:text-white/80"
                  >
                    {"{ "}
                    {social.name}
                    {" }"}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
