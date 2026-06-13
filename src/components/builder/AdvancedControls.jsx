import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  Video, 
  Mail, 
  Link as LinkIcon,
  MousePointer,
  GitBranch
} from "lucide-react";

export default function AdvancedControls({ selectedHotspot, updateHotspot }) {
  if (!selectedHotspot) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <MousePointer className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm text-slate-500">
            Select a hotspot to add advanced features
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleUpdate = (field, value) => {
    updateHotspot(selectedHotspot.id, { [field]: value });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Video className="w-4 h-4" />
            Video Content
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label htmlFor="video-url" className="text-xs">Video URL (YouTube/Vimeo)</Label>
            <Input
              id="video-url"
              placeholder="https://youtube.com/watch?v=..."
              value={selectedHotspot.video_url || ""}
              onChange={(e) => handleUpdate("video_url", e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-xs">Auto-play video</Label>
            <Switch
              checked={selectedHotspot.video_autoplay || false}
              onCheckedChange={(checked) => handleUpdate("video_autoplay", checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Lead Capture
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Show email capture form</Label>
            <Switch
              checked={selectedHotspot.show_lead_form || false}
              onCheckedChange={(checked) => handleUpdate("show_lead_form", checked)}
            />
          </div>
          {selectedHotspot.show_lead_form && (
            <>
              <div>
                <Label htmlFor="form-title" className="text-xs">Form Title</Label>
                <Input
                  id="form-title"
                  placeholder="Get Early Access"
                  value={selectedHotspot.form_title || ""}
                  onChange={(e) => handleUpdate("form_title", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="form-subtitle" className="text-xs">Subtitle</Label>
                <Textarea
                  id="form-subtitle"
                  placeholder="Enter your email to learn more"
                  value={selectedHotspot.form_subtitle || ""}
                  onChange={(e) => handleUpdate("form_subtitle", e.target.value)}
                  rows={2}
                  className="mt-1"
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <LinkIcon className="w-4 h-4" />
            Call-to-Action
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label htmlFor="cta-text" className="text-xs">Button Text</Label>
            <Input
              id="cta-text"
              placeholder="Start Free Trial"
              value={selectedHotspot.cta_text || ""}
              onChange={(e) => handleUpdate("cta_text", e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="cta-url" className="text-xs">Button URL</Label>
            <Input
              id="cta-url"
              placeholder="https://yoursite.com/signup"
              value={selectedHotspot.cta_url || ""}
              onChange={(e) => handleUpdate("cta_url", e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs">Button Style</Label>
            <Select 
              value={selectedHotspot.cta_style || "primary"}
              onValueChange={(value) => handleUpdate("cta_style", value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="primary">Primary Button</SelectItem>
                <SelectItem value="secondary">Secondary Button</SelectItem>
                <SelectItem value="outline">Outline Button</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <GitBranch className="w-4 h-4" />
            Branching
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Enable conditional path</Label>
            <Switch
              checked={selectedHotspot.enable_branching || false}
              onCheckedChange={(checked) => handleUpdate("enable_branching", checked)}
            />
          </div>
          {selectedHotspot.enable_branching && (
            <div>
              <Label htmlFor="next-screen" className="text-xs">Jump to Screen ID</Label>
              <Input
                id="next-screen"
                placeholder="screen-id-123"
                value={selectedHotspot.next_screen_id || ""}
                onChange={(e) => handleUpdate("next_screen_id", e.target.value)}
                className="mt-1"
              />
              <p className="text-xs text-slate-500 mt-1">
                When clicked, jump to a specific screen instead of proceeding normally
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}