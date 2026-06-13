import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Upload, Play, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

export default function VoiceoverEditor({ selectedScreen, updateScreen }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const generateVoiceover = async () => {
    if (!selectedScreen?.voiceover_text) {
      toast.error("Please enter voiceover text first");
      return;
    }

    setIsGenerating(true);
    try {
      // Note: This would need a text-to-speech integration
      toast.info("AI voiceover generation coming soon!");
      // const result = await base44.integrations.TextToSpeech.generate({
      //   text: selectedScreen.voiceover_text
      // });
      // updateScreen({
      //   ...selectedScreen,
      //   voiceover_url: result.audio_url
      // });
    } catch (error) {
      console.error("Error generating voiceover:", error);
      toast.error("Failed to generate voiceover");
    }
    setIsGenerating(false);
  };

  const uploadVoiceover = async (file) => {
    setIsUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      updateScreen({
        ...selectedScreen,
        voiceover_url: file_url
      });
      toast.success("Voiceover uploaded");
    } catch (error) {
      console.error("Error uploading:", error);
      toast.error("Failed to upload voiceover");
    }
    setIsUploading(false);
  };

  if (!selectedScreen) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-slate-500">
          Select a screen to add voiceover
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Mic className="w-4 h-4" />
          Voiceover
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Enter voiceover script for this screen..."
          value={selectedScreen.voiceover_text || ""}
          onChange={(e) => updateScreen({
            ...selectedScreen,
            voiceover_text: e.target.value
          })}
          rows={4}
        />

        <div className="flex gap-2">
          <Button
            onClick={generateVoiceover}
            disabled={isGenerating || !selectedScreen.voiceover_text}
            className="flex-1"
            variant="outline"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Mic className="w-4 h-4 mr-2" />
            )}
            Generate AI Voice
          </Button>

          <Button
            variant="outline"
            onClick={() => document.getElementById('voiceover-upload').click()}
            disabled={isUploading}
          >
            {isUploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
          </Button>
          <input
            id="voiceover-upload"
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) uploadVoiceover(file);
            }}
          />
        </div>

        {selectedScreen.voiceover_url && (
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-green-900">
                Voiceover Ready
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  const audio = new Audio(selectedScreen.voiceover_url);
                  audio.play();
                }}
              >
                <Play className="w-3 h-3 mr-1" />
                Preview
              </Button>
            </div>
            <audio controls className="w-full h-8">
              <source src={selectedScreen.voiceover_url} />
            </audio>
          </div>
        )}

        <div className="text-xs text-slate-500">
          <p className="mb-1">💡 Tips:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Keep it concise (20-30 seconds)</li>
            <li>Focus on key features</li>
            <li>Use natural, conversational tone</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}