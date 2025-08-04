
import { useState } from 'react';
import { MenuAnalysis } from '../types/menuAnalysis';

export const useNutriSnapState = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('nutrisnap_api_key') || '';
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<MenuAnalysis | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [dietaryPrefs, setDietaryPrefs] = useState<string[]>(() => {
    const saved = localStorage.getItem('nutrisnap_dietary_prefs');
    return saved ? JSON.parse(saved) : [];
  });
  const [allergies, setAllergies] = useState<string[]>(() => {
    const saved = localStorage.getItem('nutrisnap_allergies');
    return saved ? JSON.parse(saved) : [];
  });
  const [safetyMode, setSafetyMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('nutrisnap_safety_mode');
    return saved ? JSON.parse(saved) : false;
  });
  const [selectedMeal, setSelectedMeal] = useState<string>(() => {
    return localStorage.getItem('nutrisnap_selected_meal') || 'any';
  });

  const handleApiKeyChange = (value: string) => {
    setApiKey(value);
    localStorage.setItem('nutrisnap_api_key', value);
  };

  const handleDietaryPrefsChange = (prefs: string[]) => {
    setDietaryPrefs(prefs);
    localStorage.setItem('nutrisnap_dietary_prefs', JSON.stringify(prefs));
  };

  const handleAllergiesChange = (allergiesList: string[]) => {
    setAllergies(allergiesList);
    localStorage.setItem('nutrisnap_allergies', JSON.stringify(allergiesList));
  };

  const handleSafetyModeChange = (enabled: boolean) => {
    setSafetyMode(enabled);
    localStorage.setItem('nutrisnap_safety_mode', JSON.stringify(enabled));
  };

  const handleMealChange = (meal: string) => {
    setSelectedMeal(meal);
    localStorage.setItem('nutrisnap_selected_meal', meal);
  };

  return {
    selectedImage,
    setSelectedImage,
    imageFile,
    setImageFile,
    apiKey,
    isAnalyzing,
    setIsAnalyzing,
    analysis,
    setAnalysis,
    showSettings,
    setShowSettings,
    dietaryPrefs,
    allergies,
    safetyMode,
    selectedMeal,
    handleApiKeyChange,
    handleDietaryPrefsChange,
    handleAllergiesChange,
    handleSafetyModeChange,
    handleMealChange
  };
};
