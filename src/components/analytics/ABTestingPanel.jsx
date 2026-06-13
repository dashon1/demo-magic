import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { base44 } from "@/api/base44Client";
import { BarChart3, Play, Pause, TrendingUp, Target } from "lucide-react";
import { toast } from "sonner";

export default function ABTestingPanel({ demos }) {
  const [tests, setTests] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newTest, setNewTest] = useState({
    name: "",
    demo_a_id: "",
    demo_b_id: "",
    goal_metric: "completion_rate",
    traffic_split: 50
  });

  useEffect(() => {
    loadTests();
  }, []);

  const loadTests = async () => {
    try {
      const data = await base44.entities.ABTest.list("-created_date");
      setTests(data);
    } catch (error) {
      console.error("Error loading tests:", error);
    }
  };

  const createTest = async () => {
    if (!newTest.name || !newTest.demo_a_id || !newTest.demo_b_id) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsCreating(true);
    try {
      await base44.entities.ABTest.create(newTest);
      toast.success("A/B test created!");
      setNewTest({
        name: "",
        demo_a_id: "",
        demo_b_id: "",
        goal_metric: "completion_rate",
        traffic_split: 50
      });
      loadTests();
    } catch (error) {
      console.error("Error creating test:", error);
      toast.error("Failed to create test");
    }
    setIsCreating(false);
  };

  const toggleTest = async (test) => {
    try {
      const newStatus = test.status === "running" ? "completed" : "running";
      await base44.entities.ABTest.update(test.id, { status: newStatus });
      toast.success(`Test ${newStatus === "running" ? "started" : "paused"}`);
      loadTests();
    } catch (error) {
      console.error("Error toggling test:", error);
    }
  };

  const goalMetrics = {
    views: "Total Views",
    completion_rate: "Completion Rate",
    leads: "Lead Conversions",
    ctr: "Click-Through Rate"
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-900">
            <BarChart3 className="w-5 h-5" />
            A/B Testing
            <Badge className="ml-auto bg-orange-600">Pro</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Test Name</label>
              <Input
                placeholder="Homepage Demo Test"
                value={newTest.name}
                onChange={(e) => setNewTest({ ...newTest, name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Goal Metric</label>
              <Select
                value={newTest.goal_metric}
                onValueChange={(value) => setNewTest({ ...newTest, goal_metric: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(goalMetrics).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Demo A (Control)</label>
              <Select
                value={newTest.demo_a_id}
                onValueChange={(value) => setNewTest({ ...newTest, demo_a_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select demo" />
                </SelectTrigger>
                <SelectContent>
                  {demos.map((demo) => (
                    <SelectItem key={demo.id} value={demo.id}>
                      {demo.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Demo B (Variant)</label>
              <Select
                value={newTest.demo_b_id}
                onValueChange={(value) => setNewTest({ ...newTest, demo_b_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select demo" />
                </SelectTrigger>
                <SelectContent>
                  {demos.map((demo) => (
                    <SelectItem key={demo.id} value={demo.id}>
                      {demo.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Traffic Split: {newTest.traffic_split}% / {100 - newTest.traffic_split}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={newTest.traffic_split}
              onChange={(e) => setNewTest({ ...newTest, traffic_split: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>

          <Button
            onClick={createTest}
            disabled={isCreating}
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
          >
            <Target className="w-4 h-4 mr-2" />
            Create A/B Test
          </Button>
        </CardContent>
      </Card>

      {/* Active Tests */}
      {tests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Active Tests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {tests.map((test) => (
              <div key={test.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-slate-900">{test.name}</h4>
                    <p className="text-sm text-slate-500">
                      Goal: {goalMetrics[test.goal_metric]}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleTest(test)}
                  >
                    {test.status === "running" ? (
                      <>
                        <Pause className="w-3 h-3 mr-1" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3 mr-1" />
                        Start
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-600 mb-1">Variant A</p>
                    <Badge variant="outline">
                      {test.results?.variant_a?.conversions || 0} conversions
                    </Badge>
                  </div>
                  <div>
                    <p className="text-slate-600 mb-1">Variant B</p>
                    <Badge variant="outline">
                      {test.results?.variant_b?.conversions || 0} conversions
                    </Badge>
                  </div>
                </div>

                {test.results?.winner && (
                  <div className="mt-3 p-2 bg-green-50 rounded text-sm text-green-900 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Winner: Variant {test.results.winner}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}