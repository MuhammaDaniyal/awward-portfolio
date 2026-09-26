import { useEffect, useRef, useState } from "react";
import { socials, contactData, navSections } from "../constants";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { Link } from "react-scroll";
import { prefersReducedMotion } from "../utils/motion";
import { useMagnetic } from "../utils/useMagnetic";

gsap.registerPlugin(ScrambleTextPlugin);

const Navbar = () => {
  const navRef = useRef(null);
  const linksRef = useRef([]);
  const contactRef = useRef(null);
  const topLineRef = useRef(null);
  const bottomLineRef = useRef(null);
  const tl = useRef(null);
  const iconTl = useRef(null);
  const burgerRef = useRef(null);
  const menuWrapRef = useRef(null);
  const ringRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showBurger, setShowBurger] = useState(true);
  // The "Menu" caption is dark type, so it only shows while the beige hero is
  // behind it — past that the burger travels over the black sections.
  const [onHero, setOnHero] = useState(true);

  useMagnetic(menuWrapRef, { strength: 0.4, radius: 120 });

  // Scramble a link back into place on hover. "01" as the character set keeps it
  // in the same register as the compute lattice behind the hero.
  const scramble = (event, label) => {
    if (prefersReducedMotion()) return;
    gsap.to(event.currentTarget, {
      duration: 0.55,
      ease: "none",
      scrambleText: { text: label, chars: "01", speed: 0.6, revealDelay: 0.1 },
    });
  };

  useGSAP(() => {
    if (!prefersReducedMotion()) {
      // The menu is the only navigation on the page, so it gets a deliberate
      // entrance rather than just appearing in the corner.
      gsap.from(menuWrapRef.current, {
        scale: 0.4,
        autoAlpha: 0,
        duration: 0.8,
        ease: "back.out(1.7)",
        delay: 0.35,
      });
      gsap.fromTo(
        ringRef.current,
        { scale: 0.75, autoAlpha: 0.9 },
        {
          scale: 1.85,
          autoAlpha: 0,
          duration: 1.5,
          ease: "power2.out",
          delay: 0.9,
          repeat: 2,
          repeatDelay: 0.5,
        }
      );
    }

    gsap.set(navRef.current, { xPercent: 100 });
    gsap.set([linksRef.current, contactRef.current], { autoAlpha: 0, x: -20 });

    tl.current = gsap
      .timeline({ paused: true })
      .to(navRef.current, { xPercent: 0, duration: 1, ease: "power2.out" })
      .to(
        linksRef.current,
        { autoAlpha: 1, x: 0, stagger: 0.1, duration: 0.5, ease: "power2.out" },
        "<"
      )
      .to(
        contactRef.current,
        { autoAlpha: 1, x: 0, duration: 0.5, ease: "power2.out" },
        "<+0.2"
      );

    iconTl.current = gsap
      .timeline({ paused: true })
      .to(topLineRef.current, {
        rotate: 45,
        y: 3.3,
        duration: 0.3,
        ease: "power2.inOut",
      })
      .to(
        bottomLineRef.current,
        { rotate: -45, y: -3.3, duration: 0.3, ease: "power2.inOut" },
        "<"
      );
  }, []);

  // Hide the burger while scrolling down, bring it back on the way up.
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setShowBurger(y <= 80 || y < lastY);
      setOnHero(y < window.innerHeight * 0.55);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Escape closes the menu.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === "Escape" && setIsOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  useEffect(() => {
    if (!tl.current || !iconTl.current) return;
    if (isOpen) {
      tl.current.play();
      iconTl.current.play();
    } else {
      tl.current.reverse();
      iconTl.current.reverse();
    }
  }, [isOpen]);

  return (
    <>
      <nav
        ref={navRef}
        id="main-menu"
        // Kept in the DOM for the slide animation, so it must be taken out of the
        // tab order and the accessibility tree while closed.
        inert={!isOpen}
        aria-hidden={!isOpen}
        className="fixed z-50 flex flex-col justify-between w-full h-full px-10 uppercase bg-black text-white/80 py-28 gap-y-10 md:w-1/2 md:left-1/2"
      >
        <div className="flex flex-col text-5xl gap-y-2 md:text-6xl lg:text-8xl">
          {navSections.map((section, index) => (
            <div key={section} ref={(el) => (linksRef.current[index] = el)}>
              <Link
                className="inline-block transition-colors duration-300 cursor-pointer hover:text-white"
                to={section}
                smooth
                offset={0}
                duration={2000}
                onClick={() => setIsOpen(false)}
                onMouseEnter={(event) => scramble(event, section)}
              >
                {section}
              </Link>
            </div>
          ))}
        </div>
        <div
          ref={contactRef}
          className="flex flex-col flex-wrap justify-between gap-8 md:flex-row"
        >
          <div className="font-light">
            <p className="tracking-wider text-white/50">E-mail</p>
            <a
              href={`mailto:${contactData.email}`}
              className="text-xl tracking-widest lowercase transition-colors duration-300 text-pretty hover:text-white"
            >
              {contactData.email}
            </a>
          </div>
          <div className="font-light">
            <p className="tracking-wider text-white/50">Social Media</p>
            <div className="flex flex-col flex-wrap md:flex-row gap-x-2">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm leading-loose tracking-widest uppercase transition-colors duration-300 hover:text-white"
                >
                  {"{ "}
                  {social.name}
                  {" }"}
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <div
        ref={menuWrapRef}
        className="fixed z-50 flex flex-col items-center gap-2 top-4 right-10"
      >
        <div className="relative">
          {/* Both rings are siblings of the button, not classes on it: the
              button's clipPath (which drives the show/hide) would clip a
              box-shadow ring away entirely. */}
          <span
            aria-hidden="true"
            className={`absolute -inset-[6px] border-2 rounded-full pointer-events-none border-gold transition-opacity duration-300 ${
              showBurger || isOpen ? "opacity-100" : "opacity-0"
            }`}
          />
          {/* Expanding gold ring — plays a few times on load, then rests. */}
          <span
            ref={ringRef}
            aria-hidden="true"
            className="absolute inset-0 border-2 rounded-full pointer-events-none border-gold"
          />
          <button
            ref={burgerRef}
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls="main-menu"
            className="relative flex flex-col items-center justify-center gap-1 transition-all duration-300 bg-black rounded-full cursor-pointer w-14 h-14 md:w-20 md:h-20 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
            style={
              showBurger || isOpen
                ? { clipPath: "circle(50% at 50% 50%)" }
                : { clipPath: "circle(0% at 50% 50%)" }
            }
          >
            <span
              ref={topLineRef}
              className="block w-8 h-0.5 bg-white rounded-full origin-center"
            />
            <span
              ref={bottomLineRef}
              className="block w-8 h-0.5 bg-white rounded-full origin-center"
            />
          </button>
        </div>

        <span
          aria-hidden="true"
          className={`text-[10px] tracking-[0.3em] uppercase text-black/70 transition-opacity duration-300 ${
            onHero && !isOpen && showBurger ? "opacity-100" : "opacity-0"
          }`}
        >
          Menu
        </span>
      </div>
    </>
  );
};

export default Navbar;
