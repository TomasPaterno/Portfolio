"use client";

import { useMemo } from "react";
import { resolveMediaPresentation } from "@/lib/media/presentation/resolve-presentation";
import type { MediaRenderContext } from "@/lib/media/presentation/types";
import type { MediaIntrinsicSize } from "@/lib/media/presentation/types";
import type { ProjectMediaItem } from "@/types/media";

export function useMediaPresentation(
  item: ProjectMediaItem,
  context: MediaRenderContext,
  intrinsic: MediaIntrinsicSize | null,
) {
  return useMemo(
    () =>
      resolveMediaPresentation({
        item,
        context,
        intrinsic,
        presentation: item.presentation,
      }),
    [item, context, intrinsic, item.presentation],
  );
}
