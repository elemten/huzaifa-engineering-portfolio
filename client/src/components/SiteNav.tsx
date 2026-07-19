import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  Menu,
  X,
  ArrowRight,
  Zap,
  Github,
  Linkedin,
  Mail,
  Download,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "wouter";

type NavMode = "scroll" | "link";

type SiteNavProps = {
  mode?: NavMode;
};

const PENDING_NAV_TARGET_KEY = "site-nav-target";

export default function SiteNav({ mode = "scroll" }: SiteNavProps) {
  const { scrollY } = useScroll();
  const [location, setLocation] = useLocation();
  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ["rgba(255,255,255,0)", "rgba(255,255,255,0.9)"]
  );
  const borderOpacity = useTransform(scrollY, [0, 100], [0, 1]);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("hero");
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileCloseButtonRef = useRef<HTMLButtonElement>(null);
  const mobilePanelRef = useRef<HTMLDivElement>(null);

  const navItems = useMemo(
    () => [
      { label: "Know me", target: "about" },
      { label: "Experience", target: "experience" },
      { label: "Skills", target: "skills" },
      { label: "Systems I Built", target: "systems" },
      { label: "Contact", target: "contact" },
    ],
    []
  );

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    const headerOffsetPx = 84; // 64px nav + ~20px breathing room
    const top = Math.max(
      0,
      el.getBoundingClientRect().top + window.scrollY - headerOffsetPx
    );
    window.scrollTo({ top, behavior: "smooth" });
    setActiveSection(id);
  };

  const goHome = () => {
    if (mode === "scroll") {
      scrollTo("hero");
      return;
    }

    if (location === "/") {
      scrollTo("hero");
      window.history.replaceState(null, "", "/");
      return;
    }

    sessionStorage.setItem(PENDING_NAV_TARGET_KEY, "hero");
    setLocation("/");
  };

  const handleNavTarget = (target: string) => {
    if (mode === "scroll") {
      scrollTo(target);
      return;
    }

    if (location === "/") {
      scrollTo(target);
      window.history.replaceState(null, "", `/#${target}`);
      return;
    }

    sessionStorage.setItem(PENDING_NAV_TARGET_KEY, target);
    setLocation("/");
  };

  useEffect(() => {
    if (!mobileNavOpen) return;

    const previousOverflow = document.body.style.overflow;
    const animationFrame = window.requestAnimationFrame(() => {
      mobileCloseButtonRef.current?.focus();
    });
    const handleDialogKeys = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setMobileNavOpen(false);
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = Array.from(
        mobilePanelRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
        ) ?? []
      ).filter(element => !element.hasAttribute("disabled"));
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleDialogKeys);
    return () => {
      window.cancelAnimationFrame(animationFrame);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleDialogKeys);
      mobileMenuButtonRef.current?.focus();
    };
  }, [mobileNavOpen]);

  useEffect(() => {
    if (mode !== "scroll") {
      setActiveSection("");
      return;
    }

    const idsToTrack = ["hero", ...navItems.map(i => i.target), "cool-stuff"];
    const elements = idsToTrack
      .map(id => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort(
            (a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0)
          );
        const topEntry = visible[0];
        if (topEntry?.target?.id) setActiveSection(topEntry.target.id);
      },
      {
        root: null,
        rootMargin: "-30% 0px -60% 0px",
        threshold: [0.05, 0.1, 0.2, 0.35, 0.5, 0.75],
      }
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, [mode, navItems]);

  return (
    <motion.nav
      style={{ backgroundColor }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md"
    >
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-border"
        style={{ opacity: borderOpacity }}
      />
      <div className="container flex items-center justify-between h-16">
        <motion.button
          type="button"
          onClick={goHome}
          className="font-heading font-bold text-xl tracking-tight inline-flex items-center gap-1"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>Huzaifa</span>
          <span className="font-mono text-muted-foreground select-none">
            /&gt;
          </span>
        </motion.button>

        {/* Desktop nav */}
        <div className="hidden items-center gap-4 md:flex lg:gap-7">
          {navItems.map((item, i) =>
            mode === "scroll" ? (
              <motion.button
                key={item.label}
                onClick={() => scrollTo(item.target)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors relative group"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i + 0.3 }}
              >
                {item.label}
                {activeSection === item.target ? (
                  <motion.span
                    layoutId="nav-active-underline"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-foreground/80 shadow-[0_0_14px_rgba(0,0,0,0.18)]"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                ) : null}
                <motion.span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-foreground group-hover:w-full transition-all duration-300" />
              </motion.button>
            ) : (
              <motion.button
                type="button"
                key={item.label}
                onClick={() => handleNavTarget(item.target)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors relative group"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i + 0.3 }}
              >
                {item.label}
                <motion.span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-foreground group-hover:w-full transition-all duration-300" />
              </motion.button>
            )
          )}
          <a href="/Huzaifa-Ishaq-Resume.pdf" className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background transition-transform hover:-translate-y-0.5">
            <Download className="h-3.5 w-3.5" /> Résumé
          </a>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden">
          <motion.button
            ref={mobileMenuButtonRef}
            type="button"
            onClick={() => setMobileNavOpen(prev => !prev)}
            aria-label={mobileNavOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileNavOpen}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border/70 bg-background/60 text-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-background/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            whileTap={{ scale: 0.96 }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={mobileNavOpen ? "close" : "open"}
                initial={{ rotate: -20, opacity: 0, scale: 0.85 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 20, opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.2 }}
                className="inline-flex"
              >
                {mobileNavOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {mobileNavOpen && (
              <>
                <motion.div
                  aria-hidden="true"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  onClick={() => setMobileNavOpen(false)}
                  className="fixed inset-0 bg-black/35 z-[100]"
                />
                <motion.div
                  ref={mobilePanelRef}
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="mobile-navigation-title"
                  initial={{ y: "104%", opacity: 0.98, scale: 0.985 }}
                  animate={{ y: "0%", opacity: 1, scale: 1 }}
                  exit={{ y: "104%", opacity: 0.98, scale: 0.985 }}
                  transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                  className="fixed bottom-0 left-0 w-full bg-background z-[101] rounded-t-[2rem] shadow-[0_-8px_24px_rgba(0,0,0,0.1)] flex flex-col max-h-[90vh] transform-gpu will-change-transform will-change-opacity"
                >
              <div className="w-full flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing">
                <div className="w-12 h-1.5 bg-muted rounded-full"></div>
              </div>
              <div className="px-8 pt-4 pb-10 flex flex-col h-full overflow-y-auto no-scrollbar">
                <div className="flex items-center justify-between mb-8">
                  <h2
                    id="mobile-navigation-title"
                    className="text-3xl font-bold font-heading tracking-tight text-foreground"
                  >
                    Navigation
                  </h2>
                  <button
                    ref={mobileCloseButtonRef}
                    type="button"
                    onClick={() => setMobileNavOpen(false)}
                    aria-label="Close navigation menu"
                    className="p-2 rounded-full hover:bg-secondary transition-colors text-foreground"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <nav className="flex flex-col gap-6 mb-10">
                  {navItems.map((item, index) => {
                    const numberStr = `0${index + 1}`;
                    return mode === "scroll" ? (
                      <button
                        key={item.label}
                        onClick={() => {
                          scrollTo(item.target);
                          setMobileNavOpen(false);
                        }}
                        className="group flex items-center justify-between py-2 border-b border-transparent hover:border-border transition-all text-left"
                      >
                        <div className="flex items-baseline gap-4">
                          <span className="text-sm font-medium text-muted-foreground font-mono">
                            {numberStr}
                          </span>
                          <span className="text-2xl font-medium text-foreground group-hover:pl-2 transition-all">
                            {item.label}
                          </span>
                        </div>
                        <ArrowRight className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors opacity-0 group-hover:opacity-100" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        key={item.label}
                        onClick={() => {
                          handleNavTarget(item.target);
                          setMobileNavOpen(false);
                        }}
                        className="group flex w-full items-center justify-between py-2 border-b border-transparent hover:border-border transition-all text-left"
                      >
                        <div className="flex items-baseline gap-4">
                          <span className="text-sm font-medium text-muted-foreground font-mono">
                            {numberStr}
                          </span>
                          <span className="text-2xl font-medium text-foreground group-hover:pl-2 transition-all">
                            {item.label}
                          </span>
                        </div>
                        <ArrowRight className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors opacity-0 group-hover:opacity-100" />
                      </button>
                    );
                  })}
                </nav>

                <div className="mt-auto pt-4 border-t border-border">
                  {mode === "scroll" ? (
                    <button
                      onClick={() => {
                        scrollTo("cool-stuff");
                        setMobileNavOpen(false);
                      }}
                      className="w-full bg-foreground text-background h-14 rounded-full font-bold text-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg active:scale-[0.98] transform duration-100"
                    >
                      <span>Take me to Cool Stuff</span>
                      <Zap className="w-5 h-5 fill-background" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        handleNavTarget("cool-stuff");
                        setMobileNavOpen(false);
                      }}
                      className="w-full bg-foreground text-background h-14 rounded-full font-bold text-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg active:scale-[0.98] transform duration-100"
                    >
                      <span>Take me to Cool Stuff</span>
                      <Zap className="w-5 h-5 fill-background" />
                    </button>
                  )}
                  <div className="mt-6 flex justify-center gap-3">
                    <a
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/80 bg-background text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground/20 hover:text-foreground"
                      href="https://github.com/elemten"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="GitHub profile"
                    >
                      <Github className="h-5 w-5" />
                    </a>
                    <a
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/80 bg-background text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground/20 hover:text-foreground"
                      href="https://www.linkedin.com/in/huzaifa-ishaq-5547931bb/"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="LinkedIn profile"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                    <a
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/80 bg-background text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground/20 hover:text-foreground"
                      href="mailto:huzaifa.ishaq.395@gmail.com"
                      aria-label="Send email"
                    >
                      <Mail className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body
        )}
    </motion.nav>
  );
}
