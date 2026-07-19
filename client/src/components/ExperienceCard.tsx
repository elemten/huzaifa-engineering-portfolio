import { ArrowRight, CheckCircle2, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

type ImpactItem = {
  metric: string;
  description: string;
};

export type Experience = {
  title: string;
  company: string;
  location: string;
  period: string;
  role?: string;
  problem: string;
  approach: string;
  impact: ImpactItem[];
  owned: string[];
  stacks: string[];
  caseStudySlug?: string;
};

type ExperienceCardProps = {
  experience: Experience;
  defaultOpen?: boolean;
};

export function ExperienceCard({ experience, defaultOpen = false }: ExperienceCardProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <article className="border-t border-border py-7 last:border-b md:py-9">
      <div className="grid gap-5 md:grid-cols-[1fr_auto]">
        <div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            <span>{experience.company}</span>
            {experience.role ? <span>· {experience.role}</span> : null}
          </div>
          <h3 className="mt-3 text-xl font-semibold tracking-[-0.025em] text-foreground md:text-2xl">
            {experience.title}
          </h3>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            {experience.problem}
          </p>
        </div>
        <div className="md:text-right">
          <p className="font-mono text-xs text-foreground">{experience.period}</p>
          <p className="mt-1 text-xs text-muted-foreground">{experience.location}</p>
        </div>
      </div>

      <dl className="mt-6 grid grid-cols-3 border-y border-border/70">
        {experience.impact.map(item => (
          <div key={`${item.metric}-${item.description}`} className="min-w-0 border-r border-border/70 px-3 py-4 first:pl-0 last:border-r-0 last:pr-0 md:px-5">
            <dt className="truncate text-sm font-semibold text-foreground md:text-lg">{item.metric}</dt>
            <dd className="mt-1 line-clamp-2 text-[9px] uppercase leading-relaxed tracking-[0.11em] text-muted-foreground md:text-[10px]">
              {item.description}
            </dd>
          </div>
        ))}
      </dl>

      <details open={open} onToggle={event => setOpen(event.currentTarget.open)} className="group/details">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-xs font-semibold text-foreground transition-colors hover:text-primary [&::-webkit-details-marker]:hidden">
          <span>Ownership and system shape</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open/details:rotate-180" />
        </summary>
        <div className="grid gap-6 border-t border-border/70 py-6 md:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">I owned</p>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2 md:grid-cols-1">
              {experience.owned.map(item => (
                <li key={item} className="flex items-center gap-2 text-sm text-foreground/78">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">System delivered</p>
            <p className="mt-3 text-sm leading-relaxed text-foreground/72">{experience.approach}</p>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
              {experience.stacks.map(stack => (
                <span key={stack} className="border-b border-border pb-1 text-[10px] font-medium text-muted-foreground">
                  {stack}
                </span>
              ))}
            </div>
            {experience.caseStudySlug ? (
              <Link href={`/work/${experience.caseStudySlug}`} className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-foreground hover:underline">
                Inspect related system <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            ) : null}
          </div>
        </div>
      </details>
    </article>
  );
}
