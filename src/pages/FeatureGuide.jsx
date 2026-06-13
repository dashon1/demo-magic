import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Sparkles, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

import FeatureShowcase from "../components/misc/FeatureShowcase";

export default function FeatureGuide() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link to={createPageUrl("Dashboard")}>
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-slate-900 mb-4">
              DemoMagic Super App Features
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              10 powerful new features that transform DemoMagic into an enterprise-grade demo creation platform
            </p>
          </div>

          {/* Key Highlights */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">10+</div>
                <p className="text-slate-700 font-medium">New Features</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">5</div>
                <p className="text-slate-700 font-medium">AI-Powered Tools</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">100%</div>
                <p className="text-slate-700 font-medium">Production Ready</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Feature Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">All Features</h2>
          <FeatureShowcase />
        </div>

        {/* What's New Section */}
        <Card className="bg-white border-2 border-purple-200 mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Sparkles className="w-6 h-6 text-purple-600" />
              What's New in This Update
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-slate-900 mb-3 text-lg">🤖 AI-Powered Features</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>AI Demo Generator:</strong> Analyze websites and auto-generate demo structures with hotspot suggestions
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>Lead Scoring AI:</strong> Automatically qualify and prioritize leads with engagement-based scoring
                    </div>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 mb-3 text-lg">📊 Advanced Analytics</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>A/B Testing:</strong> Compare demo variants with statistical significance
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>Lead Qualification:</strong> Score and categorize leads automatically
                    </div>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 mb-3 text-lg">👥 Team Collaboration</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>Team Management:</strong> Invite members with role-based permissions
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>Real-time Comments:</strong> Collaborate with feedback on screens
                    </div>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 mb-3 text-lg">⚡ Automation</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>Smart Scheduling:</strong> Auto-publish demos at specific times
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>Version Control:</strong> Track all changes with full history
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technical Overview */}
        <Card className="bg-gradient-to-br from-slate-50 to-blue-50">
          <CardHeader>
            <CardTitle className="text-2xl">Technical Specifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-bold text-slate-900 mb-2">New Entities</h4>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• AIGeneration</li>
                  <li>• ABTest</li>
                  <li>• TeamMember</li>
                  <li>• DemoSchedule</li>
                  <li>• LeadScore</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-2">New Pages</h4>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• AIStudio</li>
                  <li>• Team</li>
                  <li>• AdvancedAnalytics</li>
                  <li>• FeatureGuide</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-2">New Components</h4>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• AIContentGenerator</li>
                  <li>• ABTestingPanel</li>
                  <li>• TeamManagement</li>
                  <li>• DemoScheduler</li>
                  <li>• LeadScoringPanel</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}