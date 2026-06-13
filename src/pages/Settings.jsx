import React, { useState, useEffect } from "react";
import { Demo } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createPageUrl } from "@/utils";
import { 
  Code, 
  Share2, 
  Settings as SettingsIcon,
  Copy,
  Check,
  ExternalLink
} from "lucide-react";
import { toast } from "sonner";

export default function Settings() {
  const [selectedDemo, setSelectedDemo] = useState(null);
  const [embedCode, setEmbedCode] = useState("");
  const [embedWidth, setEmbedWidth] = useState("800");
  const [embedHeight, setEmbedHeight] = useState("600");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadFirstDemo = async () => {
      const demos = await Demo.list("-updated_date", 1);
      if (demos.length > 0) {
        setSelectedDemo(demos[0]);
      }
    };
    
    loadFirstDemo();
  }, []);

  useEffect(() => {
    if (selectedDemo) {
      const baseUrl = window.location.origin;
      const code = `<iframe 
  src="${baseUrl}${createPageUrl('Player')}?embed_id=${selectedDemo.embed_id}" 
  width="${embedWidth}" 
  height="${embedHeight}"
  frameborder="0"
  allowfullscreen
  style="border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);"
></iframe>`;
      setEmbedCode(code);
    }
  }, [selectedDemo, embedWidth, embedHeight]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    toast.success("Embed code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDimensionChange = (width, height) => {
    setEmbedWidth(width);
    setEmbedHeight(height);
  };

  if (!selectedDemo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <SettingsIcon className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              No demos available
            </h3>
            <p className="text-slate-500 mb-6">
              Create a demo first to access embed codes and settings
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Embed & Share</h1>
          <p className="text-slate-600">
            Get embed codes and share your interactive demos
          </p>
        </div>

        <Tabs defaultValue="embed" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="embed">
              <Code className="w-4 h-4 mr-2" />
              Embed Code
            </TabsTrigger>
            <TabsTrigger value="share">
              <Share2 className="w-4 h-4 mr-2" />
              Share Link
            </TabsTrigger>
            <TabsTrigger value="settings">
              <SettingsIcon className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="embed">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Embed Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Demo to Embed</Label>
                    <p className="text-sm font-medium text-slate-900 mt-2 p-3 bg-slate-50 rounded-lg">
                      {selectedDemo.title}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="width">Width (px)</Label>
                      <Input
                        id="width"
                        type="number"
                        value={embedWidth}
                        onChange={(e) => handleDimensionChange(e.target.value, embedHeight)}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="height">Height (px)</Label>
                      <Input
                        id="height"
                        type="number"
                        value={embedHeight}
                        onChange={(e) => handleDimensionChange(embedWidth, e.target.value)}
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="mb-2 block">Quick Sizes</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDimensionChange("800", "600")}
                      >
                        Standard (800x600)
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDimensionChange("1200", "800")}
                      >
                        Large (1200x800)
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDimensionChange("600", "400")}
                      >
                        Small (600x400)
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDimensionChange("100%", "600")}
                      >
                        Responsive
                      </Button>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between mb-2">
                      <Label>Embed Code</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyToClipboard}
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Code
                          </>
                        )}
                      </Button>
                    </div>
                    <Textarea
                      value={embedCode}
                      readOnly
                      rows={8}
                      className="font-mono text-xs bg-slate-900 text-green-400 border-slate-700"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden">
                    {selectedDemo.screens?.[0]?.image_url ? (
                      <img 
                        src={selectedDemo.screens[0].image_url}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-8">
                        <ExternalLink className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-600">
                          Your demo will appear here when embedded
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-900 font-medium mb-2">
                      💡 Pro Tip
                    </p>
                    <p className="text-sm text-blue-700">
                      Embed your demo on landing pages, documentation, or product pages to increase engagement and conversions.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="share">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Share Your Demo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Public Demo URL</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={`${window.location.origin}${createPageUrl('Player')}?embed_id=${selectedDemo.embed_id}`}
                      readOnly
                      className="flex-1"
                    />
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}${createPageUrl('Player')}?embed_id=${selectedDemo.embed_id}`);
                        toast.success("Link copied!");
                      }}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Button variant="outline" className="w-full">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share on LinkedIn
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share on Twitter
                  </Button>
                </div>

                <div className="p-4 bg-slate-50 rounded-lg">
                  <h4 className="font-semibold text-slate-900 mb-2">
                    Password Protection (Coming Soon)
                  </h4>
                  <p className="text-sm text-slate-600">
                    Protect your demos with passwords to control who can view them.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Demo Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Demo Title</Label>
                  <Input
                    value={selectedDemo.title}
                    className="mt-2"
                    disabled
                  />
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={selectedDemo.description || ""}
                    rows={3}
                    className="mt-2"
                    disabled
                  />
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-900">
                    To edit demo settings, go to the{" "}
                    <a href={createPageUrl(`Builder?demo=${selectedDemo.id}`)} className="underline font-medium">
                      Demo Builder
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}