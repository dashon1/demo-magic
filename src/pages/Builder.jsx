import React, { useState, useEffect, useCallback } from "react";
import { Demo } from "@/api/entities";
import { UploadFile } from "@/api/integrations";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Upload,
  Settings as SettingsIcon,
  Palette,
  MousePointer,
  Play
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import BuilderHeader from "../components/builder/BuilderHeader";
import ScreenEditor from "../components/builder/ScreenEditor";
import HotspotEditor from "../components/builder/HotspotEditor";
import DemoPreview from "../components/builder/DemoPreview";
import TemplateSelector from "../components/builder/TemplateSelector";
import KeyboardShortcuts, { KeyboardShortcutsGuide } from "../components/builder/KeyboardShortcuts";
import MobilePreview from "../components/builder/MobilePreview";
import AdvancedControls from "../components/builder/AdvancedControls";
import ExportOptions from "../components/builder/ExportOptions";
import VersionHistory from "../components/builder/VersionHistory";
import CollaborationPanel from "../components/builder/CollaborationPanel";
import AIContentGenerator from "../components/ai/AIContentGenerator";
import AnimationEditor from "../components/builder/AnimationEditor";
import VoiceoverEditor from "../components/builder/VoiceoverEditor";
import ReactionEditor from "../components/builder/ReactionEditor";
import AIAutoFill from "../components/builder/AIAutoFill";

