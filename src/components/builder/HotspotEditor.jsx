import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MousePointer, X, MessageCircle, Square, Eye } from "lucide-react";
import { motion } from "framer-motion";

const hotspotTypes = [
  { value: "tooltip", label: "Tooltip", icon: MessageCircle },
  { value: "modal", label: "Modal", icon: Square },
  { value: "highlight", label: "Highlight", icon: Eye }
];

export default function HotspotEditor({ 
  selectedScreen, 
  selectedHotspot, 
  onHotspotSelect, 
  updateDemo,
  demo 
}) {
  const updateHotspot = (hotspotId, updates) => {
    if (!selectedScreen) return;

    const updatedScreens = demo.screens.map(screen => 
      screen.id === selectedScreen.id
        ? {
            ...screen,
            hotspots: screen.hotspots?.map(hotspot =>
              hotspot.id === hotspotId ? { ...hotspot, ...updates } : hotspot
            ) || []
          }
        : screen
    );

    updateDemo({ ...demo, screens: updatedScreens });
  };

  const removeHotspot = (hotspotId) => {
    if (!selectedScreen) return;

    const updatedScreens = demo.screens.map(screen => 
      screen.id === selectedScreen.id
        ? {
            ...screen,
            hotspots: screen.hotspots?.filter(hotspot => hotspot.id !== hotspotId) || []
          }
        : screen
    );

    updateDemo({ ...demo, screens: updatedScreens });
    onHotspotSelect(null);
  };

  if (!selectedScreen) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <MousePointer className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm text-slate-500">
            Select a screen to manage hotspots
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center justify-between">
            Hotspots
            <Badge variant="outline" className="text-xs">
              {selectedScreen.hotspots?.length || 0}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedScreen.hotspots?.length === 0 ? (
            <div className="text-center py-6">
              <MousePointer className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm text-slate-500 mb-2">
                No hotspots on this screen
              </p>
              <p className="text-xs text-slate-400">
                Click on the screen to add interactive points
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {selectedScreen.hotspots.map((hotspot, index) => (
                <motion.div
                  key={hotspot.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 group ${
                    selectedHotspot?.id === hotspot.id 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  onClick={() => onHotspotSelect(hotspot)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        selectedHotspot?.id === hotspot.id ? 'bg-purple-500' : 'bg-blue-500'
                      }`}>
                        <span className="text-white text-xs font-semibold">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-900">
                          {hotspot.title}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {hotspot.type}
                          </Badge>
                          <span className="text-xs text-slate-400">
                            {Math.round(hotspot.x)}%, {Math.round(hotspot.y)}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeHotspot(hotspot.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Hotspot Editor */}
      {selectedHotspot && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Edit Hotspot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Hotspot title"
                value={selectedHotspot.title}
                onChange={(e) => updateHotspot(selectedHotspot.id, { title: e.target.value })}
              />
              
              <Textarea
                placeholder="Description or tooltip content"
                value={selectedHotspot.description}
                onChange={(e) => updateHotspot(selectedHotspot.id, { description: e.target.value })}
                rows={3}
              />
              
              <Select
                value={selectedHotspot.type}
                onValueChange={(value) => updateHotspot(selectedHotspot.id, { type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {hotspotTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <type.icon className="w-4 h-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-500">X Position</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={Math.round(selectedHotspot.x)}
                    onChange={(e) => updateHotspot(selectedHotspot.id, { x: parseFloat(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500">Y Position</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={Math.round(selectedHotspot.y)}
                    onChange={(e) => updateHotspot(selectedHotspot.id, { y: parseFloat(e.target.value) })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}