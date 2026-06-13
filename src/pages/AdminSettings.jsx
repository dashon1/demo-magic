import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Settings, Sparkles, Shield, Zap } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function AdminSettings() {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      let existingSettings = await base44.entities.SystemSettings.list();
      
      if (existingSettings.length === 0) {
        const defaultSettings = [
          {
            setting_key: "ai_demo_generator_enabled",
            setting_value: "true",
            category: "features",
            data_type: "boolean",
            description: "Enable AI-powered demo generation from URLs",
            is_pro_feature: true
          },
          {
            setting_key: "ab_testing_enabled",
            setting_value: "true",
            category: "features",
            data_type: "boolean",
            description: "Enable A/B testing for demos",
            is_pro_feature: true
          },
          {
            setting_key: "team_collaboration_enabled",
            setting_value: "true",
            category: "features",
            data_type: "boolean",
            description: "Enable team collaboration features",
            is_pro_feature: false
          },
          {
            setting_key: "lead_scoring_enabled",
            setting_value: "true",
            category: "features",
            data_type: "boolean",
            description: "Enable AI-powered lead scoring",
            is_pro_feature: true
          },
          {
            setting_key: "demo_scheduling_enabled",
            setting_value: "true",
            category: "features",
            data_type: "boolean",
            description: "Enable scheduled demo publishing",
            is_pro_feature: true
          },
          {
            setting_key: "max_demos_per_user",
            setting_value: "50",
            category: "limits",
            data_type: "number",
            description: "Maximum demos per user",
            is_pro_feature: false
          },
          {
            setting_key: "max_team_members",
            setting_value: "10",
            category: "limits",
            data_type: "number",
            description: "Maximum team members allowed",
            is_pro_feature: false
          },
          {
            setting_key: "version_history_enabled",
            setting_value: "true",
            category: "features",
            data_type: "boolean",
            description: "Enable version history tracking",
            is_pro_feature: false
          },
          {
            setting_key: "analytics_retention_days",
            setting_value: "90",
            category: "limits",
            data_type: "number",
            description: "Days to retain analytics data",
            is_pro_feature: false
          },
          {
            setting_key: "multi_language_enabled",
            setting_value: "false",
            category: "features",
            data_type: "boolean",
            description: "Enable multi-language support (Coming Soon)",
            is_pro_feature: true
          }
        ];

        await base44.entities.SystemSettings.bulkCreate(defaultSettings);
        existingSettings = await base44.entities.SystemSettings.list();
      }

      setSettings(existingSettings);
      setLoading(false);
    } catch (error) {
      console.error("Error loading settings:", error);
      setLoading(false);
    }
  };

  const toggleSetting = async (settingId, currentValue) => {
    const newValue = currentValue === "true" ? "false" : "true";
    try {
      await base44.entities.SystemSettings.update(settingId, {
        setting_value: newValue
      });
      toast.success("Setting updated");
      loadSettings();
    } catch (error) {
      console.error("Error updating setting:", error);
      toast.error("Failed to update setting");
    }
  };

  const updateNumberSetting = async (settingId, newValue) => {
    try {
      await base44.entities.SystemSettings.update(settingId, {
        setting_value: newValue
      });
      toast.success("Setting updated");
      loadSettings();
    } catch (error) {
      console.error("Error updating setting:", error);
      toast.error("Failed to update setting");
    }
  };

  const categories = {
    features: { title: "Feature Toggles", icon: Sparkles, color: "from-purple-500 to-blue-600" },
    limits: { title: "System Limits", icon: Shield, color: "from-orange-500 to-red-600" },
    branding: { title: "Branding", icon: Zap, color: "from-green-500 to-emerald-600" }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-5xl mx-auto">
        <Link to={createPageUrl("AdminDashboard")}>
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Admin
          </Button>
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
            <Settings className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-slate-900">System Settings</h1>
            <p className="text-slate-600 mt-1">Configure features, limits, and pro toggles</p>
          </div>
        </div>

        {Object.entries(categories).map(([categoryKey, categoryInfo]) => {
          const categorySettings = settings.filter(s => s.category === categoryKey);
          if (categorySettings.length === 0) return null;

          const Icon = categoryInfo.icon;
          
          return (
            <Card key={categoryKey} className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${categoryInfo.color}`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  {categoryInfo.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {categorySettings.map((setting, index) => (
                  <motion.div
                    key={setting.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-slate-900">
                          {setting.setting_key.split("_").map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(" ")}
                        </p>
                        {setting.is_pro_feature && (
                          <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                            Pro
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-600">{setting.description}</p>
                    </div>
                    <div className="ml-4">
                      {setting.data_type === "boolean" ? (
                        <Switch
                          checked={setting.setting_value === "true"}
                          onCheckedChange={() => toggleSetting(setting.id, setting.setting_value)}
                        />
                      ) : (
                        <Input
                          type="number"
                          value={setting.setting_value}
                          onChange={(e) => updateNumberSetting(setting.id, e.target.value)}
                          className="w-24"
                        />
                      )}
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}