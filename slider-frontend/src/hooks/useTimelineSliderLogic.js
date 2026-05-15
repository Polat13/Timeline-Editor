import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentIndex } from "../features/timeline/timelineSlice";
import { calculateVisibleStart } from "../utils/timelineMath";

export const useTimelineSliderLogic = () => {
  const dispatch = useDispatch();
  const stageRef = useRef(null);
  const blockShiftTimeoutRef = useRef(null);
  const blockShiftLockRef = useRef(false);
  const [isBlockShifting, setIsBlockShifting] = useState(false);

  const { snapshots, currentIndex } = useSelector((state) => state.timeline);

  useEffect(() => {
    return () => {
      blockShiftLockRef.current = false;
      window.clearTimeout(blockShiftTimeoutRef.current);
    };
  }, []);

  if (!snapshots || snapshots.length === 0) {
    return { snapshots: [] };
  }

  const safeCurrentIndex = Math.min(Math.max(currentIndex, 0), snapshots.length - 1);
  const maxIndex = snapshots.length - 1;
  const visibleStepLimit = 20;

  const visibleEnd = maxIndex - Math.floor((maxIndex - safeCurrentIndex) / visibleStepLimit) * visibleStepLimit;
  const visibleStart = Math.max(0, visibleEnd - visibleStepLimit + 1);
  const visibleSnapshots = snapshots.slice(visibleStart, visibleEnd + 1);
  
  const visibleMaxIndex = visibleSnapshots.length - 1;
  const visibleCurrentIndex = safeCurrentIndex - visibleStart;
  const progress = visibleMaxIndex === 0 ? 0 : visibleCurrentIndex / visibleMaxIndex;

  const markBlockShiftIfNeeded = (nextIndex) => {
    if (calculateVisibleStart(nextIndex, maxIndex, visibleStepLimit) === visibleStart) {
      return;
    }
    setIsBlockShifting(true);
    blockShiftLockRef.current = true;
    window.clearTimeout(blockShiftTimeoutRef.current);
    blockShiftTimeoutRef.current = window.setTimeout(() => {
      blockShiftLockRef.current = false;
      setIsBlockShifting(false);
    }, 2300);
  };

  const setRelativeStep = (difference) => {
    if (blockShiftLockRef.current) return;
    const nextIndex = Math.min(Math.max(safeCurrentIndex + difference, 0), maxIndex);
    if (nextIndex !== safeCurrentIndex) {
      markBlockShiftIfNeeded(nextIndex);
      dispatch(setCurrentIndex(nextIndex));
    }
  };

  const updateIndexFromClientX = (clientX) => {
    if (maxIndex === 0 || !stageRef.current) return;
    if (blockShiftLockRef.current) return;

    const rect = stageRef.current.getBoundingClientRect();
    if (clientX < rect.left) return setRelativeStep(-1);
    if (clientX > rect.right) return setRelativeStep(1);

    const rawProgress = (clientX - rect.left) / rect.width;
    const clampedProgress = Math.min(Math.max(rawProgress, 0), 1);
    const edgeThreshold = visibleMaxIndex <= 0 ? 0 : Math.min(0.08, 1 / visibleMaxIndex);

    if (clampedProgress <= edgeThreshold && safeCurrentIndex === visibleStart && safeCurrentIndex > 0) {
      return setRelativeStep(-1);
    }
    if (clampedProgress >= 1 - edgeThreshold && safeCurrentIndex === visibleEnd && safeCurrentIndex < maxIndex) {
      return setRelativeStep(1);
    }

    const nextVisibleIndex = Math.round(clampedProgress * visibleMaxIndex);
    const nextIndex = visibleStart + nextVisibleIndex;

    if (nextIndex !== safeCurrentIndex) {
      markBlockShiftIfNeeded(nextIndex);
      dispatch(setCurrentIndex(nextIndex));
    }
  };

  const handlers = {
    onPointerDown: (event) => {
      event.currentTarget.setPointerCapture(event.pointerId);
      updateIndexFromClientX(event.clientX);
    },
    onPointerMove: (event) => {
      if (event.buttons === 1) updateIndexFromClientX(event.clientX);
    },
    onWheel: (event) => {
      event.preventDefault();
      setRelativeStep(event.deltaY > 0 ? 1 : -1);
    },
    onKeyDown: (event) => {
      if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
        event.preventDefault();
        setRelativeStep(-1);
      }
      if (event.key === "ArrowRight" || event.key === "ArrowUp") {
        event.preventDefault();
        setRelativeStep(1);
      }
      if (event.key === "Home") {
        event.preventDefault();
        dispatch(setCurrentIndex(0));
      }
      if (event.key === "End") {
        event.preventDefault();
        dispatch(setCurrentIndex(maxIndex));
      }
    }
  };

  return {
    stageRef,
    snapshots,
    safeCurrentIndex,
    maxIndex,
    visibleStart,
    visibleEnd,
    visibleSnapshots,
    visibleCurrentIndex,
    progress,
    isBlockShifting,
    handlers,
    dispatch,
    markBlockShiftIfNeeded
  };
};