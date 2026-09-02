// Authentication Store
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as apiService from "../services/api";
import { translations } from "../utils/translations";
import { useThemeStore } from "./themeStore";

const getAuthErrorMessage = (type: "login" | "register") => {
  const language = useThemeStore.getState().preferredLanguage;
  const t = translations[language];

  return type === "login" ? t.auth.loginFailed : t.auth.registrationFailed;
};

interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
  is_verified: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;

  register: (email: string, password: string, fullName: string, phone: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  restoreUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,

  register: async (email, password, fullName, phone) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.register({
        email,
        password,
        full_name: fullName,
        phone,
        role: "patient",
      });

      set({ isLoading: false });
      // Auto-login after registration
      await apiService.login({ email, password });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.detail || getAuthErrorMessage("register"),
      });
      throw error;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.login({ email, password });

      await AsyncStorage.setItem("authToken", response.access_token);
      apiService.setAuthToken(response.access_token);

      // Fetch user profile
      const profileResponse = await apiService.getPatientProfile();
      const user: User = {
        id: 1, // In production, get from actual response
        email,
        full_name: "",
        role: "patient",
        is_verified: true,
      };

      set({
        user,
        token: response.access_token,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.detail || getAuthErrorMessage("login"),
      });
      throw error;
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem("authToken");
    apiService.setAuthToken(null);
    set({ user: null, token: null, error: null });
  },

  restoreUser: async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        apiService.setAuthToken(token);
        // Verify token is still valid
        set({
          token,
          user: {
            id: 1,
            email: "user@example.com",
            full_name: "User",
            role: "patient",
            is_verified: true,
          },
        });
      }
    } catch (error) {
      console.error("Failed to restore user:", error);
    }
  },

  clearError: () => set({ error: null }),
}));
