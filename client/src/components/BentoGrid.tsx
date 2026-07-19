import { cn } from "@/lib/utils";

type BentoGridProps = {
  className?: string;
  children: React.ReactNode;
};

type BentoCardProps = {
  className?: string;
  children: React.ReactNode;
  colSpan?: 1 | 2 | 3 | 4;
  rowSpan?: 1 | 2 | 3;
};

const colSpanClasses: Record<NonNullable<BentoCardProps["colSpan"]>, string> = {
  1: "md:col-span-1 lg:col-span-1",
  2: "md:col-span-2 lg:col-span-2",
  3: "md:col-span-2 lg:col-span-3",
  4: "md:col-span-2 lg:col-span-4",
};

const rowSpanClasses: Record<NonNullable<BentoCardProps["rowSpan"]>, string> = {
  1: "row-span-1",
  2: "row-span-2",
  3: "row-span-3",
};

export function BentoGrid({ className, children }: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4",
        className
      )}
    >
      {children}
    </div>
  );
}

export function BentoCard({
  className,
  children,
  colSpan = 1,
  rowSpan = 1,
}: BentoCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border/70 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md",
        colSpanClasses[colSpan],
        rowSpanClasses[rowSpan],
        className
      )}
    >
      {children}
    </div>
  );
}
