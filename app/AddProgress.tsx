import React, { useState } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { AddProgressForm } from '@/components/AddProgressForm';
import { ProgressFormData } from '@/types/progress';
import { useNavigation } from '@react-navigation/native';
import { useProgress } from '@/hooks/useProgress';

export default function AddProgressScreen() {
  const navigation = useNavigation();
  const { addProgress } = useProgress();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: ProgressFormData) => {
    setIsSubmitting(true);
    
    try {
      await addProgress(data);
      
      Alert.alert(
        'Success',
        'Progress entry added successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to add progress entry. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel',
      'Are you sure you want to cancel? Your changes will be lost.',
      [
        { text: 'Keep Editing', style: 'cancel' },
        { text: 'Discard', style: 'destructive', onPress: () => navigation.goBack() },
      ]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <AddProgressForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
});
