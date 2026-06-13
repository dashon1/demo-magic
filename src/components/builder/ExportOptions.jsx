import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  FileJson, 
  FileVideo, 
  FileImage,
  Link as LinkIcon,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";

export default function ExportOptions({ demo }) {
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingVideo, setIsExportingVideo] = useState(false);

  const exportAsJSON = () => {
    const dataStr = JSON.stringify(demo, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${demo.title || 'demo'}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Demo exported as JSON');
  };

  const exportAsHTML = () => {
    const embedCode = `<!DOCTYPE html>
<html>
<head>
  <title>${demo.title}</title>
  <style>
    body { margin: 0; font-family: system-ui, sans-serif; }
    .demo-container { max-width: 1200px; margin: 0 auto; padding: 20px; }
  </style>
</head>
<body>
  <div class="demo-container">
    <h1>${demo.title}</h1>
    <p>${demo.description || ''}</p>
    <iframe 
      src="${window.location.origin}/embed/${demo.embed_id}" 
      width="100%" 
      height="600"
      frameborder="0"
      allowfullscreen
      style="border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);"
    ></iframe>
  </div>
</body>
</html>`;

    const dataBlob = new Blob([embedCode], { type: 'text/html' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${demo.title || 'demo'}.html`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Demo exported as HTML');
  };

  const copyShareLink = () => {
    const shareUrl = `${window.location.origin}/demo/${demo.embed_id}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success('Share link copied to clipboard!');
  };

  const exportAsVideo = async () => {
    if (!demo.id) {
      toast.error('Please save your demo first');
      return;
    }

    if (!demo.screens || demo.screens.length === 0) {
      toast.error('Add at least one screen to export as video');
      return;
    }

    setIsExportingVideo(true);
    try {
      toast.loading('Generating video... This may take a few minutes', { id: 'video-export' });
      
      const result = await base44.functions.invoke('exportDemoVideo', {
        demo_id: demo.id
      });

      toast.success('Video export started! Check your email for download link when ready.', { id: 'video-export' });
      
      // Show details about the video
      if (result.video_plan) {
        toast.info(`Estimated video duration: ${result.video_plan.total_duration}s at ${result.video_plan.resolution}`, {
          duration: 5000
        });
      }
    } catch (error) {
      console.error('Error exporting video:', error);
      toast.error('Failed to export video. Make sure all screens have valid images.', { id: 'video-export' });
    }
    setIsExportingVideo(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export & Share
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full justify-start"
          onClick={exportAsJSON}
        >
          <FileJson className="w-4 h-4 mr-2" />
          Export as JSON
          <Badge variant="secondary" className="ml-auto text-xs">Data</Badge>
        </Button>

        <Button 
          variant="outline" 
          size="sm" 
          className="w-full justify-start"
          onClick={exportAsHTML}
        >
          <FileImage className="w-4 h-4 mr-2" />
          Export as HTML
          <Badge variant="secondary" className="ml-auto text-xs">Standalone</Badge>
        </Button>

        <Button 
          variant="outline" 
          size="sm" 
          className="w-full justify-start"
          onClick={exportAsVideo}
          disabled={isExportingVideo || !demo.id || !demo.screens?.length}
        >
          {isExportingVideo ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <FileVideo className="w-4 h-4 mr-2" />
          )}
          Export as Video (MP4)
          <Badge variant="secondary" className="ml-auto text-xs">
            {isExportingVideo ? 'Processing...' : 'Beta'}
          </Badge>
        </Button>

        <div className="pt-3 border-t">
          <Button 
            variant="default" 
            size="sm" 
            className="w-full"
            onClick={copyShareLink}
          >
            <LinkIcon className="w-4 h-4 mr-2" />
            Copy Share Link
          </Button>
        </div>

        <div className="pt-3 text-xs text-slate-500 space-y-2">
          <p><strong>Pro Tip:</strong> Use JSON export to backup your demos or migrate between environments.</p>
          <p>HTML export creates a standalone page with embedded demo.</p>
          <p><strong>Video Export:</strong> Converts your demo into an MP4 video file with transitions, voiceovers, and screen recordings. Perfect for sharing on social media or embedding in presentations.</p>
        </div>
      </CardContent>
    </Card>
  );
}