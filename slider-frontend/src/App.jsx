import { useEffect } from "react";
import { useSelector } from "react-redux";
import AutosaveWatcher from "./components/AutosaveWatcher";
import Editor from "./components/Editor";
import TimelineSlider from "./components/TimelineSlider";

export default function App() {
  const { snapshots, currentIndex } = useSelector(
    (state) => state.timeline
  );

  useEffect(() => {
    localStorage.setItem(
      "snapshots",
      JSON.stringify(snapshots)
    );
    localStorage.setItem(
      "currentIndex",
      currentIndex.toString()
    );
  }, [snapshots, currentIndex]);

  return (
    <div className="flex flex-col min-h-dvh w-full overflow-hidden bg-[#09090b] bg-[radial-gradient(#27272a_1px,transparent_1px)] bg-[length:24px_24px] text-zinc-100">
      <header className="flex flex-col w-full shrink-0 pt-4 md:pt-6 lg:pt-8">
        <h1 className="px-4 md:px-8 lg:px-12 pb-4 md:pb-6 text-center text-2xl md:text-3xl lg:text-4xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-zinc-100 to-zinc-500">
          TIMELINE EDITOR
        </h1>

        <div className="w-full px-2 md:px-6 lg:px-10">
          <TimelineSlider />
        </div>
      </header>

      <main className="flex flex-col flex-1 min-h-0 w-full overflow-auto px-4 md:px-10 lg:px-16 py-4 md:py-6 lg:py-8 items-center">
        <div className="flex flex-col w-full max-w-6xl justify-center">
          <Editor />
        </div>
      </main>

      <AutosaveWatcher />
    </div>
  );
}
