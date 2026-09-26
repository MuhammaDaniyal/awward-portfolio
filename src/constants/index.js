// index.js

const aboutData = {

  text: `I am a BSCS ’27 student at FAST Islamabad, currently working remotely as a Software Engineer at Avants Lab.
    I build AI-powered products and full-stack web systems with Next.js, React, Node.js and MongoDB, and I push them further on the performance side with CUDA, OpenMP and SIMD.
    From multi-tenant SaaS to GPU-accelerated computer vision, my focus is always on writing clean, scalable code that solves complex problems efficiently.`,

  tagline: "Code with purpose, built to scale",

  subtitle: "BSCS '27 | FAST-NUCES Islamabad",

}

const heroData = {
  name: "M.Daniyal",
  tagline: "404 No Bugs Found",

  // Leads with what he does, not what he is. Kept to two lines — a third costs
  // ~52px of hero height, and education reads better in the identity block.
  subtitle: `I build AI-powered products and full-stack web systems,
then make them fast.`,

  // Small type framing the top of the hero. No name — the 152px headline below
  // already carries it, and repeating it wasted the slot.
  role: "Full-Stack & AI Engineer",
  education: "BSCS '27 · FAST-NUCES",
  location: "Islamabad, PK",
  status: "Software Engineer @ Avants Lab",

}

// The four things a recruiter actually wants to click, surfaced in the hero
// instead of being reachable only through the menu or the page footer.
export const heroActions = [
  // `primary` gets the solid treatment — it's the one thing a recruiter is most
  // likely to want, so it shouldn't look like the other three.
  { label: "Download CV", href: "/Muhammad-Daniyal-CV.pdf", icon: "\u2193", download: true, primary: true },
  { label: "GitHub", href: "https://github.com/MuhammaDaniyal", icon: "\u2197", external: true },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/muhammadaniyal/", icon: "\u2197", external: true },
  { label: "Email", href: "mailto:daniyal2771@gmail.com", icon: "\u2197" },
];

export const socials = [
  { name: "Instagram", href: "http://instagram.com/daniyal621311" },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/muhammadaniyal/" },
  { name: "GitHub", href: "https://github.com/MuhammaDaniyal" },
];

const experienceSubtitle = {
  subtitle: "Where I've been building",
  tagline: "From classrooms to production",
}

export const experienceData = [

  {
    role: "Software Engineer",
    company: "Avants Lab",
    period: "01 Aug 2026 — Present",
    location: "Remote",
    points: [
      "Developing and maintaining dynamic web applications and mobile solutions, collaborating with cross-functional teams to deliver user-centric features.",
      "Participating in the full software development lifecycle, from requirements gathering to deployment and iteration.",
    ],
  },

  {
    role: "Software Engineer Intern",
    company: "Avants Lab",
    period: "15 Jun 2026 — 01 Aug 2026",
    location: "Remote",
    points: [
      "Built and shipped features across web and mobile products alongside cross-functional teams.",
      "Converted to a full-time Software Engineer at the end of the internship.",
    ],
  },

  {
    role: "Cybersecurity Intern",
    company: "NUST Agristreams",
    period: "Jun 2025 — Aug 2025",
    location: "Islamabad, Pakistan",
    points: [
      "Implemented backend security monitoring features for a host-based WAF using Python.",
      "Developed real-time log analysis and monitoring dashboards using Flask.",
      "Worked with rule-based request inspection and attack detection workflows.",
    ],
  },

];

const projectSubtitle = {
  subtitle: "Featured projects",
  tagline: "Behind the scene, Beyond the screen",
}

