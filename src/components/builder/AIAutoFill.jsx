import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

export default function AIAutoFill({ selectedScreen, currentDemo, updateScreen }) {
  const [isGenerating, setIsGenerating] = useState(false);

  const autoFillScreen = async () => {
    if (!selectedScreen?.image_url) {
      toast.error("Please select a screen with an image");
      return;
    }

    setIsGenerating(true);
    try {
      const prompt = `Analyze this product screenshot and provide:
1. Voiceover script (20-30 seconds, conversational tone explaining key features)
2. Animations for important UI elements (suggest 2-4 animations with CSS selectors like .header, .button, .card)
3. Interactive hotspot suggestions (3-5 clickable areas with reactions)

Context: This is screen "${selectedScreen.title}" in a product demo for "${currentDemo.title}".

Return a structured JSON response.`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        file_urls: [selectedScreen.image_url],
        response_json_schema: {
          type: "object",
          properties: {
            voiceover_text: { type: "string" },
            animations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  type: { type: "string" },
                  element_selector: { type: "string" },
                  delay: { type: "number" },
                  duration: { type: "number" }
                }
              }
            },
            hotspot_enhancements: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  hotspot_id: { type: "string" },
                  suggested_reactions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        type: { type: "string" },
                        trigger: { type: "string" },
                        emoji: { type: "string" }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      });

      // Apply AI suggestions to screen
      const updatedScreen = {
        ...selectedScreen,
        voiceover_text: result.voiceover_text,
        animations: [
          ...(selectedScreen.animations || []),
          ...result.animations.map((anim, idx) => ({
            id: `ai-anim-${Date.now()}-${idx}`,
            ...anim
          }))
        ]
      };

      // Enhance existing hotspots with reactions
      if (result.hotspot_enhancements && selectedScreen.hotspots) {
        updatedScreen.hotspots = selectedScreen.hotspots.map(hotspot => {
          const enhancement = result.hotspot_enhancements.find(e => 
            e.hotspot_id === hotspot.id
          );
          if (enhancement?.suggested_reactions) {
            return {
              ...hotspot,
              reactions: [
                ...(hotspot.reactions || []),
                ...enhancement.suggested_reactions
              ]
            };
          }
          return hotspot;
        });
      }

      updateScreen(updatedScreen);
      toast.success("AI suggestions applied! Review and adjust as needed.");
    } catch (error) {
      console.error("Error generating AI suggestions:", error);
      toast.error("Failed to generate AI suggestions");
    }
    setIsGenerating(false);
  };

  return (
    <Button
      onClick={autoFillScreen}
      disabled={isGenerating || !selectedScreen}
      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
    >
      {isGenerating ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          AI Analyzing...
        </>
      ) : (
        <>
          <Sparkles className="w-4 h-4 mr-2" />
          AI Auto-Fill All
        </>
      )}
    </Button>
  );
}