import ContactSection from "@/components/ContactSection";
import { CapabilityDemo } from "@/components/CapabilityDemo";
import SiteNav from "@/components/SiteNav";
import { SystemTrace } from "@/components/SystemTrace";
import type { CaseStudy } from "@/data/caseStudies";
import { caseStudyScanBySlug } from "@/data/caseStudyScan";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Github,
  LockKeyhole,
  MoveRight,
} from "lucide-react";
import { useEffect, useLayoutEffect } from "react";
import { Link } from "wouter";

type CaseStudyPageProps = {
  study: CaseStudy;
  nextStudy?: CaseStudy;
};

export default function CaseStudyPage({ study, nextStudy }: CaseStudyPageProps) {
  const scan = caseStudyScanBySlug[study.slug];

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [study.slug]);

  useEffect(() => {
    document.title = `${study.title} — Huzaifa bin Ishaq`;
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    description?.setAttribute("content", scan.brief);
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    canonical?.setAttribute("href", `https://huzaifa.cc/work/${study.slug}`);
    const setMeta = (selector: string, content: string) => {
      document.querySelector<HTMLMetaElement>(selector)?.setAttribute("content", content);
    };
    setMeta('meta[property="og:title"]', `${study.title} — System Brief`);
    setMeta('meta[property="og:description"]', scan.brief);
    setMeta('meta[property="og:url"]', `https://huzaifa.cc/work/${study.slug}`);
    setMeta('meta[name="twitter:title"]', `${study.title} — System Brief`);
    setMeta('meta[name="twitter:description"]', scan.brief);

    const structuredData = document.createElement("script");
    structuredData.id = "case-study-schema";
    structuredData.type = "application/ld+json";
    structuredData.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: study.title,
      description: scan.brief,
      url: `https://huzaifa.cc/work/${study.slug}`,
      image: scan.proof[0] ? `https://huzaifa.cc${scan.proof[0].src}` : undefined,
      creator: { "@type": "Person", name: "Huzaifa bin Ishaq", url: "https://huzaifa.cc" },
      keywords: study.tags,
    });
    document.getElementById("case-study-schema")?.remove();
    document.head.appendChild(structuredData);
    return () => structuredData.remove();
  }, [scan, study]);

  return (
    <div className="min-h-screen bg-[#f7f7f4] text-[#15171b]">
      <SiteNav mode="link" />
      <main>
        <header className="overflow-hidden bg-[#f7f7f4] pt-24">
          <div className="container py-8 md:py-12">
            <Link href="/#systems" className="inline-flex items-center gap-2 text-sm font-medium text-black/55 transition-colors hover:text-black">
              <ArrowLeft className="h-4 w-4" />
              Systems
            </Link>

            <div className="mt-9 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-black/48">
                  <span style={{ color: study.accent }}>{study.index}</span>
                  <span aria-hidden="true">/</span>
                  <span>{study.status}</span>
                  <span aria-hidden="true">/</span>
                  <span>{study.period}</span>
                </div>
                <h1 className="mt-5 max-w-4xl text-5xl font-semibold tracking-[-0.055em] md:text-7xl lg:text-[5.4rem] lg:leading-[0.95]">
                  {study.title}
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-black/60 md:text-xl">
                  {scan.brief}
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  {study.liveUrl ? (
                    <a href={study.liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5">
                      Live system <ArrowUpRight className="h-4 w-4" />
                    </a>
                  ) : null}
                  {study.repoUrl ? (
                    <a href={study.repoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white px-5 py-3 text-sm font-semibold transition-colors hover:border-black/35">
                      <Github className="h-4 w-4" /> Source
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-2 rounded-full border border-black/12 bg-white/70 px-5 py-3 text-sm text-black/52">
                      <LockKeyhole className="h-4 w-4" /> {study.repoLabel}
                    </span>
                  )}
                </div>
                <ul className="mt-6 flex flex-wrap gap-2" aria-label="Technology used">
                  {study.tags.map(tag => (
                    <li key={tag} className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-[11px] font-medium text-black/58">{tag}</li>
                  ))}
                </ul>
              </div>

              <dl className="border-y border-black/12">
                <div className="grid grid-cols-[7rem_1fr] gap-4 border-b border-black/10 py-4">
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/42">My role</dt>
                  <dd className="text-sm font-semibold">{study.role}</dd>
                </div>
                <div className="grid grid-cols-[7rem_1fr] gap-4 border-b border-black/10 py-4">
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/42">System</dt>
                  <dd className="text-sm font-semibold">{study.industry}</dd>
                </div>
                {study.metrics.slice(0, 2).map(metric => (
                  <div key={metric.label} className="grid grid-cols-[7rem_1fr] gap-4 border-b border-black/10 py-4 last:border-b-0">
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/42">{metric.label}</dt>
                    <dd className="text-lg font-semibold tracking-tight" style={{ color: study.accent }}>{metric.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="mt-12 md:mt-16">
              <SystemTrace
                steps={scan.system}
                accent={study.accent}
                label={scan.proof.length > 0 ? "Interactive runtime model" : "Interactive architecture reconstruction"}
              />
            </div>
          </div>
        </header>

        <section className="container py-20 md:py-28">
          <div className="flex items-end justify-between gap-5 border-b border-black/12 pb-6">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-black/42">Transformation</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] md:text-5xl">What changed</h2>
            </div>
            <MoveRight className="hidden h-8 w-8 text-black/25 md:block" />
          </div>

          <div className="mt-7 grid border-y border-black/12 lg:grid-cols-[1fr_1.15fr_1fr]">
            <div className="py-7 pr-0 lg:pr-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/42">Before</p>
              <p className="mt-4 text-sm leading-relaxed text-black/60">{scan.problem}</p>
              <ul className="mt-6 space-y-3">
                {scan.before.map(item => <li key={item} className="flex gap-3 text-sm"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black/25" />{item}</li>)}
              </ul>
            </div>

            <div className="border-y border-black/10 py-7 lg:border-x lg:border-y-0 lg:px-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: study.accent }}>I owned</p>
              <p className="mt-4 text-lg font-semibold leading-snug text-black/82">{scan.intervention}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {scan.owned.map(item => <span key={item} className="border-b border-black/18 pb-1 text-xs font-medium text-black/62">{item}</span>)}
              </div>
            </div>

            <div className="py-7 pl-0 lg:pl-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/42">After</p>
              <p className="mt-4 text-sm leading-relaxed text-black/60">{scan.result}</p>
              <ul className="mt-6 space-y-3">
                {scan.after.map(item => <li key={item} className="flex gap-3 text-sm"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" style={{ color: study.accent }} />{item}</li>)}
              </ul>
            </div>
          </div>
        </section>

        <section className="border-y border-black/10 bg-white py-20 md:py-28">
          <div className="container">
            <div className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-black/42">Operating context</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] md:text-5xl">The constraints behind the interface</h2>
                <p className="mt-6 text-sm leading-relaxed text-black/60">{study.challenge}</p>
              </div>
              <div className="lg:col-span-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-2xl border border-black/10 bg-[#f7f7f4] p-6">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-black/42">Constraints</p>
                    <ul className="mt-5 space-y-4">
                      {study.constraints.map(item => (
                        <li key={item} className="flex gap-3 text-sm leading-relaxed text-black/65"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: study.accent }} />{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-2xl border border-black/10 bg-[#f7f7f4] p-6">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-black/42">My contribution</p>
                    <ul className="mt-5 space-y-4">
                      {study.contribution.map(item => (
                        <li key={item} className="flex gap-3 text-sm leading-relaxed text-black/65"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" style={{ color: study.accent }} />{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <dl className="mt-6 grid gap-4 sm:grid-cols-3">
                  {study.metrics.map(metric => (
                    <div key={metric.label} className="rounded-2xl border border-black/10 p-5">
                      <dt className="text-2xl font-semibold tracking-tight" style={{ color: study.accent }}>{metric.value}</dt>
                      <dd className="mt-2 text-xs font-semibold uppercase tracking-[0.12em]">{metric.label}</dd>
                      <p className="mt-3 text-xs leading-relaxed text-black/52">{metric.detail}</p>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </section>

        {scan.proof.length === 0 || study.slug === "resume-analyzer" || study.slug === "gis-road-matcher" ? (
          <CapabilityDemo slug={study.slug} steps={scan.system} accent={study.accent} />
        ) : null}

        {scan.proof.length > 0 ? (
          <section className="border-y border-black/10 bg-white py-20 md:py-28">
            <div className="container">
              <div className="max-w-2xl">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-black/42">Verified product evidence</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] md:text-5xl">Observed surfaces, with provenance</h2>
              </div>
              <div className={`mt-9 grid gap-5 ${scan.proof.length > 1 ? "lg:grid-cols-2" : ""}`}>
                {scan.proof.map((image, index) => (
                  <figure key={image.src} className={`${index === 0 && scan.proof.length === 3 ? "lg:col-span-2" : ""} ${image.orientation === "portrait" ? "max-w-sm" : ""}`}>
                    <div className="overflow-hidden border border-black/10 bg-[#eeeee9] p-2">
                      <img src={image.src} alt={image.alt} loading="lazy" className={image.orientation === "portrait" ? "h-auto w-full object-contain" : "aspect-[16/10] w-full object-cover object-top"} />
                    </div>
                    <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
                      <span className="text-black/62">{image.caption}</span>
                      <span className="border-b border-black/12 pb-1 font-mono text-[10px] uppercase tracking-[0.12em] text-black/46">{image.provenance}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="container py-20 md:py-28">
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-black/42">Engineering judgment</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] md:text-5xl">Decisions that shaped the system</h2>
            </div>
            <div className="border-b border-black/12">
              {study.decisions.map((decision, index) => (
                <article key={decision.title} className="grid gap-4 border-t border-black/12 py-6 md:grid-cols-[2rem_0.8fr_1.2fr] md:items-start">
                  <p className="font-mono text-xs" style={{ color: study.accent }}>0{index + 1}</p>
                  <h3 className="text-lg font-semibold tracking-tight">{decision.title}</h3>
                  <p className="text-sm leading-relaxed text-black/57">{decision.detail}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-12 border-y border-black/12 py-6 md:flex md:items-start md:justify-between md:gap-8">
            <div className="max-w-xs">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/42">Trust boundaries</p>
              <p className="mt-2 text-sm font-medium">Where failure and authorization are handled.</p>
            </div>
            <div className="mt-5 grid flex-1 gap-4 md:mt-0 md:grid-cols-2 xl:grid-cols-4">
              {study.security.map((item, index) => <div key={item} className="border-l border-black/12 pl-4 text-xs leading-relaxed text-black/58"><span className="mb-2 block font-mono text-[9px] text-black/30">0{index + 1}</span>{item}</div>)}
            </div>
          </div>

          <div className="mt-10 grid gap-5 border-b border-black/12 pb-8 md:grid-cols-[12rem_1fr]">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/42">Evidence register</p>
              <p className="mt-2 text-xs leading-relaxed text-black/48">Artifacts behind the claims above.</p>
            </div>
            <ul className="grid gap-x-8 gap-y-3 md:grid-cols-2">
              {study.evidence.map((item, index) => (
                <li key={item} className="grid grid-cols-[1.5rem_1fr] gap-2 text-xs leading-relaxed text-black/58">
                  <span className="font-mono text-[9px] text-black/30">0{index + 1}</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-12 grid gap-5 rounded-2xl border border-black/10 bg-white p-6 md:grid-cols-[12rem_1fr] md:p-8">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/42">Reflection</p>
              <p className="mt-2 text-xs leading-relaxed text-black/48">What this project changed in my engineering judgment.</p>
            </div>
            <p className="max-w-3xl text-base leading-relaxed text-black/68">{study.reflection}</p>
          </div>
        </section>

        {nextStudy ? (
          <section className="border-t border-black/10 bg-[#e9eef8] py-16 text-foreground">
            <div className="container">
              <Link href={`/work/${nextStudy.slug}`} className="group flex items-end justify-between gap-8">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-black/42">Next system</p>
                  <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] md:text-5xl">{nextStudy.shortTitle}</h2>
                </div>
                <ArrowRight className="h-8 w-8 transition-transform group-hover:translate-x-2" />
              </Link>
            </div>
          </section>
        ) : null}
      </main>
      <ContactSection />
    </div>
  );
}
