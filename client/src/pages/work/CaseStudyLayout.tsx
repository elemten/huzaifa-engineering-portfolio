import ContactSection from "@/components/ContactSection";
import SiteNav from "@/components/SiteNav";

type CaseStudyLayoutProps = {
  title: string;
};

export default function CaseStudyLayout({ title }: CaseStudyLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav mode="link" />
      <main className="container py-16 md:py-24">
        <section
          aria-label={`${title} case study content placeholder`}
          className="min-h-[50vh] rounded-2xl border border-dashed border-border/60 bg-muted/20"
        />
      </main>
      <ContactSection />
    </div>
  );
}
