import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, Sparkles, Upload, MousePointer, Share2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const steps = [
  {
    icon: Upload,
    title: "Upload Your Screenshots",
    description: "Start by uploading images of your product or website"
  },
  {
    icon: MousePointer,
    title: "Add Interactive Hotspots",
    description: "Click on your screens to add tooltips, modals, and highlights"
  },
  {
    icon: Sparkles,
    title: "Customize Your Demo",
    description: "Match your brand with colors, templates, and styling"
  },
  {
    icon: Share2,
    title: "Embed & Share",
    description: "Get your embed code and add it to your website in seconds"
  }
];

export default function FirstTimeWelcome({ onClose, onStartTour }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative"
        >
          <Card className="max-w-2xl w-full bg-white shadow-2xl">
            <CardContent className="p-8">
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="absolute top-4 right-4"
              >
                <X className="w-5 h-5" />
              </Button>

              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">
                  Welcome to DemoMagic! 🎉
                </h2>
                <p className="text-slate-600 text-lg">
                  Create interactive product demos in 4 simple steps
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {steps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <step.icon className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">
                        {step.title}
                      </h3>
                      <p className="text-sm text-slate-600">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={onStartTour}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg py-6"
                >
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Start Creating
                </Button>
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="px-8"
                >
                  Skip
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}