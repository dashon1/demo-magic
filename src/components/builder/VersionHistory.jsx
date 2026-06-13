import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DemoVersion } from "@/api/entities";
import { History, RotateCcw, Clock } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function VersionHistory({ demoId, onRestore }) {
  const [versions, setVersions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadVersions = async () => {
      try {
        const data = await DemoVersion.filter({ demo_id: demoId }, "-version_number");
        setVersions(data);
      } catch (error) {
        console.error("Error loading versions:", error);
      }
      setIsLoading(false);
    };

    if (demoId) {
      loadVersions();
    }
  }, [demoId]);

  const handleRestore = async (version) => {
    if (confirm(`Restore to version ${version.version_number}?`)) {
      onRestore(version.demo_data);
    }
  };

  if (!demoId) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <History className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm text-slate-500">
            Save your demo to enable version history
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <History className="w-4 h-4" />
          Version History
          <Badge variant="outline" className="ml-auto text-xs">
            {versions.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto" />
          </div>
        ) : versions.length === 0 ? (
          <div className="text-center py-6">
            <Clock className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm text-slate-500">No version history yet</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {versions.map((version, index) => (
              <motion.div
                key={version.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">
                      v{version.version_number}
                    </Badge>
                    <span className="text-xs text-slate-500">
                      {format(new Date(version.created_date), 'MMM d, yyyy h:mm a')}
                    </span>
                  </div>
                  {version.change_description && (
                    <p className="text-sm text-slate-600">
                      {version.change_description}
                    </p>
                  )}
                  <p className="text-xs text-slate-400 mt-1">
                    by {version.created_by}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRestore(version)}
                  className="ml-2"
                >
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Restore
                </Button>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}