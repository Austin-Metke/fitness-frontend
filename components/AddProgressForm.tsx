import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { ProgressFormData, PersonalBest } from '@/types/progress';

interface AddProgressFormProps {
  onSubmit: (data: ProgressFormData) => void;
  onCancel: () => void;
  initialData?: ProgressFormData;
}

export function AddProgressForm({ onSubmit, onCancel, initialData }: AddProgressFormProps) {
  const [formData, setFormData] = useState<ProgressFormData>(
    initialData || {
      date: new Date().toISOString().split('T')[0],
      weight: 0,
      bfPercentage: 0,
      personalBests: [],
    }
  );

  const [showPersonalBests, setShowPersonalBests] = useState(
    initialData?.personalBests && initialData.personalBests.length > 0
  );

  const handleSubmit = () => {
    if (formData.weight <= 0 || formData.bfPercentage < 0) {
      Alert.alert('Invalid Input', 'Please enter valid weight and body fat percentage values.');
      return;
    }

    onSubmit(formData);
  };

  const addPersonalBest = () => {
    setFormData(prev => ({
      ...prev,
      personalBests: [
        ...prev.personalBests,
        {
          exercise: '',
          weight: 0,
          reps: 0,
          sets: 1,
          notes: '',
        }
      ]
    }));
  };

  const updatePersonalBest = (index: number, field: keyof Omit<PersonalBest, 'id' | 'progress_id'>, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      personalBests: prev.personalBests.map((pb, i) => 
        i === index ? { ...pb, [field]: value } : pb
      )
    }));
  };

  const removePersonalBest = (index: number) => {
    setFormData(prev => ({
      ...prev,
      personalBests: prev.personalBests.filter((_, i) => i !== index)
    }));
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ThemedView style={styles.form}>
        <ThemedText type="title" style={styles.title}>
          {initialData ? 'Edit Progress Entry' : 'Add Progress Entry'}
        </ThemedText>

        <View style={styles.inputGroup}>
          <ThemedText type="default" style={styles.label}>
            Date
          </ThemedText>
          <TextInput
            style={styles.input}
            value={formData.date}
            onChangeText={(text) => setFormData(prev => ({ ...prev, date: text }))}
            placeholder="YYYY-MM-DD"
          />
        </View>

        <View style={styles.inputGroup}>
          <ThemedText type="default" style={styles.label}>
            Weight (lbs)
          </ThemedText>
          <TextInput
            style={styles.input}
            value={formData.weight.toString()}
            onChangeText={(text) => setFormData(prev => ({ ...prev, weight: parseFloat(text) || 0 }))}
            placeholder="Enter weight"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <ThemedText type="default" style={styles.label}>
            Body Fat Percentage (%)
          </ThemedText>
          <TextInput
            style={styles.input}
            value={formData.bfPercentage.toString()}
            onChangeText={(text) => setFormData(prev => ({ ...prev, bfPercentage: parseFloat(text) || 0 }))}
            placeholder="Enter body fat percentage"
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setShowPersonalBests(!showPersonalBests)}
        >
          <ThemedText type="default" style={styles.toggleButtonText}>
            {showPersonalBests ? 'Hide' : 'Add'} Personal Bests
          </ThemedText>
        </TouchableOpacity>

        {showPersonalBests && (
          <View style={styles.personalBestsSection}>
            {formData.personalBests.map((pb, index) => (
              <View key={index} style={styles.personalBestCard}>
                <View style={styles.pbHeader}>
                  <ThemedText type="default" style={styles.pbTitle}>
                    Personal Best #{index + 1}
                  </ThemedText>
                  <TouchableOpacity
                    onPress={() => removePersonalBest(index)}
                    style={styles.removeButton}
                  >
                    <ThemedText style={styles.removeButtonText}>×</ThemedText>
                  </TouchableOpacity>
                </View>

                <TextInput
                  style={styles.input}
                  value={pb.exercise}
                  onChangeText={(text) => updatePersonalBest(index, 'exercise', text)}
                  placeholder="Exercise name"
                />

                <View style={styles.pbRow}>
                  <TextInput
                    style={[styles.input, styles.halfInput]}
                    value={pb.weight.toString()}
                    onChangeText={(text) => updatePersonalBest(index, 'weight', parseFloat(text) || 0)}
                    placeholder="Weight (lbs)"
                    keyboardType="numeric"
                  />
                  <TextInput
                    style={[styles.input, styles.halfInput]}
                    value={pb.reps.toString()}
                    onChangeText={(text) => updatePersonalBest(index, 'reps', parseInt(text) || 0)}
                    placeholder="Reps"
                    keyboardType="numeric"
                  />
                </View>

                <TextInput
                  style={styles.input}
                  value={pb.notes || ''}
                  onChangeText={(text) => updatePersonalBest(index, 'notes', text)}
                  placeholder="Notes (optional)"
                  multiline
                  numberOfLines={2}
                />
              </View>
            ))}

            <TouchableOpacity style={styles.addPbButton} onPress={addPersonalBest}>
              <ThemedText style={styles.addPbButtonText}>
                + Add Personal Best
              </ThemedText>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <ThemedText style={styles.submitButtonText}>
              {initialData ? 'Update Progress' : 'Save Progress'}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#FFF',
  },
  toggleButton: {
    backgroundColor: '#F0F0F0',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  toggleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  personalBestsSection: {
    marginBottom: 24,
  },
  personalBestCard: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  pbHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  pbTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  removeButton: {
    backgroundColor: '#FF4444',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pbRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  halfInput: {
    flex: 1,
  },
  addPbButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addPbButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
});
