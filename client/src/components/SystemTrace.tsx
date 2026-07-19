import type { SystemStep } from "@/data/caseStudyScan";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Cloud, Code2, Network } from "lucide-react";
import { useState } from "react";

type SystemTraceProps = {
  steps: SystemStep[];
  accent: string;
  label: string;
};

const ownershipLabels: Record<SystemStep["ownership"], string> = {
  built: "I designed / built",
  platform: "Platform boundary",
  external: "External integration",
};

const ownershipIcons = {
  built: Code2,
  platform: Cloud,
  external: Network,
};

export function SystemTrace({ steps, accent, label }: SystemTraceProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const activeStep = steps[activeIndex];
  const ActiveIcon = ownershipIcons[activeStep.ownership];

  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-black/10 bg-white shadow-[0_22px_70px_rgba(15,23,42,0.08)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 bg-[#fbfbf8] px-5 py-4 md:px-7">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: accent }} />
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-black/55">
            {label}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.12em] text-black/40">
          <span>Click a boundary</span>
          <span aria-hidden="true">·</span>
          <span>{activeIndex + 1}/{steps.length}</span>
        </div>
      </div>

      <div className="px-5 py-6 md:px-7">
        <div className="relative grid gap-0 border-b border-black/10 md:grid-cols-5">
          <div
            aria-hidden="true"
            className="absolute left-[8%] right-[8%] top-5 hidden h-px origin-left md:block"
            style={{ backgroundColor: `${accent}66` }}
          />
          {steps.map((step, index) => {
            const Icon = ownershipIcons[step.ownership];
            const isActive = activeIndex === index;
            return (
              <button
                type="button"
                key={step.label}
                onClick={() => setActiveIndex(index)}
                className="group relative z-10 grid grid-cols-[2.5rem_1fr] items-center gap-3 border-t border-black/10 py-3 text-left transition-colors first:border-t-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:block md:border-t-0 md:px-2 md:pb-5 md:pt-0 md:text-center"
                style={{
                  color: isActive ? accent : undefined,
                }}
                aria-pressed={isActive}
              >
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-full border bg-white transition-transform group-hover:scale-105 md:mx-auto"
                  style={{ borderColor: isActive ? accent : "rgba(15,23,42,0.16)" }}
                >
                  {isActive ? (
                    <Check className="h-5 w-5" style={{ color: accent }} />
                  ) : (
                    <Icon className="h-5 w-5 text-black/45" />
                  )}
                </span>
                <span>
                  <span className="block text-xs font-semibold text-foreground md:mt-3">{step.label}</span>
                  <span className="mt-1 block text-[9px] uppercase tracking-[0.12em] text-black/40">{ownershipLabels[step.ownership]}</span>
                </span>
              </button>
            );
          })}
        </div>

        <motion.div
          key={activeStep.label}
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-4 border-b border-black/10 py-5 md:grid-cols-[auto_1fr] md:items-center"
        >
          <span
            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10"
            style={{ backgroundColor: `${accent}22`, color: accent }}
          >
            <ActiveIcon className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold text-foreground">{activeStep.label}</p>
            <p className="mt-1 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              {activeStep.detail}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
