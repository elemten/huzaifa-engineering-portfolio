import { cn } from "@/lib/utils";

type MarqueeBannerProps = {
  items: string[];
  className?: string;
};

export function MarqueeBanner({ items, className }: MarqueeBannerProps) {
  const repeated = [...items, ...items];

  return (
    <div
      className={cn(
        "marquee-banner relative overflow-hidden border-y border-border/70 bg-background",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />

      <div className="flex w-max animate-marquee items-center gap-8 py-6">
        {repeated.map((item, index) => (
          <div key={`${item}-${index}`} className="flex items-center gap-3">
            <span className="text-sm font-medium uppercase tracking-[0.18em] text-foreground">
              {item}
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-border" />
          </div>
        ))}
      </div>
    </div>
  );
}
