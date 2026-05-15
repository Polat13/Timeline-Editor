import { useLayoutEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addSnapshot } from "../features/timeline/timelineSlice";
import Button from "./Button";
import { useMemo } from "react";

export default function Editor() {
  const dispatch = useDispatch();
  const { snapshots, currentIndex } = useSelector(
    (state) => state.timeline
  );

  const currentSnapshot = snapshots[currentIndex];
  const isReadyOnly = currentIndex !== snapshots.length - 1;
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);

  // UI states
  const [isClosed, setIsClosed] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const handlechange = (e) => {
    dispatch(addSnapshot(e.target.value));
  };

  useLayoutEffect(() => {
    const updateContentHeight = () => {
      setContentHeight(contentRef.current?.scrollHeight ?? 0);
    };

    updateContentHeight();
    window.addEventListener("resize", updateContentHeight);

    return () => window.removeEventListener("resize", updateContentHeight);
  }, [currentSnapshot?.content]);

  const editorControls = useMemo(() => [
    {
      color: "red",
      label: "Editörü kapat",
      onClick: () => {
        setIsClosed(true);
        setIsMinimized(false);
      },
    },
    {
      color: "yellow",
      label: "Editörü küçült veya büyüt",
      onClick: () => {
        if (!isClosed) {
          setIsMinimized(!isMinimized);
        }
      },
    },
    {
      color: "green",
      label: "Editörü aç",
      onClick: () => {
        setIsClosed(false);
        setIsMinimized(false);
      },
    },
  ], [isClosed, isMinimized]);

  return (
    <div className="flex w-full max-w-5xl flex-col gap-5 mx-auto">
      {isReadyOnly ? (
  <div className="flex w-full items-center gap-3 rounded-xl border border-amber-500/30 bg-cyan-500/20 px-5 py-3.5 shadow-[0_0_15px_rgba(245,158,11,0.05)] backdrop-blur-sm">
    
    {/* Zarif Zaman/Geçmiş İkonu */}
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className="h-5 w-5 shrink-0 text-amber-400" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor" 
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>

    {/* Vurgulu ve Hiyerarşik Metin */}
    <p className="text-sm tracking-wide text-amber-200/90">
      <span className="mr-1.5 font-semibold text-amber-400">
        Geçmiş Modu:
      </span>
      Bu içerik şu an kilitli ve düzenlenemez.
    </p>
    
  </div>
) : null}
      <div className="overflow-hidden rounded-3xl border border-zinc-700 bg-zinc-800 shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-700 bg-zinc-900/60 px-4 py-3">
          <div className="flex items-center gap-2">
            {editorControls.map((control) => (
              <Button
                key={control.color}
                color={control.color}
                aria-label={control.label}
                onClick={control.onClick}
              />
            ))}
          </div>

          <span className="text-xs uppercase tracking-widest text-zinc-400">
            {isReadyOnly ? "Geçmiş" : "Düzenleme"}
          </span>
        </div>

        <div
          className="
            overflow-hidden
            transition-[max-height,opacity]
            duration-700
            ease-in-out
          "
          style={{
            maxHeight: isClosed
              ? "0px"
              : isMinimized
              ? "6rem"
              : `${contentHeight}px`,
            opacity: isClosed ? 0 : 1,
          }}
        >
          <div ref={contentRef}>
            <textarea
              rows={10}
              value={currentSnapshot?.content || ""}
              onChange={handlechange}
              readOnly={isReadyOnly || isClosed}
              placeholder="Yazmaya başlayın..."
              className={`
                w-full
                resize-none
                bg-transparent
                px-6 py-5
                text-base sm:text-lg
                leading-8
                text-white
                placeholder:text-zinc-500
                outline-none
                border-none
                transition-opacity
                duration-500
                ${
                  isReadyOnly || isClosed
                    ? "opacity-80 cursor-not-allowed"
                    : "cursor-text"
                }
              `}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
