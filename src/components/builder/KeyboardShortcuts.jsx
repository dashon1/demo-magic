import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Keyboard } from "lucide-react";

export default function KeyboardShortcuts({ onSave, onPreview, onUndo, onRedo }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Save: Cmd/Ctrl + S
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        onSave?.();
      }
      
      // Preview: Cmd/Ctrl + P
      if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
        e.preventDefault();
        onPreview?.();
      }
      
      // Undo: Cmd/Ctrl + Z
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        onUndo?.();
      }
      
      // Redo: Cmd/Ctrl + Shift + Z
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'z') {
        e.preventDefault();
        onRedo?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSave, onPreview, onUndo, onRedo]);

  return null; // This is a utility component without UI
}

// Separate component to display shortcuts guide
export function KeyboardShortcutsGuide() {
  const shortcuts = [
    { keys: ['⌘/Ctrl', 'S'], action: 'Save demo' },
    { keys: ['⌘/Ctrl', 'P'], action: 'Preview demo' },
    { keys: ['⌘/Ctrl', 'Z'], action: 'Undo' },
    { keys: ['⌘/Ctrl', 'Shift', 'Z'], action: 'Redo' },
    { keys: ['Delete'], action: 'Delete selected hotspot' },
    { keys: ['Escape'], action: 'Deselect hotspot' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Keyboard className="w-4 h-4" />
          Keyboard Shortcuts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between text-xs">
              <span className="text-slate-600">{shortcut.action}</span>
              <div className="flex gap-1">
                {shortcut.keys.map((key, i) => (
                  <Badge key={i} variant="outline" className="font-mono text-xs">
                    {key}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}