// Theme Store
import { create } from "zustand";

interface ThemeState {
  isDarkMode: boolean;
  preferredLanguage: string;
  offlineMode: boolean;
  showMoodSelector: boolean;
  currentMood: "happy" | "calm" | "stressed" | "tired" | "energetic";

  toggleTheme: () => void;
  setLanguage: (lang: string) => void;
  setOfflineMode: (offline: boolean) => void;
  setMood: (mood: "happy" | "calm" | "stressed" | "tired" | "energetic") => void;
  toggleMoodSelector: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  isDarkMode: false,
  preferredLanguage: "en",
  offlineMode: false,
  showMoodSelector: false,
  currentMood: "calm",

  toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  setLanguage: (lang) => set({ preferredLanguage: lang }),
  setOfflineMode: (offline) => set({ offlineMode: offline }),
  setMood: (mood) => set({ currentMood: mood }),
  toggleMoodSelector: () => set((state) => ({ showMoodSelector: !state.showMoodSelector })),
}));
