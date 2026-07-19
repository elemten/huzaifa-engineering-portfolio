import {
  ArrowUpRight,
  Cloud,
  Code2,
  Download,
  Github,
  Monitor,
  Shield,
  Zap,
} from "lucide-react";
import { useEffect } from "react";
import type { ReactNode } from "react";
import { useLocation } from "wouter";
import {
  SiAmazonwebservices,
  SiDocker,
  SiGoogle,
  SiJavascript,
  SiN8N,
  SiNextdotjs,
  SiOpenai,
  SiPostgresql,
  SiReact,
  SiSupabase,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
} from "react-icons/si";
import { FaCogs, FaMicrosoft, FaNetworkWired, FaServer, FaShieldAlt } from "react-icons/fa";
import { ExperienceCard } from "@/components/ExperienceCard";
import SystemsIBuiltSection from "@/components/SystemsIBuiltSection";
import ContactSection from "@/components/ContactSection";
import SiteNav from "@/components/SiteNav";
import { TypewriterText } from "@/components/TypewriterText";
import CoolStuffSection from "@/components/CoolStuffSection";

const PENDING_NAV_TARGET_KEY = "site-nav-target";

const heroPhrases = [
  "I build systems that scale.",
  "I automate what slows teams down.",
  "I architect secure cloud products.",
  "I make engineering tradeoffs visible.",
];

// Data
type AccentColor = "blue" | "green" | "cyan" | "orange" | "purple" | "gray";

const skills = {
  "Agentic AI & Automation": [
    "OpenAI Agent SDK",
    "Google ADK",
    "Google A2A Kit",
    "Multi-Agent Architectures",
    "n8n",
    "Power Automate",
  ],
  "Backend & Cloud": [
    "Supabase",
    "PostgreSQL",
    "AWS Lambda",
    "S3",
    "EC2",
    "REST APIs",
    "Docker",
    "Vercel CI/CD",
  ],
  "Frontend & Apps": [
    "TypeScript",
    "JavaScript",
    "React",
    "Next.js",
    "Tailwind CSS",
  ],
  "Security & Identity": [
    "IAM Roles & Policies",
    "RBAC",
    "OAuth/JWT",
    "Supabase RLS",
    "M365 Administration",
  ],
  "Systems & IT": [
    "Networking",
    "Tier 2 Troubleshooting",
    "IP Camera/VMS",
    "Windows/macOS Admin",
  ],
};

const techIcons: Record<string, ReactNode> = {
  "TypeScript": <SiTypescript className="h-5 w-5" />,
  "JavaScript": (
    <span className="inline-flex h-5 w-5 items-center justify-center rounded-[2px] bg-[#111]">
      <SiJavascript className="h-5 w-5" />
    </span>
  ),
  "React": <SiReact className="h-5 w-5" />,
  "Next.js": <SiNextdotjs className="h-5 w-5" />,
  "Tailwind CSS": <SiTailwindcss className="h-5 w-5" />,
  "Supabase": <SiSupabase className="h-5 w-5" />,
  "PostgreSQL": <SiPostgresql className="h-5 w-5" />,
  "AWS Lambda": <SiAmazonwebservices className="h-5 w-5" />,
  "S3": <SiAmazonwebservices className="h-5 w-5" />,
  "EC2": <SiAmazonwebservices className="h-5 w-5" />,
  "Docker": <SiDocker className="h-5 w-5" />,
  "Vercel CI/CD": <SiVercel className="h-5 w-5" />,
  "OpenAI Agent SDK": <SiOpenai className="h-5 w-5" />,
  "Google ADK": <SiGoogle className="h-5 w-5" />,
  "Google A2A Kit": <SiGoogle className="h-5 w-5" />,
  "Multi-Agent Architectures": <FaServer className="h-5 w-5" />,
  "n8n": <SiN8N className="h-5 w-5" />,
  "Power Automate": <FaMicrosoft className="h-5 w-5" />,
  "REST APIs": <FaServer className="h-5 w-5" />,
  "IAM Roles & Policies": <FaShieldAlt className="h-5 w-5" />,
  "RBAC": <FaShieldAlt className="h-5 w-5" />,
  "OAuth/JWT": <FaShieldAlt className="h-5 w-5" />,
  "Supabase RLS": <SiSupabase className="h-5 w-5" />,
  "M365 Administration": <FaMicrosoft className="h-5 w-5" />,
  "Networking": <FaNetworkWired className="h-5 w-5" />,
  "Tier 2 Troubleshooting": <FaCogs className="h-5 w-5" />,
  "IP Camera/VMS": <FaNetworkWired className="h-5 w-5" />,
  "Windows/macOS Admin": <FaCogs className="h-5 w-5" />,
};

