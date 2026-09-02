// Theme Store
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

import type { LanguageCode } from "../utils/translations";

interface ThemeState {
  isDarkMode: boolean;
  preferredLanguage: LanguageCode;
  offlineMode: boolean;
  showMoodSelector: boolean;
  currentMood: "happy" | "calm" | "stressed" | "tired" | "energetic";

  toggleTheme: () => void;
  setLanguage: (lang: LanguageCode) => Promise<void>;
  restoreLanguage: () => Promise<void>;
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
  setLanguage: async (lang) => {
    set({ preferredLanguage: lang });
    await AsyncStorage.setItem("appLanguage", lang);
  },
  restoreLanguage: async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem("appLanguage");
      if (savedLanguage === "en" || savedLanguage === "hi" || savedLanguage === "mr") {
        set({ preferredLanguage: savedLanguage });
      }
    } catch (error) {
      console.warn("Failed to restore language preference:", error);
    }
  },
  setOfflineMode: (offline) => set({ offlineMode: offline }),
  setMood: (mood) => set({ currentMood: mood }),
  toggleMoodSelector: () => set((state) => ({ showMoodSelector: !state.showMoodSelector })),
}));
