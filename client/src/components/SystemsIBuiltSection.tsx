import { caseStudies } from "@/data/caseStudies";
import { caseStudyScanBySlug } from "@/data/caseStudyScan";
import { ArrowRight, ExternalLink, Github, LockKeyhole } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";

const flagshipSlugs = [
  "llrib-modernization",
  "ttsask",
  "autojobapply",
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
  return (
    <section id="systems" className="scroll-mt-20 border-b border-border bg-[#f7f7f3] py-20 md:py-28">
      <div className="container">
        <div className="grid gap-8 border-b border-foreground pb-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="section-label">Selected work</p>
            <h2 className="mt-4 max-w-4xl text-4xl font-semibold tracking-[-0.055em] md:text-6xl">
              The systems I would put on the whiteboard.
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground lg:col-span-4">
            Four projects with different constraints. Open one for the decisions, boundaries, shipped interface, and what I would change next.
          </p>
        </div>

        <div>
          {flagshipStudies.map((study, index) => {
            const scan = caseStudyScanBySlug[study.slug];
            const leadImage = scan.proof[0];
            const imageFirst = index % 2 === 0;

            return (
              <motion.article
                key={study.slug}
                initial={false}
                className="grid gap-8 border-b border-border py-12 md:py-16 lg:grid-cols-12 lg:items-center lg:gap-14"
              >
                <Link
                  href={`/work/${study.slug}`}
                  className={`group relative block overflow-hidden bg-secondary/60 ${imageFirst ? "lg:col-span-7" : "lg:order-2 lg:col-span-7"}`}
                >
                  <img
                    src={leadImage.src}
                    alt={leadImage.alt}
                    loading={index < 2 ? "eager" : "lazy"}
                    className="aspect-[16/10] w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.012]"
                  />
                  <span className="absolute left-0 top-0 bg-[#f7f7f3] px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em]">
                    {study.status}
                  </span>
                  {scan.proof.length > 1 ? (
                    <span className="absolute bottom-0 right-0 bg-foreground px-3 py-2 font-mono text-[9px] uppercase tracking-[0.12em] text-background">
                      {scan.proof.length} documented views
                    </span>
                  ) : null}
                </Link>

                <div className={imageFirst ? "lg:col-span-5" : "lg:order-1 lg:col-span-5"}>
                  <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: study.accent }}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <span className="h-px w-8 bg-current" />
                    <span>{study.period}</span>
                  </div>
                  <h3 className="mt-5 text-3xl font-semibold tracking-[-0.045em] md:text-4xl">{study.shortTitle}</h3>
                  <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">{scan.brief}</p>

                  <dl className="mt-8 border-t border-border">
                    <div className="grid grid-cols-[6.5rem_1fr] gap-4 border-b border-border py-3.5">
                      <dt className="font-mono text-[9px] uppercase tracking-[0.13em] text-muted-foreground">Made easier</dt>
                      <dd className="text-sm leading-relaxed">{scan.impact?.easier ?? scan.after[0]}</dd>
                    </div>
                    <div className="grid grid-cols-[6.5rem_1fr] gap-4 border-b border-border py-3.5">
                      <dt className="font-mono text-[9px] uppercase tracking-[0.13em] text-muted-foreground">Automated</dt>
                      <dd className="text-sm leading-relaxed">{scan.impact?.automated ?? scan.owned.slice(0, 2).join(" · ")}</dd>
                    </div>
                    <div className="grid grid-cols-[6.5rem_1fr] gap-4 border-b border-border py-3.5">
                      <dt className="font-mono text-[9px] uppercase tracking-[0.13em] text-muted-foreground">Proof</dt>
                      <dd className="text-sm leading-relaxed">{scan.impact?.proof ?? scan.after[0]}</dd>
                    </div>
                  </dl>

                  <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
                    <Link href={`/work/${study.slug}`} className="inline-flex items-center gap-2 text-sm font-semibold underline decoration-border underline-offset-4 hover:decoration-foreground">
                      Read the case study <ArrowRight className="h-4 w-4" />
                    </Link>
                    {study.repoUrl ? (
                      <a href={study.repoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
                        <Github className="h-3.5 w-3.5" /> Public source <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"><LockKeyhole className="h-3.5 w-3.5" /> Private source; evidence labeled</span>
                    )}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        <div className="grid gap-8 border-b border-border border-t border-foreground py-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="section-label">Technical archive</p>
            <h3 className="mt-3 text-2xl font-semibold tracking-[-0.035em]">Smaller builds, kept in proportion.</h3>
          </div>
          <div className="md:col-span-8 md:border-l md:border-border md:pl-8">
            {archiveStudies.map(study => (
              <Link key={study.slug} href={`/work/${study.slug}`} className="group grid grid-cols-[2rem_1fr_auto] items-center gap-3 border-t border-border py-4 first:border-t-0">
                <span className="font-mono text-[10px]" style={{ color: study.accent }}>{study.index}</span>
                <span>
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
