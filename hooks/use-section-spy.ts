"use client";

import { useEffect, useState } from "react";

export function useSectionSpy(sectionIds: string[], rootMargin = "-20% 0px -60% 0px") {
  const [activeSection, setActiveSection] = useState<string | undefined>(
    sectionIds[0],
  );

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin, threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, [sectionIds, rootMargin]);

  return activeSection;
}
