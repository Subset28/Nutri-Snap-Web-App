
import React from 'react';
import { Shield } from 'lucide-react';

interface AppHeaderProps {
  safetyMode: boolean;
}

const AppHeader: React.FC<AppHeaderProps> = ({ safetyMode }) => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold text-green-800 mb-2">NutriSnap</h1>
      <p className="text-green-600 text-lg">Safe menu choices for food allergies & dietary needs</p>
      {safetyMode && (
        <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-red-100 border border-red-200 rounded-full">
          <Shield className="h-4 w-4 text-red-600" />
          <span className="text-sm font-medium text-red-700">Safety Mode Active</span>
        </div>
      )}
    </div>
  );
};

export default AppHeader;
