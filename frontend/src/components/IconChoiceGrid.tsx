import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

export interface IconOption {
  value: string;
  label: string;
  icon: string;
}

interface IconChoiceGridProps {
  options: IconOption[];
  selectedValues: string[];
  onSelect: (value: string) => void;
  multiSelect?: boolean;
}

export const IconChoiceGrid: React.FC<IconChoiceGridProps> = ({
  options,
  selectedValues,
  onSelect,
  multiSelect = false,
}) => {
  return (
    <View style={styles.grid}>
      {options.map((item) => {
        const isSelected = selectedValues.includes(item.value);
        return (
          <TouchableOpacity
            key={item.value}
            style={[styles.card, isSelected && styles.selectedCard]}
            onPress={() => onSelect(item.value)}
            activeOpacity={0.7}
          >
            <Text style={styles.icon}>{item.icon}</Text>
            <Text style={[styles.label, isSelected && styles.selectedLabel]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  card: {
    minHeight: 60,
    width: '48%',
    borderRadius: 12, // rounded-xl
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 1,
  },
  selectedCard: {
    borderColor: '#2563eb', // blue accent
    backgroundColor: '#eff6ff',
  },
  icon: {
    fontSize: 22,
    marginRight: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    flexShrink: 1,
  },
  selectedLabel: {
    color: '#1d4ed8',
    fontWeight: '700',
  },
});
