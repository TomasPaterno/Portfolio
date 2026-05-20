import { Badge } from "@/components/ui/badge";

type TechBadgesProps = {
  technologies: string[];
  tags?: string[];
};

export function TechBadges({ technologies, tags = [] }: TechBadgesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {technologies.map((tech) => (
        <Badge key={tech} variant="default">
          {tech}
        </Badge>
      ))}
      {tags.map((tag) => (
        <Badge key={tag} variant="muted">
          {tag}
        </Badge>
      ))}
    </div>
  );
}
