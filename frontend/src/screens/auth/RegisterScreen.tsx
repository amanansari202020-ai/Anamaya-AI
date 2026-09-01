// Register Screen
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
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

export default function RegisterScreen({ navigation }: any) {
  const theme = useTheme();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const { register, isLoading, error } = useAuthStore();

  const handleRegister = async () => {
    if (!fullName || !email || !phone || !password) {
      Alert.alert("Incomplete Form", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Password Mismatch", "Passwords do not match");
      return;
    }

    if (password.length < 8) {
      Alert.alert("Weak Password", "Password must be at least 8 characters");
      return;
    }

    try {
      await register(email, password, fullName, phone);
    } catch (err) {
      Alert.alert("Registration Failed", error || "Please try again");
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
    title: {
      fontSize: 28,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 30,
      color: theme.colors.primary,
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
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Create Account</Text>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <TextInput
          label="Full Name"
          value={fullName}
          onChangeText={setFullName}
          mode="outlined"
          editable={!isLoading}
          style={styles.input}
          left={<TextInput.Icon icon="account" />}
        />

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
          label="Phone"
          value={phone}
          onChangeText={setPhone}
          mode="outlined"
          keyboardType="phone-pad"
          editable={!isLoading}
          style={styles.input}
          left={<TextInput.Icon icon="phone" />}
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

        <TextInput
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          mode="outlined"
          secureTextEntry
          editable={!isLoading}
          style={styles.input}
          left={<TextInput.Icon icon="lock-check" />}
        />

        <Button
          mode="contained"
          onPress={handleRegister}
          disabled={isLoading}
          style={styles.button}
        >
          {isLoading ? <ActivityIndicator animating color="white" /> : "Register"}
        </Button>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <Button
            mode="text"
            onPress={() => navigation.navigate("Login")}
            disabled={isLoading}
            compact
          >
            <Text style={styles.linkText}>Login</Text>
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
