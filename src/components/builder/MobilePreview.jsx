import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Monitor, Tablet, Smartphone } from "lucide-react";
import { motion } from "framer-motion";

export default function MobilePreview({ screen, deviceType = "desktop", onDeviceChange }) {
  const deviceSizes = {
    desktop: { width: "100%", height: "auto", icon: Monitor },
    tablet: { width: "768px", height: "1024px", icon: Tablet },
    mobile: { width: "375px", height: "667px", icon: Smartphone }
  };

  const currentDevice = deviceSizes[deviceType];
  const DeviceIcon = currentDevice.icon;

  return (
    <Card className="bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <DeviceIcon className="w-4 h-4" />
            Device Preview
          </CardTitle>
          <Tabs value={deviceType} onValueChange={onDeviceChange}>
            <TabsList className="h-8">
              <TabsTrigger value="desktop" className="px-2 py-1">
                <Monitor className="w-3 h-3" />
              </TabsTrigger>
              <TabsTrigger value="tablet" className="px-2 py-1">
                <Tablet className="w-3 h-3" />
              </TabsTrigger>
              <TabsTrigger value="mobile" className="px-2 py-1">
                <Smartphone className="w-3 h-3" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-center justify-center bg-slate-100 rounded-lg p-8">
          <motion.div
            key={deviceType}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-lg shadow-2xl overflow-hidden"
            style={{
              width: currentDevice.width,
              maxWidth: "100%",
              height: deviceType === "desktop" ? "auto" : currentDevice.height,
              maxHeight: "600px"
            }}
          >
            {screen?.image_url ? (
              <img 
                src={screen.image_url} 
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                <p className="text-sm">No screen selected</p>
              </div>
            )}
          </motion.div>
        </div>
        <div className="mt-3 text-center">
          <p className="text-xs text-slate-500">
            {deviceType === "desktop" && "Desktop View (Responsive)"}
            {deviceType === "tablet" && "Tablet View (768 × 1024)"}
            {deviceType === "mobile" && "Mobile View (375 × 667)"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}