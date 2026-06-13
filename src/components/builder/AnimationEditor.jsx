import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Sparkles } from "lucide-react";

const animationTypes = [
  { value: "fade-in", label: "Fade In", icon: "✨" },
  { value: "slide-in-left", label: "Slide Left", icon: "⬅️" },
  { value: "slide-in-right", label: "Slide Right", icon: "➡️" },
  { value: "slide-in-up", label: "Slide Up", icon: "⬆️" },
  { value: "slide-in-down", label: "Slide Down", icon: "⬇️" },
  { value: "zoom-in", label: "Zoom In", icon: "🔍" },
  { value: "pulse", label: "Pulse", icon: "💓" },
  { value: "bounce", label: "Bounce", icon: "🎾" }
];

export default function AnimationEditor({ selectedScreen, updateScreen }) {
  const [newAnimation, setNewAnimation] = useState({
    type: "fade-in",
    element_selector: "",
    delay: 0,
    duration: 0.5
  });

  const animations = selectedScreen?.animations || [];

  const addAnimation = () => {
    if (!newAnimation.element_selector) return;
    
    const animation = {
      id: `anim-${Date.now()}`,
      ...newAnimation
    };

    updateScreen({
      ...selectedScreen,
      animations: [...animations, animation]
    });

    setNewAnimation({
      type: "fade-in",
      element_selector: "",
      delay: 0,
      duration: 0.5
    });
  };

  const removeAnimation = (animId) => {
    updateScreen({
      ...selectedScreen,
      animations: animations.filter(a => a.id !== animId)
    });
  };

  if (!selectedScreen) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-slate-500">
          Select a screen to add animations
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Sparkles className="w-4 h-4" />
          Screen Animations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Animation */}
        <div className="space-y-3 p-3 bg-slate-50 rounded-lg">
          <Select
            value={newAnimation.type}
            onValueChange={(value) => setNewAnimation({...newAnimation, type: value})}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {animationTypes.map(anim => (
                <SelectItem key={anim.value} value={anim.value}>
                  {anim.icon} {anim.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="Element selector (e.g., .header)"
            value={newAnimation.element_selector}
            onChange={(e) => setNewAnimation({...newAnimation, element_selector: e.target.value})}
          />

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-slate-600">Delay (s)</label>
              <Input
                type="number"
                step="0.1"
                value={newAnimation.delay}
                onChange={(e) => setNewAnimation({...newAnimation, delay: parseFloat(e.target.value)})}
              />
            </div>
            <div>
              <label className="text-xs text-slate-600">Duration (s)</label>
              <Input
                type="number"
                step="0.1"
                value={newAnimation.duration}
                onChange={(e) => setNewAnimation({...newAnimation, duration: parseFloat(e.target.value)})}
              />
            </div>
          </div>

          <Button onClick={addAnimation} size="sm" className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Animation
          </Button>
        </div>

        {/* Animation List */}
        {animations.length > 0 ? (
          <div className="space-y-2">
            {animations.map(anim => (
              <div key={anim.id} className="flex items-center justify-between p-2 bg-white rounded border">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {animationTypes.find(a => a.value === anim.type)?.icon}
                    </Badge>
                    <span className="text-sm font-medium">{anim.element_selector}</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Delay: {anim.delay}s • Duration: {anim.duration}s
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeAnimation(anim.id)}
                  className="h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-sm text-slate-500 py-4">
            No animations yet
          </p>
        )}
      </CardContent>
    </Card>
  );
}