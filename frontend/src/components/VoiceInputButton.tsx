import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  label?: string;
  language?: 'en' | 'hi' | 'mr' | 'kat';
}

export const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({
  onTranscript,
  label = 'Tap and speak',
  language = 'en',
}) => {
  const [isRecording, setIsRecording] = useState(false);

  const handlePress = () => {
    setIsRecording(true);
    // Simulate voice recording for demo with fallback (using mr-IN engine for Katkari/Marathi)
    setTimeout(() => {
      setIsRecording(false);
      if (language === 'hi') {
        onTranscript('बुखार और खांसी');
      } else if (language === 'mr' || language === 'kat') {
        onTranscript('ताप आणि खोकला');
      } else {
        onTranscript('Fever and Cough');
      }
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, isRecording && styles.recordingButton]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <Text style={styles.icon}>{isRecording ? '🎙️' : '🎤'}</Text>
        <Text style={[styles.label, isRecording && styles.recordingLabel]}>
          {isRecording
            ? (language === 'hi'
                ? 'सुन रहे हैं...'
                : language === 'mr' || language === 'kat'
                ? 'ऐकत आहे...'
                : 'Listening...')
            : label}
        </Text>
        {isRecording && <ActivityIndicator size="small" color="#dc2626" style={{ marginLeft: 6 }} />}
      </TouchableOpacity>
      {language === 'kat' && (
        <Text style={styles.katkariNote}>
          🎙️ Speak in Katkari or Marathi — we'll do our best to understand
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    minHeight: 52,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#f1f5f9',
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  recordingButton: {
    backgroundColor: '#fee2e2',
    borderColor: '#ef4444',
  },
  icon: {
    fontSize: 20,
    marginRight: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  recordingLabel: {
    color: '#dc2626',
  },
  katkariNote: {
    fontSize: 12,
    color: '#0284c7',
    marginTop: 2,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
