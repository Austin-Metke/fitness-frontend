import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { Progress } from '@/types/progress';

interface ProgressCardProps {
  progress: Progress;
  onPress?: () => void;
  showDate?: boolean;
}

export function ProgressCard({ progress, onPress, showDate = true }: ProgressCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <ThemedView style={styles.cardContent}>
        <View style={styles.header}>
          {showDate && (
            <ThemedText type="subtitle" style={styles.date}>
              {formatDate(progress.date)}
            </ThemedText>
          )}
          <View style={styles.metrics}>
            <View style={styles.metric}>
              <ThemedText type="default" style={styles.metricLabel}>
                Weight
              </ThemedText>
              <ThemedText type="title" style={styles.metricValue}>
                {progress.weight} lbs
              </ThemedText>
            </View>
            <View style={styles.metric}>
              <ThemedText type="default" style={styles.metricLabel}>
                Body Fat
              </ThemedText>
              <ThemedText type="title" style={styles.metricValue}>
                {progress.bfPercentage}%
              </ThemedText>
            </View>
          </View>
        </View>
        
        {progress.personalBests && progress.personalBests.length > 0 && (
          <View style={styles.personalBests}>
            <ThemedText type="default" style={styles.pbLabel}>
              Personal Bests:
            </ThemedText>
            {progress.personalBests.slice(0, 2).map((pb, index) => (
              <ThemedText key={index} type="default" style={styles.pbText}>
                • {pb.exercise}: {pb.weight}lbs x {pb.reps}
              </ThemedText>
            ))}
            {progress.personalBests.length > 2 && (
              <ThemedText type="default" style={styles.pbText}>
                +{progress.personalBests.length - 2} more...
              </ThemedText>
            )}
          </View>
        )}
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  cardContent: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  date: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  metrics: {
    flexDirection: 'row',
    gap: 24,
  },
  metric: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  personalBests: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  pbLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    fontWeight: '600',
  },
  pbText: {
    fontSize: 12,
    color: '#888',
    marginLeft: 8,
  },
});
