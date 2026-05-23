"use client";

import {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
  type RefObject,
} from "react";
import {
  createInitialSequenceState,
  isVideoItem,
  sequenceReducer,
  shouldScheduleImageTimer,
  type SequenceState,
} from "@/lib/media/sequence-controller";
import type { ProjectMediaItem, ProjectMediaSettings } from "@/types/media";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const VIDEO_ERROR_FALLBACK_MS = 3000;

export type UseMediaSequenceOptions = {
  media: ProjectMediaItem[];
  settings: ProjectMediaSettings;
  /** Card preview vs detail gallery */
  variant?: "preview" | "detail";
  /** Ref for intersection-based pause */
  containerRef?: RefObject<HTMLElement | null>;
  /** Initial index (e.g. when opening fullscreen) */
  initialIndex?: number;
};

export type UseMediaSequenceReturn = {
  activeIndex: number;
  activeItem: ProjectMediaItem | undefined;
  state: SequenceState;
  goTo: (index: number) => void;
  goNext: () => void;
  goPrev: () => void;
  pause: () => void;
  resume: () => void;
  isPaused: boolean;
  isHovered: boolean;
  setHovered: (hovered: boolean) => void;
  videoRef: RefObject<HTMLVideoElement | null>;
  onVideoEnded: () => void;
  onVideoError: () => void;
  onVideoCanPlay: () => void;
  registerVisibility: (visible: boolean) => void;
};

