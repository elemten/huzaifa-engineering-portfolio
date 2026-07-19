import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type CoolStuffCardProps = {
  label: string;
  icon: React.ReactNode;
  iconContainerClassName?: string;
  headerClassName?: string;
  headerOverlay?: React.ReactNode;
  headerRight?: React.ReactNode;
  labelClassName?: string;
  className?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function CoolStuffCard({
  label,
  icon,
  iconContainerClassName,
  headerClassName,
  headerOverlay,
  headerRight,
  labelClassName,
  className,
  children,
  footer,
}: CoolStuffCardProps) {
  return (
    <Card
      className={cn(
        "relative h-full w-full max-w-full overflow-hidden border-border/70 bg-card shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md",
        className
      )}
    >
      <CardHeader
        className={cn(
          "relative overflow-hidden border-b border-border/70 pb-4",
          headerClassName
        )}
      >
        {headerOverlay ? (
          <div className="pointer-events-none absolute inset-0">
            {headerOverlay}
          </div>
        ) : null}
        <div className="relative z-10 flex min-w-0 items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          <span
            className={cn(
              "inline-flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-muted-foreground",
              iconContainerClassName
            )}
          >
            {icon}
          </span>
          <span className={cn("truncate", labelClassName)}>{label}</span>
          {headerRight ? <span className="ml-auto shrink-0">{headerRight}</span> : null}
        </div>
      </CardHeader>
      <CardContent className="flex-1 min-w-0 space-y-4 pt-0">
        {children}
      </CardContent>
      {footer ? (
        <CardFooter className="mt-auto min-w-0 pt-0">{footer}</CardFooter>
      ) : null}
    </Card>
  );
}
