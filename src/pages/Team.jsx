import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Shield } from "lucide-react";
import { motion } from "framer-motion";

import TeamManagement from "../components/team/TeamManagement";

export default function Team() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link to={createPageUrl("Dashboard")}>
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Team Management</h1>
              <p className="text-slate-600 text-lg mt-1">
                Collaborate with your team on interactive demos
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <div className="p-4 bg-white rounded-lg border">
              <Shield className="w-8 h-8 text-purple-600 mb-2" />
              <h3 className="font-semibold text-slate-900">Role-Based Access</h3>
              <p className="text-sm text-slate-600 mt-1">
                Control who can view, edit, or manage demos
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg border">
              <Users className="w-8 h-8 text-blue-600 mb-2" />
              <h3 className="font-semibold text-slate-900">Team Invites</h3>
              <p className="text-sm text-slate-600 mt-1">
                Invite colleagues via email instantly
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg border">
              <Shield className="w-8 h-8 text-green-600 mb-2" />
              <h3 className="font-semibold text-slate-900">Permissions</h3>
              <p className="text-sm text-slate-600 mt-1">
                Fine-grained permission controls
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg border">
              <Users className="w-8 h-8 text-orange-600 mb-2" />
              <h3 className="font-semibold text-slate-900">Activity Tracking</h3>
              <p className="text-sm text-slate-600 mt-1">
                See who's working on what
              </p>
            </div>
          </div>
        </motion.div>

        <TeamManagement />
      </div>
    </div>
  );
}