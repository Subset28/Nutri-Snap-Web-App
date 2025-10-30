import { useState, useEffect, useCallback } from 'react';
import { SavedScan } from '@/types/savedScan';

const STORAGE_KEY = 'saved_scans';
const MAX_SCANS = 10;

export const useSavedScans = () => {
  const [scans, setScans] = useState<SavedScan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load scans from storage
  const loadScans = useCallback(async () => {
    try {
      setIsLoading(true);
      if (typeof window !== 'undefined') {
        const value = localStorage.getItem(STORAGE_KEY);
        if (value) {
          const parsedScans = JSON.parse(value) as SavedScan[];
          // Sort by timestamp (newest first)
          parsedScans.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          setScans(parsedScans);
        }
      }
    } catch (error) {
      console.error('Error loading saved scans:', error);
      setScans([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save scans to storage
  const saveToStorage = useCallback(async (updatedScans: SavedScan[]) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedScans));
        setScans(updatedScans);
      }
    } catch (error) {
      console.error('Error saving scans to storage:', error);
      throw error;
    }
  }, []);

  // Save a new scan
  const saveScan = useCallback(async (scan: SavedScan) => {
    try {
      const currentScans = [...scans];
      
      // Add new scan at the beginning
      currentScans.unshift(scan);
      
      // Remove oldest non-pinned scans if we exceed the limit
      while (currentScans.length > MAX_SCANS) {
        const indexToRemove = currentScans.findIndex(s => !s.isPinned);
        if (indexToRemove !== -1) {
          currentScans.splice(indexToRemove, 1);
        } else {
          // If all scans are pinned, remove the oldest one anyway
          currentScans.pop();
        }
      }
      
      await saveToStorage(currentScans);
    } catch (error) {
      console.error('Error saving scan:', error);
      throw error;
    }
  }, [scans, saveToStorage]);

  // Delete a scan
  const deleteScan = useCallback(async (id: string) => {
    try {
      const updatedScans = scans.filter(scan => scan.id !== id);
      await saveToStorage(updatedScans);
    } catch (error) {
      console.error('Error deleting scan:', error);
      throw error;
    }
  }, [scans, saveToStorage]);

  // Edit restaurant name
  const editScanName = useCallback(async (id: string, name: string) => {
    try {
      const updatedScans = scans.map(scan =>
        scan.id === id ? { ...scan, restaurantName: name } : scan
      );
      await saveToStorage(updatedScans);
    } catch (error) {
      console.error('Error editing scan name:', error);
      throw error;
    }
  }, [scans, saveToStorage]);

  // Toggle pin status
  const togglePin = useCallback(async (id: string) => {
    try {
      const updatedScans = scans.map(scan =>
        scan.id === id ? { ...scan, isPinned: !scan.isPinned } : scan
      );
      await saveToStorage(updatedScans);
    } catch (error) {
      console.error('Error toggling pin:', error);
      throw error;
    }
  }, [scans, saveToStorage]);

  // Get a specific scan
  const getScan = useCallback((id: string) => {
    return scans.find(scan => scan.id === id);
  }, [scans]);

  // Load scans on mount
  useEffect(() => {
    loadScans();
  }, [loadScans]);

  return {
    scans,
    isLoading,
    saveScan,
    deleteScan,
    editScanName,
    togglePin,
    getScan,
    refresh: loadScans
  };
};