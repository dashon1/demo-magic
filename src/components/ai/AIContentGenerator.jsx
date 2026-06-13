import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { base44 } from "@/api/base44Client";
import { Sparkles, Wand2, Link as LinkIcon, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function AIContentGenerator({ onGenerated }) {
  const [url, setUrl] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);

  const generateFromURL = async () => {
    if (!url.trim()) {
      toast.error("Please enter a URL");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this website URL: ${url}

Generate a comprehensive interactive demo plan with:
1. 5-7 key screens/sections to showcase
2. For each screen, suggest 3-5 interactive hotspots with:
   - Title
   - Description (engaging, benefit-focused)
   - Type (tooltip, modal, or highlight)
   - Suggested X,Y coordinates (percentage-based)
3. Suggested theme colors based on the brand
4. Call-to-action recommendations

${customPrompt ? `Additional context: ${customPrompt}` : ''}

Format as structured JSON.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            theme_color: { type: "string" },
            screens: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  suggested_image: { type: "string" },
                  hotspots: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        description: { type: "string" },
                        type: { type: "string" },
                        x: { type: "number" },
                        y: { type: "number" }
                      }
                    }
                  }
                }
              }
            },
            cta_suggestions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  text: { type: "string" },
                  url: { type: "string" }
                }
              }
            }
          }
        }
      });

      setGeneratedContent(response);
      toast.success("AI content generated successfully!");
      if (onGenerated) {
        onGenerated(response);
      }
    } catch (error) {
      console.error("Generation error:", error);
      toast.error("Failed to generate content. Please try again.");
    }
    setIsGenerating(false);
  };

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-900">
          <Sparkles className="w-5 h-5" />
          AI Demo Generator
          <Badge className="ml-auto bg-gradient-to-r from-purple-600 to-blue-600">
            New
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-700 mb-2 block">
            Website URL
          </label>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="https://yourwebsite.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700 mb-2 block">
            Additional Instructions (Optional)
          </label>
          <Textarea
            placeholder="E.g., Focus on the checkout flow, highlight security features..."
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            rows={3}
          />
        </div>

        <Button
          onClick={generateFromURL}
          disabled={isGenerating}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          size="lg"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Generating with AI...
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4 mr-2" />
              Generate Demo Content
            </>
          )}
        </Button>

        {generatedContent && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-white rounded-lg border border-purple-200"
          >
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="font-semibold text-slate-900">Generated Content</span>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-slate-600">
                ✨ {generatedContent.screens?.length || 0} screens suggested
              </p>
              <p className="text-slate-600">
                🎯 {generatedContent.screens?.reduce((acc, s) => acc + (s.hotspots?.length || 0), 0)} interactive hotspots
              </p>
              <p className="text-slate-600">
                🎨 Theme color: <span className="font-mono">{generatedContent.theme_color}</span>
              </p>
            </div>
          </motion.div>
        )}

        <div className="p-3 bg-blue-50 rounded-lg flex gap-2">
          <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-900">
            AI analyzes your website and suggests optimal demo structure, hotspot placements, and messaging.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}