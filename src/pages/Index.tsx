
import React from 'react';
import { Settings, History } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import AppHeader from "@/components/AppHeader";
import SettingsPanel from "@/components/SettingsPanel";
import MenuUpload from "@/components/MenuUpload";
import MenuAnalysis from "@/components/MenuAnalysis";
import MealChooser from "@/components/MealChooser";
import SavedScans from "@/components/SavedScans";
import { analyzeMenu } from "@/utils/openaiService";
import { useNutriSnapState } from "@/hooks/useNutriSnapState";
import { useSavedScans } from "@/hooks/useSavedScans";
import { SavedScan } from "@/types/savedScan";
import { fileToBase64 } from "@/utils/openaiService";
import { useState } from "react";
import { NutritionDisclaimer } from "@/components/NutritionDisclaimer";

const Index = () => {
  const [currentView, setCurrentView] = useState<'main' | 'saved'>('main');
  const [isSaving, setIsSaving] = useState(false);

  const {
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
  } = useNutriSnapState();

  const { saveScan } = useSavedScans();
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('File selected:', file.name, 'Type:', file.type, 'Size:', file.size);
      
      // Check if file is PDF or image
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Unsupported file type",
          description: "Please select an image (JPG, PNG, GIF, WebP) or PDF file",
          variant: "destructive"
        });
        return;
      }

      if (file.size > 10 * 1024 * 1024) { // 10MB limit for PDFs
        toast({
          title: "File too large",
          description: "Please select a file smaller than 10MB",
          variant: "destructive"
        });
        return;
      }
      
      setImageFile(file);
      setAnalysis(null);

      try {
        if (file.type === 'application/pdf') {
          // Show PDF indicator - actual processing happens in OpenAI service
          setSelectedImage('data:application/pdf;base64,PDF_PLACEHOLDER');
          
          toast({
            title: "PDF ready",
            description: "PDF selected and ready for analysis"
          });
        } else {
          // Handle regular image files
          const reader = new FileReader();
          reader.onload = (e) => {
            const result = e.target?.result;
            if (typeof result === 'string') {
              setSelectedImage(result);
              console.log('File converted to data URL successfully');
            }
          };
          reader.onerror = (error) => {
            console.error('Error reading file:', error);
            toast({
              title: "File read error",
              description: "Failed to read the selected file",
              variant: "destructive"
            });
          };
          reader.readAsDataURL(file);
        }
      } catch (error) {
        console.error('Error processing file:', error);
        toast({
          title: "File processing error",
          description: error instanceof Error ? error.message : "Failed to process the selected file",
          variant: "destructive"
        });
      }
    }
  };

  const handleCameraCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Camera capture triggered');
    handleFileUpload(event);
  };

  const handleAnalyzeMenu = async () => {
    console.log('Analyze menu clicked. API Key present:', !!apiKey, 'Image file present:', !!imageFile);
    
    if (!imageFile) {
      toast({
        title: "No menu uploaded",
        description: "Please select an image or PDF of a menu to analyze.",
        variant: "destructive"
      });
      return;
    }

    if (!apiKey) {
      toast({
        title: "OpenAI API Key Required",
        description: "Please enter your OpenAI API key in Settings to analyze the menu.",
        variant: "destructive",
        style: { marginTop: '3.5rem' } // 56px, adjust as needed for notch
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      console.log('Starting analysis with dietary prefs:', dietaryPrefs, 'allergies:', allergies, 'safety mode:', safetyMode, 'meal:', selectedMeal);
      const result = await analyzeMenu(imageFile, apiKey, dietaryPrefs, allergies, safetyMode, selectedMeal);
      console.log('Analysis completed successfully:', result);
      setAnalysis(result);
      toast({
        title: "Analysis complete!",
        description: safetyMode 
          ? "Menu analyzed with enhanced safety protocols" 
          : "Your menu has been analyzed successfully"
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "Please check your API key and try again",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveScan = async () => {
    if (!analysis || !imageFile || !selectedImage) {
      toast({
        title: "Nothing to save",
        description: "Please analyze a menu first before saving.",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      let imageData: string;
      
      // Convert the file to base64 if it's not already
      if (selectedImage.startsWith('data:application/pdf')) {
        // For PDFs, we need to convert the file to base64
        imageData = await fileToBase64(imageFile);
      } else {
        // For images, use the already converted data
        imageData = selectedImage;
      }

      const savedScan: SavedScan = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        imageData,
        analysis,
        timestamp: new Date().toISOString(),
        userPrefs: {
          allergies,
          diet: dietaryPrefs,
          safetyMode
        }
      };

      await saveScan(savedScan);
      toast({
        title: "Scan saved!",
        description: "Your menu analysis has been saved for later viewing."
      });
    } catch (error) {
      console.error('Error saving scan:', error);
      toast({
        title: "Save failed",
        description: "Failed to save the scan. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Only require an image to enable the button
  const canAnalyze = Boolean(selectedImage);
  const canSave = Boolean(analysis && selectedImage);

  if (currentView === 'saved') {
    return (
      <div className="relative min-h-screen">
        {/* Top padding for notch, with matching background and dynamic height */}
        <div
          className="w-full bg-green-50"
          style={{ height: 'calc(env(safe-area-inset-top, 50px) + 2.5rem)' }}
        />
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-6 md:p-10">
          <div className="w-full">
            <SavedScans onBack={() => setCurrentView('main')} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Top padding for notch, with matching background and dynamic height */}
      <div
        className="w-full bg-green-50"
        style={{ height: 'calc(env(safe-area-inset-top, 50px) + 2.5rem)' }}
      />
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-6 md:p-10">
        <div className="w-full">
          <header className="mb-10">
        <AppHeader safetyMode={safetyMode} />
          </header>
          <main>
            {/* Settings Toggle and Panel */}
            <div className="mb-10">
        <div className="flex justify-between mb-6">
          <Button
            variant="outline"
            onClick={() => setCurrentView('saved')}
            className="flex items-center gap-2 h-12 text-base hover:shadow-xl"
          >
            <History className="h-6 w-6" />
            Saved Scans
          </Button>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center gap-2 h-12 text-base hover:shadow-xl"
            >
              <Settings className="h-6 w-6" />
              Settings
            </Button>
          </div>
        </div>
        {showSettings && (
                <div className="rounded-2xl shadow-lg bg-white w-full">
          <SettingsPanel
            apiKey={apiKey}
            dietaryPrefs={dietaryPrefs}
            allergies={allergies}
            safetyMode={safetyMode}
            onApiKeyChange={handleApiKeyChange}
            onDietaryPrefsChange={handleDietaryPrefsChange}
            onAllergiesChange={handleAllergiesChange}
            onSafetyModeChange={handleSafetyModeChange}
          />
                </div>
        )}
            </div>
        {/* Meal Chooser */}
            <div className="mb-10">
              <div className="rounded-2xl shadow-lg bg-white w-full">
        <MealChooser 
          selectedMeal={selectedMeal}
          onMealChange={handleMealChange}
        />
              </div>
            </div>
            {/* Upload Section */}
            <div className="mb-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 w-full">
                <div className="h-full p-8 rounded-2xl shadow-lg bg-white hover:shadow-xl transition-shadow w-full">
          <MenuUpload
            selectedImage={selectedImage}
            isAnalyzing={isAnalyzing}
            canAnalyze={canAnalyze}
            onFileUpload={handleFileUpload}
            onCameraCapture={handleCameraCapture}
            onAnalyzeMenu={handleAnalyzeMenu}
            canSave={canSave}
            isSaving={isSaving}
            onSaveScan={handleSaveScan}
          />
                </div>
                <div className="h-full p-8 rounded-2xl shadow-lg bg-white hover:shadow-xl transition-shadow w-full">
          <MenuAnalysis 
            analysis={analysis} 
            isLoading={isAnalyzing} 
            safetyMode={safetyMode} 
          />
                </div>
              </div>
              {/* Nutrition Disclaimer - Moved here to be more prominent */}
              <div className="mt-6">
                <NutritionDisclaimer />
              </div>
            </div>
          </main>
          {/* <AdBanner /> */}
        </div>
      </div>
    </div>
  );
};

export default Index;
