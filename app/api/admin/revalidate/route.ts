import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { clearContentCache } from "@/lib/content/content-cache";

function isAuthorized(request: Request): boolean {
  const secret = process.env.ADMIN_REVALIDATE_SECRET;
  if (!secret) {
    return process.env.NODE_ENV === "development";
  }
  const header = request.headers.get("x-admin-revalidate-secret");
  return header === secret;
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  clearContentCache();
  revalidateTag("projects", { expire: 0 });

  const body = (await request.json().catch(() => ({}))) as {
    paths?: string[];
  };
  const paths = body.paths ?? ["/es", "/en", "/es/projects", "/en/projects"];

  for (const p of paths) {
    revalidatePath(p, "layout");
  }

  return NextResponse.json({ revalidated: true, paths });
}
