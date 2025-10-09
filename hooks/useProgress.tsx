import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Progress, ProgressFormData, ProgressStats as ProgressStatsType } from '@/types/progress';

interface ProgressContextType {
  progressData: Progress[];
  stats: ProgressStatsType | null;
  loading: boolean;
  addProgress: (data: ProgressFormData) => Promise<void>;
  updateProgress: (id: number, data: ProgressFormData) => Promise<void>;
  deleteProgress: (id: number) => Promise<void>;
  refreshData: () => Promise<void>;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);
const STORAGE_KEY = 'progress_data';

const mockProgressData: Progress[] = [
  {
    id: 1,
    user_id: 1,
    date: '2025-09-15',
    weight: 180.5,
    bfPercentage: 15.2,
    personalBests: [
      { id: 1, progress_id: 1, exercise: 'Bench Press', weight: 225, reps: 5, sets: 3 },
      { id: 2, progress_id: 1, exercise: 'Squat', weight: 275, reps: 3, sets: 3 },
    ]
  },
  {
    id: 2,
    user_id: 1,
    date: '2025-09-22',
    weight: 182.0,
    bfPercentage: 15.8,
    personalBests: [
      { id: 3, progress_id: 2, exercise: 'Deadlift', weight: 315, reps: 3, sets: 3 },
    ]
  },
  {
    id: 3,
    user_id: 1,
    date: '2025-09-29',
    weight: 184.0,
    bfPercentage: 16.5,
    personalBests: []
  },
];

interface ProgressProviderProps {
  children: ReactNode;
}

/**
 * ProgressProvider component that wraps the app and provides progress data to all components
 * Manages state for progress data, stats, and loading status
 * Automatically loads data when component mounts and recalculates stats when data changes
 */
export function ProgressProvider({ children }: ProgressProviderProps) {
  const [progressData, setProgressData] = useState<Progress[]>([]);
  const [stats, setStats] = useState<ProgressStatsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [progressData]);

  /**
   * Loads progress data from device storage (AsyncStorage)
   * If no data exists, uses mock data as fallback
   */
  const loadData = async () => {
    try {
      setLoading(true);
      const storedData = await AsyncStorage.getItem(STORAGE_KEY);
      
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setProgressData(parsedData);
      } else {
        setProgressData(mockProgressData);
        await saveData(mockProgressData);
      }
    } catch (error) {
      console.error('Error loading progress data:', error);
      setProgressData(mockProgressData);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Saves progress data to device storage (AsyncStorage)
   * Converts the data array to JSON string before storing
   */
  const saveData = async (data: Progress[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving progress data:', error);
    }
  };

  /**
   * Calculates stats from progress data
   * Computes weight changes, body fat changes, and other metrics
   * Uses the two most recent entries to calculate changes
   */
  const calculateStats = () => {
    if (progressData.length === 0) {
      setStats(null);
      return;
    }

    const sortedData = [...progressData].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const latest = sortedData[0];
    const previous = sortedData[1];

    const calculatedStats: ProgressStatsType = {
      currentWeight: latest.weight,
      weightChange: previous ? latest.weight - previous.weight : 0,
      currentBF: latest.bfPercentage,
      bfChange: previous ? latest.bfPercentage - previous.bfPercentage : 0,
      totalEntries: progressData.length,
      lastEntryDate: latest.date,
    };

    setStats(calculatedStats);
  };

  /**
   * Adds a new progress entry to the data
   * Generates a unique ID and creates a new Progress object
   * Adds the entry to the beginning of the array (most recent first)
   * Saves the updated data to storage
   */
  const addProgress = async (data: ProgressFormData) => {
    try {
      const newId = Math.max(...progressData.map(p => p.id || 0), 0) + 1;
      const newProgress: Progress = {
        id: newId,
        user_id: 1,
        date: data.date,
        weight: data.weight,
        bfPercentage: data.bfPercentage,
        personalBests: data.personalBests.map((pb, index) => ({
          id: Date.now() + index,
          progress_id: newId,
          exercise: pb.exercise,
          weight: pb.weight,
          reps: pb.reps,
          sets: pb.sets,
          notes: pb.notes,
        })),
      };

      const updatedData = [newProgress, ...progressData];
      setProgressData(updatedData);
      await saveData(updatedData);
    } catch (error) {
      console.error('Error adding progress:', error);
      throw error;
    }
  };

  /**
   * Updates an existing progress entry by ID
   * Finds the entry with matching ID and replaces it with updated data
   * Preserves existing personal best IDs when updating
   * Saves the updated data to storage
   */
  const updateProgress = async (id: number, data: ProgressFormData) => {
    try {
      const updatedData = progressData.map(progress => {
        if (progress.id === id) {
          return {
            ...progress,
            date: data.date,
            weight: data.weight,
            bfPercentage: data.bfPercentage,
            personalBests: data.personalBests.map((pb, index) => ({
              id: progress.personalBests?.[index]?.id || Date.now() + index,
              progress_id: id,
              exercise: pb.exercise,
              weight: pb.weight,
              reps: pb.reps,
              sets: pb.sets,
              notes: pb.notes,
            })),
          };
        }
        return progress;
      });

      setProgressData(updatedData);
      await saveData(updatedData);
    } catch (error) {
      console.error('Error updating progress:', error);
      throw error;
    }
  };

  /**
   * Deletes a progress entry by ID
   * Filters out the entry with matching ID from the data array
   * Saves the updated data to storage
   */
  const deleteProgress = async (id: number) => {
    try {
      const updatedData = progressData.filter(progress => progress.id !== id);
      setProgressData(updatedData);
      await saveData(updatedData);
    } catch (error) {
      console.error('Error deleting progress:', error);
      throw error;
    }
  };

  /**
   * Refreshes progress data by reloading from storage
   * Used for pull-to-refresh functionality
   */
  const refreshData = async () => {
    await loadData();
  };

  const value: ProgressContextType = {
    progressData,
    stats,
    addProgress,
    updateProgress,
    deleteProgress,
    refreshData,
    loading,
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}

/**
 * Custom hook to access progress context data and functions
 * Must be used within a ProgressProvider component
 * Returns all progress data, stats, and CRUD functions
 */
export function useProgress() {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}
