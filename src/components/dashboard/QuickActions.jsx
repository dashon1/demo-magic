import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Plus, 
  BarChart3,
  Sparkles,
  FileImage
} from "lucide-react";
import { motion } from "framer-motion";

const quickActions = [
  {
    title: "Create Demo",
    description: "Start building a new interactive demo",
    icon: Plus,
    href: createPageUrl("Builder"),
    color: "from-blue-500 to-purple-600"
  },
  {
    title: "AI Studio",
    description: "Generate demos automatically with AI",
    icon: Sparkles,
    href: createPageUrl("AIStudio"),
    color: "from-purple-500 to-blue-600",
    badge: "New"
  },
  {
    title: "Advanced Analytics",
    description: "A/B testing, lead scoring & insights",
    icon: BarChart3,
    href: createPageUrl("AdvancedAnalytics"),
    color: "from-orange-500 to-red-600",
    badge: "Pro"
  },
  {
    title: "Team Management",
    description: "Invite team members and manage access",
    icon: FileImage,
    href: createPageUrl("Team"),
    color: "from-blue-500 to-indigo-600"
  }
];

export default function QuickActions() {
  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
        <CardHeader className="p-6 border-b border-slate-100">
          <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={action.href}>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start p-4 h-auto hover:bg-slate-50 group transition-all duration-200"
                  >
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${action.color} mr-4 group-hover:scale-110 transition-transform duration-200`}>
                      <action.icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors duration-200 flex items-center gap-2">
                        {action.title}
                        {action.badge && (
                          <span className="text-xs bg-gradient-to-r from-purple-600 to-blue-600 text-white px-2 py-0.5 rounded-full">
                            {action.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500">
                        {action.description}
                      </div>
                    </div>
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pro Tips Card */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Pro Tip</h3>
              <p className="text-sm text-slate-600 mb-3">
                Add interactive hotspots to guide users through your product features and increase engagement rates.
              </p>
              <Link to={createPageUrl("Builder")}>
                <Button size="sm" variant="outline">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}