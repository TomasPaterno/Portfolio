import { getTranslations } from "next-intl/server";
import { Link } from "@/navigation";
import { Button } from "@/components/ui/button";

export default async function ProjectNotFound() {
  const t = await getTranslations("projects");

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-6 text-center">
      <h1 className="text-2xl font-semibold">{t("notFoundTitle")}</h1>
      <p className="mt-2 text-muted-foreground">{t("notFoundDescription")}</p>
      <Button asChild className="mt-6">
        <Link href="/projects">{t("backToProjects")}</Link>
      </Button>
    </div>
  );
}
