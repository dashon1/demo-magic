import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Activity, Search, Filter } from "lucide-react";

export default function AdminActivity() {
  const [activities, setActivities] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("all");

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      const data = await base44.entities.ActivityLog.list("-created_date", 100);
      setActivities(data);
    } catch (error) {
      console.error("Error loading activities:", error);
    }
  };

  const actionTypes = {
    demo_created: { label: "Demo Created", color: "bg-blue-100 text-blue-800" },
    demo_published: { label: "Demo Published", color: "bg-green-100 text-green-800" },
    demo_deleted: { label: "Demo Deleted", color: "bg-red-100 text-red-800" },
    lead_captured: { label: "Lead Captured", color: "bg-purple-100 text-purple-800" },
    user_invited: { label: "User Invited", color: "bg-yellow-100 text-yellow-800" },
    settings_changed: { label: "Settings Changed", color: "bg-orange-100 text-orange-800" },
    export: { label: "Export", color: "bg-indigo-100 text-indigo-800" },
    view: { label: "View", color: "bg-slate-100 text-slate-800" }
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.user_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (activity.resource_type && activity.resource_type.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesAction = actionFilter === "all" || activity.action_type === actionFilter;
    return matchesSearch && matchesAction;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        <Link to={createPageUrl("AdminDashboard")}>
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Admin
          </Button>
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <Activity className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Activity Logs</h1>
            <p className="text-slate-600 mt-1">Track all system activities and user actions</p>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search by user or resource..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  {Object.entries(actionTypes).map(([key, { label }]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filteredActivities.map((activity) => {
                const actionInfo = actionTypes[activity.action_type] || {
                  label: activity.action_type,
                  color: "bg-slate-100 text-slate-800"
                };
                
                return (
                  <div key={activity.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={actionInfo.color}>
                            {actionInfo.label}
                          </Badge>
                          <span className="font-medium text-slate-900 text-sm">
                            {activity.user_email}
                          </span>
                        </div>
                        <div className="text-xs text-slate-600">
                          {activity.resource_type && (
                            <span className="mr-3">
                              Resource: {activity.resource_type}
                            </span>
                          )}
                          <span>
                            {new Date(activity.created_date).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              {filteredActivities.length === 0 && (
                <div className="text-center py-12">
                  <Activity className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-500">No activities found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}