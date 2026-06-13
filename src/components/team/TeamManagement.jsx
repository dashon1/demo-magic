import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { base44 } from "@/api/base44Client";
import { Users, UserPlus, Mail, Shield, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function TeamManagement() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("viewer");
  const [isInviting, setIsInviting] = useState(false);

  useEffect(() => {
    loadTeam();
  }, []);

  const loadTeam = async () => {
    try {
      const data = await base44.entities.TeamMember.list("-created_date");
      setTeamMembers(data);
    } catch (error) {
      console.error("Error loading team:", error);
    }
  };

  const inviteMember = async () => {
    if (!newMemberEmail.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    setIsInviting(true);
    try {
      const currentUser = await base44.auth.me();
      
      await base44.entities.TeamMember.create({
        user_email: newMemberEmail,
        role: newMemberRole,
        invited_by: currentUser.email,
        invitation_status: "pending"
      });

      // Send invitation email
      await base44.integrations.Core.SendEmail({
        to: newMemberEmail,
        subject: "You've been invited to join DemoMagic",
        body: `You've been invited to join the DemoMagic team as a ${newMemberRole}. Click here to accept the invitation.`
      });

      toast.success("Invitation sent successfully!");
      setNewMemberEmail("");
      setNewMemberRole("viewer");
      loadTeam();
    } catch (error) {
      console.error("Error inviting member:", error);
      toast.error("Failed to send invitation");
    }
    setIsInviting(false);
  };

  const removeMember = async (memberId) => {
    if (!confirm("Remove this team member?")) return;

    try {
      await base44.entities.TeamMember.delete(memberId);
      toast.success("Team member removed");
      loadTeam();
    } catch (error) {
      console.error("Error removing member:", error);
      toast.error("Failed to remove member");
    }
  };

  const updateRole = async (memberId, newRole) => {
    try {
      await base44.entities.TeamMember.update(memberId, { role: newRole });
      toast.success("Role updated successfully");
      loadTeam();
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Failed to update role");
    }
  };

  const roleColors = {
    owner: "bg-purple-100 text-purple-800",
    editor: "bg-blue-100 text-blue-800",
    viewer: "bg-slate-100 text-slate-800",
    analyst: "bg-green-100 text-green-800"
  };

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    accepted: "bg-green-100 text-green-800",
    declined: "bg-red-100 text-red-800"
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <UserPlus className="w-5 h-5" />
            Invite Team Member
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type="email"
                  placeholder="colleague@company.com"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Role</label>
              <Select value={newMemberRole} onValueChange={setNewMemberRole}>
                <SelectTrigger>
                  <Shield className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">Viewer - View only</SelectItem>
                  <SelectItem value="editor">Editor - Create & edit</SelectItem>
                  <SelectItem value="analyst">Analyst - View analytics</SelectItem>
                  <SelectItem value="owner">Owner - Full access</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={inviteMember}
            disabled={isInviting}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            {isInviting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Sending Invitation...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4 mr-2" />
                Send Invitation
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Team Members
            <Badge variant="outline" className="ml-auto">
              {teamMembers.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {teamMembers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-500">No team members yet</p>
                <p className="text-sm text-slate-400 mt-1">
                  Invite colleagues to collaborate on demos
                </p>
              </div>
            ) : (
              teamMembers.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {member.user_email[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{member.user_email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={roleColors[member.role]} variant="outline">
                          {member.role}
                        </Badge>
                        <Badge className={statusColors[member.invitation_status]} variant="outline">
                          {member.invitation_status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select
                      value={member.role}
                      onValueChange={(value) => updateRole(member.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="viewer">Viewer</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                        <SelectItem value="analyst">Analyst</SelectItem>
                        <SelectItem value="owner">Owner</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeMember(member.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}