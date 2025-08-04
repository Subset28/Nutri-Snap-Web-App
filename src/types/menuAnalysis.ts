export interface MenuAnalysis {
  recommendations: Array<{
    dish: string;
    reason: string;
    modification?: string;
    nutrition?: Record<string, string>;
    rank: number;
  }>;
  flaggedItems: Array<{
    dish: string;
    warning: string;
    allergens: string[];
    reason: string;
  }>;
  generalNotes?: string;
}