const techBrandColors: Record<string, string> = {
  TypeScript: "#3178C6",
  JavaScript: "#F7DF1E",
  React: "#087EA4",
  "Next.js": "#111111",
  "Tailwind CSS": "#06B6D4",
  Supabase: "#2E9E6F",
  "Supabase RLS": "#2E9E6F",
  PostgreSQL: "#336791",
  Docker: "#2496ED",
  "AWS Lambda": "#E77700",
  S3: "#E77700",
  EC2: "#E77700",
  "OpenAI Agent SDK": "#111111",
  "Google ADK": "#4285F4",
  "Google A2A Kit": "#4285F4",
  n8n: "#D93662",
  "Power Automate": "#0067B8",
  "M365 Administration": "#D83B01",
  "Vercel CI/CD": "#111111",
};

const skillCategories: Array<{
  title: string;
  items: string[];
  icon: ReactNode;
  style: string;
}> = [
  {
    title: "Agentic AI & Automation",
    items: skills["Agentic AI & Automation"],
    icon: <Zap className="h-5 w-5" />,
    style: "",
  },
  {
    title: "Backend & Cloud",
    items: skills["Backend & Cloud"],
    icon: <Cloud className="h-5 w-5" />,
    style: "",
  },
  {
    title: "Frontend & Apps",
    items: skills["Frontend & Apps"],
    icon: <Code2 className="h-5 w-5" />,
    style: "",
  },
  {
    title: "Security & Identity",
    items: skills["Security & Identity"],
    icon: <Shield className="h-5 w-5" />,
    style: "",
  },
  {
    title: "Systems & IT",
    items: skills["Systems & IT"],
    icon: <Monitor className="h-5 w-5" />,
    style: "",
  },
];

type ExperienceItem = {
  title: string;
  company: string;
  location: string;
  period: string;
  role?: string;
  problem: string;
  approach: string;
  impact: Array<{ metric: string; description: string }>;
  owned: string[];
  stacks: string[];
  caseStudySlug?: string;
  accent: AccentColor;
};

const experiences: ExperienceItem[] = [
  {
    title: "IT Specialist & Full-Stack Developer",
    company: "Table Tennis Saskatchewan",
    location: "Saskatoon, SK",
    period: "Aug 2025 – Apr 2026",
    role: "Project Lead",
    problem: "Replace spreadsheet-heavy membership, booking, finance, and event operations with one role-aware platform.",
    approach: "React public and admin surfaces over Postgres/RLS, with Edge Functions isolating Stripe, calendar, and invoice workflows.",
    impact: [
      {
        metric: "968→183KB",
        description: "main entry after route and vendor splitting",
      },
      {
        metric: "RLS",
        description: "database-level authorization for operational data",
      },
      {
        metric: "4 domains",
        description: "memberships, bookings, invoices, and events",
      },
    ],
    owned: ["Data model and migrations", "RLS policy design", "Public and admin UI", "Service integrations"],
    stacks: [
      "React",
      "Vite",
      "Supabase",
      "PostgreSQL",
      "Stripe",
      "Google Calendar API",
    ],
    caseStudySlug: "ttsask",
    accent: "blue",
  },
  {
    title: "IT Specialist & Web Developer",
    company: "Quest Disposal",
    location: "Vegreville, AB",
    period: "May 2024 – July 2024",
    problem: "Move paper work orders and status-by-conversation into a shared operational workflow.",
    approach: "A PowerApps workshop prototype with a shared record, role-specific queues, Power Automate transitions, and reporting boundaries.",
    impact: [
      {
        metric: "3 roles",
        description: "mechanic, admin, management",
      },
      {
        metric: "1 model",
        description: "shared work-order state",
      },
      {
        metric: "M365",
        description: "automation and reporting stack",
      },
    ],
    owned: ["Workflow mapping", "Role-specific prototype", "Automation design", "IT and network support"],
    stacks: ["PowerApps", "Power Automate", "Microsoft 365", "WordPress"],
    caseStudySlug: "quest-disposal",
    accent: "purple",
  },
  {
    title: "Cloud Architect",
    company: "CNS Engineering & Storak Digital",
    location: "Lahore, PK",
    period: "Jan 2022 – Nov 2023",
    problem: "Design cloud delivery paths that reduce server ownership while keeping network and access boundaries explicit.",
    approach: "AWS delivery patterns combining event-driven Lambda workloads, S3/CloudFront distribution, EC2 where required, and VPC boundaries.",
    impact: [
      {
        metric: "Lambda",
        description: "event-driven compute",
      },
      {
        metric: "S3 + CDN",
        description: "static delivery path",
      },
      {
        metric: "VPC",
        description: "network boundary design",
      },
    ],
    owned: ["Architecture design", "Cloud deployment", "Network boundaries", "Delivery optimization"],
    stacks: ["AWS Lambda", "S3", "CloudFront", "EC2", "VPC"],
    accent: "cyan",
  },
  {
    title: "Web Developer",
    company: "Weproms Digital",
    location: "Lahore, PK",
    period: "Jan 2022 – Dec 2022",
    problem: "Translate client requirements into maintainable websites under short delivery cycles.",
    approach: "WordPress/PHP delivery with reusable layouts, responsive CSS, release coordination, and ongoing plugin/security maintenance.",
    impact: [
      { metric: "WordPress", description: "client delivery platform" },
      {
        metric: "PHP/CSS",
        description: "custom implementation layer",
      },
      {
        metric: "Lifecycle",
        description: "build through maintenance",
      },
    ],
    owned: ["Requirement translation", "Responsive implementation", "Release delivery", "Security maintenance"],
    stacks: ["WordPress", "Elementor", "PHP", "CSS"],
    accent: "green",
  },
];

