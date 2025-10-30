export interface SavedScan {
  id: string;
  imageData: string; // base64 string
  analysis: any; // OpenAI analysis result
  restaurantName?: string;
  timestamp: string; // ISO string
  userPrefs: {
    allergies: string[];
    diet: string[];
    safetyMode: boolean;
  };
  isPinned?: boolean; // Optional bonus feature
}

export interface SavedScansStorage {
  scans: SavedScan[];
}