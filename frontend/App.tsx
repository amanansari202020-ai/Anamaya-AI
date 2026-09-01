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

// Store & Utils
import { useAuthStore } from "./src/stores/authStore";
import { useThemeStore } from "./src/stores/themeStore";
import { lightTheme, darkTheme } from "./src/utils/theme";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

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
      animationEnabled: true,
    }}
  >
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

// Health Stack
const HealthStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerTintColor: "#1976D2",
      headerTitleStyle: { fontWeight: "bold" },
    }}
  >
    <Stack.Screen name="HealthCheckHome" component={HealthCheckScreen} options={{ title: "AI Health Check" }} />
    <Stack.Screen name="AssessmentResult" component={AssessmentResultScreen} options={{ title: "Assessment Result" }} />
    <Stack.Screen name="HealthJourney" component={HealthJourneyScreen} options={{ title: "Healthcare Journey" }} />
  </Stack.Navigator>
);

// Facilities Stack
const FacilitiesStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerTintColor: "#1976D2",
      headerTitleStyle: { fontWeight: "bold" },
    }}
  >
    <Stack.Screen name="FacilitySearchHome" component={FacilitySearchScreen} options={{ title: "Find Healthcare" }} />
    <Stack.Screen name="NearbyFacilities" component={NearbyFacilitiesScreen} options={{ title: "Nearby Facilities" }} />
    <Stack.Screen name="FacilityDetails" component={FacilityDetailsScreen} options={{ title: "Facility Details" }} />
  </Stack.Navigator>
);

// Referral Stack
const ReferralStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerTintColor: "#1976D2",
      headerTitleStyle: { fontWeight: "bold" },
    }}
  >
    <Stack.Screen name="ReferralHome" component={ReferralScreen} options={{ title: "Smart Referral" }} />
  </Stack.Navigator>
);

// Health Passport Stack
const HealthPassportStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerTintColor: "#1976D2",
      headerTitleStyle: { fontWeight: "bold" },
    }}
  >
    <Stack.Screen name="HealthPassportHome" component={HealthPassportScreen} options={{ title: "Digital Health Passport" }} />
  </Stack.Navigator>
);

// Main Tab Navigator
const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ color, size }) => {
        let iconName = "home";
        if (route.name === "Dashboard") iconName = "home";
        else if (route.name === "Health") iconName = "heart";
        else if (route.name === "Facilities") iconName = "hospital-box";
        else if (route.name === "Passport") iconName = "id-card";
        else if (route.name === "Profile") iconName = "account";

        return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: "#1976D2",
      tabBarInactiveTintColor: "#999",
    })}
  >
    <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ title: "Home" }} />
    <Tab.Screen name="Health" component={HealthStack} options={{ title: "AI Health Check" }} />
    <Tab.Screen name="Facilities" component={FacilitiesStack} options={{ title: "Find Care" }} />
    <Tab.Screen name="Passport" component={HealthPassportStack} options={{ title: "My Records" }} />
    <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: "Profile" }} />
  </Tab.Navigator>
);

// Root Stack (modals, etc.)
const RootStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animationEnabled: true,
    }}
  >
    <Stack.Screen name="Main" component={MainTabs} />
    <Stack.Group screenOptions={{ presentation: "modal" }}>
      <Stack.Screen name="Referral" component={ReferralStack} />
      <Stack.Screen name="Schemes" component={GovernmentSchemesScreen} options={{ title: "Government Schemes" }} />
      <Stack.Screen name="Budget" component={BudgetEstimatorScreen} options={{ title: "Budget Estimator" }} />
      <Stack.Screen name="Offline" component={OfflineScreen} options={{ title: "Offline Mode" }} />
    </Stack.Group>
  </Stack.Navigator>
);

// Main App Component
export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const { user, restoreUser } = useAuthStore();
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    const prepare = async () => {
      try {
        // Load fonts
        await Font.loadAsync({
          "MaterialCommunityIcons": require("./assets/fonts/MaterialCommunityIcons.ttf"),
        });

        // Restore user session
        await restoreUser();
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    };

    prepare();
  }, []);

  if (!appIsReady) {
    return <LoadingScreen />;
  }

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        {user ? <RootStack /> : <AuthStack />}
      </NavigationContainer>
    </PaperProvider>
  );
}
