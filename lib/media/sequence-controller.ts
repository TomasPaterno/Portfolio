import type { ProjectMediaItem } from "@/types/media";

export type SequenceMode = "autoplay" | "manual-hold" | "paused";

export type SequenceState = {
  activeIndex: number;
  mode: SequenceMode;
  /** True while a video is playing and must not be interrupted. */
  videoLocked: boolean;
};

export type SequenceAction =
  | { type: "INIT"; count: number; startIndex?: number }
  | { type: "TICK_IMAGE" }
  | { type: "VIDEO_ENDED" }
  | { type: "VIDEO_ERROR" }
  | { type: "USER_SELECT"; index: number }
  | { type: "PAUSE" }
  | { type: "RESUME" }
  | { type: "MANUAL_HOLD_EXPIRED" }
  | { type: "SET_VIDEO_LOCKED"; locked: boolean };

export function createInitialSequenceState(
  count: number,
  startIndex = 0,
): SequenceState {
  return {
    activeIndex: count > 0 ? Math.min(startIndex, count - 1) : 0,
    mode: "autoplay",
    videoLocked: false,
  };
}

export function nextIndex(current: number, count: number): number {
  if (count <= 0) return 0;
  return (current + 1) % count;
}

export function prevIndex(current: number, count: number): number {
  if (count <= 0) return 0;
  return (current - 1 + count) % count;
}

export function sequenceReducer(
  state: SequenceState,
  action: SequenceAction,
  count: number,
): SequenceState {
  switch (action.type) {
    case "INIT":
      return createInitialSequenceState(action.count, action.startIndex);
    case "USER_SELECT": {
      const index = Math.max(0, Math.min(action.index, count - 1));
      return {
        activeIndex: index,
        mode: "manual-hold",
        videoLocked: false,
      };
    }
    case "PAUSE":
      if (state.mode === "paused") return state;
      return { ...state, mode: "paused", videoLocked: false };
    case "RESUME":
      if (state.mode !== "paused") return state;
      return { ...state, mode: "autoplay" };
    case "MANUAL_HOLD_EXPIRED":
      if (state.mode !== "manual-hold") return state;
      return { ...state, mode: "autoplay" };
    case "SET_VIDEO_LOCKED":
      if (state.videoLocked === action.locked) return state;
      return { ...state, videoLocked: action.locked };
    case "TICK_IMAGE": {
      if (state.mode === "paused" || state.videoLocked) return state;
      if (state.mode === "manual-hold") return state;
      return {
        ...state,
        activeIndex: nextIndex(state.activeIndex, count),
        videoLocked: false,
      };
    }
    case "VIDEO_ENDED": {
      if (state.mode === "paused") return { ...state, videoLocked: false };
      return {
        activeIndex: nextIndex(state.activeIndex, count),
        mode: state.mode === "manual-hold" ? "manual-hold" : "autoplay",
        videoLocked: false,
      };
    }
    case "VIDEO_ERROR": {
      return {
        ...state,
        activeIndex: nextIndex(state.activeIndex, count),
        videoLocked: false,
        mode: state.mode === "manual-hold" ? "manual-hold" : "autoplay",
      };
    }
    default:
      return state;
  }
}

export function shouldScheduleImageTimer(
  item: ProjectMediaItem | undefined,
  state: SequenceState,
  autoplay: boolean,
  reducedMotion: boolean,
): boolean {
  if (!autoplay || reducedMotion) return false;
  if (!item || item.type !== "image") return false;
  if (state.mode === "paused" || state.mode === "manual-hold") return false;
  if (state.videoLocked) return false;
  return true;
}

export function isVideoItem(
  item: ProjectMediaItem | undefined,
): item is Extract<ProjectMediaItem, { type: "video" }> {
  return item?.type === "video";
}
