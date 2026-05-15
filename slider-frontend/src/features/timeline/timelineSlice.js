import { createSlice } from "@reduxjs/toolkit";

/*
  LocalStorage'dan verileri güvenli şekilde oku
*/
const savedSnapshots = JSON.parse(localStorage.getItem("snapshots")) || [];

const savedCurrentIndex = Number(localStorage.getItem("currentIndex"));

/*
  Başlangıç state'i
*/
const initialState = {
  // Eğer localStorage'da snapshot varsa onları kullan
  // Yoksa boş bir başlangıç snapshot'ı oluştur
  snapshots:
    savedSnapshots.length > 0
      ? savedSnapshots
      : [
          {
            content: "",
            createdAt: new Date().toISOString(),
          },
        ],

  /*
    currentIndex:
    - localStorage'dan gelen değer geçerliyse onu kullan
    - geçersizse son snapshot'a git
    - hiç veri yoksa 0 kullan
  */
  currentIndex:
    !Number.isNaN(savedCurrentIndex) &&
    savedCurrentIndex >= 0 &&
    savedCurrentIndex < savedSnapshots.length
      ? savedCurrentIndex
      : savedSnapshots.length > 0
      ? savedSnapshots.length - 1
      : 0,

  // Son backend kaydı zamanı
  lastSavedAt: null,
};

const timelineSlice = createSlice({
  name: "timeline",
  initialState,

  reducers: {
    addSnapshot: (state, action) => {
      // Geçmişteysen ve yeni yazı yazarsan,
      // bulunduğun noktadan sonraki snapshot'ları sil
      state.snapshots = state.snapshots.slice(
        0,
        state.currentIndex + 1
      );

      // Yeni snapshot ekle
      state.snapshots.push({
        content: action.payload,
        createdAt: new Date().toISOString(),
      });

      // Her zaman son snapshot'a git
      state.currentIndex = state.snapshots.length - 1;
    },

    // Slider hareketi
    setCurrentIndex: (state, action) => {
      state.currentIndex = action.payload;
    },

    // Backend'e kaydedildi bilgisini tut
    markAsSaved: (state) => {
      state.lastSavedAt = new Date().toISOString();
    },
  },
});

export const {
  addSnapshot,
  setCurrentIndex,
  markAsSaved,
} = timelineSlice.actions;

export default timelineSlice.reducer;