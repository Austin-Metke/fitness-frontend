import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { ProgressStats as ProgressStatsType } from '@/types/progress';

interface ProgressStatsProps {
  stats: ProgressStatsType;
}

export function ProgressStats({ stats }: ProgressStatsProps) {
  const formatChange = (change: number, unit: string = '') => {
    const sign = change >= 0 ? '+' : '';
    const color = change >= 0 ? '#4CAF50' : '#F44336';
    return (
      <ThemedText style={[styles.changeText, { color }]}>
        {sign}{change.toFixed(1)}{unit}
      </ThemedText>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Progress Overview
      </ThemedText>
      
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <ThemedText type="default" style={styles.statLabel}>
            Current Weight
          </ThemedText>
          <ThemedText type="title" style={styles.statValue}>
            {stats.currentWeight.toFixed(1)} lbs
          </ThemedText>
          {formatChange(stats.weightChange, ' lbs')}
        </View>

        <View style={styles.statCard}>
          <ThemedText type="default" style={styles.statLabel}>
            Body Fat %
          </ThemedText>
          <ThemedText type="title" style={styles.statValue}>
            {stats.currentBF.toFixed(1)}%
          </ThemedText>
          {formatChange(stats.bfChange, '%')}
        </View>

        <View style={styles.statCard}>
          <ThemedText type="default" style={styles.statLabel}>
            Total Entries
          </ThemedText>
          <ThemedText type="title" style={styles.statValue}>
            {stats.totalEntries}
          </ThemedText>
          <ThemedText style={styles.lastEntry}>
            Last: {formatDate(stats.lastEntryDate)}
          </ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  lastEntry: {
    fontSize: 10,
    color: '#888',
    textAlign: 'center',
  },
});