export const projectsData = [

  {
    title: "AI Chat & Booking SaaS",
    description:
      "A multi-tenant AI chatbot SaaS that embeds on external websites via Shadow DOM and iframe, enabling real-time customer chat, automated booking management, and natural-language availability checking. A hybrid 2-step AI architecture injects live database state into LLM calls to eliminate hallucinations on calendar queries, backed by atomic usage tracking, TTL-based data lifecycle management, and strict CORS domain whitelisting.",
    tech: ["Next.js", "TypeScript", "MongoDB", "Groq LLM"],
    links: {},
  },

  {
    title: "Parallel K-Means Optimization",
    description:
      "An optimized K-Means clustering implementation using OpenMP parallelization, AVX2 SIMD vectorization, and cache-aware memory layouts, achieving up to 10x speedup over the baseline. Scalability, convergence behavior, and workload performance were benchmarked across multiple optimized implementations.",
    tech: ["C++", "OpenMP", "AVX2 SIMD", "perf"],
    links: {},
  },

  {
    title: "KLT Feature Tracking Optimization",
    description:
      "An optimized implementation of the Kanade–Lucas–Tomasi (KLT) feature tracking algorithm, accelerated with CUDA and OpenACC for a 2x speedup over the CPU baseline. CPU, OpenACC, and CUDA versions were benchmarked with a focus on execution time, memory access patterns, and GPU parallelization strategies.",
    tech: ["C++", "CUDA", "OpenACC", "Computer Vision"],
    links: {
      github: "https://github.com/MuhammaDaniyal/Complex_Computing_Problem",
    },
  },

  {
    title: "PetCare",
    description:
      "A full-stack pet care and e-commerce platform featuring authentication, product management, cart and checkout, bookings, and admin dashboards, with secure role-based workflows for customers, veterinarians, and administrators.",
    tech: ["Next.js", "TypeScript", "MongoDB"],
    links: {
      github: "https://github.com/MuhammaDaniyal/pet-store",
      live: "https://pet-store-ruddy.vercel.app",
    },
  },

  {
    title: "AI-Powered Quiz Generation System",
    description:
      "An automated quiz generation system built on TF-IDF features and a 4-model ensemble (Logistic Regression, Naive Bayes, SVM, KMeans) for question generation and answer evaluation, wrapped in a real-time Streamlit interface with progressive hints, difficulty-ranked distractors, and live performance tracking.",
    tech: ["Python", "Scikit-learn", "Streamlit"],
    links: {},
  },

  {
    title: "Treap vs BST Performance Analysis",
    description:
      "Treap and BST data structures implemented and benchmarked on a large-scale Reddit dataset (10,000+ operations), reaching 56x faster insertion and search than the BST while analyzing balancing behavior and tree height differences (25 vs 4025 levels), with timing and structural metrics visualized in Python.",
    tech: ["C++", "DSA", "Algorithms", "Python"],
    links: {
      github: "https://github.com/MuhammaDaniyal/Treap-vs-BST",
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
  tagline: "You dream it, I code it",
  text: `Building at Avants Lab, open to interesting problems.
        Let's connect & build something fast.`,
  email: "daniyal2771@gmail.com",
  phone: "+92 316 5605744",
}

// Order here drives both the nav and the scroll targets.
export const navSections = [
  "home",
  "skills",
  "about",
  "experience",
  "projects",
  "contact",
];

// The full inventory, grouped. Everything here comes from cv.md or a project's
// tech list. This is the ONLY place skills are listed — the hero used to repeat
// a six-item subset, which read as the same list twice.
export const skillsData = [
  {
    label: "Languages",
    items: [
      { name: "C/C++", strong: true },
      { name: "Python" },
      { name: "Java", italic: true },
      { name: "TypeScript" },
      { name: "JavaScript" },
      { name: "SQL" },
    ],
  },
  {
    label: "Frontend",
    items: [{ name: "React", strong: true }, { name: "Next.js" }, { name: "Tailwind" }],
  },
  {
    label: "Backend",
    items: [
      { name: "Node" },
      { name: "Express" },
      { name: "MongoDB" },
      { name: "Flask", italic: true },
    ],
  },
  {
    label: "Parallel",
    items: [
      { name: "CUDA", strong: true },
      { name: "OpenMP" },
      { name: "OpenACC", italic: true },
      { name: "OpenMPI" },
      { name: "OpenCL" },
    ],
  },
  {
    label: "Systems",
    items: [
      { name: "AVX2 SIMD" },
      { name: "Linux" },
      { name: "perf", italic: true },
      { name: "Git" },
    ],
  },
  {
    label: "AI / ML",
    items: [
      { name: "Scikit-learn" },
      { name: "Streamlit" },
      { name: "Computer Vision" },
    ],
  },
];

export const resume = {
  href: "/Muhammad-Daniyal-CV.pdf",
  label: "Download CV",
};

export { contactData, projectSubtitle, experienceSubtitle, aboutData, heroData };
