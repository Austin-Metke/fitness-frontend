import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Progress, PersonalBest } from '@/types/progress';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '@/types/navigation';
import { useProgress } from '@/hooks/useProgress';

interface RouteParams {
  progress: Progress;
}

export default function ProgressDetailScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { progress: initialProgress } = route.params as RouteParams;
  const { deleteProgress } = useProgress();
  
  const [progress, setProgress] = useState<Progress>(initialProgress);

  useEffect(() => {
    navigation.setOptions({
      title: 'Progress Details',
    });
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleEdit = () => {
    navigation.navigate('EditProgress', { progress });
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this progress entry? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              if (progress.id) {
                await deleteProgress(progress.id);
                Alert.alert('Success', 'Progress entry deleted successfully.');
                navigation.goBack();
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to delete progress entry. Please try again.');
            }
          },
        },
      ]
    );
  };

  const renderPersonalBest = (pb: PersonalBest, index: number) => (
    <View key={pb.id || index} style={styles.pbCard}>
      <View style={styles.pbHeader}>
        <ThemedText type="title" style={styles.pbExercise}>
          {pb.exercise}
        </ThemedText>
        <ThemedText type="default" style={styles.pbStats}>
          {pb.weight}lbs × {pb.reps}
          {pb.sets && ` × ${pb.sets} sets`}
        </ThemedText>
      </View>
      {pb.notes && (
        <ThemedText type="default" style={styles.pbNotes}>
          {pb.notes}
        </ThemedText>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ThemedView style={styles.content}>
        <View style={styles.dateHeader}>
          <ThemedText type="subtitle" style={styles.dateText}>
            {formatDate(progress.date)}
          </ThemedText>
        </View>

        <View style={styles.metricsSection}>
          <View style={styles.metricCard}>
            <ThemedText type="default" style={styles.metricLabel}>
              Weight
            </ThemedText>
            <ThemedText type="title" style={styles.metricValue}>
              {progress.weight} lbs
            </ThemedText>
          </View>

          <View style={styles.metricCard}>
            <ThemedText type="default" style={styles.metricLabel}>
              Body Fat Percentage
            </ThemedText>
            <ThemedText type="title" style={styles.metricValue}>
              {progress.bfPercentage}%
            </ThemedText>
          </View>
        </View>

        {progress.personalBests && progress.personalBests.length > 0 && (
          <View style={styles.personalBestsSection}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Personal Bests
            </ThemedText>
            {progress.personalBests.map((pb, index) => renderPersonalBest(pb, index))}
          </View>
        )}

        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <ThemedText style={styles.editButtonText}>Edit Entry</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <ThemedText style={styles.deleteButtonText}>Delete Entry</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  content: {
    padding: 20,
  },
  dateHeader: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
  metricsSection: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  metricLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  personalBestsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  pbCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  pbHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  pbExercise: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  pbStats: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  pbNotes: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
  },
  actionsSection: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#FF4444',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
