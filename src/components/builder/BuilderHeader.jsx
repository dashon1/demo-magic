import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, Eye, Share } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function BuilderHeader({ demo, onSave, onPreview, isSaving }) {
  return (
    <div className="bg-white border-b border-slate-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to={createPageUrl("Dashboard")}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="font-semibold text-slate-900">
              {demo.title || 'Untitled Demo'}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs">
                {demo.template} template
              </Badge>
              {demo.screens?.length > 0 && (
                <Badge variant="outline" className="text-xs">
                  {demo.screens.length} screens
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onPreview}
            disabled={!demo.screens?.length}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button 
            onClick={onSave}
            disabled={isSaving || !demo.title}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Demo'}
          </Button>
          <Button variant="outline" size="sm">
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>
    </div>
  );
}