// Helper function to generate unique IDs
const generateId = () => `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export default function Builder() {
  const [currentDemo, setCurrentDemo] = useState({
    title: "",
    description: "",
    template: "modern",
    theme_color: "#3B82F6",
    screens: [],
    settings: {
      auto_play: false,
      show_navigation: true,
      show_progress: true,
      allow_skip: true
    }
  });
  
  const [activeTab, setActiveTab] = useState("screens");
  const [selectedScreen, setSelectedScreen] = useState(null);
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [devicePreview, setDevicePreview] = useState("desktop");
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const saveToHistory = useCallback((demoState) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(JSON.parse(JSON.stringify(demoState)));
      return newHistory;
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentDemo(history[newIndex]);
    }
  }, [historyIndex, history]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentDemo(history[newIndex]);
    }
  }, [historyIndex, history]);

  useEffect(() => {
    const loadDemo = async (demoId) => {
      try {
        const demo = await Demo.get(demoId);
        setCurrentDemo(demo);
        setHistory([demo]);
        setHistoryIndex(0);
        if (demo.screens?.length > 0) {
          setSelectedScreen(demo.screens[0]);
        }
      } catch (error) {
        console.error("Error loading demo:", error);
      }
    };

    const urlParams = new URLSearchParams(window.location.search);
    const demoId = urlParams.get('demo');
    if (demoId) {
      loadDemo(demoId);
    }
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      let savedDemo;
      if (currentDemo.id) {
        savedDemo = await Demo.update(currentDemo.id, currentDemo);
      } else {
        savedDemo = await Demo.create({
          ...currentDemo,
          embed_id: generateId()
        });
        setCurrentDemo(savedDemo); // Update currentDemo with the ID from the server
      }
      // CRITICAL: Ensure we save the correct demo object to history.
      // If a new demo was created, 'savedDemo' contains its ID.
      // If an existing demo was updated, 'currentDemo' is the source.
      // The original logic `savedDemo || currentDemo` correctly handles this.
      saveToHistory(savedDemo || currentDemo); 
    } catch (error) {
      console.error("Error saving demo:", error);
    }
    setIsSaving(false);
  };

  const handleImageUpload = async (file) => {
    setIsUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      const newScreen = {
        id: generateId(),
        title: `Screen ${currentDemo.screens.length + 1}`,
        image_url: file_url,
        hotspots: []
      };
      
      const updatedDemo = {
        ...currentDemo,
        screens: [...currentDemo.screens, newScreen]
      };

      setCurrentDemo(updatedDemo);
      saveToHistory(updatedDemo); // Save after adding new screen
      
      setSelectedScreen(newScreen);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
    setIsUploading(false);
  };

  const addHotspot = (x, y) => {
    if (!selectedScreen) return;
    
    const newHotspot = {
      id: generateId(),
      x,
      y,
      title: "New Hotspot",
      description: "Click to edit this hotspot",
      type: "tooltip"
    };

    const updatedScreens = currentDemo.screens.map(screen => 
      screen.id === selectedScreen.id 
        ? { ...screen, hotspots: [...(screen.hotspots || []), newHotspot] }
        : screen
    );

    const updatedDemo = { ...currentDemo, screens: updatedScreens };
    setCurrentDemo(updatedDemo);
    saveToHistory(updatedDemo); // Save after adding new hotspot
    setSelectedHotspot(newHotspot);
  };

  const updateHotspot = (hotspotId, updates) => {
    if (!selectedScreen) return;

    const updatedScreens = currentDemo.screens.map(screen => 
      screen.id === selectedScreen.id
        ? {
            ...screen,
            hotspots: screen.hotspots?.map(hotspot =>
              hotspot.id === hotspotId ? { ...hotspot, ...updates } : hotspot
            ) || []
          }
        : screen
    );

    const updatedDemo = { ...currentDemo, screens: updatedScreens };
    setCurrentDemo(updatedDemo);
    saveToHistory(updatedDemo); // Save after updating hotspot
    
    if (selectedHotspot?.id === hotspotId) {
      setSelectedHotspot({ ...selectedHotspot, ...updates });
    }
  };

  const restoreVersion = (versionData) => {
    setCurrentDemo(versionData);
    saveToHistory(versionData); // Save restored version to history as a new state
    if (versionData.screens?.length > 0) {
      setSelectedScreen(versionData.screens[0]);
    } else {
      setSelectedScreen(null);
    }
  };

  return (
    <div className="h-screen bg-slate-50 flex flex-col">
      <KeyboardShortcuts
        onSave={handleSave}
        onPreview={() => setIsPreviewOpen(true)}
        onUndo={undo}
        onRedo={redo}
      />
      
      <BuilderHeader 
        demo={currentDemo}
        onSave={handleSave}
        onPreview={() => setIsPreviewOpen(true)}
        isSaving={isSaving}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel */}
        <div className="w-80 bg-white border-r border-slate-200 overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5 m-4">
              <TabsTrigger value="ai" className="text-xs">
                <Play className="w-4 h-4 mr-1" />
                AI
              </TabsTrigger>
              <TabsTrigger value="screens" className="text-xs">
                <Upload className="w-4 h-4 mr-1" />
                Screens
              </TabsTrigger>
              <TabsTrigger value="hotspots" className="text-xs">
                <MousePointer className="w-4 h-4 mr-1" />
                Hotspots
              </TabsTrigger>
              <TabsTrigger value="style" className="text-xs">
                <Palette className="w-4 h-4 mr-1" />
                Style
              </TabsTrigger>
              <TabsTrigger value="settings" className="text-xs">
                <SettingsIcon className="w-4 h-4 mr-1" />
                Settings
              </TabsTrigger>
            </TabsList>

            <div className="px-4 pb-4">
              <TabsContent value="ai" className="mt-0">
                <AIContentGenerator 
                  onGenerated={(content) => {
                    const updatedDemo = {
                      ...currentDemo,
                      theme_color: content.theme_color,
                      screens: content.screens.map((screen, index) => ({
                        id: `screen-${Date.now()}-${index}`,
                        title: screen.title,
                        image_url: "",
                        hotspots: screen.hotspots || []
                      }))
                    };
                    setCurrentDemo(updatedDemo);
                    saveToHistory(updatedDemo);
                    if (updatedDemo.screens.length > 0) {
                      setSelectedScreen(updatedDemo.screens[0]);
                    }
                  }}
                />
              </TabsContent>

              <TabsContent value="screens" className="mt-0">
                <ScreenEditor 
                  demo={currentDemo}
                  selectedScreen={selectedScreen}
                  onScreenSelect={setSelectedScreen}
                  onImageUpload={handleImageUpload}
                  isUploading={isUploading}
                  updateDemo={(updated) => {
                    setCurrentDemo(updated);
                    saveToHistory(updated);
                  }}
                />
              </TabsContent>

              <TabsContent value="hotspots" className="mt-0 space-y-4">
                <HotspotEditor 
                  selectedScreen={selectedScreen}
                  selectedHotspot={selectedHotspot}
                  onHotspotSelect={setSelectedHotspot}
                  updateDemo={(updated) => {
                    setCurrentDemo(updated);
                    saveToHistory(updated);
                  }}
                  demo={currentDemo}
                />
                
                {selectedHotspot && (
                  <>
                    <AdvancedControls
                      selectedHotspot={selectedHotspot}
                      updateHotspot={updateHotspot}
                    />
                    <ReactionEditor
                      selectedHotspot={selectedHotspot}
                      updateHotspot={updateHotspot}
                    />
                  </>
                )}
              </TabsContent>

              <TabsContent value="style" className="mt-0 space-y-4">
                <TemplateSelector 
                  demo={currentDemo}
                  updateDemo={(updated) => {
                    setCurrentDemo(updated);
                    saveToHistory(updated);
                  }}
                />
                
                {selectedScreen && (
                  <>
                    <AIAutoFill
                      selectedScreen={selectedScreen}
                      currentDemo={currentDemo}
                      updateScreen={(updated) => {
                        const updatedScreens = currentDemo.screens.map(s =>
                          s.id === updated.id ? updated : s
                        );
                        const updatedDemo = {...currentDemo, screens: updatedScreens};
                        setCurrentDemo(updatedDemo);
                        saveToHistory(updatedDemo);
                      }}
                    />
                    <AnimationEditor
                      selectedScreen={selectedScreen}
                      updateScreen={(updated) => {
                        const updatedScreens = currentDemo.screens.map(s =>
                          s.id === updated.id ? updated : s
                        );
                        const updatedDemo = {...currentDemo, screens: updatedScreens};
                        setCurrentDemo(updatedDemo);
                        saveToHistory(updatedDemo);
                      }}
                    />
                    <VoiceoverEditor
                      selectedScreen={selectedScreen}
                      updateScreen={(updated) => {
                        const updatedScreens = currentDemo.screens.map(s =>
                          s.id === updated.id ? updated : s
                        );
                        const updatedDemo = {...currentDemo, screens: updatedScreens};
                        setCurrentDemo(updatedDemo);
                        saveToHistory(updatedDemo);
                      }}
                    />
                    <MobilePreview
                      screen={selectedScreen}
                      deviceType={devicePreview}
                      onDeviceChange={setDevicePreview}
                    />
                  </>
                )}
              </TabsContent>

              <TabsContent value="settings" className="mt-0 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Demo Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      placeholder="Demo title"
                      value={currentDemo.title}
                      onChange={(e) => setCurrentDemo(prev => ({ ...prev, title: e.target.value }))}
                    />
                    <Textarea
                      placeholder="Demo description"
                      value={currentDemo.description}
                      onChange={(e) => setCurrentDemo(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                    />
                  </CardContent>
                </Card>

                <ExportOptions demo={currentDemo} />
                
                <KeyboardShortcutsGuide />
                
                {currentDemo.id && ( // Version history and collaboration are typically for saved demos
                  <>
                    <VersionHistory 
                      demoId={currentDemo.id}
                      onRestore={restoreVersion} // This uses the history-aware restoreVersion function
                    />
                    
                    <CollaborationPanel
                      demoId={currentDemo.id}
                      selectedScreen={selectedScreen}
                    />
                  </>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
          {selectedScreen ? (
            <div className="relative max-w-4xl w-full">
              <div 
                className="relative bg-white rounded-xl shadow-2xl overflow-hidden cursor-crosshair"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width) * 100;
                  const y = ((e.clientY - rect.top) / rect.height) * 100;
                  addHotspot(x, y);
                }}
              >
                <img 
                  src={selectedScreen.image_url} 
                  alt={selectedScreen.title}
                  className="w-full h-auto"
                  draggable={false}
                />
                
                {/* Hotspot Overlays */}
                <AnimatePresence>
                  {selectedScreen.hotspots?.map((hotspot) => (
                    <motion.div
                      key={hotspot.id}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className={`absolute w-6 h-6 rounded-full cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${
                        selectedHotspot?.id === hotspot.id 
                          ? 'bg-purple-500 ring-4 ring-purple-200' 
                          : 'bg-blue-500 hover:bg-blue-600'
                      } shadow-lg transition-colors duration-200`}
                      style={{ 
                        left: `${hotspot.x}%`, 
                        top: `${hotspot.y}%` 
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedHotspot(hotspot);
                      }}
                    >
                      <div className="absolute inset-0 rounded-full animate-ping bg-current opacity-20" />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              
              <div className="mt-4 text-center">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {selectedScreen.title}
                </Badge>
                <p className="text-sm text-slate-500 mt-2">
                  Click anywhere on the screen to add an interactive hotspot
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Upload className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Upload Your First Screen
              </h3>
              <p className="text-slate-500 max-w-md mx-auto">
                Get started by uploading a screenshot or image of your product to create your first interactive demo screen.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {isPreviewOpen && (
          <DemoPreview 
            demo={currentDemo}
            onClose={() => setIsPreviewOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}