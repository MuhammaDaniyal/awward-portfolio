import { useEffect, useState } from "react";
import ReactLenis from "lenis/react";
import Navbar from "./sections/Navbar";
import Hero from "./sections/Hero";
import Skills from "./sections/Skills";
import About from "./sections/About";
import Experience from "./sections/Experience";
import Projects from "./sections/Projects";
import Contact from "./sections/Contact";
import Cursor from "./components/Cursor";
import { prefersReducedMotion } from "./utils/motion";

// The headline is set in Amiamie at ~150px, so swapping the fallback out mid-view
// is very visible. Hold the fade-in until the fonts resolve — but never longer
// than MAX_WAIT, so a slow or failed font can't lock anyone out of the site.
const MAX_WAIT = 1500;

const App = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let done = false;
    const reveal = () => {
      if (done) return;
      done = true;
      setIsReady(true);
    };

    const timer = setTimeout(reveal, MAX_WAIT);
    document.fonts?.ready.then(reveal).catch(reveal) ?? reveal();

    return () => clearTimeout(timer);
  }, []);

  return (
    <ReactLenis
      root
      // Hijacking the wheel is the single most disorienting thing here for
      // motion-sensitive users, so hand scrolling back to the browser.
      options={{ smoothWheel: !prefersReducedMotion() }}
      className="relative w-full min-h-screen overflow-x-clip"
    >
      <Cursor />
      <div
        className={`${
          isReady ? "opacity-100" : "opacity-0"
        } transition-opacity duration-700`}
      >
        <Navbar />
        <Hero />
        <Skills />
        <About />
        <Experience />
        <Projects />
        <Contact />
      </div>
    </ReactLenis>
  );
};

export default App;
