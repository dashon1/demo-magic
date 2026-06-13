import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { base44 } from "@/api/base44Client";
import { Sparkles, TrendingUp } from "lucide-react";
import { toast } from "sonner";

export default function LeadScoringStatus({ leadId, currentScore, onScoreUpdated }) {
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateScore = async () => {
    setIsCalculating(true);
    try {
      const result = await base44.functions.invoke('calculateLeadScore', {
        lead_id: leadId
      });
      
      toast.success(`Lead score updated: ${result.score}/100`);
      if (onScoreUpdated) onScoreUpdated(result);
    } catch (error) {
      console.error("Error calculating score:", error);
      toast.error("Failed to calculate lead score");
    }
    setIsCalculating(false);
  };

  const getQualificationColor = (qual) => {
    const colors = {
      qualified: "bg-green-100 text-green-800",
      hot: "bg-orange-100 text-orange-800",
      warm: "bg-yellow-100 text-yellow-800",
      cold: "bg-blue-100 text-blue-800"
    };
    return colors[qual] || "bg-slate-100 text-slate-800";
  };

  return (
    <div className="flex items-center gap-2">
      {currentScore && (
        <>
          <Badge className={getQualificationColor(currentScore.qualification)}>
            {currentScore.qualification?.toUpperCase()}
          </Badge>
          <span className="text-sm font-semibold">{currentScore.score}/100</span>
        </>
      )}
      <Button
        size="sm"
        variant="outline"
        onClick={calculateScore}
        disabled={isCalculating}
        className="ml-2"
      >
        {isCalculating ? (
          <>
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-2" />
            Calculating...
          </>
        ) : (
          <>
            <TrendingUp className="w-3 h-3 mr-2" />
            {currentScore ? 'Recalculate' : 'Calculate Score'}
          </>
        )}
      </Button>
    </div>
  );
}