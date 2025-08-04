
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, AlertTriangle, Shield, Utensils, Info } from 'lucide-react';
import { NutritionDisclaimer } from './NutritionDisclaimer';

interface MenuAnalysisProps {
  analysis: any;
  isLoading: boolean;
  safetyMode: boolean;
}

const MenuAnalysis: React.FC<MenuAnalysisProps> = React.memo(({ analysis, isLoading, safetyMode }) => {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800">Analyzing Menu...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-green-100 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-green-50 rounded w-full mb-1"></div>
                  <div className="h-3 bg-green-50 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="space-y-6">
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Safe & Healthy Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Utensils className="h-12 w-12 mx-auto mb-2" aria-hidden="true" />
              <p>Upload a menu photo or PDF to get personalized safe and healthy recommendations</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getRankColor = (rank: number) => {
    if (rank >= 8) return 'bg-green-600';
    if (rank >= 6) return 'bg-yellow-600';
    return 'bg-orange-600';
  };

  const getRankLabel = (rank: number) => {
    if (rank >= 8) return 'Excellent';
    if (rank >= 6) return 'Good';
    return 'Fair';
  };

  // Memoize recommendations rendering
  const recommendationsList = useMemo(() => (
    analysis.recommendations && analysis.recommendations.length > 0 ? (
      <div className="space-y-4">
        {analysis.recommendations.map((item: any, index: number) => (
          <div key={index} className="border-l-4 border-green-500 pl-4 py-3 bg-green-50 rounded-r-lg">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-green-800">{item.dish}</h3>
              <div className="flex gap-2">
                {item.rank && (
                  <Badge className={getRankColor(item.rank) + ' text-white text-xs'}>
                    {getRankLabel(item.rank)} ({item.rank}/10)
                  </Badge>
                )}
                <Badge className="bg-green-600 text-white">#{index + 1}</Badge>
              </div>
            </div>
            <p className="text-sm text-green-700 mb-2">{item.reason}</p>
            {item.modification && (
              <div className="bg-blue-50 border border-blue-200 rounded p-2 mt-2">
                <p className="text-sm text-blue-800 flex items-start gap-2">
                  <Info className="h-4 w-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <span><strong>Suggested Modification:</strong> {item.modification}</span>
                </p>
              </div>
            )}
            {item.nutrition && (
              <div className="mt-3 p-3 bg-white rounded border border-green-200">
                <h4 className="text-sm font-medium text-green-800 mb-2 flex items-center gap-1">
                  <Utensils className="h-3 w-3" aria-hidden="true" />
                  Nutritional Estimates
                </h4>
                <div className="flex flex-wrap gap-1">
                  {Object.entries(item.nutrition).map(([key, value]) => (
                    <Badge key={key} variant="outline" className="text-xs">
                      {key.replace('_', ' ')}: {String(value)}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-8">
        <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-orange-400" aria-hidden="true" />
        <p className="text-gray-600">No completely safe options found on this menu.</p>
        <p className="text-sm text-gray-500 mt-2">Consider asking restaurant staff about ingredient modifications.</p>
      </div>
    )
  ), [analysis.recommendations]);

  // Memoize flagged items rendering
  const flaggedItemsList = useMemo(() => (
    analysis.flaggedItems && analysis.flaggedItems.length > 0 && (
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-800 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" aria-hidden="true" />
            ⚠️ Items to Avoid
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analysis.flaggedItems.map((item: any, index: number) => (
              <div key={index} className="border-l-4 border-red-500 pl-4 py-3 bg-red-50 rounded-r-lg">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-red-800">{item.dish}</h3>
                  <Badge className="bg-red-600 text-white">AVOID</Badge>
                </div>
                <div className="bg-red-100 border border-red-200 rounded p-2 mb-2">
                  <p className="text-sm text-red-800 font-medium">
                    <strong>⚠️ Warning:</strong> {item.warning}
                  </p>
                </div>
                {item.allergens && item.allergens.length > 0 && (
                  <div className="mb-2 flex flex-wrap gap-1">
                    {item.allergens.map((allergen: string, idx: number) => (
                      <Badge key={idx} className="bg-red-600 text-white text-xs">
                        {allergen}
                      </Badge>
                    ))}
                  </div>
                )}
                <p className="text-sm text-red-700">{item.reason}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  ), [analysis.flaggedItems]);

  return (
    <div className="space-y-6" aria-live="polite">
      {/* Safe Recommendations */}
      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800 flex items-center gap-2">
            <Shield className="h-5 w-5" aria-hidden="true" />
            Safe & Healthy Choices
            {safetyMode && (
              <Badge className="bg-green-600 text-white text-xs">
                Safety Mode
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recommendationsList}
        </CardContent>
      </Card>
      {/* Flagged Items */}
      {flaggedItemsList}
      {/* General Notes */}
      {analysis.generalNotes && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
            <Star className="h-4 w-4" />
            General Safety Notes
          </h4>
          <p className="text-sm text-blue-700">{analysis.generalNotes}</p>
        </div>
      )}
      {/* Nutrition Disclaimer */}
      <NutritionDisclaimer />
    </div>
  );
});

export default MenuAnalysis;
