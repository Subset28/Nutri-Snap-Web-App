
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AlertTriangle } from 'lucide-react';

interface DietaryPreferencesProps {
  preferences: string[];
  allergies: string[];
  safetyMode: boolean;
  onPreferencesChange: (preferences: string[]) => void;
  onAllergiesChange: (allergies: string[]) => void;
  onSafetyModeChange: (enabled: boolean) => void;
}

const DIETARY_OPTIONS = [
  { id: 'vegan', label: 'Vegan' },
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'keto', label: 'Keto' },
  { id: 'gluten-free', label: 'Gluten-Free' },
  { id: 'dairy-free', label: 'Dairy-Free' },
  { id: 'low-carb', label: 'Low-Carb' },
  { id: 'low-sodium', label: 'Low-Sodium' },
  { id: 'high-protein', label: 'High-Protein' },
  { id: 'low-calorie', label: 'Low-Calorie' }
];

const ALLERGY_OPTIONS = [
  { id: 'pork', label: 'Pork' },
  { id: 'beef', label: 'Beef' },
  { id: 'nuts', label: 'Tree Nuts' },
  { id: 'peanuts', label: 'Peanuts' },
  { id: 'dairy', label: 'Dairy/Milk' },
  { id: 'eggs', label: 'Eggs' },
  { id: 'shellfish', label: 'Shellfish' },
  { id: 'fish', label: 'Fish' },
  { id: 'soy', label: 'Soy' },
  { id: 'wheat', label: 'Wheat/Gluten' },
  { id: 'sesame', label: 'Sesame' }
];

const DietaryPreferences: React.FC<DietaryPreferencesProps> = ({ 
  preferences, 
  allergies, 
  safetyMode,
  onPreferencesChange, 
  onAllergiesChange,
  onSafetyModeChange
}) => {
  const handlePreferenceChange = (preferenceId: string, checked: boolean) => {
    if (checked) {
      onPreferencesChange([...preferences, preferenceId]);
    } else {
      onPreferencesChange(preferences.filter(p => p !== preferenceId));
    }
  };

  const handleAllergyChange = (allergyId: string, checked: boolean) => {
    if (checked) {
      onAllergiesChange([...allergies, allergyId]);
    } else {
      onAllergiesChange(allergies.filter(a => a !== allergyId));
    }
  };

  return (
    <div className="space-y-6">
      {/* Safety Mode Toggle */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <h3 className="text-lg font-semibold text-red-800">Safety Mode</h3>
          </div>
          <Switch
            checked={safetyMode}
            onCheckedChange={onSafetyModeChange}
          />
        </div>
        <p className="text-sm text-red-700">
          When enabled, prioritizes avoiding allergens over nutritional ranking and provides detailed allergy warnings.
        </p>
      </div>

      {/* Allergies Section */}
      <div>
        <h3 className="text-lg font-semibold text-red-800 mb-3 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Food Allergies & Intolerances
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {ALLERGY_OPTIONS.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <Checkbox
                id={`allergy-${option.id}`}
                checked={allergies.includes(option.id)}
                onCheckedChange={(checked) => handleAllergyChange(option.id, checked as boolean)}
              />
              <Label htmlFor={`allergy-${option.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {option.label}
              </Label>
            </div>
          ))}
        </div>
        {allergies.length > 0 && (
          <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
            <p className="text-sm text-red-700">
              <strong>Avoiding:</strong> {allergies.map(a => ALLERGY_OPTIONS.find(o => o.id === a)?.label).join(', ')}
            </p>
          </div>
        )}
      </div>

      {/* Dietary Preferences */}
      <div>
        <h3 className="text-lg font-semibold text-green-800 mb-3">Dietary Preferences</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {DIETARY_OPTIONS.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <Checkbox
                id={option.id}
                checked={preferences.includes(option.id)}
                onCheckedChange={(checked) => handlePreferenceChange(option.id, checked as boolean)}
              />
              <Label htmlFor={option.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {option.label}
              </Label>
            </div>
          ))}
        </div>
        {preferences.length > 0 && (
          <div className="mt-3 p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-green-700">
              <strong>Selected:</strong> {preferences.map(p => DIETARY_OPTIONS.find(o => o.id === p)?.label).join(', ')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DietaryPreferences;
