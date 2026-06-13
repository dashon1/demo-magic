import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  BarChart3, 
  Users, 
  Calendar, 
  Target,
  Wand2,
  TrendingUp,
  Zap,
  Brain
} from "lucide-react";

const features = [
  {
    id: 1,
    title: "AI Demo Generator",
    description: "Generate complete demo structures from URLs with AI-powered content suggestions",
    icon: Sparkles,
    color: "from-purple-500 to-blue-600",
    status: "New",
    category: "AI-Powered"
  },
  {
    id: 2,
    title: "A/B Testing Engine",
    description: "Compare demo variants with statistical significance testing",
    icon: BarChart3,
    color: "from-orange-500 to-red-600",
    status: "Pro",
    category: "Analytics"
  },
  {
    id: 3,
    title: "Team Collaboration",
    description: "Role-based access control with email invitations and permissions",
    icon: Users,
    color: "from-blue-500 to-indigo-600",
    status: "New",
    category: "Collaboration"
  },
  {
    id: 4,
    title: "Smart Scheduling",
    description: "Auto-publish/unpublish demos at scheduled times with timezone support",
    icon: Calendar,
    color: "from-green-500 to-emerald-600",
    status: "Pro",
    category: "Automation"
  },
  {
    id: 5,
    title: "AI Lead Scoring",
    description: "Automatically qualify and score leads based on engagement patterns",
    icon: Target,
    color: "from-purple-500 to-pink-600",
    status: "AI",
    category: "Lead Management"
  },
  {
    id: 6,
    title: "Version Control",
    description: "Track changes and restore previous versions with full history",
    icon: Zap,
    color: "from-yellow-500 to-orange-600",
    status: "Core",
    category: "Workflow"
  },
  {
    id: 7,
    title: "Advanced Hotspots",
    description: "Video embeds, lead capture forms, CTAs, and branching logic",
    icon: Wand2,
    color: "from-blue-500 to-purple-600",
    status: "Core",
    category: "Interactive"
  },
  {
    id: 8,
    title: "Real-time Collaboration",
    description: "Comment on screens, resolve feedback, and collaborate in real-time",
    icon: Users,
    color: "from-pink-500 to-red-600",
    status: "New",
    category: "Collaboration"
  },
  {
    id: 9,
    title: "Performance Analytics",
    description: "Device breakdown, completion rates, and conversion tracking",
    icon: TrendingUp,
    color: "from-green-500 to-blue-600",
    status: "Core",
    category: "Analytics"
  },
  {
    id: 10,
    title: "Smart Templates",
    description: "AI-suggested templates based on industry and use case",
    icon: Brain,
    color: "from-indigo-500 to-purple-600",
    status: "AI",
    category: "Templates"
  }
];

export default function FeatureShowcase() {
  const statusColors = {
    "New": "bg-gradient-to-r from-green-600 to-emerald-600",
    "Pro": "bg-gradient-to-r from-orange-600 to-red-600",
    "AI": "bg-gradient-to-r from-purple-600 to-pink-600",
    "Core": "bg-gradient-to-r from-blue-600 to-indigo-600"
  };

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {features.map((feature, index) => {
        const Icon = feature.icon;
        return (
          <Card key={feature.id} className="hover:shadow-lg transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <Badge className={`${statusColors[feature.status]} text-white`}>
                  {feature.status}
                </Badge>
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-600 mb-3">{feature.description}</p>
              <Badge variant="outline" className="text-xs">
                {feature.category}
              </Badge>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}