export function useMediaSequence({
  media,
  settings,
  variant = "preview",
  containerRef,
  initialIndex = 0,
}: UseMediaSequenceOptions): UseMediaSequenceReturn {
  const reducedMotion = useReducedMotion();
  const count = media.length;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const imageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const manualHoldTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const videoErrorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isVisibleRef = useRef(true);
  const isHoveredRef = useRef(false);

  const [state, dispatch] = useReducer(
    (s: SequenceState, action: Parameters<typeof sequenceReducer>[1]) =>
      sequenceReducer(s, action, count),
    count,
    (c) => createInitialSequenceState(c, initialIndex),
  );

  const [hovered, setHovered] = useState(false);

  const activeItem = media[state.activeIndex];
  const autoplay =
    settings.autoplay && !reducedMotion && count > 1;

  const clearImageTimer = useCallback(() => {
    if (imageTimerRef.current) {
      clearTimeout(imageTimerRef.current);
      imageTimerRef.current = null;
    }
  }, []);

  const clearManualHoldTimer = useCallback(() => {
    if (manualHoldTimerRef.current) {
      clearTimeout(manualHoldTimerRef.current);
      manualHoldTimerRef.current = null;
    }
  }, []);

  const scheduleImageTimer = useCallback(() => {
    clearImageTimer();
    if (
      !shouldScheduleImageTimer(activeItem, state, autoplay, reducedMotion)
    ) {
      return;
    }
    if (!isVisibleRef.current) return;
    if (variant === "preview" && settings.pauseOnHover && isHoveredRef.current) {
      return;
    }

    imageTimerRef.current = setTimeout(() => {
      dispatch({ type: "TICK_IMAGE" });
    }, settings.imageDurationMs);
  }, [
    activeItem,
    state.mode,
    state.videoLocked,
    autoplay,
    reducedMotion,
    settings.imageDurationMs,
    settings.pauseOnHover,
    variant,
    clearImageTimer,
  ]);

  const playActiveVideo = useCallback(() => {
    const el = videoRef.current;
    if (!el || !isVideoItem(activeItem)) return;
    el.currentTime = 0;
    dispatch({ type: "SET_VIDEO_LOCKED", locked: true });
    void el.play().catch(() => {
      dispatch({ type: "SET_VIDEO_LOCKED", locked: false });
      videoErrorTimerRef.current = setTimeout(() => {
        dispatch({ type: "VIDEO_ERROR" });
      }, VIDEO_ERROR_FALLBACK_MS);
    });
  }, [activeItem]);

  useEffect(() => {
    dispatch({ type: "INIT", count, startIndex: initialIndex });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset only when item count changes
  }, [count]);

  useEffect(() => {
    clearImageTimer();
    if (isVideoItem(activeItem)) {
      if (autoplay && state.mode !== "paused" && isVisibleRef.current) {
        playActiveVideo();
      }
    } else {
      scheduleImageTimer();
    }

    return () => {
      clearImageTimer();
      const el = videoRef.current;
      if (el && !el.paused) el.pause();
    };
  }, [
    state.activeIndex,
    activeItem?.id,
    autoplay,
    state.mode,
    scheduleImageTimer,
    playActiveVideo,
    clearImageTimer,
  ]);

  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) {
        clearImageTimer();
        videoRef.current?.pause();
        dispatch({ type: "PAUSE" });
      } else {
        dispatch({ type: "RESUME" });
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [clearImageTimer]);

  useEffect(() => {
    const el = containerRef?.current;
    if (!el || !settings.pauseWhenOffscreen) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        isVisibleRef.current = visible;
        if (!visible) {
          clearImageTimer();
          videoRef.current?.pause();
          dispatch({ type: "PAUSE" });
        } else {
          dispatch({ type: "RESUME" });
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [containerRef, settings.pauseWhenOffscreen, clearImageTimer]);

  const setHoveredHandler = useCallback(
    (value: boolean) => {
      isHoveredRef.current = value;
      setHovered(value);
      if (variant !== "preview" || !settings.pauseOnHover) return;
      if (value) {
        clearImageTimer();
        videoRef.current?.pause();
      } else if (isVideoItem(activeItem)) {
        playActiveVideo();
      } else {
        scheduleImageTimer();
      }
    },
    [
      variant,
      settings.pauseOnHover,
      clearImageTimer,
      activeItem,
      playActiveVideo,
      scheduleImageTimer,
    ],
  );

  const goTo = useCallback(
    (index: number) => {
      clearImageTimer();
      clearManualHoldTimer();
      videoRef.current?.pause();
      dispatch({ type: "USER_SELECT", index });
      manualHoldTimerRef.current = setTimeout(() => {
        dispatch({ type: "MANUAL_HOLD_EXPIRED" });
      }, settings.manualHoldMs);
    },
    [clearImageTimer, clearManualHoldTimer, settings.manualHoldMs],
  );

  const goNext = useCallback(() => {
    goTo((state.activeIndex + 1) % count);
  }, [goTo, state.activeIndex, count]);

  const goPrev = useCallback(() => {
    goTo((state.activeIndex - 1 + count) % count);
  }, [goTo, state.activeIndex, count]);

  const pause = useCallback(() => {
    clearImageTimer();
    videoRef.current?.pause();
    dispatch({ type: "PAUSE" });
  }, [clearImageTimer]);

  const resume = useCallback(() => {
    dispatch({ type: "RESUME" });
  }, []);

  const onVideoEnded = useCallback(() => {
    if (videoErrorTimerRef.current) {
      clearTimeout(videoErrorTimerRef.current);
      videoErrorTimerRef.current = null;
    }
    dispatch({ type: "VIDEO_ENDED" });
  }, []);

  const onVideoError = useCallback(() => {
    videoErrorTimerRef.current = setTimeout(() => {
      dispatch({ type: "VIDEO_ERROR" });
    }, VIDEO_ERROR_FALLBACK_MS);
  }, []);

  const onVideoCanPlay = useCallback(() => {
    if (videoErrorTimerRef.current) {
      clearTimeout(videoErrorTimerRef.current);
      videoErrorTimerRef.current = null;
    }
  }, []);

  const registerVisibility = useCallback((visible: boolean) => {
    isVisibleRef.current = visible;
  }, []);

  useEffect(
    () => () => {
      clearImageTimer();
      clearManualHoldTimer();
      if (videoErrorTimerRef.current) clearTimeout(videoErrorTimerRef.current);
    },
    [clearImageTimer, clearManualHoldTimer],
  );

  return {
    activeIndex: state.activeIndex,
    activeItem,
    state,
    goTo,
    goNext,
    goPrev,
    pause,
    resume,
    isPaused: state.mode === "paused",
    isHovered: hovered,
    setHovered: setHoveredHandler,
    videoRef,
    onVideoEnded,
    onVideoError,
    onVideoCanPlay,
    registerVisibility,
  };
}
