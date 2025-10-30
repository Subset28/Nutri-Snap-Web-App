import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock } from 'lucide-react';

interface MealChooserProps {
  selectedMeal: string;
  onMealChange: (meal: string) => void;
}

const MEAL_OPTIONS = [
  { id: 'any', label: 'Any Meal' },
  { id: 'breakfast', label: 'Breakfast' },
  { id: 'brunch', label: 'Brunch' },
  { id: 'lunch', label: 'Lunch' },
  { id: 'dinner', label: 'Dinner' },
  { id: 'snack', label: 'Snack/Appetizer' },
  { id: 'dessert', label: 'Dessert' }
];

const MealChooser: React.FC<MealChooserProps> = ({ selectedMeal, onMealChange }) => {
  return (
    <Card className="border-blue-200">
      <CardHeader>
        <CardTitle className="text-blue-800 flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Meal Type
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Select value={selectedMeal} onValueChange={onMealChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select meal type" />
          </SelectTrigger>
          <SelectContent>
            {MEAL_OPTIONS.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-blue-600 mt-2">
          Choose the meal type to get appropriate recommendations for that time of day
        </p>
      </CardContent>
    </Card>
  );
};

export default MealChooser;