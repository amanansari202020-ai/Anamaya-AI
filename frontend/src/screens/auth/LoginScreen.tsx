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
import { useThemeStore } from "../../stores/themeStore";
import { translations } from "../../utils/translations";
import LanguageSelector from "../../components/LanguageSelector";

export default function LoginScreen({ navigation }: any) {
  const theme = useTheme();
  const { preferredLanguage } = useThemeStore();
  const t = translations[preferredLanguage];
  const [email, setEmail] = useState("user@example.com");
  const [password, setPassword] = useState("password123");
  const { login, isLoading, error } = useAuthStore();

  const handleLogin = async () => {
    try {
      await login(email, password);
    } catch (err) {
      Alert.alert(t.auth.loginFailed, error || t.auth.loginError);
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
          <View style={styles.selectorWrap}>
            <LanguageSelector />
          </View>
          <Text style={styles.title}>{t.auth.titleLogin}</Text>
          <Text style={styles.subtitle}>{t.auth.subtitleLogin}</Text>

          {error && <Text style={styles.errorText}>{error}</Text>}

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
            label={t.common.password}
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
              t.auth.loginButton
            )}
          </Button>

          <View style={styles.footer}>
            <Text style={styles.footerText}>{t.auth.noAccount}</Text>
            <Button
              mode="text"
              onPress={() => navigation.navigate("Register")}
              disabled={isLoading}
              compact
            >
              <Text style={styles.linkText}>{t.auth.registerButton}</Text>
            </Button>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
