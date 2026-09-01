// Theme Configuration
import { MD3LightTheme, MD3DarkTheme } from "react-native-paper";

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#1976D2",
    secondary: "#FF6B6B",
    tertiary: "#4CAF50",
    background: "#FFFFFF",
    surface: "#F5F5F5",
    error: "#F44336",
    success: "#4CAF50",
    warning: "#FFC107",
    info: "#2196F3",
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#1976D2",
    secondary: "#FF6B6B",
    tertiary: "#4CAF50",
    background: "#121212",
    surface: "#1E1E1E",
    error: "#F44336",
    success: "#4CAF50",
    warning: "#FFC107",
    info: "#2196F3",
  },
};
