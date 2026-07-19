import { motion, useInView, useReducedMotion } from "framer-motion";
import {
  Dices,
  Gamepad2,
  Gift,
  Rocket,
  Sparkles,
} from "lucide-react";
import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { CoolStuffCard } from "@/components/CoolStuffCard";
import { GitHubActivity } from "@/components/GitHubActivity";

const MeVsWorldCard = lazy(async () => {
  const module = await import("@/components/MeVsWorldCard");
  return { default: module.MeVsWorldCard };
});

const githubUsername = import.meta.env.VITE_GITHUB_USERNAME || "elemten";
const signatureStorageKey = "portfolio-signatures";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

function GiftSignbook() {
  const [name, setName] = useState("");
  const [response, setResponse] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [signatures, setSignatures] = useState<string[]>([]);
  const [showSignatures, setShowSignatures] = useState(false);
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(signatureStorageKey);
      const parsed = stored ? JSON.parse(stored) : [];
      if (Array.isArray(parsed)) {
        setSignatures(parsed.filter(item => typeof item === "string").slice(-5));
      }
    } catch {
      setSignatures([]);
    }
    return () => controllerRef.current?.abort();
  }, []);

  async function receiveGift() {
    const cleanName = name.trim().slice(0, 40);
    if (!cleanName || status === "loading") return;

    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    setStatus("loading");
    setResponse("");

    try {
      const request = await fetch("/api/gift", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: cleanName }),
        signal: controller.signal,
      });
      const body = await request.json().catch(() => ({})) as { pun?: string; error?: string };
      if (!request.ok || !body.pun) throw new Error(body.error || "The gift shop is resting.");

      const nextSignatures = [...signatures, cleanName].slice(-5);
      setSignatures(nextSignatures);
      try {
        window.localStorage.setItem(signatureStorageKey, JSON.stringify(nextSignatures));
      } catch {
        // The interaction still works when storage is unavailable.
      }
      setResponse(body.pun);
      setStatus("success");
    } catch (error: unknown) {
      if ((error as { name?: string })?.name === "AbortError") return;
      setResponse(error instanceof Error ? error.message : "The gift shop is resting.");
      setStatus("error");
    }
  }

  return (
    <CoolStuffCard
      label="Mystery gift signbook"
      icon={<Gift className="h-4 w-4" />}
      iconContainerClassName="bg-rose-100 text-rose-700"
      headerClassName="border-rose-200/80 bg-[linear-gradient(120deg,#ffc2cf,#f47c9b)]"
      labelClassName="text-rose-950"
      className="!pt-0 border-rose-200 bg-[linear-gradient(180deg,#fff0f4,#fff)] shadow-[0_24px_60px_-34px_rgba(225,29,72,.5)]"
      footer={
        <button
          type="button"
          onClick={() => void receiveGift()}
          disabled={!name.trim() || status === "loading"}
          className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "loading" ? "Unwrapping…" : "Receive gift"}
          <Sparkles className={status === "loading" ? "h-3.5 w-3.5 animate-pulse" : "h-3.5 w-3.5"} />
        </button>
      }
    >
      <div className="space-y-4 rounded-xl border border-rose-200/70 bg-white/75 p-4">
        <div className="flex items-center justify-between gap-3">
          <label htmlFor="gift-name" className="font-mono text-[10px] uppercase tracking-[0.16em] text-rose-900/65">Your name</label>
          <button type="button" onClick={() => setShowSignatures(value => !value)} className="text-[10px] text-rose-800 underline underline-offset-4">
            {showSignatures ? "Hide signbook" : "Open signbook"}
          </button>
        </div>
        <input
          id="gift-name"
          value={name}
          maxLength={40}
          onChange={event => setName(event.target.value)}
          onKeyDown={event => { if (event.key === "Enter") void receiveGift(); }}
          placeholder="Your name"
          className="w-full border-b-2 border-rose-200 bg-transparent py-2 text-2xl font-semibold text-rose-950 outline-none transition-colors placeholder:text-rose-900/20 focus:border-rose-500"
        />
        <div className="min-h-20 whitespace-pre-line border-l-2 border-rose-200 bg-rose-50/70 p-3 text-sm leading-relaxed text-rose-950/75" aria-live="polite">
          {response || "Leave your name and receive a tiny two-line surprise."}
        </div>
        {showSignatures ? (
          <div className="border-t border-rose-200 pt-3">
            <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-rose-900/55">Stored on this device only</p>
            <p className="mt-2 text-sm text-rose-950/70">{signatures.length ? [...signatures].reverse().join(" · ") : "No signatures yet."}</p>
          </div>
        ) : null}
      </div>
    </CoolStuffCard>
  );
}

const ideaReels = {
  friction: ["Spreadsheet maze", "Manual handoff", "Mystery outage", "Slow approval", "Scattered knowledge"],
  build: ["Tiny agent team", "Event-driven API", "Operator cockpit", "Geospatial matcher", "Automation pipeline"],
  rule: ["No browser secrets", "Auditable by humans", "One-click rollback", "Works on a phone", "No invented data"],
};

