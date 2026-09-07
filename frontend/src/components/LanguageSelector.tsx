import React from "react";
import { View, StyleSheet } from "react-native";
import { SegmentedButtons } from "react-native-paper";

import { languageOptions, type LanguageCode } from "../utils/translations";
import { useThemeStore } from "../stores/themeStore";

export default function LanguageSelector() {
  const { preferredLanguage, setLanguage } = useThemeStore();

  return (
    <View style={styles.container}>
      <SegmentedButtons
        value={preferredLanguage}
        onValueChange={(value) => setLanguage(value as LanguageCode)}
        buttons={languageOptions.map((option) => ({
          value: option.value,
          label: option.label,
        }))}
        density="small"
        style={styles.segmentedButtons}
        theme={{
          roundness: 999,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-start",
    maxWidth: "100%",
  },
  segmentedButtons: {
    width: "100%",
    minWidth: 180,
  },
});
