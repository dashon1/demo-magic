import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  Eye, 
  Clock, 
  TrendingUp,
  Monitor
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const statCards = [
  {
    title: "Total Demos",
    key: "totalDemos",
    icon: Monitor,
    color: "from-blue-500 to-cyan-500"
  },
  {
    title: "Total Views",
    key: "totalViews", 
    icon: Eye,
    color: "from-green-500 to-emerald-500"
  },
  {
    title: "Avg Completion",
    key: "avgCompletion",
    icon: BarChart3,
    color: "from-purple-500 to-violet-500",
    suffix: "%"
  },
  {
    title: "Avg View Time",
    key: "avgTime",
    icon: Clock,
    color: "from-orange-500 to-red-500",
    suffix: "min"
  }
];

export default function StatsOverview({ analytics, isLoading }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="relative overflow-hidden bg-white/80 backdrop-blur-sm border-slate-200 hover:shadow-lg transition-all duration-300 group">
            <div className={`absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8 bg-gradient-to-br ${stat.color} rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />
            <CardHeader className="p-6 pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-sm font-medium text-slate-600">
                    {stat.title}
                  </CardTitle>
                  {isLoading ? (
                    <Skeleton className="h-8 w-16 mt-2" />
                  ) : (
                    <div className="text-3xl font-bold text-slate-900 mt-2">
                      {analytics?.[stat.key] || 0}{stat.suffix || ''}
                    </div>
                  )}
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-20 group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className={`w-5 h-5 text-transparent bg-gradient-to-br ${stat.color} bg-clip-text`} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="flex items-center text-sm">
                <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
                <span className="text-green-600 font-medium">+12%</span>
                <span className="text-slate-500 ml-1">this month</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}