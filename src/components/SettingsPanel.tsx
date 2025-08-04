
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DietaryPreferences from "@/components/DietaryPreferences";

interface SettingsPanelProps {
  apiKey: string;
  dietaryPrefs: string[];
  allergies: string[];
  safetyMode: boolean;
  onApiKeyChange: (value: string) => void;
  onDietaryPrefsChange: (prefs: string[]) => void;
  onAllergiesChange: (allergies: string[]) => void;
  onSafetyModeChange: (enabled: boolean) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  apiKey,
  dietaryPrefs,
  allergies,
  safetyMode,
  onApiKeyChange,
  onDietaryPrefsChange,
  onAllergiesChange,
  onSafetyModeChange
}) => {
  return (
    <Card className="mb-6 border-green-200">
      <CardHeader>
        <CardTitle className="text-green-800">Settings & Safety Preferences</CardTitle>
        <CardDescription>Configure your dietary preferences, allergies, and safety settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="api-key">OpenAI API Key</Label>
          <Input
            id="api-key"
            type="password"
            placeholder="Enter your OpenAI API key"
            value={apiKey}
            onChange={(e) => onApiKeyChange(e.target.value)}
            className="mt-1"
          />
          <p className="text-sm text-gray-500 mt-1">
            Your API key is stored locally and never sent to our servers
          </p>
        </div>
        
        <DietaryPreferences
          preferences={dietaryPrefs}
          allergies={allergies}
          safetyMode={safetyMode}
          onPreferencesChange={onDietaryPrefsChange}
          onAllergiesChange={onAllergiesChange}
          onSafetyModeChange={onSafetyModeChange}
        />
        <div className="mt-8 text-center text-sm text-gray-500">
          Need help? <a href="mailto:support@orbconcepts.com" className="text-green-700 underline">Contact Support</a>
        </div>
        <div className="mt-2 text-center text-sm text-gray-500">
          <a href="https://orbconcepts.com/privacy-policy/" target="_blank" rel="noopener noreferrer" className="text-green-700 underline">Privacy Policy</a>
        </div>
      </CardContent>
    </Card>
  );
};

export default SettingsPanel;
