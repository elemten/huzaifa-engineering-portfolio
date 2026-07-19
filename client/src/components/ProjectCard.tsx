type Project = {
  title: string;
  subtitle: string;
  image?: string;
  problem: string;
  solution: string;
  stacks: string[];
};

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <div className="border-b border-border/70 px-6 py-5">
        <h3 className="text-xl font-semibold text-foreground">
          {project.title}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">{project.subtitle}</p>
      </div>

      {project.image ? (
        <div className="border-b border-border/70 bg-secondary/20">
          <img
            src={project.image}
            alt={project.title}
            className="h-56 w-full object-cover"
            loading="lazy"
          />
        </div>
      ) : null}

      <div className="px-6 py-5">
        <div className="space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground">
              The problem
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {project.problem}
            </p>
          </div>

          <div className="border-t border-border/70" />

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground">
              The solution
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {project.solution}
            </p>
          </div>
        </div>

        <div className="mt-6 border-t border-border/70 pt-5">
          <p className="text-sm text-muted-foreground">
            {project.stacks.join(" \u2022 ")}
          </p>
        </div>
      </div>
    </div>
  );
}
