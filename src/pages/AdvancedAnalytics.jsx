import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BarChart3, Target, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

import ABTestingPanel from "../components/analytics/ABTestingPanel";
import DemoScheduler from "../components/scheduling/DemoScheduler";
import LeadScoringPanel from "../components/leads/LeadScoringPanel";

export default function AdvancedAnalytics() {
  const [demos, setDemos] = useState([]);
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [demosData, leadsData] = await Promise.all([
        base44.entities.Demo.list(),
        base44.entities.LeadCapture.list("-created_date", 100)
      ]);
      setDemos(demosData);
      setLeads(leadsData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link to={createPageUrl("Analytics")}>
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Analytics
            </Button>
          </Link>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Advanced Analytics</h1>
              <p className="text-slate-600 text-lg mt-1">
                A/B testing, lead scoring, and advanced insights
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-white rounded-lg border">
              <BarChart3 className="w-8 h-8 text-orange-600 mb-2" />
              <h3 className="font-semibold text-slate-900">A/B Testing</h3>
              <p className="text-sm text-slate-600 mt-1">
                Compare demo variants to optimize performance
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg border">
              <Target className="w-8 h-8 text-purple-600 mb-2" />
              <h3 className="font-semibold text-slate-900">Lead Scoring</h3>
              <p className="text-sm text-slate-600 mt-1">
                AI-powered lead qualification and prioritization
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg border">
              <TrendingUp className="w-8 h-8 text-green-600 mb-2" />
              <h3 className="font-semibold text-slate-900">Scheduling</h3>
              <p className="text-sm text-slate-600 mt-1">
                Schedule demos to publish automatically
              </p>
            </div>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
            <p className="text-slate-600">Loading advanced analytics...</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <ABTestingPanel demos={demos} />
              <DemoScheduler demos={demos} />
            </div>
            <div>
              <LeadScoringPanel leads={leads} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}