import type { ProjectMetric } from "@/types/project";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

type MetricsBlockProps = {
  metrics: ProjectMetric[];
};

export function MetricsBlock({ metrics }: MetricsBlockProps) {
  if (!metrics.length) return null;

  return (
    <ScrollReveal>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="glass-panel glow-hover rounded-xl p-6"
          >
            <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              {metric.label}
            </p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
              {metric.value}
              {metric.unit && (
                <span className="ml-1 text-lg font-normal text-muted-foreground">
                  {metric.unit}
                </span>
              )}
            </p>
          </div>
        ))}
      </div>
    </ScrollReveal>
  );
}
