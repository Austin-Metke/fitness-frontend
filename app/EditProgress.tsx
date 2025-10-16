import React, { useState } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { AddProgressForm } from '@/components/AddProgressForm';
import { ProgressFormData, Progress } from '@/types/progress';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useProgress } from '@/hooks/useProgress';

interface RouteParams {
  progress: Progress;
}

export default function EditProgressScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { progress: initialProgress } = route.params as RouteParams;
  const { updateProgress } = useProgress();
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: ProgressFormData) => {
    if (!initialProgress.id) return;
    
    setIsSubmitting(true);
    
    try {
      await updateProgress(initialProgress.id, data);
      
      Alert.alert(
        'Success',
        'Progress entry updated successfully!',
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
        'Failed to update progress entry. Please try again.',
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

  // Pre-populate form with existing data
  const initialFormData: ProgressFormData = {
    date: initialProgress.date.split('T')[0], // Convert to YYYY-MM-DD format
    weight: initialProgress.weight,
    bfPercentage: initialProgress.bfPercentage,
    personalBests: initialProgress.personalBests?.map(pb => ({
      exercise: pb.exercise,
      weight: pb.weight,
      reps: pb.reps,
      sets: pb.sets,
      notes: pb.notes,
    })) || [],
  };

  return (
    <ThemedView style={styles.container}>
      <AddProgressForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        initialData={initialFormData}
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
