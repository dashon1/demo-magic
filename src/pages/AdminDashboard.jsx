import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, Users, Database, Activity, Settings, TrendingUp,
  ArrowUpRight, CheckCircle2, DollarSign
} from "lucide-react";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDemos: 0,
    totalLeads: 0,
    activeTeams: 0,
    revenue: 0,
    activityCount: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [systemHealth, setSystemHealth] = useState("operational");

  useEffect(() => {
    loadAdminStats();
    loadRecentActivity();
  }, []);

  const loadAdminStats = async () => {
    try {
      const [users, demos, leads, teams, activities, pipeline] = await Promise.all([
        base44.entities.User.list(),
        base44.entities.Demo.list(),
        base44.entities.LeadCapture.list(),
        base44.entities.TeamMember.list(),
        base44.entities.ActivityLog.list(),
        base44.entities.CRMPipeline.list()
      ]);

      const revenue = pipeline
        .filter(p => p.stage === "won")
        .reduce((sum, p) => sum + (p.deal_value || 0), 0);

      setStats({
        totalUsers: users.length,
        totalDemos: demos.length,
        totalLeads: leads.length,
        activeTeams: teams.filter(t => t.invitation_status === "accepted").length,
        revenue: revenue,
        activityCount: activities.length
      });
    } catch (error) {
      console.error("Error loading admin stats:", error);
    }
  };

  const loadRecentActivity = async () => {
    try {
      const activities = await base44.entities.ActivityLog.list("-created_date", 10);
      setRecentActivity(activities);
    } catch (error) {
      console.error("Error loading activities:", error);
    }
  };

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "from-blue-500 to-blue-600",
      change: "+12%",
      link: createPageUrl("AdminUsers")
    },
    {
      title: "Total Demos",
      value: stats.totalDemos,
      icon: Database,
      color: "from-purple-500 to-purple-600",
      change: "+8%",
      link: createPageUrl("Library")
    },
    {
      title: "Total Leads",
      value: stats.totalLeads,
      icon: TrendingUp,
      color: "from-green-500 to-green-600",
      change: "+24%",
      link: createPageUrl("CRMLeads")
    },
    {
      title: "Revenue (Won)",
      value: `$${(stats.revenue / 1000).toFixed(1)}k`,
      icon: DollarSign,
      color: "from-orange-500 to-orange-600",
      change: "+18%",
      link: createPageUrl("CRMLeads")
    }
  ];

  const actionTypeLabels = {
    demo_created: "Created Demo",
    demo_published: "Published Demo",
    demo_deleted: "Deleted Demo",
    lead_captured: "New Lead",
    user_invited: "Invited User",
    settings_changed: "Changed Settings",
    export: "Exported Data",
    view: "Viewed Demo"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Admin Dashboard</h1>
              <p className="text-slate-600 mt-1">System overview and management</p>
            </div>
          </div>
          <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            System Healthy
          </Badge>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={stat.link}>
                <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                      <Badge variant="outline" className="text-green-600">
                        {stat.change}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.length === 0 ? (
                  <p className="text-center text-slate-500 py-8">No recent activity</p>
                ) : (
                  recentActivity.map((activity, index) => (
                    <div key={activity.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-900 text-sm">
                          {actionTypeLabels[activity.action_type] || activity.action_type}
                        </p>
                        <p className="text-xs text-slate-500">
                          {activity.user_email} • {new Date(activity.created_date).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <Link to={createPageUrl("AdminActivity")}>
                <Button variant="outline" className="w-full mt-4">
                  View All Activity
                  <ArrowUpRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to={createPageUrl("AdminUsers")}>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Manage Users
                </Button>
              </Link>
              <Link to={createPageUrl("CRMLeads")}>
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  CRM & Pipeline
                </Button>
              </Link>
              <Link to={createPageUrl("AdminSettings")}>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="w-4 h-4 mr-2" />
                  System Settings
                </Button>
              </Link>
              <Link to={createPageUrl("AdminActivity")}>
                <Button variant="outline" className="w-full justify-start">
                  <Activity className="w-4 h-4 mr-2" />
                  Activity Logs
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}