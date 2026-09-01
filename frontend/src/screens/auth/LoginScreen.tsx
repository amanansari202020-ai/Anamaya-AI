// Login Screen
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
} from "react-native";
import {
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  useTheme,
} from "react-native-paper";
import { useAuthStore } from "../../stores/authStore";

export default function LoginScreen({ navigation }: any) {
  const theme = useTheme();
  const [email, setEmail] = useState("user@example.com");
  const [password, setPassword] = useState("password123");
  const { login, isLoading, error } = useAuthStore();

  const handleLogin = async () => {
    try {
      await login(email, password);
    } catch (err) {
      Alert.alert("Login Failed", error || "Please try again");
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: "center",
      padding: 20,
    },
    logo: {
      width: 100,
      height: 100,
      alignSelf: "center",
      marginBottom: 30,
      tintColor: theme.colors.primary,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 10,
      color: theme.colors.primary,
    },
    subtitle: {
      fontSize: 14,
      textAlign: "center",
      marginBottom: 30,
      color: theme.colors.onSurfaceVariant,
    },
    input: {
      marginBottom: 15,
    },
    button: {
      marginTop: 20,
      paddingVertical: 8,
    },
    footer: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 20,
      gap: 5,
    },
    footerText: {
      fontSize: 14,
      color: theme.colors.onSurfaceVariant,
    },
    linkText: {
      fontSize: 14,
      color: theme.colors.primary,
      fontWeight: "bold",
    },
    errorText: {
      color: theme.colors.error,
      marginBottom: 15,
      textAlign: "center",
    },
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Text style={styles.title}>HealthSphere AI</Text>
          <Text style={styles.subtitle}>
            Connecting Every Patient to the Right Care
          </Text>

          {error && <Text style={styles.errorText}>{error}</Text>}

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            keyboardType="email-address"
            editable={!isLoading}
            style={styles.input}
            left={<TextInput.Icon icon="email" />}
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry
            editable={!isLoading}
            style={styles.input}
            left={<TextInput.Icon icon="lock" />}
          />

          <Button
            mode="contained"
            onPress={handleLogin}
            disabled={isLoading}
            style={styles.button}
          >
            {isLoading ? (
              <ActivityIndicator animating color="white" />
            ) : (
              "Login"
            )}
          </Button>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <Button
              mode="text"
              onPress={() => navigation.navigate("Register")}
              disabled={isLoading}
              compact
            >
              <Text style={styles.linkText}>Register</Text>
            </Button>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
