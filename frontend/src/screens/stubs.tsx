// Stub implementations for remaining screens

import React from "react";
import { View, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { Text, Card, Button, useTheme } from "react-native-paper";

const createStubScreen = (title: string, description: string) => {
  return ({ navigation }: any) => {
    const theme = useTheme();
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
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.description}>{description}</Text>
              <Button mode="contained" style={styles.button} onPress={() => navigation.goBack()}>
                Go Back
              </Button>
            </Card.Content>
          </Card>
        </View>
      </SafeAreaView>
    );
  };
};

export const AssessmentResultScreen = createStubScreen(
  "Assessment Result",
  "Your symptom assessment and recommendations will appear here"
);

export const HealthPassportScreen = createStubScreen(
  "Digital Health Passport",
  "Your complete health records in one secure place"
);

export const FacilitySearchScreen = createStubScreen(
  "Find Healthcare",
  "Search for nearby healthcare facilities"
);

export const NearbyFacilitiesScreen = createStubScreen(
  "Nearby Facilities",
  "Healthcare facilities near you"
);

export const FacilityDetailsScreen = createStubScreen(
  "Facility Details",
  "Complete information about the healthcare facility"
);

export const ReferralScreen = createStubScreen(
  "Smart Referral",
  "Manage your healthcare referrals"
);

export const GovernmentSchemesScreen = createStubScreen(
  "Government Schemes",
  "Find healthcare schemes you may be eligible for"
);

export const BudgetEstimatorScreen = createStubScreen(
  "Budget Estimator",
  "Estimate healthcare costs for your journey"
);

export const HealthJourneyScreen = createStubScreen(
  "Healthcare Journey",
  "Your recommended healthcare pathway"
);

export const ProfileScreen = createStubScreen(
  "My Profile",
  "Manage your personal and health information"
);

export const OfflineScreen = createStubScreen(
  "Offline Mode",
  "Manage offline data and synchronization"
);
