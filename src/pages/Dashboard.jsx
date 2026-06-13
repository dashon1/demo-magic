import React, { useState, useEffect } from "react";
import { Demo, DemoView } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

import StatsOverview from "../components/dashboard/StatsOverview";
import RecentDemos from "../components/dashboard/RecentDemos";
import QuickActions from "../components/dashboard/QuickActions";
import FirstTimeWelcome from "../components/onboarding/FirstTimeWelcome";

export default function Dashboard() {
  const [demos, setDemos] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    loadDashboardData();
    checkFirstTime();
  }, []);

  const checkFirstTime = () => {
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome) {
      setShowWelcome(true);
    }
  };

  const handleCloseWelcome = () => {
    localStorage.setItem('hasSeenWelcome', 'true');
    setShowWelcome(false);
  };

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [demosData, viewsData] = await Promise.all([
        Demo.list("-updated_date", 10),
        DemoView.list("-created_date", 100)
      ]);
      
      setDemos(demosData);
      
      const totalViews = viewsData.length;
      const avgCompletion = viewsData.reduce((sum, view) => sum + view.completion_percentage, 0) / (viewsData.length || 1);
      const totalTime = viewsData.reduce((sum, view) => sum + view.time_spent, 0);
      const avgTime = totalTime / (viewsData.length || 1);

      setAnalytics({
        totalDemos: demosData.length,
        totalViews,
        avgCompletion: Math.round(avgCompletion),
        avgTime: Math.round(avgTime / 60)
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              Welcome back! 👋
            </h1>
            <p className="text-slate-600 text-lg">
              Create engaging product demos that convert visitors into customers
            </p>
          </div>
          <Link to={createPageUrl("Builder")}>
            <Button 
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create New Demo
            </Button>
          </Link>
        </motion.div>

        <StatsOverview analytics={analytics} isLoading={isLoading} />

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <RecentDemos demos={demos} isLoading={isLoading} />
          </div>
          <div>
            <QuickActions />
          </div>
        </div>
      </div>

      {showWelcome && (
        <FirstTimeWelcome
          onClose={handleCloseWelcome}
          onStartTour={() => {
            handleCloseWelcome();
            window.location.href = createPageUrl("Builder");
          }}
        />
      )}
    </div>
  );
}