import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Palette, Check } from "lucide-react";

const templates = [
  {
    id: "modern",
    name: "Modern",
    description: "Clean and contemporary design",
    color: "#3B82F6",
    preview: "bg-gradient-to-br from-blue-500 to-purple-600"
  },
  {
    id: "classic",
    name: "Classic",
    description: "Professional and timeless",
    color: "#6B7280", 
    preview: "bg-gradient-to-br from-gray-500 to-slate-600"
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Simple and focused",
    color: "#10B981",
    preview: "bg-gradient-to-br from-emerald-500 to-teal-600"
  },
  {
    id: "branded",
    name: "Branded",
    description: "Custom brand colors",
    color: "#F59E0B",
    preview: "bg-gradient-to-br from-amber-500 to-orange-600"
  }
];

export default function TemplateSelector({ demo, updateDemo }) {
  const handleTemplateChange = (templateId) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      updateDemo(prev => ({
        ...prev,
        template: templateId,
        theme_color: template.color
      }));
    }
  };

  const handleColorChange = (color) => {
    updateDemo(prev => ({ ...prev, theme_color: color }));
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Template Style
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {templates.map((template) => (
              <div
                key={template.id}
                className={`relative p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                  demo.template === template.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
                onClick={() => handleTemplateChange(template.id)}
              >
                <div className={`w-full h-16 rounded-md mb-2 ${template.preview}`}>
                  {demo.template === template.id && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <div className="text-xs font-medium text-slate-900">
                  {template.name}
                </div>
                <div className="text-xs text-slate-500">
                  {template.description}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Theme Color</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 mb-4">
            <Input
              type="color"
              value={demo.theme_color}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-12 h-8 p-1 border-slate-300"
            />
            <Input
              type="text"
              value={demo.theme_color}
              onChange={(e) => handleColorChange(e.target.value)}
              className="flex-1 text-sm"
              placeholder="#3B82F6"
            />
          </div>
          
          <div className="grid grid-cols-6 gap-2">
            {[
              "#3B82F6", "#6366F1", "#8B5CF6", "#A855F7", 
              "#D946EF", "#EC4899", "#F43F5E", "#EF4444",
              "#F97316", "#F59E0B", "#EAB308", "#84CC16",
              "#22C55E", "#10B981", "#14B8A6", "#06B6D4",
              "#0EA5E9", "#3B82F6", "#6B7280", "#374151"
            ].map((color) => (
              <button
                key={color}
                className={`w-8 h-8 rounded-md border-2 transition-all duration-200 ${
                  demo.theme_color === color 
                    ? 'border-slate-400 scale-110' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
                style={{ backgroundColor: color }}
                onClick={() => handleColorChange(color)}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}