import { cn } from "@/lib/utils";

type SectionWrapperProps = {
  id?: string;
  className?: string;
  children: React.ReactNode;
  narrow?: boolean;
};

export function SectionWrapper({
  id,
  className,
  children,
  narrow = false,
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={cn("section-padding relative", className)}
    >
      <div
        className={cn(
          "mx-auto px-6",
          narrow ? "max-w-4xl" : "max-w-6xl",
        )}
      >
        {children}
      </div>
    </section>
  );
}
