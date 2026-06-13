import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import confetti from "canvas-confetti";
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Volume2, 
  VolumeX,
  Play,
  Pause
} from "lucide-react";

export default function InteractivePlayer({ demo, onClose }) {
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(demo?.settings?.auto_play || false);
  const audioRef = useRef(null);
  const timerRef = useRef(null);

  const currentScreen = demo?.screens?.[currentScreenIndex];
  const totalScreens = demo?.screens?.length || 0;

  useEffect(() => {
    setProgress(((currentScreenIndex + 1) / totalScreens) * 100);
  }, [currentScreenIndex, totalScreens]);

  useEffect(() => {
    // Play voiceover when screen changes
    if (currentScreen?.voiceover_url && !isMuted && demo?.settings?.enable_voiceovers) {
      if (audioRef.current) {
        audioRef.current.src = currentScreen.voiceover_url;
        audioRef.current.play();
      }
    }

    // Auto-advance timer
    if (isPlaying && currentScreen) {
      const duration = (currentScreen.duration || 5) * 1000;
      timerRef.current = setTimeout(() => {
        if (currentScreenIndex < totalScreens - 1) {
          setCurrentScreenIndex(prev => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, duration);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentScreenIndex, currentScreen, isPlaying, isMuted]);

  const handleHotspotClick = (hotspot) => {
    // Trigger reactions
    if (demo?.settings?.enable_reactions && hotspot.reactions) {
      hotspot.reactions.forEach(reaction => {
        if (reaction.trigger === "click") {
          triggerReaction(reaction);
        }
      });
    }

    // Handle action
    if (hotspot.action) {
      switch (hotspot.action.type) {
        case "next_screen":
          goToNext();
          break;
        case "go_to_screen":
          const targetIndex = demo.screens.findIndex(s => s.id === hotspot.action.target);
          if (targetIndex >= 0) setCurrentScreenIndex(targetIndex);
          break;
        case "open_url":
          window.open(hotspot.action.target, "_blank");
          break;
      }
    }
  };

  const triggerReaction = (reaction) => {
    switch (reaction.type) {
      case "confetti":
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        break;
      case "emoji":
        // Emoji burst animation would go here
        break;
    }
  };

  const goToPrevious = () => {
    if (currentScreenIndex > 0) {
      setCurrentScreenIndex(prev => prev - 1);
    }
  };

  const goToNext = () => {
    if (currentScreenIndex < totalScreens - 1) {
      setCurrentScreenIndex(prev => prev + 1);
    }
  };

  const getAnimationVariant = (animType) => {
    const variants = {
      "fade-in": {
        initial: { opacity: 0 },
        animate: { opacity: 1 }
      },
      "slide-in-left": {
        initial: { x: -100, opacity: 0 },
        animate: { x: 0, opacity: 1 }
      },
      "slide-in-right": {
        initial: { x: 100, opacity: 0 },
        animate: { x: 0, opacity: 1 }
      },
      "zoom-in": {
        initial: { scale: 0.8, opacity: 0 },
        animate: { scale: 1, opacity: 1 }
      },
      "pulse": {
        animate: { scale: [1, 1.05, 1] }
      }
    };
    return variants[animType] || variants["fade-in"];
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
    >
      <div className="relative w-full max-w-6xl">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/50 to-transparent z-10">
          <div className="flex items-center justify-between text-white">
            <div>
              <h2 className="text-2xl font-bold">{demo?.title}</h2>
              <p className="text-sm text-white/70">{currentScreen?.title}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMuted(!isMuted)}
                className="text-white hover:bg-white/20"
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative bg-white rounded-xl overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentScreenIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <img
                src={currentScreen?.image_url}
                alt={currentScreen?.title}
                className="w-full h-auto"
              />

              {/* Hotspots */}
              {currentScreen?.hotspots?.map((hotspot) => (
                <motion.div
                  key={hotspot.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute cursor-pointer group"
                  style={{
                    left: `${hotspot.x}%`,
                    top: `${hotspot.y}%`,
                    transform: "translate(-50%, -50%)"
                  }}
                  onClick={() => handleHotspotClick(hotspot)}
                  onMouseEnter={() => {
                    if (demo?.settings?.enable_reactions && hotspot.reactions) {
                      hotspot.reactions.forEach(reaction => {
                        if (reaction.trigger === "hover") triggerReaction(reaction);
                      });
                    }
                  }}
                >
                  <div className={`w-8 h-8 rounded-full bg-blue-500 shadow-lg ${
                    hotspot.style?.pulse !== false ? 'animate-pulse' : ''
                  }`}>
                    <div className="absolute inset-0 rounded-full animate-ping bg-blue-400 opacity-75" />
                  </div>

                  {/* Tooltip */}
                  {hotspot.type === "tooltip" && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-slate-900 text-white rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <p className="font-semibold mb-1">{hotspot.title}</p>
                      <p className="text-sm text-slate-300">{hotspot.description}</p>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                        <div className="border-8 border-transparent border-t-slate-900" />
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/50 to-transparent">
          <div className="space-y-4">
            {demo?.settings?.show_progress && (
              <Progress value={progress} className="h-1" />
            )}

            {demo?.settings?.show_navigation && (
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  onClick={goToPrevious}
                  disabled={currentScreenIndex === 0}
                  className="text-white hover:bg-white/20"
                >
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  Previous
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="text-white hover:bg-white/20"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </Button>
                  <span className="text-white text-sm">
                    {currentScreenIndex + 1} / {totalScreens}
                  </span>
                </div>

                <Button
                  variant="ghost"
                  onClick={goToNext}
                  disabled={currentScreenIndex === totalScreens - 1}
                  className="text-white hover:bg-white/20"
                >
                  Next
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Audio Element */}
        <audio ref={audioRef} />
      </div>
    </motion.div>
  );
}