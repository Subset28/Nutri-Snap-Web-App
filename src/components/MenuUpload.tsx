
import React, { useRef } from 'react';
import { Camera, Upload, Search, FileText, Save } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface MenuUploadProps {
  selectedImage: string | null;
  isAnalyzing: boolean;
  canAnalyze: boolean;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCameraCapture: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAnalyzeMenu: () => void;
  // New props for save functionality
  canSave?: boolean;
  isSaving?: boolean;
  onSaveScan?: () => void;
}

const MenuUpload: React.FC<MenuUploadProps> = React.memo(({
  selectedImage,
  isAnalyzing,
  canAnalyze,
  onFileUpload,
  onCameraCapture,
  onAnalyzeMenu,
  // New props for save functionality
  canSave = false,
  isSaving = false,
  onSaveScan
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const isPDF = selectedImage?.startsWith('data:application/pdf;base64,');

  const handleCameraClick = () => {
    console.log('Camera button clicked');
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  const handleFileClick = () => {
    console.log('File upload button clicked');
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Card className="border-green-200">
      <CardHeader>
        <CardTitle className="text-green-800 flex items-center gap-2">
          <Camera className="h-5 w-5" aria-hidden="true" />
          Upload Menu Photo or PDF
        </CardTitle>
        <CardDescription>
          Take a photo, upload an image, or select a PDF of a restaurant menu for AI-powered safety analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {selectedImage && (
            <div className="relative">
              {isPDF ? (
                <div className="w-full h-64 bg-gray-100 rounded-lg border-2 border-green-200 flex items-center justify-center">
                  <div className="text-center">
                    <FileText className="h-16 w-16 text-green-600 mx-auto mb-2" aria-hidden="true" />
                    <p className="text-green-700 font-medium">PDF Menu Ready</p>
                    <p className="text-sm text-gray-600">PDF ready for text analysis</p>
                  </div>
                </div>
              ) : (
                <img
                  src={selectedImage}
                  alt="Uploaded menu preview"
                  className="w-full h-64 object-cover rounded-lg border-2 border-green-200"
                  loading="lazy"
                  width={512}
                  height={256}
                  aria-label="Uploaded menu preview"
                />
              )}
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleCameraClick}
              className="flex-1 bg-green-600 hover:bg-green-700"
              aria-label="Take photo with camera"
            >
              <Camera className="h-4 w-4 mr-2" />
              Take Photo
            </Button>
            
            <Button
              onClick={handleFileClick}
              variant="outline"
              className="flex-1 border-green-300 text-green-700 hover:bg-green-50"
              aria-label="Upload file from device"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload File
            </Button>
          </div>
          
          <Button
            onClick={onAnalyzeMenu}
            disabled={!canAnalyze || isAnalyzing}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
          >
            {isAnalyzing ? (
              "Analyzing Menu with AI..."
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Analyze Menu with AI
              </>
            )}
          </Button>

          {/* Save Scan Button */}
          {onSaveScan && canSave && (
            <Button
              onClick={onSaveScan}
              disabled={isSaving}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-50"
            >
              {isSaving ? (
                "Saving Scan..."
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Scan
                </>
              )}
            </Button>
          )}
        </div>
        
        {/* File upload input for general files */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,application/pdf"
          onChange={onFileUpload}
          className="hidden"
        />
        
        {/* Camera input specifically for mobile camera capture */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={onCameraCapture}
          className="hidden"
        />
      </CardContent>
    </Card>
  );
});

export default MenuUpload;
