import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { base44 } from "@/api/base44Client";
import { Calendar, Clock } from "lucide-react";
import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function DemoScheduler({ demos }) {
  const [schedules, setSchedules] = useState([]);
  const [newSchedule, setNewSchedule] = useState({
    demo_id: "",
    publish_date: "",
    unpublish_date: "",
    auto_publish: true
  });
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    try {
      const data = await base44.entities.DemoSchedule.list("-publish_date");
      setSchedules(data);
    } catch (error) {
      console.error("Error loading schedules:", error);
    }
  };

  const createSchedule = async () => {
    if (!newSchedule.demo_id || !newSchedule.publish_date) {
      toast.error("Please select a demo and publish date");
      return;
    }

    setIsCreating(true);
    try {
      await base44.entities.DemoSchedule.create(newSchedule);
      toast.success("Demo scheduled successfully!");
      setNewSchedule({
        demo_id: "",
        publish_date: "",
        unpublish_date: "",
        auto_publish: true
      });
      loadSchedules();
    } catch (error) {
      console.error("Error creating schedule:", error);
      toast.error("Failed to schedule demo");
    }
    setIsCreating(false);
  };

  const cancelSchedule = async (scheduleId) => {
    if (!confirm("Cancel this scheduled publication?")) return;

    try {
      await base44.entities.DemoSchedule.update(scheduleId, { status: "cancelled" });
      toast.success("Schedule cancelled");
      loadSchedules();
    } catch (error) {
      console.error("Error cancelling schedule:", error);
      toast.error("Failed to cancel schedule");
    }
  };

  const statusColors = {
    scheduled: "bg-blue-100 text-blue-800",
    published: "bg-green-100 text-green-800",
    unpublished: "bg-slate-100 text-slate-800",
    cancelled: "bg-red-100 text-red-800"
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-900">
            <Calendar className="w-5 h-5" />
            Schedule Demo Publication
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Select Demo</label>
            <Select
              value={newSchedule.demo_id}
              onValueChange={(value) => setNewSchedule({ ...newSchedule, demo_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a demo" />
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

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                <Clock className="w-3 h-3 inline mr-1" />
                Publish Date & Time
              </label>
              <Input
                type="datetime-local"
                value={newSchedule.publish_date}
                onChange={(e) => setNewSchedule({ ...newSchedule, publish_date: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                <Clock className="w-3 h-3 inline mr-1" />
                Unpublish Date (Optional)
              </label>
              <Input
                type="datetime-local"
                value={newSchedule.unpublish_date}
                onChange={(e) => setNewSchedule({ ...newSchedule, unpublish_date: e.target.value })}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-white rounded-lg">
            <input
              type="checkbox"
              id="auto_publish"
              checked={newSchedule.auto_publish}
              onChange={(e) => setNewSchedule({ ...newSchedule, auto_publish: e.target.checked })}
              className="w-4 h-4"
            />
            <label htmlFor="auto_publish" className="text-sm text-slate-700">
              Automatically publish at scheduled time
            </label>
          </div>

          <Button
            onClick={createSchedule}
            disabled={isCreating}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          >
            {isCreating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Scheduling...
              </>
            ) : (
              <>
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Publication
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {schedules.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Scheduled Demos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {schedules.map((schedule, index) => {
                const demo = demos.find(d => d.id === schedule.demo_id);
                return (
                  <motion.div
                    key={schedule.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 border rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-slate-900">
                          {demo?.title || "Unknown Demo"}
                        </h4>
                        <p className="text-sm text-slate-500 mt-1">
                          Publishes: {format(parseISO(schedule.publish_date), "PPp")}
                        </p>
                        {schedule.unpublish_date && (
                          <p className="text-sm text-slate-500">
                            Unpublishes: {format(parseISO(schedule.unpublish_date), "PPp")}
                          </p>
                        )}
                      </div>
                      <Badge className={statusColors[schedule.status]}>
                        {schedule.status}
                      </Badge>
                    </div>
                    {schedule.status === "scheduled" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => cancelSchedule(schedule.id)}
                        className="mt-2"
                      >
                        Cancel Schedule
                      </Button>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}