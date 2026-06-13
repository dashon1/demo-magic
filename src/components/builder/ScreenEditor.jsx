import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Upload, Plus, X, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ScreenEditor({ 
  demo, 
  selectedScreen, 
  onScreenSelect, 
  onImageUpload, 
  isUploading,
  updateDemo 
}) {
  const fileInputRef = React.useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const removeScreen = (screenId) => {
    const updatedScreens = demo.screens.filter(screen => screen.id !== screenId);
    updateDemo({ ...demo, screens: updatedScreens });
    
    if (selectedScreen?.id === screenId) {
      onScreenSelect(updatedScreens[0] || null);
    }
  };

  const updateScreenTitle = (screenId, title) => {
    const updatedScreens = demo.screens.map(screen => 
      screen.id === screenId ? { ...screen, title } : screen
    );
    updateDemo({ ...demo, screens: updatedScreens });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center justify-between">
            Demo Screens
            <Badge variant="outline" className="text-xs">
              {demo.screens?.length || 0}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <Button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full mb-4"
            variant="outline"
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2" />
                Uploading...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Add New Screen
              </>
            )}
          </Button>

          <div className="space-y-3">
            <AnimatePresence>
              {demo.screens?.map((screen, index) => (
                <motion.div
                  key={screen.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedScreen?.id === screen.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  onClick={() => onScreenSelect(screen)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                      {screen.image_url ? (
                        <img 
                          src={screen.image_url} 
                          alt={screen.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-5 h-5 text-slate-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Input
                        value={screen.title}
                        onChange={(e) => updateScreenTitle(screen.id, e.target.value)}
                        className="text-sm border-none p-0 h-auto bg-transparent focus:bg-white focus:border focus:border-blue-300 rounded"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          Screen {index + 1}
                        </Badge>
                        {screen.hotspots?.length > 0 && (
                          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                            {screen.hotspots.length} hotspots
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeScreen(screen.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {demo.screens?.length === 0 && (
              <div className="text-center py-8">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-500">
                  No screens added yet
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}