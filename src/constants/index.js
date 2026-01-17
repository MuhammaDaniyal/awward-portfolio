// index.js

const aboutData = {

  text: `I am a BSCS ’27 student at FAST Islamabad, specialized in high-performance systems and modern web development.
    On the low-level side, I build application logic using C++, Java, and Python, with specialized experience in CUDA for parallel programming and SFML for game development.
    As a web developer, I create responsive interfaces using React and Tailwind CSS. My focus is always on writing clean, scalable code that solves complex problems efficiently.`,

  tagline: "Cod with purpose, Built to scale",

  subtitle: "BSCS '27 | FAST-NUCES Islamabad",

}

const heroData = {
  name: "M.Daniyal",
  tagline: "404 No Bugs Found",
  subtitle: `I am a undergraduate BSCS'27 from
FAST Islamabad, Pakistan.`
}

export const socials = [
  { name: "Instagram", href: "http://instagram.com/daniyal621311" },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/muhammadaniyal/" },
  { name: "GitHub", href: "https://github.com/MuhammaDaniyal" },
];

const projectSubtitle = {
  subtitle: "Featured projects",
  tagline: "Behind the scene, Beyond the screen",
}

export const projectsData = [

  {
    title: "KLT Feature Tracking Optimization",
    description:
      "An optimized implementation of the Kanade–Lucas–Tomasi (KLT) feature tracking algorithm. The project improves performance over the CPU version by leveraging GPU acceleration using CUDA and parallelization with both cuda and OpenACC.",
    tech: ["C++", "CUDA", "OpenACC", "Computer Vision"],
    links: {
      github: "https://github.com/MuhammaDaniyal/Complex_Computing_Problem",
    },
  },

  {
    title: "Tenant Connect",
    description:
      "A desktop application built with JavaFX to facilitate communication between tenants and property owners. The system focuses on structured interaction, data handling, and a clean desktop UI workflow.",
    tech: ["Java", "JavaFX"],
    links: {
      github: "https://github.com/Red0MFHA/TenantConnect_VertexSphere",
    },
  },
  
  {
    title: "SFML Game Collection (C++)",
    description:
      "A collection of classic games including Snake, Centipede, and Plants vs Zombies, developed in C++ using SFML. The projects emphasize object-oriented design, game loops, collision handling, and file-based high score management.",
    tech: ["C++", "SFML", "OOP"],
    links: {
      centipede: "https://github.com/MuhammaDaniyal/Centipede-SFML", 
      snake: "https://github.com/MuhammaDaniyal/Snake-SFML", 
      pvz: "https://github.com/MuhammaDaniyal/Plants-vs-Zombies", 
    },
  },

  {
    title: "Portfolio Website",
    description:
      "Personal portfolio built with React and CSS, focusing on smooth user experience, scroll-based animations, responsive design, and performance optimization.",
    tech: ["React", "CSS", "JavaScript"],
    links: {
      github: "https://github.com/MuhammaDaniyal/My-Portfolio",
      live: "https://muhammad-daniyal.vercel.app/",
    },
  },

];

const contactData = {
  tagline: "You Dream It, I Code it",
  subtitle: "You Dream It, I Code it",
  text :`Orbiting for new adventures
        Let's connect & launch something cool.`,
  email: "daniyal2771@gmail.com",
  phone: "+33 7 12 12 32 12",
}

export { contactData, projectSubtitle, aboutData, heroData };