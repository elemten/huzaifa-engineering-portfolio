import { caseStudies } from "@/data/caseStudies";
import { caseStudyScanBySlug } from "@/data/caseStudyScan";
import { ArrowRight, CheckCircle2, ExternalLink, Github, LockKeyhole } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "wouter";

const flagshipSlugs = [
  "llrib-modernization",
  "ttsask",
  "resume-analyzer",
  "gis-road-matcher",
] as const;

const flagshipStudies = flagshipSlugs.map(slug => {
  const study = caseStudies.find(item => item.slug === slug);
  if (!study) throw new Error(`Missing flagship case study: ${slug}`);
  return study;
});

const hiddenSlugs = new Set([
  "rave-confessions",
  "data-portfolio-delivery",
  "receipt-extraction-prototype",
]);

const archiveStudies = caseStudies.filter(study =>
  !flagshipSlugs.includes(study.slug as typeof flagshipSlugs[number]) && !hiddenSlugs.has(study.slug)
);

export default function SystemsIBuiltSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="systems" className="scroll-mt-20 border-b border-border bg-[#f7f7f3] py-20 md:py-28">
      <div className="container">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="section-label">Flagship work · selected for hiring signal</p>
            <h2 className="mt-4 max-w-4xl text-4xl font-semibold tracking-[-0.05em] md:text-6xl">
              Four systems. Four different kinds of ownership.
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground lg:col-span-4">
            Recruiters get the outcome and scope quickly. Engineering leads can open each case study for architecture, trust boundaries, evidence, and tradeoffs.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {flagshipStudies.map((study, index) => {
            const scan = caseStudyScanBySlug[study.slug];
            const leadImage = scan.proof[0];
            return (
              <motion.article
                key={study.slug}
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                whileHover={reduceMotion ? undefined : { y: -4 }}
                transition={{ duration: 0.25 }}
                className="group overflow-hidden rounded-[1.75rem] border border-border bg-white shadow-[0_18px_55px_rgba(15,23,42,0.05)]"
              >
                {leadImage ? (
                  <Link href={`/work/${study.slug}`} className="relative block overflow-hidden border-b border-border bg-secondary/50">
                    <img
                      src={leadImage.src}
                      alt={leadImage.alt}
                      loading={index < 2 ? "eager" : "lazy"}
                      className="aspect-[16/9] w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.015]"
                    />
                    <span className="absolute left-4 top-4 rounded-full border border-white/70 bg-white/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground shadow-sm backdrop-blur">
                      {study.status}
                    </span>
                    {scan.proof.length > 1 ? (
                      <span className="absolute bottom-4 right-4 rounded-full bg-black/75 px-3 py-1.5 text-[10px] font-medium text-white">
                        {scan.proof.length} verified views
                      </span>
                    ) : null}
                  </Link>
                ) : null}

                <div className="p-6 md:p-8">
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: study.accent }}>
                        {study.index} · {study.period}
                      </p>
                      <h3 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">{study.shortTitle}</h3>
                    </div>
                    <Link href={`/work/${study.slug}`} aria-label={`Open ${study.title} case study`} className="rounded-full border border-border p-3 transition-colors hover:bg-secondary">
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{scan.brief}</p>

                  <div className="mt-6 grid gap-3 rounded-2xl border border-border bg-secondary/30 p-4 sm:grid-cols-3">
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">Problem</p>
                      <p className="mt-2 text-xs leading-relaxed">{scan.before[0]}</p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">I owned</p>
                      <p className="mt-2 text-xs leading-relaxed">{scan.owned.slice(0, 2).join(" + ")}</p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">Result</p>
                      <p className="mt-2 text-xs leading-relaxed">{scan.after[0]}</p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4" style={{ color: study.accent }} />
                      Evidence and limitations labeled
                    </div>
                    <div className="flex items-center gap-4">
                      {study.repoUrl ? (
                        <a href={study.repoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold hover:underline">
                          <Github className="h-3.5 w-3.5" /> Source <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"><LockKeyhole className="h-3.5 w-3.5" /> Source private</span>
                      )}
                      <Link href={`/work/${study.slug}`} className="inline-flex items-center gap-2 text-xs font-semibold">
                        Read case study <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        <div className="mt-16 rounded-[1.5rem] border border-border bg-white p-6 md:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="section-label">Technical archive</p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight">More range, intentionally less prominence.</h3>
            </div>
            <p className="max-w-lg text-xs leading-relaxed text-muted-foreground">Labs and prototypes remain inspectable without competing with production and higher-evidence work.</p>
          </div>
          <div className="mt-6 grid border-t border-border md:grid-cols-2">
            {archiveStudies.map(study => (
              <Link key={study.slug} href={`/work/${study.slug}`} className="group flex items-center justify-between gap-4 border-b border-border py-4 md:odd:pr-6 md:even:border-l md:even:pl-6">
                <span>
                  <span className="mr-3 font-mono text-[10px]" style={{ color: study.accent }}>{study.index}</span>
                  <span className="text-sm font-semibold">{study.shortTitle}</span>
                  <span className="ml-3 text-[9px] uppercase tracking-[0.12em] text-muted-foreground">{study.status}</span>
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