function IdeaMachineCard() {
  const reduceMotion = useReducedMotion();
  const [indices, setIndices] = useState([0, 1, 2]);
  const [spinning, setSpinning] = useState(false);
  const [briefNumber, setBriefNumber] = useState(1);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) window.clearInterval(intervalRef.current);
    };
  }, []);

  function randomIndices() {
    return [
      Math.floor(Math.random() * ideaReels.friction.length),
      Math.floor(Math.random() * ideaReels.build.length),
      Math.floor(Math.random() * ideaReels.rule.length),
    ];
  }

  function spin() {
    if (spinning) return;
    if (reduceMotion) {
      setIndices(randomIndices());
      setBriefNumber(number => number + 1);
      return;
    }
    setSpinning(true);
    let ticks = 0;
    intervalRef.current = window.setInterval(() => {
      setIndices(randomIndices());
      ticks += 1;
      if (ticks >= 9 && intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
        setSpinning(false);
        setBriefNumber(number => number + 1);
      }
    }, 75);
  }

  const rows = [
    ["Friction", ideaReels.friction[indices[0]]],
    ["Build", ideaReels.build[indices[1]]],
    ["One rule", ideaReels.rule[indices[2]]],
  ];

  return (
    <CoolStuffCard
      label="Ship something weird"
      icon={<Rocket className="h-4 w-4" />}
      iconContainerClassName="bg-[#ffe66d] text-[#2f2376] ring-1 ring-[#2f2376]/10"
      headerClassName="border-[#2f2376]/15 bg-[#ff7a59]"
      labelClassName="text-[#261b63]"
      className="!pt-0 border-[#2f2376]/20 bg-[#3f32a5] text-white shadow-[0_26px_65px_-35px_rgba(63,50,165,.7)]"
      footer={
        <button type="button" onClick={spin} disabled={spinning} className="inline-flex items-center gap-2 rounded-full bg-[#ffe66d] px-5 py-2.5 text-sm font-black text-[#261b63] shadow-[0_8px_0_#261b63] transition-transform hover:-translate-y-0.5 active:translate-y-1 active:shadow-none disabled:cursor-wait disabled:opacity-70">
          <Dices className={spinning ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
          {spinning ? "Spinning…" : "Pull the lever"}
        </button>
      }
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.17em] text-[#d8d3ff]">Architecture slot machine</p>
          <h3 className="mt-2 text-3xl font-black leading-none tracking-[-0.045em] text-white">Make a strange brief.<br />Then make it shippable.</h3>
        </div>
        <span className="rotate-3 border-2 border-[#ffe66d] px-2 py-1 font-mono text-[10px] text-[#ffe66d]">#{String(briefNumber).padStart(2, "0")}</span>
      </div>
      <div className="mt-7 overflow-hidden border-2 border-[#261b63] bg-[#fffdf4] text-[#261b63] shadow-[8px_8px_0_#261b63]">
        {rows.map(([label, value], index) => (
          <motion.div
            key={label}
            animate={spinning ? { x: [0, index % 2 ? -8 : 8, 0] } : { x: 0 }}
            className="grid grid-cols-[5.5rem_1fr] items-center border-b-2 border-[#261b63] last:border-b-0"
          >
            <span className="h-full border-r-2 border-[#261b63] bg-[#ffe66d] px-3 py-4 font-mono text-[9px] font-bold uppercase tracking-[0.13em]">{label}</span>
            <strong className="px-4 py-4 text-base tracking-[-0.02em]">{value}</strong>
          </motion.div>
        ))}
      </div>
      <p className="mt-5 text-sm leading-relaxed text-[#d8d3ff]">No AI call. Just a tiny prompt generator for the kind of constraint-first systems conversations I enjoy.</p>
    </CoolStuffCard>
  );
}

export default function CoolStuffSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section id="cool-stuff" ref={sectionRef} className="scroll-mt-24 border-b border-border bg-[#f3f6f5] py-20 md:py-24">
      <div className="container">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <p className="section-label">Cool stuff</p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">Small working experiments that show personality, interaction, and a few implementation boundaries.</p>
          </div>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="grid-auto lg:col-span-9"
          >
            <motion.div variants={fadeInUp} className="h-full"><GiftSignbook /></motion.div>
            <motion.div variants={fadeInUp} className="h-full"><GitHubActivity username={githubUsername} /></motion.div>
            <motion.div variants={fadeInUp} className="h-full">
              {isInView ? (
                <Suspense fallback={<CoolStuffCard label="Me vs the world" icon={<Gamepad2 className="h-4 w-4" />}><div className="h-[420px] animate-pulse bg-secondary/30" /></CoolStuffCard>}>
                  <MeVsWorldCard />
                </Suspense>
              ) : (
                <CoolStuffCard label="Me vs the world" icon={<Gamepad2 className="h-4 w-4" />}><div className="h-[420px] bg-secondary/20" /></CoolStuffCard>
              )}
            </motion.div>
            <motion.div variants={fadeInUp} className="h-full"><IdeaMachineCard /></motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
