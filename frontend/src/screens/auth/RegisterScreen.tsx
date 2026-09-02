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
import { useThemeStore } from "../../stores/themeStore";
import { translations } from "../../utils/translations";
import LanguageSelector from "../../components/LanguageSelector";

export default function RegisterScreen({ navigation }: any) {
  const theme = useTheme();
  const { preferredLanguage } = useThemeStore();
  const t = translations[preferredLanguage];
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const { register, isLoading, error } = useAuthStore();

  const handleRegister = async () => {
    if (!fullName || !email || !phone || !password) {
      Alert.alert(t.alerts.incompleteForm, t.alerts.fillAllFields);
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(t.alerts.passwordMismatch, t.alerts.passwordsDoNotMatch);
      return;
    }

    if (password.length < 8) {
      Alert.alert(t.alerts.weakPassword, t.alerts.weakPasswordMessage);
      return;
    }

    try {
      await register(email, password, fullName, phone);
    } catch (err) {
      Alert.alert(t.auth.registrationFailed, error || t.auth.loginError);
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
    selectorWrap: {
      marginBottom: 20,
      alignItems: "center",
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
        <View style={styles.selectorWrap}>
          <LanguageSelector />
        </View>
        <Text style={styles.title}>{t.auth.createAccount}</Text>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <TextInput
          label={t.common.fullName}
          value={fullName}
          onChangeText={setFullName}
          mode="outlined"
          editable={!isLoading}
          style={styles.input}
          left={<TextInput.Icon icon="account" />}
        />

        <TextInput
          label={t.common.email}
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          keyboardType="email-address"
          editable={!isLoading}
          style={styles.input}
          left={<TextInput.Icon icon="email" />}
        />

        <TextInput
          label={t.common.phone}
          value={phone}
          onChangeText={setPhone}
          mode="outlined"
          keyboardType="phone-pad"
          editable={!isLoading}
          style={styles.input}
          left={<TextInput.Icon icon="phone" />}
        />

        <TextInput
          label={t.common.password}
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          secureTextEntry
          editable={!isLoading}
          style={styles.input}
          left={<TextInput.Icon icon="lock" />}
        />

        <TextInput
          label={t.common.confirmPassword}
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
          {isLoading ? <ActivityIndicator animating color="white" /> : t.auth.registerButton}
        </Button>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{t.auth.haveAccount}</Text>
          <Button
            mode="text"
            onPress={() => navigation.navigate("Login")}
            disabled={isLoading}
            compact
          >
            <Text style={styles.linkText}>{t.auth.loginButton}</Text>
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
