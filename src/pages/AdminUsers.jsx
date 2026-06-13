import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Users, Search, Mail, Shield } from "lucide-react";
import { toast } from "sonner";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await base44.entities.User.list("-created_date");
      setUsers(data);
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      await base44.entities.User.update(userId, { role: newRole });
      toast.success("User role updated");
      loadUsers();
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Failed to update role");
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (user.full_name && user.full_name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const roleColors = {
    admin: "bg-red-100 text-red-800",
    user: "bg-blue-100 text-blue-800"
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
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
            <Users className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-slate-900">User Management</h1>
            <p className="text-slate-600 mt-1">Manage all system users and permissions</p>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search users by email or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admins</SelectItem>
                  <SelectItem value="user">Users</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {user.email[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">
                        {user.full_name || "No Name"}
                      </p>
                      <p className="text-sm text-slate-600 flex items-center gap-2">
                        <Mail className="w-3 h-3" />
                        {user.email}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Joined: {new Date(user.created_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Select
                      value={user.role}
                      onValueChange={(value) => updateUserRole(user.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <Shield className="w-3 h-3 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <Badge className={roleColors[user.role]}>
                      {user.role}
                    </Badge>
                  </div>
                </div>
              ))}
              {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-500">No users found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-3xl font-bold text-blue-600 mb-2">{users.length}</p>
              <p className="text-sm text-slate-600">Total Users</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-3xl font-bold text-purple-600 mb-2">
                {users.filter(u => u.role === "admin").length}
              </p>
              <p className="text-sm text-slate-600">Admins</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-3xl font-bold text-green-600 mb-2">
                {users.filter(u => u.role === "user").length}
              </p>
              <p className="text-sm text-slate-600">Regular Users</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}