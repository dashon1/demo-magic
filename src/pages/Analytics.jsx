
import React, { useState, useEffect } from "react";
import { Demo, DemoView, LeadCapture } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { 
  TrendingUp, 
  Users, 
  Eye, 
  MousePointer,
  Calendar,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, subDays, startOfDay } from "date-fns";

export default function Analytics() {
  const [demos, setDemos] = useState([]);
  const [views, setViews] = useState([]);
  const [leads, setLeads] = useState([]);
  const [selectedDemo, setSelectedDemo] = useState("all");
  const [timeRange, setTimeRange] = useState("30");
  const [analytics, setAnalytics] = useState({
    totalViews: 0,
    avgCompletion: 0,
    totalLeads: 0,
    conversionRate: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const daysAgo = parseInt(timeRange);
    const cutoffDate = startOfDay(subDays(new Date(), daysAgo));

    let filteredViews = views.filter(v => new Date(v.created_date) >= cutoffDate);
    let filteredLeads = leads.filter(l => new Date(l.created_date) >= cutoffDate);

    if (selectedDemo !== "all") {
      filteredViews = filteredViews.filter(v => v.demo_id === selectedDemo);
      filteredLeads = filteredLeads.filter(l => l.demo_id === selectedDemo);
    }

    const totalViews = filteredViews.length;
    const avgCompletion = filteredViews.reduce((sum, v) => sum + v.completion_percentage, 0) / (totalViews || 1);
    const totalLeads = filteredLeads.length;
    const conversionRate = totalViews > 0 ? (totalLeads / totalViews) * 100 : 0;

    setAnalytics({
      totalViews,
      avgCompletion: Math.round(avgCompletion),
      totalLeads,
      conversionRate: conversionRate.toFixed(2)
    });
  }, [views, leads, selectedDemo, timeRange]);

  const loadData = async () => {
    const [demosData, viewsData, leadsData] = await Promise.all([
      Demo.list(),
      DemoView.list("-created_date", 1000),
      LeadCapture.list("-created_date", 500)
    ]);
    
    setDemos(demosData);
    setViews(viewsData);
    setLeads(leadsData);
  };

  const getViewsTrendData = () => {
    const days = parseInt(timeRange);
    const data = [];
    
    // Filter views by selectedDemo and timeRange for trend data
    const cutoffDate = startOfDay(subDays(new Date(), days));
    const filteredViewsForTrend = views.filter(v => {
      const viewDate = new Date(v.created_date);
      return viewDate >= cutoffDate && (selectedDemo === "all" || v.demo_id === selectedDemo);
    });

    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dayViews = filteredViewsForTrend.filter(v => {
        const viewDate = new Date(v.created_date);
        return format(viewDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
      }).length;
      
      data.push({
        date: format(date, 'MMM d'),
        views: dayViews
      });
    }
    
    return data;
  };

  const getCompletionData = () => {
    const ranges = [
      { name: '0-25%', min: 0, max: 25 },
      { name: '26-50%', min: 26, max: 50 },
      { name: '51-75%', min: 51, max: 75 },
      { name: '76-100%', min: 76, max: 100 }
    ];

    // Filter views by selectedDemo and timeRange for completion data
    const days = parseInt(timeRange);
    const cutoffDate = startOfDay(subDays(new Date(), days));
    const filteredViewsForCompletion = views.filter(v => {
      const viewDate = new Date(v.created_date);
      return viewDate >= cutoffDate && (selectedDemo === "all" || v.demo_id === selectedDemo);
    });


    return ranges.map(range => ({
      name: range.name,
      count: filteredViewsForCompletion.filter(v => 
        v.completion_percentage >= range.min && 
        v.completion_percentage <= range.max
      ).length
    }));
  };

  const getDeviceData = () => {
    // Filter views by selectedDemo and timeRange for device data
    const days = parseInt(timeRange);
    const cutoffDate = startOfDay(subDays(new Date(), days));
    const filteredViewsForDevice = views.filter(v => {
      const viewDate = new Date(v.created_date);
      return viewDate >= cutoffDate && (selectedDemo === "all" || v.demo_id === selectedDemo);
    });


    const deviceCounts = filteredViewsForDevice.reduce((acc, view) => {
      const device = view.device_type || 'unknown';
      acc[device] = (acc[device] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(deviceCounts).map(([name, value]) => ({ name, value }));
  };

  const getDemoPerformance = () => {
    // These specific performance metrics already rely on the `demos` state and then
    // filter `views` and `leads` based on `demo.id`.
    // The `calculateAnalytics` useEffect already handles filtering `views` and `leads` based on `selectedDemo` and `timeRange`
    // but for this specific component that shows "Top Performing Demos" we want to show all demos if "All Demos" is selected,
    // or just the selected demo if one is picked, and apply the time range.

    const days = parseInt(timeRange);
    const cutoffDate = startOfDay(subDays(new Date(), days));

    const allFilteredViews = views.filter(v => new Date(v.created_date) >= cutoffDate);
    const allFilteredLeads = leads.filter(l => new Date(l.created_date) >= cutoffDate);

    let demosToDisplay = demos;
    if (selectedDemo !== "all") {
      demosToDisplay = demos.filter(d => d.id === selectedDemo);
    }

    return demosToDisplay.map(demo => {
      const demoViews = allFilteredViews.filter(v => v.demo_id === demo.id);
      const demoLeads = allFilteredLeads.filter(l => l.demo_id === demo.id);
      
      return {
        name: demo.title.substring(0, 20),
        views: demoViews.length,
        leads: demoLeads.length,
        conversion: demoViews.length > 0 ? ((demoLeads.length / demoViews.length) * 100).toFixed(1) : 0
      };
    }).sort((a, b) => b.views - a.views).slice(0, selectedDemo === "all" ? 5 : 1); // Show top 5 if "all", else just the selected one
  };

  const COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Analytics Dashboard</h1>
            <p className="text-slate-600 mt-1">Track demo performance and engagement</p>
          </div>
          <div className="flex gap-3">
            <Select value={selectedDemo} onValueChange={setSelectedDemo}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Demos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Demos</SelectItem>
                {demos.map(demo => (
                  <SelectItem key={demo.id} value={demo.id}>
                    {demo.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader className="p-6 pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-slate-600">Total Views</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">
                    {analytics.totalViews}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Eye className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-2">
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>+12% from last period</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader className="p-6 pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-slate-600">Avg Completion</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">
                    {analytics.avgCompletion}%
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-xl">
                  <MousePointer className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-2">
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>+5% from last period</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader className="p-6 pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-slate-600">Total Leads</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">
                    {analytics.totalLeads}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-xl">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-2">
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>+8% from last period</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader className="p-6 pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-slate-600">Conversion Rate</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">
                    {analytics.conversionRate}%
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-xl">
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-2">
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>+3% from last period</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Views Trend */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Views Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={getViewsTrendData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="views" stroke="#3B82F6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Completion Distribution */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Completion Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getCompletionData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Device Breakdown */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Device Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={getDeviceData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {getDeviceData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Performing Demos */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Top Performing Demos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getDemoPerformance().map((demo, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{demo.name}</p>
                      <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                        <span>{demo.views} views</span>
                        <span>{demo.leads} leads</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">{demo.conversion}%</p>
                      <p className="text-xs text-slate-500">conversion</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
