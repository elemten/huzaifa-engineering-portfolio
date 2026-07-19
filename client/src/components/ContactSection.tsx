import { Download, Github, Linkedin, ExternalLink, Mail } from "lucide-react";
import { useState } from "react";
import { CopyToClipboard } from "@/components/CopyToClipboard";

type ContactSectionProps = {
  id?: string;
};

export default function ContactSection({
  id = "contact",
}: ContactSectionProps) {
  const email = "huzaifa.ishaq.395@gmail.com";
  const [emailCopied, setEmailCopied] = useState(false);

  return (
    <section id={id} className="border-t border-border py-20 scroll-mt-24 md:py-24">
      <div className="container">
        <div className="grid gap-10 lg:grid-cols-12">
          <p className="section-label lg:col-span-3">Contact</p>
          <div className="lg:col-span-9">
            <h2 className="max-w-3xl text-3xl font-semibold tracking-[-0.04em] md:text-5xl">Need an engineer who can own the system, not only the interface?</h2>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">Open to full-stack, cloud, and AI automation roles in Canada or remote.</p>

            <div className="mb-10 mt-9 flex flex-wrap gap-3">
              <a
                href="/Huzaifa-Ishaq-Resume.pdf"
                download
                className="inline-flex items-center gap-2 rounded-md bg-foreground px-5 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-85"
              >
                <Download className="h-4 w-4" />
                Download résumé
              </a>
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-3 text-sm font-semibold transition-colors hover:bg-secondary"
              >
                <Mail className="h-4 w-4" />
                Email me
              </a>
            </div>

            <p className="mb-8 text-sm text-muted-foreground">Saskatoon, Saskatchewan</p>

            <div className="group space-y-3">
              <CopyToClipboard
                text={email}
                onCopiedChange={setEmailCopied}
                className="font-mono text-lg tracking-[0.02em] text-foreground"
              >
                {email}
              </CopyToClipboard>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground/70 transition-colors group-hover:text-muted-foreground">
                {emailCopied ? "Copied!" : "Tap to copy email"}
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-6 border-t border-border/70 pt-6">
              <a
                href="https://www.linkedin.com/in/huzaifa-ishaq-5547931bb/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-foreground transition-opacity hover:opacity-70 hover:underline"
              >
                <Linkedin className="h-4 w-4 text-muted-foreground" />
                LinkedIn
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </a>
              <a
                href="https://github.com/elemten"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-foreground transition-opacity hover:opacity-70 hover:underline"
              >
                <Github className="h-4 w-4 text-muted-foreground" />
                GitHub
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
