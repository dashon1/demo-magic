import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, Target, DollarSign, Mail, Building2, TrendingUp, Plus
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function CRMLeads() {
  const [leads, setLeads] = useState([]);
  const [pipeline, setPipeline] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [leadsData, pipelineData] = await Promise.all([
        base44.entities.LeadCapture.list("-created_date"),
        base44.entities.CRMPipeline.list("-created_date")
      ]);
      setLeads(leadsData);
      setPipeline(pipelineData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const updatePipelineStage = async (pipelineId, newStage) => {
    try {
      await base44.entities.CRMPipeline.update(pipelineId, { 
        stage: newStage,
        last_contact: new Date().toISOString()
      });
      toast.success("Stage updated");
      loadData();
    } catch (error) {
      console.error("Error updating stage:", error);
      toast.error("Failed to update stage");
    }
  };

  const createPipeline = async (leadId) => {
    try {
      await base44.entities.CRMPipeline.create({
        lead_id: leadId,
        stage: "new",
        priority: "medium"
      });
      toast.success("Added to pipeline");
      loadData();
    } catch (error) {
      console.error("Error creating pipeline:", error);
      toast.error("Failed to add to pipeline");
    }
  };

  const stages = [
    { value: "new", label: "New", color: "bg-slate-100 text-slate-800" },
    { value: "contacted", label: "Contacted", color: "bg-blue-100 text-blue-800" },
    { value: "qualified", label: "Qualified", color: "bg-purple-100 text-purple-800" },
    { value: "proposal", label: "Proposal", color: "bg-yellow-100 text-yellow-800" },
    { value: "negotiation", label: "Negotiation", color: "bg-orange-100 text-orange-800" },
    { value: "won", label: "Won", color: "bg-green-100 text-green-800" },
    { value: "lost", label: "Lost", color: "bg-red-100 text-red-800" }
  ];

  const getLeadPipeline = (leadId) => {
    return pipeline.find(p => p.lead_id === leadId);
  };

  const getStageColor = (stage) => {
    return stages.find(s => s.value === stage)?.color || "bg-slate-100 text-slate-800";
  };

  const pipelineStats = {
    total: pipeline.length,
    won: pipeline.filter(p => p.stage === "won").length,
    revenue: pipeline.filter(p => p.stage === "won")
      .reduce((sum, p) => sum + (p.deal_value || 0), 0)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <Link to={createPageUrl("AdminDashboard")}>
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Admin
          </Button>
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
            <Target className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-slate-900">CRM & Lead Pipeline</h1>
            <p className="text-slate-600 mt-1">Manage leads and track deals through the pipeline</p>
          </div>
        </div>

        {/* Pipeline Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-blue-600 mb-1">{pipelineStats.total}</p>
              <p className="text-sm text-slate-600">Active Deals</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-green-600 mb-1">{pipelineStats.won}</p>
              <p className="text-sm text-slate-600">Closed Won</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <DollarSign className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-purple-600 mb-1">
                ${(pipelineStats.revenue / 1000).toFixed(1)}k
              </p>
              <p className="text-sm text-slate-600">Total Revenue</p>
            </CardContent>
          </Card>
        </div>

        {/* Leads List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>All Leads ({leads.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leads.map((lead, index) => {
                const leadPipeline = getLeadPipeline(lead.id);
                return (
                  <motion.div
                    key={lead.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {lead.name ? lead.name[0].toUpperCase() : "?"}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{lead.name || "No Name"}</p>
                          <div className="flex items-center gap-3 text-sm text-slate-600">
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {lead.email}
                            </span>
                            {lead.company && (
                              <span className="flex items-center gap-1">
                                <Building2 className="w-3 h-3" />
                                {lead.company}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500">
                        Captured: {new Date(lead.created_date).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {leadPipeline ? (
                        <>
                          <Select
                            value={leadPipeline.stage}
                            onValueChange={(value) => updatePipelineStage(leadPipeline.id, value)}
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {stages.map(stage => (
                                <SelectItem key={stage.value} value={stage.value}>
                                  {stage.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Badge className={getStageColor(leadPipeline.stage)}>
                            {stages.find(s => s.value === leadPipeline.stage)?.label}
                          </Badge>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => createPipeline(lead.id)}
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Add to Pipeline
                        </Button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
              {leads.length === 0 && (
                <div className="text-center py-12">
                  <Target className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-500">No leads yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}