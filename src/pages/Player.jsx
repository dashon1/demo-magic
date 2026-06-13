import React, { useState, useEffect, useCallback } from "react";
import { Demo, DemoView, LeadCapture } from "@/api/entities";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  ChevronRight, 
  X,
  Play,
  Pause,
  RotateCcw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function Player() {
  const [demo, setDemo] = useState(null);
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
  const [showHotspotContent, setShowHotspotContent] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [viewStartTime] = useState(Date.now());
  const [viewerId] = useState(`viewer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [leadEmail, setLeadEmail] = useState("");

  const trackView = useCallback(async () => {
    if (!demo) return;
    
    const timeSpent = Math.floor((Date.now() - viewStartTime) / 1000);
    const completionPercentage = Math.round(((currentScreenIndex + 1) / demo.screens.length) * 100);

    try {
      await base44.functions.invoke('trackDemoView', {
        demo_id: demo.id,
        viewer_id: viewerId,
        completion_percentage: completionPercentage,
        time_spent: timeSpent,
        device_type: /Mobile|Android|iPhone/.test(navigator.userAgent) ? 'mobile' : 'desktop',
        referrer: document.referrer || 'direct'
      });
    } catch (error) {
      console.error("Error tracking view:", error);
    }
  }, [demo, currentScreenIndex, viewerId, viewStartTime]);

  useEffect(() => {
    const loadDemo = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const embedId = urlParams.get('embed_id') || window.location.pathname.split('/').pop();
      
      try {
        const demos = await Demo.filter({ embed_id: embedId });
        if (demos.length > 0) {
          setDemo(demos[0]);
          
          // Update view count
          await Demo.update(demos[0].id, { 
            view_count: (demos[0].view_count || 0) + 1 
          });
        }
      } catch (error) {
        console.error("Error loading demo:", error);
      }
    };

    loadDemo();
    
    // Track view on component unmount
    return () => {
      trackView();
    };
  }, [trackView]);

  const nextScreen = useCallback(() => {
    if (demo && currentScreenIndex < demo.screens.length - 1) {
      setCurrentScreenIndex(prev => prev + 1);
      setShowHotspotContent(null);
    }
  }, [demo, currentScreenIndex]);

  useEffect(() => {
    if (isPlaying && demo?.screens?.length) {
      const timer = setTimeout(() => {
        if (currentScreenIndex < demo.screens.length - 1) {
          nextScreen();
        } else {
          setIsPlaying(false);
        }
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isPlaying, currentScreenIndex, demo, nextScreen]);

  const prevScreen = () => {
    if (currentScreenIndex > 0) {
      setCurrentScreenIndex(prev => prev - 1);
      setShowHotspotContent(null);
    }
  };

  const handleHotspotClick = (hotspot) => {
    setShowHotspotContent(hotspot);
    setIsPlaying(false);
  };

  const handleLeadCapture = async () => {
    if (!leadEmail || !leadEmail.includes('@')) {
      toast.error('Please enter a valid email');
      return;
    }

    try {
      const lead = await LeadCapture.create({
        demo_id: demo.id,
        email: leadEmail,
        name: leadEmail.split('@')[0],
        source: 'demo_player'
      });
      
      // Send notification
      try {
        await base44.functions.invoke('sendLeadNotification', {
          lead_id: lead.id
        });
      } catch (notifError) {
        console.error("Error sending notification:", notifError);
      }
      
      setLeadCaptured(true);
      toast.success('Thanks! We\'ll be in touch soon.');
      setShowHotspotContent(null);
    } catch (error) {
      console.error("Error capturing lead:", error);
      toast.error('Something went wrong. Please try again.');
    }
  };

  if (!demo) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
          <p className="text-white">Loading demo...</p>
        </div>
      </div>
    );
  }

  const currentScreen = demo.screens?.[currentScreenIndex];
  const totalScreens = demo.screens?.length || 0;

  if (!currentScreen) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <p>No screens available in this demo</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-white">{demo.title}</h1>
            {demo.description && (
              <p className="text-sm text-slate-400 mt-1">{demo.description}</p>
            )}
          </div>
          <Badge variant="secondary" className="bg-slate-700 text-slate-300">
            {currentScreenIndex + 1} / {totalScreens}
          </Badge>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-6xl">
          <motion.div
            key={currentScreenIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="relative bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            <img 
              src={currentScreen.image_url} 
              alt={currentScreen.title}
              className="w-full h-auto"
            />
            
            {/* Interactive Hotspots */}
            <AnimatePresence>
              {currentScreen.hotspots?.map((hotspot, index) => (
                <motion.button
                  key={hotspot.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="absolute w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 shadow-xl cursor-pointer transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-white font-semibold group"
                  style={{ 
                    left: `${hotspot.x}%`, 
                    top: `${hotspot.y}%` 
                  }}
                  onClick={() => handleHotspotClick(hotspot)}
                >
                  {index + 1}
                  <div className="absolute inset-0 rounded-full animate-ping bg-blue-400 opacity-40" />
                  
                  {/* Tooltip Preview */}
                  {hotspot.type === 'tooltip' && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                      <div className="bg-slate-900 text-white text-sm rounded-lg py-2 px-4 whitespace-nowrap max-w-xs shadow-xl">
                        {hotspot.title}
                      </div>
                      <div className="w-3 h-3 bg-slate-900 rotate-45 absolute top-full left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    </div>
                  )}
                </motion.button>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Screen Title */}
          <div className="text-center mt-6">
            <h2 className="text-2xl font-semibold text-white mb-2">
              {currentScreen.title}
            </h2>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-t border-slate-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={prevScreen}
            disabled={currentScreenIndex === 0}
            className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Previous
          </Button>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentScreenIndex(0)}
              className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsPlaying(!isPlaying)}
              className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>

            {/* Progress Dots */}
            <div className="flex gap-2">
              {Array.from({ length: totalScreens }, (_, i) => (
                <button
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    i === currentScreenIndex 
                      ? 'bg-blue-500 w-8' 
                      : i < currentScreenIndex 
                        ? 'bg-blue-400/50' 
                        : 'bg-slate-600'
                  }`}
                  onClick={() => setCurrentScreenIndex(i)}
                />
              ))}
            </div>
          </div>

          <Button 
            onClick={nextScreen}
            disabled={currentScreenIndex === totalScreens - 1}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Next
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>

      {/* Hotspot Content Modal */}
      <AnimatePresence>
        {showHotspotContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowHotspotContent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <h3 className="text-2xl font-bold text-slate-900">
                  {showHotspotContent.title}
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowHotspotContent(null)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Description */}
              <p className="text-slate-700 text-lg mb-6 leading-relaxed">
                {showHotspotContent.description}
              </p>

              {/* Video */}
              {showHotspotContent.video_url && (
                <div className="mb-6 rounded-xl overflow-hidden">
                  <iframe
                    src={showHotspotContent.video_url}
                    className="w-full aspect-video"
                    allowFullScreen
                  />
                </div>
              )}

              {/* Lead Capture Form */}
              {showHotspotContent.show_lead_form && !leadCaptured && (
                <div className="bg-blue-50 rounded-xl p-6 mb-6">
                  <h4 className="font-semibold text-slate-900 mb-2">
                    {showHotspotContent.form_title || 'Get Early Access'}
                  </h4>
                  <p className="text-sm text-slate-600 mb-4">
                    {showHotspotContent.form_subtitle || 'Enter your email to learn more'}
                  </p>
                  <div className="flex gap-2">
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleLeadCapture}>
                      Submit
                    </Button>
                  </div>
                </div>
              )}

              {/* CTA Button */}
              {showHotspotContent.cta_text && showHotspotContent.cta_url && (
                <a
                  href={showHotspotContent.cta_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg py-6">
                    {showHotspotContent.cta_text}
                  </Button>
                </a>
              )}

              {!showHotspotContent.cta_text && (
                <Button 
                  onClick={() => setShowHotspotContent(null)}
                  className="w-full"
                  variant="outline"
                >
                  Continue Demo
                </Button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}