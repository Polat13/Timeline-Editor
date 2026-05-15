import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { markAsSaved } from "../features/timeline/timelineSlice";
import { saveTimeline } from "../services/api";

export default function AutosaveWatcher() {
  const dispatch = useDispatch();

  const { snapshots, currentIndex } = useSelector((state) => state.timeline);

  const currentSnapshot = snapshots[currentIndex];

  const timerRef = useRef(null);

  // Son kaydedilen snapshot'ın createdAt bilgisi
  const lastSavedCreatedAtRef = useRef(localStorage.getItem("lastSavedCreatedAt"));

  useEffect(() => {
    if (!currentSnapshot) return;

    // İçerik boşsa kaydetme
    const content = currentSnapshot.content?.trim();

    if (!content) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    // Sadece en son snapshot için autosave çalışsın
    const isLatest =currentIndex === snapshots.length - 1;

    if (!isLatest) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    // Bu snapshot daha önce kaydedildiyse tekrar kaydetme
    if (lastSavedCreatedAtRef.current ===String(currentSnapshot.createdAt)) {
      return;
    }

    // Önceki timer'ı temizle
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Yeni timer başlat
    timerRef.current = setTimeout(async () => {
      try {
        const result = await saveTimeline(
          currentSnapshot
        );

        console.log(
          "Backend kaydı başarılı:",
          result
        );

        // Ref güncelle
        lastSavedCreatedAtRef.current =
          currentSnapshot.createdAt;

        // LocalStorage güncelle
        localStorage.setItem(
          "lastSavedCreatedAt",
          currentSnapshot.createdAt
        );

        // Redux state güncelle
        dispatch(markAsSaved());
      } catch (error) {
        console.error(
          "Backend kaydı başarısız:",
          error
        );
      } finally {
        timerRef.current = null;
      }
    }, 30000);

    // Cleanup
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [
    currentSnapshot?.createdAt,
    currentSnapshot?.content,
    currentIndex,
    snapshots.length,
    dispatch,
  ]);

  return null;
}