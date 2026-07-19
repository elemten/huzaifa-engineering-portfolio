import type { SystemStep } from "@/data/caseStudyScan";
import { motion, useReducedMotion } from "framer-motion";
import { Check, FileCheck2, MapPin, Play, RotateCcw, Smartphone, Workflow } from "lucide-react";
import { useEffect, useState } from "react";

type CapabilityDemoProps = {
  slug: string;
  steps: SystemStep[];
  accent: string;
};

const demoTitles: Record<string, string> = {
  "resume-analyzer": "Grounded document run",
  "gis-road-matcher": "GPS-to-road snap",
  "ramadan-wallpaper": "Wallpaper render contract",
  autojobapply: "Stage-isolated application run",
  "quest-disposal": "Work-order state transition",
  dapp: "Wallet-to-confirmation lifecycle",
  "prairiecare-architecture": "Referral state contract",
  "rave-confessions": "Pseudonymous write boundary",
  "netprobe-android-lab": "Consent-to-local-server boundary",
  "data-portfolio-delivery": "Static client delivery path",
  "receipt-extraction-prototype": "Archived extraction boundary",
};

const demoArtifacts: Record<string, { label: string; value: string }[]> = {
  "resume-analyzer": [
    { label: "Source", value: "Candidate facts locked" },
    { label: "Analysis", value: "Requirements structured" },
    { label: "Gate", value: "Sections validated" },
    { label: "Artifact", value: "PDF ready" },
  ],
  autojobapply: [
    { label: "Role", value: "Normalized" },
    { label: "Fit", value: "Evaluated" },
    { label: "Documents", value: "Prepared" },
    { label: "Worker", value: "Queued" },
  ],
  "quest-disposal": [
    { label: "WO-1042", value: "Received" },
    { label: "Owner", value: "Assigned" },
    { label: "Status", value: "In progress" },
    { label: "Audit", value: "Recorded" },
  ],
  dapp: [
    { label: "Action", value: "Prepared" },
    { label: "Wallet", value: "Approved" },
    { label: "Network", value: "Pending" },
    { label: "Contract", value: "Confirmed" },
  ],
  "prairiecare-architecture": [
    { label: "Identity", value: "JWT validated" },
    { label: "Command", value: "State checked" },
    { label: "Current", value: "Record updated" },
    { label: "Audit", value: "Event appended" },
  ],
  "rave-confessions": [
    { label: "Session", value: "Pseudonym resolved" },
    { label: "Payload", value: "Length checked" },
    { label: "Mutation", value: "Server-held role" },
    { label: "Remediation", value: "Abuse gate required" },
  ],
  "netprobe-android-lab": [
    { label: "Consent", value: "Permission visible" },
    { label: "Lifecycle", value: "Service active" },
    { label: "Transport", value: "Local lab only" },
    { label: "Boundary", value: "Unauthenticated" },
  ],
  "data-portfolio-delivery": [
    { label: "Content", value: "Structured" },
    { label: "Sections", value: "Navigable" },
    { label: "Projects", value: "Selectable" },
    { label: "Delivery", value: "Static" },
  ],
  "receipt-extraction-prototype": [
    { label: "Upload", value: "Must be bounded" },
    { label: "Provider", value: "Model retired" },
    { label: "Schema", value: "Needs validation" },
    { label: "Status", value: "Archived" },
  ],
};

function MapDemo({ activeIndex, accent }: { activeIndex: number; accent: string }) {
  return (
    <div className="relative min-h-64 overflow-hidden rounded-xl border border-white/10 bg-[#0d1718]">
      <svg viewBox="0 0 520 260" className="absolute inset-0 h-full w-full" role="img" aria-label="Representative raw GPS point snapping to a road geometry">
        <path d="M-20 220 C100 170 125 70 250 105 S410 200 550 58" fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="28" />
        <path d="M-20 220 C100 170 125 70 250 105 S410 200 550 58" fill="none" stroke="rgba(255,255,255,.28)" strokeWidth="2" strokeDasharray="8 8" />
        <path d="M20 20 C140 90 210 20 315 55 S440 120 540 95" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="12" />
        {activeIndex >= 1 ? <circle cx="174" cy="61" r="7" fill="white" opacity=".78" /> : null}
        {activeIndex >= 2 ? <line x1="174" y1="61" x2="194" y2="91" stroke={accent} strokeWidth="2" strokeDasharray="5 5" /> : null}
        {activeIndex >= 3 ? <circle cx="194" cy="91" r="9" fill={accent} /> : null}
        {activeIndex >= 3 ? <circle cx="194" cy="91" r="18" fill="none" stroke={accent} opacity=".35" /> : null}
      </svg>
      <div className="absolute left-4 top-4 rounded-lg border border-white/10 bg-black/35 px-3 py-2 font-mono text-[10px] text-white/60">
        fixture: 52.1322, -106.6700
      </div>
      <div className="absolute bottom-4 right-4 rounded-lg bg-black/55 px-3 py-2 text-xs text-white/65">
        {activeIndex < 2 ? "Locating candidate segments" : activeIndex < 3 ? "Ordering by distance" : "Road geometry verified"}
      </div>
    </div>
  );
}

