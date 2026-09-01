// Dashboard Screen
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Alert,
} from "react-native";
import {
  Text,
  Button,
  Card,
  useTheme,
  ActivityIndicator,
  Chip,
} from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import * as Location from "expo-location";
import { useThemeStore } from "../../stores/themeStore";
import { healthCheck } from "../../services/api";

export default function DashboardScreen({ navigation }: any) {
  const theme = useTheme();
  const { currentMood, setMood, offlineMode } = useThemeStore();
  const [connectivity, setConnectivity] = useState<"online" | "limited" | "offline">("online");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkConnectivity = async () => {
      try {
        await healthCheck();
        setConnectivity("online");
      } catch (error) {
        setConnectivity("offline");
      }
      setLoading(false);
    };

    checkConnectivity();
  }, []);

  const moodOptions = [
    { mood: "happy" as const, icon: "emoticon-happy", color: "#FFD700" },
    { mood: "calm" as const, icon: "emoticon-cool", color: "#87CEEB" },
    { mood: "stressed" as const, icon: "emoticon-sad", color: "#FF6B6B" },
    { mood: "tired" as const, icon: "emoticon-dead", color: "#A9A9A9" },
    { mood: "energetic" as const, icon: "emoticon-excited", color: "#FF4500" },
  ];

  const connectivityColor =
    connectivity === "online"
      ? "#4CAF50"
      : connectivity === "limited"
      ? "#FFC107"
      : "#F44336";

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      backgroundColor: theme.colors.primary,
      paddingTop: StatusBar.currentHeight || 10,
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: "bold",
      color: "white",
      marginBottom: 10,
    },
    headerSubtitle: {
      fontSize: 14,
      color: "rgba(255,255,255,0.8)",
      marginBottom: 15,
    },
    connectivityIndicator: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      backgroundColor: "rgba(255,255,255,0.2)",
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
      alignSelf: "flex-start",
    },
    connectivityDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: connectivityColor,
    },
    connectivityText: {
      color: "white",
      fontSize: 12,
      fontWeight: "600",
    },
    scrollContent: {
      padding: 20,
    },
    moodSection: {
      marginBottom: 25,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 12,
      color: theme.colors.onBackground,
    },
    moodChips: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
    },
    featureCard: {
      marginBottom: 15,
      backgroundColor: theme.colors.surface,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.primary,
    },
    featureTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.primary,
    },
    featureSubtitle: {
      fontSize: 13,
      color: theme.colors.onSurfaceVariant,
      marginTop: 4,
    },
    featureButton: {
      marginTop: 12,
      paddingVertical: 6,
    },
    quickActionGrid: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 15,
      gap: 10,
    },
    actionButton: {
      flex: 1,
      paddingVertical: 12,
    },
  });

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Welcome Back!</Text>
        <Text style={styles.headerSubtitle}>
          Your trusted healthcare companion
        </Text>
        <View style={styles.connectivityIndicator}>
          <View style={styles.connectivityDot} />
          <Text style={styles.connectivityText}>
            {connectivity === "online"
              ? "🟢 Online"
              : connectivity === "limited"
              ? "🟡 Limited Connection"
              : "⚫ Offline Mode"}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Mood Selector */}
        <View style={styles.moodSection}>
          <Text style={styles.sectionTitle}>How are you feeling today?</Text>
          <View style={styles.moodChips}>
            {moodOptions.map(({ mood, icon, color }) => (
              <Chip
                key={mood}
                selected={currentMood === mood}
                onPress={() => setMood(mood)}
                icon={icon}
                style={{
                  backgroundColor:
                    currentMood === mood
                      ? color + "30"
                      : theme.colors.surfaceVariant,
                  borderColor: currentMood === mood ? color : "transparent",
                  borderWidth: currentMood === mood ? 2 : 0,
                }}
                textStyle={{
                  fontSize: 11,
                  color: currentMood === mood ? color : theme.colors.onSurface,
                }}
              >
                {mood.charAt(0).toUpperCase() + mood.slice(1)}
              </Chip>
            ))}
          </View>
        </View>

        {/* Main Features */}
        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
          Healthcare Services
        </Text>

        <Card style={styles.featureCard}>
          <Card.Content>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <MaterialCommunityIcons
                name="heart-pulse"
                size={24}
                color={theme.colors.primary}
              />
              <Text style={[styles.featureTitle, { marginLeft: 12 }]}>
                AI Health Check
              </Text>
            </View>
            <Text style={styles.featureSubtitle}>
              Describe your symptoms and get personalized health guidance
            </Text>
            <Button
              mode="contained"
              onPress={() => navigation.navigate("Health", { screen: "HealthCheckHome" })}
              style={styles.featureButton}
              compact
            >
              Start Assessment
            </Button>
          </Card.Content>
        </Card>

        <Card style={styles.featureCard}>
          <Card.Content>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <MaterialCommunityIcons
                name="hospital-box"
                size={24}
                color={theme.colors.primary}
              />
              <Text style={[styles.featureTitle, { marginLeft: 12 }]}>
                Find Healthcare
              </Text>
            </View>
            <Text style={styles.featureSubtitle}>
              Discover nearby healthcare facilities and specialists
            </Text>
            <Button
              mode="contained"
              onPress={() => navigation.navigate("Facilities", { screen: "FacilitySearchHome" })}
              style={styles.featureButton}
              compact
            >
              Search Facilities
            </Button>
          </Card.Content>
        </Card>

        <Card style={styles.featureCard}>
          <Card.Content>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <MaterialCommunityIcons
                name="file-document"
                size={24}
                color={theme.colors.primary}
              />
              <Text style={[styles.featureTitle, { marginLeft: 12 }]}>
                Health Passport
              </Text>
            </View>
            <Text style={styles.featureSubtitle}>
              Your portable digital health records
            </Text>
            <Button
              mode="contained"
              onPress={() => navigation.navigate("Passport", { screen: "HealthPassportHome" })}
              style={styles.featureButton}
              compact
            >
              View Records
            </Button>
          </Card.Content>
        </Card>

        {/* Quick Actions */}
        <Text style={[styles.sectionTitle, { marginTop: 25 }]}>
          Quick Actions
        </Text>

        <View style={styles.quickActionGrid}>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate("Schemes")}
            style={styles.actionButton}
            icon="briefcase"
            compact
          >
            Schemes
          </Button>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate("Budget")}
            style={styles.actionButton}
            icon="calculator"
            compact
          >
            Budget
          </Button>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate("Offline")}
            style={styles.actionButton}
            icon="wifi-off"
            compact
          >
            Offline
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
