import React from 'react';
import { View, StyleSheet } from 'react-native';

interface WizardProgressDotsProps {
  totalSteps: number;
  currentStep: number;
}

export const WizardProgressDots: React.FC<WizardProgressDotsProps> = ({
  totalSteps,
  currentStep,
}) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }).map((_, index) => {
        const step = index + 1;
        const isActive = step === currentStep;
        const isCompleted = step < currentStep;

        return (
          <View
            key={step}
            style={[
              styles.dot,
              isActive && styles.activeDot,
              isCompleted && styles.completedDot,
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#cbd5e1',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#2563eb',
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  completedDot: {
    backgroundColor: '#3b82f6',
  },
});
