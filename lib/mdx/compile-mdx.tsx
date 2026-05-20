import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";

export async function compileProjectMarkdown(source: string) {
  if (!source?.trim()) {
    return null;
  }

  const { content } = await compileMDX({
    source,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
    },
  });

  return content;
}
