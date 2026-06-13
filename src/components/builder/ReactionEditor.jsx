import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Plus, X } from "lucide-react";

const reactionTypes = [
  { value: "confetti", label: "🎉 Confetti", description: "Celebration particles" },
  { value: "emoji", label: "😊 Emoji", description: "Animated emoji burst" },
  { value: "ripple", label: "〰️ Ripple", description: "Water ripple effect" },
  { value: "glow", label: "✨ Glow", description: "Glowing pulse" }
];

export default function ReactionEditor({ selectedHotspot, updateHotspot }) {
  const reactions = selectedHotspot?.reactions || [];

  const addReaction = () => {
    const newReaction = {
      trigger: "click",
      type: "confetti"
    };

    updateHotspot(selectedHotspot.id, {
      reactions: [...reactions, newReaction]
    });
  };

  const updateReaction = (index, updates) => {
    const updated = [...reactions];
    updated[index] = { ...updated[index], ...updates };
    updateHotspot(selectedHotspot.id, { reactions: updated });
  };

  const removeReaction = (index) => {
    updateHotspot(selectedHotspot.id, {
      reactions: reactions.filter((_, i) => i !== index)
    });
  };

  if (!selectedHotspot) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-slate-500">
          Select a hotspot to add reactions
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Sparkles className="w-4 h-4" />
          Hotspot Reactions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={addReaction} size="sm" className="w-full" variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          Add Reaction
        </Button>

        {reactions.length > 0 ? (
          <div className="space-y-3">
            {reactions.map((reaction, index) => (
              <div key={index} className="p-3 bg-slate-50 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">Reaction {index + 1}</Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeReaction(index)}
                    className="h-6 w-6"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>

                <Select
                  value={reaction.trigger}
                  onValueChange={(value) => updateReaction(index, { trigger: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="click">On Click</SelectItem>
                    <SelectItem value="hover">On Hover</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={reaction.type}
                  onValueChange={(value) => updateReaction(index, { type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {reactionTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {reaction.type === "emoji" && (
                  <Input
                    placeholder="Enter emoji (e.g., 🎉)"
                    value={reaction.emoji || ""}
                    onChange={(e) => updateReaction(index, { emoji: e.target.value })}
                  />
                )}

                <p className="text-xs text-slate-600">
                  {reactionTypes.find(t => t.value === reaction.type)?.description}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-sm text-slate-500 py-4">
            No reactions yet. Add reactions to make hotspots more engaging!
          </p>
        )}
      </CardContent>
    </Card>
  );
}