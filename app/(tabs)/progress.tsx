import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ProgressCard } from '@/components/ProgressCard';
import { ProgressStats } from '@/components/ProgressStats';
import { Progress } from '@/types/progress';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '@/types/navigation';
import { useProgress } from '@/hooks/useProgress';

export default function ProgressScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { progressData, stats, refreshData, loading } = useProgress();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshData();
    } finally {
      setRefreshing(false);
    }
  };

  const handleAddProgress = () => {
    navigation.navigate('AddProgress');
  };

  const handleProgressPress = (progress: Progress) => {
    navigation.navigate('ProgressDetail', { progress });
  };

  const renderProgressCard = ({ item }: { item: Progress }) => (
    <ProgressCard
      progress={item}
      onPress={() => handleProgressPress(item)}
    />
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Progress Tracking
        </ThemedText>
        <TouchableOpacity style={styles.addButton} onPress={handleAddProgress}>
          <ThemedText style={styles.addButtonText}>+ Add Entry</ThemedText>
        </TouchableOpacity>
      </View>

      {stats && <ProgressStats stats={stats} />}

      <View style={styles.listHeader}>
        <ThemedText type="subtitle" style={styles.listTitle}>
          Progress History
        </ThemedText>
      </View>

      <FlatList
        data={progressData}
        keyExtractor={(item) => item.id?.toString() || item.date}
        renderItem={renderProgressCard}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#007AFF"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <ThemedText type="default" style={styles.emptyText}>
              No progress entries yet.{'\n'}Start tracking your fitness journey!
            </ThemedText>
            <TouchableOpacity style={styles.emptyButton} onPress={handleAddProgress}>
              <ThemedText style={styles.emptyButtonText}>Add First Entry</ThemedText>
            </TouchableOpacity>
          </View>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  listHeader: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  emptyButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
