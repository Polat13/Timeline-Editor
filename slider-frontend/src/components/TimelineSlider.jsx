import { setCurrentIndex } from "../features/timeline/timelineSlice";
import { useTimelineSliderLogic } from "../hooks/useTimelineSliderLogic";
import { calculateOrbitPoint } from "../utils/timelineMath";
import styles from "./TimelineSlider.module.css";

const classNames = (...classes) => classes.filter(Boolean).join(" ");

export default function TimelineSlider() {
  const {
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
    markBlockShiftIfNeeded,
  } = useTimelineSliderLogic();

  if (!snapshots || snapshots.length === 0) return null;

  const activePoint = calculateOrbitPoint(
    visibleCurrentIndex,
    visibleSnapshots.length
  );

  return (
    <div
      className={classNames(
        styles["timeline-slider-shell"],
        isBlockShifting && styles["is-block-shifting"]
      )}
      style={{ "--timeline-progress": progress }}
    >
      <div
        ref={stageRef}
        className={styles["timeline-orbit-stage"]}
        role="slider"
        tabIndex={0}
        aria-label="Timeline step"
        aria-valuemin={1}
        aria-valuemax={snapshots.length}
        aria-valuenow={safeCurrentIndex + 1}
        {...handlers}
      >
        <svg
          className={styles["timeline-orbit-svg"]}
          viewBox="0 0 1000 132"
          preserveAspectRatio="none"
        >
          <path
            className={styles["timeline-orbit-shadow"]}
            d="M 44 75 C 260 8, 740 8, 956 75"
          />
          <path
            className={styles["timeline-orbit-track"]}
            d="M 44 75 C 260 8, 740 8, 956 75"
          />
          <path
            className={styles["timeline-orbit-progress"]}
            d="M 44 75 C 260 8, 740 8, 956 75"
            pathLength="1"
          />
        </svg>

        {visibleSnapshots.map((_, index) => {
          const point = calculateOrbitPoint(index, visibleSnapshots.length);
          const globalIndex = visibleStart + index;
          const isActive = globalIndex === safeCurrentIndex;
          const isPast = globalIndex < safeCurrentIndex;

          return (
            <span
              key={`visible-tick-${index}`}
              className={classNames(
                styles["timeline-orbit-tick"],
                isActive && styles["is-active"],
                isPast && styles["is-past"]
              )}
              style={{
                left: point.left,
                top: point.top,
                transform: `translate(-50%, -50%) rotate(${point.rotation}deg)`,
              }}
            >
              <span className={styles["timeline-orbit-tick-line"]} />
            </span>
          );
        })}

        <span
          className={styles["timeline-orbit-cursor"]}
          style={{
            left: activePoint.left,
            top: activePoint.top,
            transform: `translate(-50%, -50%) rotate(${activePoint.rotation}deg)`,
          }}
        >
          <span className={styles["timeline-orbit-cursor-core"]} />
        </span>
      </div>

      <input
        className={styles["timeline-range-input"]}
        type="range"
        min={0}
        max={maxIndex}
        value={safeCurrentIndex}
        aria-hidden="true"
        tabIndex={-1}
        onChange={(event) => {
          const nextIndex = Number(event.target.value);
          markBlockShiftIfNeeded(nextIndex);
          dispatch(setCurrentIndex(nextIndex));
        }}
      />

      <div className={styles["timeline-step-label"]}>
        <span >Step {safeCurrentIndex + 1}</span>
        <span>{snapshots.length}</span>
        {snapshots.length > 20 ? (
          <span>
            {visibleStart + 1}-{visibleEnd + 1}
          </span>
        ) : null}
      </div>
    </div>
  );
}
