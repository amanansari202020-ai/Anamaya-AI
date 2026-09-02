// Stub implementations for remaining screens

import React from "react";
import { View, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { Text, Card, Button, useTheme } from "react-native-paper";

import LanguageSelector from "../components/LanguageSelector";
import { useThemeStore } from "../stores/themeStore";
import { translations } from "../utils/translations";

const createStubScreen = (titleKey: keyof (typeof translations)["en"]["stub"], descriptionKey: keyof (typeof translations)["en"]["stub"]) => {
  return ({ navigation }: any) => {
    const theme = useTheme();
    const { preferredLanguage } = useThemeStore();
    const t = translations[preferredLanguage];
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: theme.colors.background,
      },
      content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      },
      selectorWrap: {
        marginBottom: 20,
        alignItems: "center",
      },
      card: {
        width: "100%",
      },
      title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 15,
      },
      description: {
        fontSize: 16,
        textAlign: "center",
        color: theme.colors.onSurfaceVariant,
        marginBottom: 20,
      },
      button: {
        marginTop: 10,
      },
    });

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.selectorWrap}>
            <LanguageSelector />
          </View>
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.title}>{t.stub[titleKey]}</Text>
              <Text style={styles.description}>{t.stub[descriptionKey]}</Text>
              <Button mode="contained" style={styles.button} onPress={() => navigation.goBack()}>
                {t.common.goBack}
              </Button>
            </Card.Content>
          </Card>
        </View>
      </SafeAreaView>
    );
  };
};

export const AssessmentResultScreen = createStubScreen(
  "assessmentResultTitle",
  "assessmentResultDescription"
);

export const HealthPassportScreen = createStubScreen(
  "passportTitle",
  "passportDescription"
);

export const FacilitySearchScreen = createStubScreen(
  "findHealthcareTitle",
  "findHealthcareDescription"
);

export const NearbyFacilitiesScreen = createStubScreen(
  "nearbyFacilitiesTitle",
  "nearbyFacilitiesDescription"
);

export const FacilityDetailsScreen = createStubScreen(
  "facilityDetailsTitle",
  "facilityDetailsDescription"
);

export const ReferralScreen = createStubScreen(
  "referralTitle",
  "referralDescription"
);

export const GovernmentSchemesScreen = createStubScreen(
  "schemesTitle",
  "schemesDescription"
);

export const BudgetEstimatorScreen = createStubScreen(
  "budgetTitle",
  "budgetDescription"
);

export const HealthJourneyScreen = createStubScreen(
  "journeyTitle",
  "journeyDescription"
);

export const ProfileScreen = createStubScreen(
  "profileTitle",
  "profileDescription"
);

export const OfflineScreen = createStubScreen(
  "offlineTitle",
  "offlineDescription"
);
