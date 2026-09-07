import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { PaperProvider } from "react-native-paper";
import * as Font from "expo-font";
import { ActivityIndicator, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

// Screens
import LoginScreen from "./src/screens/auth/LoginScreen";
import RegisterScreen from "./src/screens/auth/RegisterScreen";
import DashboardScreen from "./src/screens/main/DashboardScreen";
import HealthCheckScreen from "./src/screens/health/HealthCheckScreen";
import {
  AssessmentResultScreen,
  FacilitySearchScreen,
  NearbyFacilitiesScreen,
  FacilityDetailsScreen,
  ReferralScreen,
  HealthPassportScreen,
  GovernmentSchemesScreen,
  BudgetEstimatorScreen,
  HealthJourneyScreen,
  ProfileScreen,
  OfflineScreen,
} from "./src/screens/stubs";

import { EmergencyScreen } from "./src/screens/health/EmergencyScreen";

// Store & Utils
import { useAuthStore } from "./src/stores/authStore";
import { useThemeStore } from "./src/stores/themeStore";
import { lightTheme, darkTheme } from "./src/utils/theme";
import { translations } from "./src/utils/translations";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
type TranslationSet = (typeof translations)[keyof typeof translations];

// Loading Screen
const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <ActivityIndicator size="large" color="#1976D2" />
  </View>
);

// Auth Stack
const AuthStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animation: "default",
    }}
  >
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

// Health Stack
const HealthStack = ({ t }: { t: TranslationSet }) => (
  <Stack.Navigator
    screenOptions={{
      headerTintColor: "#1976D2",
      headerTitleStyle: { fontWeight: "bold" },
    }}
  >
    <Stack.Screen name="HealthCheckHome" component={HealthCheckScreen} options={{ title: t.navigation.aiHealthCheck }} />
    <Stack.Screen name="AssessmentResult" component={AssessmentResultScreen} options={{ title: t.navigation.assessmentResult }} />
    <Stack.Screen name="HealthJourney" component={HealthJourneyScreen} options={{ title: t.navigation.healthcareJourney }} />
  </Stack.Navigator>
);

// Facilities Stack
const FacilitiesStack = ({ t }: { t: TranslationSet }) => (
  <Stack.Navigator
    screenOptions={{
      headerTintColor: "#1976D2",
      headerTitleStyle: { fontWeight: "bold" },
    }}
  >
    <Stack.Screen name="FacilitySearchHome" component={FacilitySearchScreen} options={{ title: t.navigation.findHealthcare }} />
    <Stack.Screen name="NearbyFacilities" component={NearbyFacilitiesScreen} options={{ title: t.navigation.nearbyFacilities }} />
    <Stack.Screen name="FacilityDetails" component={FacilityDetailsScreen} options={{ title: t.navigation.facilityDetails }} />
  </Stack.Navigator>
);

// Referral Stack
const ReferralStack = ({ t }: { t: TranslationSet }) => (
  <Stack.Navigator
    screenOptions={{
      headerTintColor: "#1976D2",
      headerTitleStyle: { fontWeight: "bold" },
    }}
  >
    <Stack.Screen name="ReferralHome" component={ReferralScreen} options={{ title: t.navigation.smartReferral }} />
  </Stack.Navigator>
);

// Health Passport Stack
const HealthPassportStack = ({ t }: { t: TranslationSet }) => (
  <Stack.Navigator
    screenOptions={{
      headerTintColor: "#1976D2",
      headerTitleStyle: { fontWeight: "bold" },
    }}
  >
    <Stack.Screen name="HealthPassportHome" component={HealthPassportScreen} options={{ title: t.navigation.digitalHealthPassport }} />
  </Stack.Navigator>
);

// Main Tab Navigator
const MainTabs = ({ t }: { t: TranslationSet }) => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ color, size }) => {
        let iconName = "home";
        if (route.name === "Dashboard") iconName = "home";
        else if (route.name === "Health") iconName = "heart";
        else if (route.name === "Facilities") iconName = "hospital-box";
        else if (route.name === "Passport") iconName = "id-card";
        else if (route.name === "Emergency") iconName = "alert-circle";
        else if (route.name === "Profile") iconName = "account";

        return <MaterialCommunityIcons name={iconName} size={size} color={route.name === "Emergency" ? "#dc2626" : color} />;
      },
      tabBarActiveTintColor: "#1976D2",
      tabBarInactiveTintColor: "#999",
    })}
  >
    <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ title: t.navigation.home }} />
    <Tab.Screen name="Health" component={() => <HealthStack t={t} />} options={{ title: t.navigation.aiHealthCheck }} />
    <Tab.Screen name="Facilities" component={() => <FacilitiesStack t={t} />} options={{ title: t.navigation.findCare }} />
    <Tab.Screen name="Passport" component={() => <HealthPassportStack t={t} />} options={{ title: t.navigation.myRecords }} />
    <Tab.Screen name="Emergency" component={EmergencyScreen} options={{ title: "Emergency SOS" }} />
    <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: t.navigation.profile }} />
  </Tab.Navigator>
);

// Root Stack (modals, etc.)
const RootStack = ({ t }: { t: TranslationSet }) => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animation: "default",
    }}
  >
    <Stack.Screen name="Main" component={() => <MainTabs t={t} />} />
    <Stack.Group screenOptions={{ presentation: "modal" }}>
      <Stack.Screen name="Referral" component={() => <ReferralStack t={t} />} />
      <Stack.Screen name="Schemes" component={GovernmentSchemesScreen} options={{ title: t.navigation.governmentSchemes }} />
      <Stack.Screen name="Budget" component={BudgetEstimatorScreen} options={{ title: t.navigation.budgetEstimator }} />
      <Stack.Screen name="Offline" component={OfflineScreen} options={{ title: t.navigation.offlineMode }} />
    </Stack.Group>
  </Stack.Navigator>
);

// Main App Component
export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const { user, restoreUser } = useAuthStore();
  const { isDarkMode, preferredLanguage, restoreLanguage } = useThemeStore();

  const t = translations[preferredLanguage];

  useEffect(() => {
    const prepare = async () => {
      try {
        // Load fonts
        await Font.loadAsync({
          "MaterialCommunityIcons": require("./assets/fonts/MaterialCommunityIcons.ttf"),
        });

        await restoreLanguage();
        await restoreUser();
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    };

    prepare();
  }, [restoreLanguage, restoreUser]);

  if (!appIsReady) {
    return <LoadingScreen />;
  }

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        {user ? <RootStack t={t} /> : <AuthStack />}
      </NavigationContainer>
    </PaperProvider>
  );
}
