import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProjectNotFound() {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-6 text-center">
      <h1 className="text-2xl font-semibold">Project not found</h1>
      <p className="mt-2 text-muted-foreground">
        This project may have been moved or removed.
      </p>
      <Button asChild className="mt-6">
        <Link href="/projects">Back to projects</Link>
      </Button>
    </div>
  );
}
