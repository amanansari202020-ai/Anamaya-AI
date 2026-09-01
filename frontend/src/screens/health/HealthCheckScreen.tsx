// Health Check Screen - Core AI Assessment Feature
import React, { useState } from "react";
import { View, StyleSheet, ScrollView, SafeAreaView, Alert } from "react-native";
import {
  Text,
  Button,
  TextInput,
  Card,
  useTheme,
  ActivityIndicator,
  Chip,
} from "react-native-paper";
import * as Speech from "expo-speech";
import { assessSymptoms } from "../../services/api";

export default function HealthCheckScreen({ navigation }: any) {
  const theme = useTheme();
  const [symptoms, setSymptoms] = useState("");
  const [symptomList, setSymptomList] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [useVoice, setUseVoice] = useState(false);

  const commonSymptoms = [
    "Fever",
    "Headache",
    "Cough",
    "Cold",
    "Body Pain",
    "Weakness",
    "Nausea",
    "Dizziness",
  ];

  const handleAddSymptom = () => {
    if (symptoms.trim()) {
      setSymptomList([...symptomList, symptoms.trim()]);
      setSymptoms("");
    }
  };

  const handleRemoveSymptom = (index: number) => {
    setSymptomList(symptomList.filter((_, i) => i !== index));
  };

  const handleAssess = async () => {
    if (symptomList.length === 0) {
      Alert.alert("No Symptoms", "Please add at least one symptom");
      return;
    }

    setLoading(true);
    try {
      const response = await assessSymptoms({
        symptoms: symptomList,
        duration: "recent",
        severity: "moderate",
      });

      navigation.navigate("AssessmentResult", { assessment: response.assessment });
    } catch (error) {
      Alert.alert("Error", "Failed to assess symptoms. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      padding: 20,
    },
    card: {
      marginBottom: 20,
      backgroundColor: theme.colors.surface,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 12,
      color: theme.colors.primary,
    },
    input: {
      marginBottom: 10,
    },
    addButton: {
      paddingVertical: 6,
      marginBottom: 15,
    },
    symptomChip: {
      margin: 4,
    },
    chipsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginBottom: 15,
    },
    commonChipsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginTop: 10,
    },
    assessButton: {
      paddingVertical: 10,
      marginTop: 15,
    },
    info: {
      backgroundColor: theme.colors.surfaceVariant,
      padding: 12,
      borderRadius: 8,
      marginTop: 15,
    },
    infoText: {
      fontSize: 13,
      color: theme.colors.onSurfaceVariant,
      lineHeight: 20,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Describe Your Symptoms</Text>
            <TextInput
              label="Enter a symptom"
              value={symptoms}
              onChangeText={setSymptoms}
              mode="outlined"
              multiline
              numberOfLines={3}
              style={styles.input}
              placeholder="e.g., fever, headache, body pain"
            />
            <Button
              mode="contained"
              onPress={handleAddSymptom}
              style={styles.addButton}
              disabled={!symptoms.trim() || loading}
            >
              Add Symptom
            </Button>

            {symptomList.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Selected Symptoms</Text>
                <View style={styles.chipsContainer}>
                  {symptomList.map((symptom, index) => (
                    <Chip
                      key={index}
                      onClose={() => handleRemoveSymptom(index)}
                      style={styles.symptomChip}
                    >
                      {symptom}
                    </Chip>
                  ))}
                </View>
              </>
            )}
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Quick Add Common Symptoms</Text>
            <View style={styles.commonChipsContainer}>
              {commonSymptoms.map((symptom) => (
                <Button
                  key={symptom}
                  mode="outlined"
                  onPress={() => {
                    if (!symptomList.includes(symptom)) {
                      setSymptomList([...symptomList, symptom]);
                    }
                  }}
                  compact
                  disabled={symptomList.includes(symptom)}
                >
                  {symptom}
                </Button>
              ))}
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Button
              mode="contained"
              onPress={handleAssess}
              disabled={symptomList.length === 0 || loading}
              style={styles.assessButton}
            >
              {loading ? (
                <ActivityIndicator animating color="white" />
              ) : (
                "Get AI Assessment"
              )}
            </Button>

            <View style={styles.info}>
              <Text style={styles.infoText}>
                💡 HealthSphere AI provides informational guidance and does not
                replace professional medical advice. Always consult with a
                healthcare professional for diagnosis and treatment.
              </Text>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
