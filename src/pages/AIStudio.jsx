import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft, Sparkles, Wand2 } from "lucide-react";
import { motion } from "framer-motion";

import AIContentGenerator from "../components/ai/AIContentGenerator";

export default function AIStudio() {
  const [generatedDemo, setGeneratedDemo] = useState(null);

  const handleContentGenerated = async (content) => {
    setGeneratedDemo(content);
  };

  const createDemoFromAI = async () => {
    if (!generatedDemo) return;

    try {
      const newDemo = await base44.entities.Demo.create({
        title: "AI Generated Demo",
        description: "Created with AI assistance",
        template: "modern",
        theme_color: generatedDemo.theme_color,
        screens: generatedDemo.screens.map((screen, index) => ({
          id: `screen-${Date.now()}-${index}`,
          title: screen.title,
          image_url: "", // User needs to upload images
          hotspots: screen.hotspots || []
        })),
        status: "draft"
      });

      window.location.href = createPageUrl(`Builder?demo=${newDemo.id}`);
    } catch (error) {
      console.error("Error creating demo:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link to={createPageUrl("Dashboard")}>
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900">AI Demo Studio</h1>
              <p className="text-slate-600 text-lg mt-1">
                Generate interactive demos automatically with AI
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-white rounded-lg border border-purple-200">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">Smart Analysis</h3>
              <p className="text-sm text-slate-600">
                AI analyzes your website and suggests optimal demo structure
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-blue-200">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                <Wand2 className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">Auto Hotspots</h3>
              <p className="text-sm text-slate-600">
                Automatically generates hotspots with engaging descriptions
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-pink-200">
              <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5 text-pink-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">Brand Matching</h3>
              <p className="text-sm text-slate-600">
                Suggests colors and themes that match your brand
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          <AIContentGenerator onGenerated={handleContentGenerated} />

          {generatedDemo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-purple-200">
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  Generated Demo Preview
                </h3>

                <div className="space-y-4">
                  {generatedDemo.screens?.map((screen, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-slate-50">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-slate-900">{screen.title}</h4>
                          <p className="text-sm text-slate-600 mt-1">{screen.description}</p>
                        </div>
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                          Screen {index + 1}
                        </span>
                      </div>
                      
                      <div className="mt-3 space-y-2">
                        <p className="text-xs font-medium text-slate-700">Hotspots:</p>
                        {screen.hotspots?.map((hotspot, idx) => (
                          <div key={idx} className="text-xs bg-white p-2 rounded border">
                            <span className="font-medium text-slate-900">{hotspot.title}</span>
                            <span className="text-slate-500 ml-2">
                              ({hotspot.type} at {hotspot.x}%, {hotspot.y}%)
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={createDemoFromAI}
                  className="w-full mt-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  size="lg"
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  Create Demo from AI Plan
                </Button>

                <p className="text-xs text-slate-500 text-center mt-3">
                  You'll need to upload images for each screen in the builder
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}