import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { base44 } from "@/api/base44Client";
import { Target, Flame, Snowflake, ThermometerSun } from "lucide-react";
import { motion } from "framer-motion";

export default function LeadScoringPanel({ leads }) {
  const [scoredLeads, setScoredLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    scoreLeads();
  }, [leads]);

  const scoreLeads = async () => {
    setIsLoading(true);
    try {
      const scores = await base44.entities.LeadScore.list("-score");
      const leadsWithScores = leads.map(lead => {
        const scoreData = scores.find(s => s.lead_id === lead.id);
        return {
          ...lead,
          score: scoreData?.score || 0,
          qualification: scoreData?.qualification || "cold",
          engagement_score: scoreData?.engagement_score || 0,
          demographic_score: scoreData?.demographic_score || 0,
          behavior_score: scoreData?.behavior_score || 0
        };
      }).sort((a, b) => b.score - a.score);

      setScoredLeads(leadsWithScores);
    } catch (error) {
      console.error("Error scoring leads:", error);
    }
    setIsLoading(false);
  };

  const qualificationConfig = {
    cold: {
      icon: Snowflake,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      label: "Cold Lead"
    },
    warm: {
      icon: ThermometerSun,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      label: "Warm Lead"
    },
    hot: {
      icon: Flame,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      label: "Hot Lead"
    },
    qualified: {
      icon: Target,
      color: "text-green-600",
      bgColor: "bg-green-100",
      label: "Qualified"
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-orange-600";
    if (score >= 40) return "text-yellow-600";
    return "text-slate-600";
  };

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-900">
          <Target className="w-5 h-5" />
          Lead Scoring & Qualification
          <Badge className="ml-auto bg-gradient-to-r from-purple-600 to-pink-600">
            AI-Powered
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto" />
            <p className="text-sm text-slate-600 mt-2">Analyzing leads...</p>
          </div>
        ) : scoredLeads.length === 0 ? (
          <div className="text-center py-8">
            <Target className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-500">No leads to score yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Summary Stats */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {Object.entries(qualificationConfig).map(([key, config]) => {
                const count = scoredLeads.filter(l => l.qualification === key).length;
                const Icon = config.icon;
                return (
                  <div key={key} className={`p-3 ${config.bgColor} rounded-lg text-center`}>
                    <Icon className={`w-5 h-5 ${config.color} mx-auto mb-1`} />
                    <p className="text-2xl font-bold text-slate-900">{count}</p>
                    <p className="text-xs text-slate-600">{config.label}</p>
                  </div>
                );
              })}
            </div>

            {/* Lead List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {scoredLeads.slice(0, 10).map((lead, index) => {
                const config = qualificationConfig[lead.qualification];
                const Icon = config.icon;
                return (
                  <motion.div
                    key={lead.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 bg-white border rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-slate-900">{lead.name || lead.email}</h4>
                          <Badge className={config.bgColor + " " + config.color} variant="outline">
                            <Icon className="w-3 h-3 mr-1" />
                            {config.label}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-500">{lead.email}</p>
                        {lead.company && (
                          <p className="text-sm text-slate-500">{lead.company}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className={`text-3xl font-bold ${getScoreColor(lead.score)}`}>
                          {lead.score}
                        </p>
                        <p className="text-xs text-slate-500">Score</p>
                      </div>
                    </div>

                    {/* Score Breakdown */}
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-xs text-slate-600 mb-1">
                          <span>Engagement</span>
                          <span>{lead.engagement_score}/100</span>
                        </div>
                        <Progress value={lead.engagement_score} className="h-1.5" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-slate-600 mb-1">
                          <span>Demographics</span>
                          <span>{lead.demographic_score}/100</span>
                        </div>
                        <Progress value={lead.demographic_score} className="h-1.5" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-slate-600 mb-1">
                          <span>Behavior</span>
                          <span>{lead.behavior_score}/100</span>
                        </div>
                        <Progress value={lead.behavior_score} className="h-1.5" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {scoredLeads.length > 10 && (
              <p className="text-center text-sm text-slate-500">
                Showing top 10 of {scoredLeads.length} leads
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}