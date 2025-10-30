import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSavedScans } from '@/hooks/useSavedScans';
import { SavedScan } from '@/types/savedScan';
import { Trash2, Edit3, Pin, PinOff, Clock, Shield, ArrowLeft } from 'lucide-react';
import MenuAnalysis from './MenuAnalysis';
import { useToast } from '@/hooks/use-toast';

interface SavedScansProps {
  onBack: () => void;
}

const SavedScans: React.FC<SavedScansProps> = ({ onBack }) => {
  const { scans, isLoading, deleteScan, editScanName, togglePin } = useSavedScans();
  const { toast } = useToast();
  const [selectedScan, setSelectedScan] = useState<SavedScan | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleDelete = async (id: string) => {
    try {
      await deleteScan(id);
      toast({
        title: "Scan deleted",
        description: "The saved scan has been removed."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete scan. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEditName = async (id: string) => {
    try {
      await editScanName(id, editName.trim());
      setEditingId(null);
      setEditName('');
      toast({
        title: "Name updated",
        description: "Restaurant name has been updated."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update name. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleTogglePin = async (id: string) => {
    try {
      await togglePin(id);
      const scan = scans.find(s => s.id === id);
      toast({
        title: scan?.isPinned ? "Scan unpinned" : "Scan pinned",
        description: scan?.isPinned 
          ? "Scan can now be auto-deleted when limit is reached." 
          : "Scan is now protected from auto-deletion."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update pin status. Please try again.",
        variant: "destructive"
      });
    }
  };

  const startEditing = (scan: SavedScan) => {
    setEditingId(scan.id);
    setEditName(scan.restaurantName || '');
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditName('');
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Saved Scans</h1>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-muted rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Saved Scans</h1>
        <Badge variant="secondary">{scans.length}/10</Badge>
      </div>

      {scans.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <Clock className="h-12 w-12 mx-auto mb-2" />
              <p className="text-lg font-medium mb-1">No saved scans yet</p>
              <p className="text-sm">Your scanned menus will appear here for easy access</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {scans.map((scan) => (
            <Card key={scan.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {/* Thumbnail */}
                  <div 
                    className="w-16 h-16 bg-muted rounded overflow-hidden cursor-pointer flex-shrink-0"
                    onClick={() => setSelectedScan(scan)}
                  >
                    <img 
                      src={scan.imageData} 
                      alt="Menu thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        {editingId === scan.id ? (
                          <div className="flex gap-2 mb-2">
                            <Input
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              placeholder="Restaurant name"
                              className="h-8 text-sm"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleEditName(scan.id);
                                if (e.key === 'Escape') cancelEditing();
                              }}
                              autoFocus
                            />
                            <Button size="sm" onClick={() => handleEditName(scan.id)}>
                              Save
                            </Button>
                            <Button size="sm" variant="ghost" onClick={cancelEditing}>
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 mb-1">
                            <h3 
                              className="font-medium text-sm truncate cursor-pointer hover:text-primary"
                              onClick={() => setSelectedScan(scan)}
                            >
                              {scan.restaurantName || 'Unnamed Restaurant'}
                            </h3>
                            {scan.isPinned && (
                              <Pin className="h-3 w-3 text-primary flex-shrink-0" />
                            )}
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                          <Clock className="h-3 w-3" />
                          <span>{formatTimestamp(scan.timestamp)}</span>
                          {scan.userPrefs.safetyMode && (
                            <Badge variant="secondary" className="text-xs">
                              <Shield className="h-2 w-2 mr-1" />
                              Safety Mode
                            </Badge>
                          )}
                        </div>

                        {/* User preferences */}
                        <div className="flex flex-wrap gap-1">
                          {scan.userPrefs.allergies.map((allergy) => (
                            <Badge key={allergy} variant="outline" className="text-xs">
                              {allergy}
                            </Badge>
                          ))}
                          {scan.userPrefs.diet.map((diet) => (
                            <Badge key={diet} variant="outline" className="text-xs">
                              {diet}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-1 flex-shrink-0">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => startEditing(scan)}
                          disabled={editingId === scan.id}
                        >
                          <Edit3 className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleTogglePin(scan.id)}
                        >
                          {scan.isPinned ? (
                            <PinOff className="h-3 w-3" />
                          ) : (
                            <Pin className="h-3 w-3" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(scan.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Scan Detail Modal */}
      <Dialog open={!!selectedScan} onOpenChange={() => setSelectedScan(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedScan?.restaurantName || 'Menu Analysis'}
              {selectedScan?.isPinned && (
                <Pin className="h-4 w-4 text-primary" />
              )}
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              Scanned on {selectedScan ? formatTimestamp(selectedScan.timestamp) : ''}
            </p>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Menu Image */}
            <div className="border rounded-lg overflow-hidden">
              <img 
                src={selectedScan?.imageData} 
                alt="Menu"
                className="w-full h-auto max-h-96 object-contain"
              />
            </div>

            {/* Analysis */}
            {selectedScan && (
              <MenuAnalysis 
                analysis={selectedScan.analysis}
                isLoading={false}
                safetyMode={selectedScan.userPrefs.safetyMode}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SavedScans;