const education = [
  {
    degree: "Postgraduate Certificate",
    field: "Cloud Computing & Blockchain",
    institution: "Saskatchewan Polytechnic",
    year: "2026",
  },
  {
    degree: "Bachelor of Computer Science",
    field: "",
    institution: "University of Central Punjab",
    year: "2023",
  },
];

function Hero() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden border-b border-border bg-[radial-gradient(circle_at_85%_10%,rgba(37,99,235,0.08),transparent_32%),linear-gradient(to_bottom,#ffffff,#fbfbf8)] pb-20 pt-32 scroll-mt-24 md:pb-28 md:pt-40"
    >
      <div className="container">
        <div className="grid gap-14 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <p className="mb-7 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Full-stack developer &amp; cloud architect</p>
            <h1 className="text-5xl font-semibold leading-[0.98] tracking-[-0.06em] md:text-7xl lg:text-[5.35rem]">
              Huzaifa bin Ishaq
            </h1>
            <div className="mt-7 min-h-[4.5rem] max-w-3xl text-2xl font-semibold leading-tight tracking-[-0.035em] text-primary md:min-h-[3.5rem] md:text-4xl">
              <TypewriterText phrases={heroPhrases} />
            </div>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              I turn operational friction into maintainable software—owning the product surface, data model, authorization boundaries, integrations, and delivery path.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#systems" className="group inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5">
                View four flagship projects <ArrowUpRight className="h-4 w-4" />
              </a>
              <a href="/Huzaifa-Ishaq-Resume.pdf" className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-5 py-3 text-sm font-semibold transition-colors hover:border-foreground">
                <Download className="h-4 w-4" /> Résumé
              </a>
              <a href="https://github.com/elemten" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-5 py-3 text-sm font-semibold transition-colors hover:border-foreground">
                <Github className="h-4 w-4" /> GitHub portfolio
              </a>
            </div>
          </div>
          <div className="lg:col-span-5">
            <HeroShowcase />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroShowcase() {
  const evidence = [
    { value: "Production", label: "public-sector and operations platforms" },
    { value: "Full-stack", label: "React, Next.js, Postgres, APIs, cloud" },
    { value: "Trust-aware", label: "RLS, server-held secrets, explicit boundaries" },
  ];

  return (
    <aside aria-label="Engineering profile" className="relative overflow-hidden rounded-[2rem] border border-border bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.09)] md:p-8">
      <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-blue-50" />
      <div className="relative">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">What I bring to a team</p>
        <h2 className="mt-4 max-w-sm text-3xl font-semibold tracking-[-0.04em]">From ambiguous workflow to shipped system.</h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">I work across product, data, security, and delivery so the result is useful to operators and reviewable by engineers.</p>
      </div>
      <dl className="relative mt-7 border-y border-border">
        {evidence.map(item => (
          <div key={item.label} className="grid grid-cols-[7rem_1fr] gap-4 border-b border-border py-4 last:border-b-0">
            <dt className="text-sm font-semibold tracking-tight text-foreground">
              {item.value}
            </dt>
            <dd className="text-xs leading-relaxed text-muted-foreground">
              {item.label}
            </dd>
          </div>
        ))}
      </dl>
      <a href="#experience" className="relative mt-6 inline-flex items-center gap-2 text-sm font-semibold">See ownership by role <ArrowUpRight className="h-4 w-4" /></a>
    </aside>
  );
}

function About() {
  return (
    <section id="about" className="border-b border-border py-20 scroll-mt-24 md:py-24">
      <div className="container">
        <div className="grid gap-10 lg:grid-cols-12">
          <p className="section-label lg:col-span-3">How I work</p>
          <div className="lg:col-span-9">
            <h2 className="max-w-4xl text-3xl font-semibold leading-tight tracking-[-0.04em] md:text-5xl">
              I like the part where a fuzzy operational problem becomes a system people can rely on.
            </h2>
            <p className="mt-6 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">That means listening before modeling, making ownership and failure states explicit, and leaving the next engineer with evidence—not folklore.</p>
            <div className="mt-10 grid border-y border-border md:grid-cols-3">
              {[
                ["01 · Frame", "Map the operator, failure mode, and decision that software must improve."],
                ["02 · Build", "Model the data and authorization first; keep privileged integrations server-side."],
                ["03 · Prove", "Ship observable states, measure the constraint, and document the tradeoff."],
              ].map(([label, detail]) => (
                <div key={label} className="border-b border-border py-6 last:border-b-0 md:border-b-0 md:border-r md:px-6 md:first:pl-0 md:last:border-r-0 md:last:pr-0">
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/72">{detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Skills() {
  return (
    <section id="skills" className="border-y border-border bg-secondary/20 py-20 scroll-mt-24 md:py-24">
      <div className="container">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <p className="section-label">Technical range</p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">Grouped by the systems I can own, with the tools kept recognizable.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-9">
            {skillCategories.map(category => (
              <article key={category.title} className="rounded-2xl border border-border bg-white p-6">
                <h3 className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.13em] text-foreground">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-foreground">{category.icon}</span>{category.title}
                </h3>
                <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                  {category.items.map(skill => {
                    const icon = techIcons[skill];
                    const color = techBrandColors[skill];
                    return (
                      <li key={skill} className="flex min-h-11 items-center gap-3 border-t border-border/80 pt-2.5 text-xs font-medium text-foreground/75">
                        <span
                          className={`inline-flex h-7 w-7 shrink-0 items-center justify-center ${color ? "" : "text-muted-foreground"}`}
                          style={color ? { color } : undefined}
                          aria-hidden="true"
                        >
                          {icon}
                        </span>
                        <span>{skill}</span>
                      </li>
                    );
                  })}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section id="experience" className="py-20 scroll-mt-24 md:py-24">
      <div className="container">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <p className="section-label">Experience</p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">Roles shown through owned systems and changed operating conditions.</p>
          </div>
          <div className="lg:col-span-9">
            {experiences.map((exp, index) => (
              <div key={`${exp.company}-${index}`}>
                <ExperienceCard experience={exp} defaultOpen={index === 0} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Education() {
  return (
    <section className="py-16 md:py-20">
      <div className="container">
        <div className="grid gap-10 lg:grid-cols-12">
          <p className="section-label lg:col-span-3">Education</p>
          <div className="border-b border-border lg:col-span-9">
            {education.map(edu => (
              <div key={`${edu.degree}-${edu.institution}`} className="grid gap-2 border-t border-border py-5 md:grid-cols-[1fr_1fr_auto] md:items-center md:gap-6">
                <h3 className="text-lg font-semibold text-foreground">
                  {edu.degree}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {edu.field ? `${edu.field} · ` : ""}
                  {edu.institution}
                </p>
                <p className="font-mono text-xs text-muted-foreground">
                  {edu.year}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function GitHubApproach() {
  const principles = [
    "Every public repository starts with the problem and the decision it supports.",
    "Screenshots, architecture, setup, and known limitations make the work reviewable.",
    "Client, employer, and organization source stays private unless publication rights are explicit.",
    "Public code is scanned for secrets and personal data before it becomes portfolio evidence.",
  ];

  return (
    <section className="border-y border-border bg-[#eef3fb] py-16 md:py-20">
      <div className="container">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-4">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-foreground text-background"><Github className="h-5 w-5" /></span>
            <p className="section-label mt-5">GitHub as engineering evidence</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">Readable work, without publishing what I do not own.</h2>
          </div>
          <div className="lg:col-span-8">
            <p className="max-w-3xl text-base leading-relaxed text-muted-foreground">My public GitHub is being curated as a second portfolio surface: owned projects get context and reproducible proof; private client systems are represented here through permission-safe case studies instead of exposed source.</p>
            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {principles.map(principle => (
                <li key={principle} className="rounded-2xl border border-blue-100 bg-white/80 p-4 text-sm leading-relaxed text-foreground/72">{principle}</li>
              ))}
            </ul>
            <a href="https://github.com/elemten" target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background">
              Review public repositories <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-8 border-t border-border">
      <div className="container flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
        <p>
          © {new Date().getFullYear()} Huzaifa bin Ishaq. All rights reserved.
        </p>
        <p>
          Saskatoon, SK · 639-318-2037
        </p>
      </div>
    </footer>
  );
}

export default function Home() {
  const [location] = useLocation();

  useEffect(() => {
    document.title = "Huzaifa bin Ishaq — Full-Stack, Cloud & AI Automation";
    document.getElementById("case-study-schema")?.remove();
    document
      .querySelector<HTMLMetaElement>('meta[name="description"]')
      ?.setAttribute(
        "content",
        "Full-stack developer in Saskatoon building cloud platforms, AI automation, and operational systems. Explore evidence-backed case studies and production work."
      );
    document
      .querySelector<HTMLLinkElement>('link[rel="canonical"]')
      ?.setAttribute("href", "https://huzaifa.cc/");
    document
      .querySelector<HTMLMetaElement>('meta[property="og:title"]')
      ?.setAttribute(
        "content",
        "Huzaifa bin Ishaq — Full-Stack, Cloud & AI Automation"
      );
    document
      .querySelector<HTMLMetaElement>('meta[property="og:description"]')
      ?.setAttribute(
        "content",
        "Evidence-backed case studies across public-sector platforms, AI document workflows, geospatial systems, and cloud automation."
      );
    document
      .querySelector<HTMLMetaElement>('meta[property="og:url"]')
      ?.setAttribute("content", "https://huzaifa.cc/");
    document
      .querySelector<HTMLMetaElement>('meta[name="twitter:title"]')
      ?.setAttribute(
        "content",
        "Huzaifa bin Ishaq — Full-Stack, Cloud & AI Automation"
      );
    document
      .querySelector<HTMLMetaElement>('meta[name="twitter:description"]')
      ?.setAttribute(
        "content",
        "Evidence-backed systems, architecture decisions, and production case studies."
      );
  }, []);

  useEffect(() => {
    if (location !== "/") return;
    const pendingTarget = sessionStorage.getItem(PENDING_NAV_TARGET_KEY);
    const hashTarget = window.location.hash.replace("#", "");
    const targetId = pendingTarget || hashTarget;
    if (!targetId) return;

    const scrollWithOffset = (behavior: ScrollBehavior) => {
      const targetEl = document.getElementById(targetId);
      if (!targetEl) return;
      const headerOffsetPx = 84;
      const top = Math.max(
        0,
        targetEl.getBoundingClientRect().top + window.scrollY - headerOffsetPx
      );
      window.scrollTo({ top, behavior });
    };

    const initialScrollTimeout = window.setTimeout(() => {
      scrollWithOffset("smooth");
    }, 40);
    const settleScrollTimeout = window.setTimeout(() => {
      scrollWithOffset("auto");
    }, 420);

    if (pendingTarget) {
      sessionStorage.removeItem(PENDING_NAV_TARGET_KEY);
      window.history.replaceState(null, "", `/#${targetId}`);
    }

    return () => {
      window.clearTimeout(initialScrollTimeout);
      window.clearTimeout(settleScrollTimeout);
    };
  }, [location]);

  return (
    <div className="min-h-screen">
      <SiteNav />
      <main>
        <Hero />
        <SystemsIBuiltSection />
        <CoolStuffSection />
        <About />
        <Experience />
        <Skills />
        <GitHubApproach />
        <Education />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
