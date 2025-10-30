import { Info } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function NutritionDisclaimer() {
  return (
    <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r">
      <div className="flex items-start">
        <Info className="h-5 w-5 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
        <div>
          <p className="text-sm text-yellow-700">
            <strong>Note:</strong> Nutritional information is estimated using AI and may not be 100% accurate. 
            Always verify with the restaurant or a healthcare professional for dietary needs.
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="link" className="h-auto p-0 text-yellow-700 hover:text-yellow-800 text-sm">
                Learn more about our data sources
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>About Our Nutritional Information</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 text-sm">
                <p>
                  The nutritional information provided in this app is generated using artificial intelligence (AI) based on 
                  menu item descriptions. It should be considered an estimate only.
                </p>
                
                <h3 className="font-semibold">Data Sources</h3>
                <p>Our AI is trained on data from these authoritative sources:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <a 
                      href="https://fdc.nal.usda.gov/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      USDA FoodData Central
                    </a> - For general nutritional information
                  </li>
                  <li>
                    <a 
                      href="https://www.fda.gov/food/food-labeling-nutrition" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      FDA Food Labeling & Nutrition
                    </a> - For dietary guidelines
                  </li>
                  <li>
                    <a 
                      href="https://www.who.int/health-topics/nutrition" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      World Health Organization - Nutrition
                    </a> - For international nutrition standards
                  </li>
                </ul>

                <div className="p-4 bg-gray-50 rounded text-xs">
                  <h4 className="font-semibold mb-2">Important Disclaimer</h4>
                  <p>
                    The information provided by this app is for general informational purposes only and is not intended 
                    as medical advice. Always seek the advice of your physician or other qualified health provider with 
                    any questions you may have regarding a medical condition or dietary needs.
                  </p>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-2"
                  onClick={() => {
                    window.location.href = "mailto:support@orbconcepts.com?subject=Nutritional Information Inaccuracy";
                  }}
                >
                  Report Inaccuracy
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