function WallpaperDemo({ activeIndex, accent }: { activeIndex: number; accent: string }) {
  const rose = activeIndex >= 3;
  return (
    <div className="flex min-h-64 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-[#171a23] to-[#090b10] p-5">
      <motion.div
        animate={{ background: rose ? "linear-gradient(165deg,#4a1f39,#b8677e)" : "linear-gradient(165deg,#06152e,#16476f)" }}
        className="relative h-56 w-28 overflow-hidden rounded-[1.75rem] border-4 border-white/15 p-3 shadow-2xl"
      >
        <div className="mx-auto h-2 w-10 rounded-full bg-black/45" />
        <p className="mt-5 text-center text-[8px] uppercase tracking-[0.18em] text-white/65">Ramadan 1447</p>
        <p className="mt-1 text-center text-lg font-semibold text-white">12</p>
        <div className="mt-4 space-y-1.5 font-mono text-[7px] text-white/75">
          <div className="flex justify-between"><span>Fajr</span><span>05:41</span></div>
          <div className="flex justify-between"><span>Dhuhr</span><span>12:18</span></div>
          <div className="flex justify-between"><span>Asr</span><span>15:22</span></div>
          <div className="flex justify-between"><span>Maghrib</span><span>18:06</span></div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-16" style={{ background: `linear-gradient(transparent,${accent}55)` }} />
      </motion.div>
      <div className="ml-5 space-y-2 text-xs text-white/60">
        <p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> Location-aware</p>
        <p className="flex items-center gap-2"><Smartphone className="h-3.5 w-3.5" /> iOS dimensions</p>
        <p className="flex items-center gap-2"><Check className="h-3.5 w-3.5" /> Stable URL</p>
      </div>
    </div>
  );
}

function ArtifactDemo({ slug, activeIndex, accent }: { slug: string; activeIndex: number; accent: string }) {
  const artifacts = demoArtifacts[slug] ?? [];
  const Icon = slug === "resume-analyzer" ? FileCheck2 : slug === "quest-disposal" ? Workflow : Check;

  return (
    <div className="grid min-h-64 gap-3 rounded-xl border border-black/10 bg-white p-4 sm:grid-cols-2">
      {artifacts.map((artifact, index) => {
        const complete = activeIndex >= index + 1;
        return (
          <motion.div
            key={artifact.label}
            animate={{ opacity: complete ? 1 : 0.36, scale: complete ? 1 : 0.98 }}
            className="flex items-center gap-3 rounded-lg border border-black/10 bg-[#fbfbf8] p-4"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: complete ? `${accent}18` : "rgba(15,23,42,.04)", color: complete ? accent : "rgba(15,23,42,.3)" }}>
              <Icon className="h-4 w-4" />
            </span>
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-black/35">{artifact.label}</p>
              <p className="mt-1 text-xs font-medium text-foreground/75">{artifact.value}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export function CapabilityDemo({ slug, steps, accent }: CapabilityDemoProps) {
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(reduceMotion ? steps.length - 1 : 0);
  const [runId, setRunId] = useState(0);

  useEffect(() => {
    if (reduceMotion || activeIndex >= steps.length - 1) return;
    const timer = window.setTimeout(() => setActiveIndex(index => index + 1), 650);
    return () => window.clearTimeout(timer);
  }, [activeIndex, reduceMotion, runId, steps.length]);

  const replay = () => {
    setActiveIndex(reduceMotion ? steps.length - 1 : 0);
    setRunId(id => id + 1);
  };

  return (
    <section className="border-y border-black/10 bg-[#f1f5f9] py-16 text-foreground md:py-20">
      <div className="container">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/40">Implementation walkthrough · representative fixture data</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] md:text-5xl">{demoTitles[slug] ?? "System capability walkthrough"}</h2>
          </div>
          <button type="button" onClick={replay} className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-semibold text-foreground/70 transition-colors hover:border-black/25">
            {activeIndex >= steps.length - 1 ? <RotateCcw className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            Replay trace
          </button>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
          <div className="space-y-2">
            {steps.map((step, index) => {
              const active = activeIndex === index;
              const complete = activeIndex >= index;
              return (
                <button key={step.label} type="button" onClick={() => setActiveIndex(index)} className="flex w-full items-center gap-3 rounded-xl border bg-white p-3 text-left transition-colors" style={{ borderColor: active ? `${accent}99` : "rgba(15,23,42,.1)", backgroundColor: active ? `${accent}0c` : "white" }}>
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[10px]" style={{ borderColor: complete ? accent : "rgba(15,23,42,.15)", color: complete ? accent : "rgba(15,23,42,.35)" }}>
                    {complete ? <Check className="h-3.5 w-3.5" /> : index + 1}
                  </span>
                  <span>
                    <span className="block text-xs font-semibold text-foreground/80">{step.label}</span>
                    <span className="mt-0.5 line-clamp-1 block text-[10px] text-muted-foreground">{step.detail}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {slug === "gis-road-matcher" ? <MapDemo activeIndex={activeIndex} accent={accent} /> : slug === "ramadan-wallpaper" ? <WallpaperDemo activeIndex={activeIndex} accent={accent} /> : <ArtifactDemo slug={slug} activeIndex={activeIndex} accent={accent} />}
        </div>
      </div>
    </section>
  );
}
