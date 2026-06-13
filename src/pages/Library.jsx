
import React, { useState, useEffect } from "react";
import { Demo } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  MoreVertical,
  Edit,
  Copy,
  Trash2,
  Eye,
  Share2,
  Download,
  Grid3x3,
  List
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

export default function Library() {
  const [demos, setDemos] = useState([]);
  const [filteredDemos, setFilteredDemos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedDemos, setSelectedDemos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDemos();
  }, []);

  useEffect(() => {
    let filtered = demos;

    if (searchQuery) {
      filtered = filtered.filter(demo => 
        demo.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        demo.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(demo => demo.status === statusFilter);
    }

    setFilteredDemos(filtered);
  }, [demos, searchQuery, statusFilter]);

  const loadDemos = async () => {
    setIsLoading(true);
    const data = await Demo.list("-updated_date");
    setDemos(data);
    setIsLoading(false);
  };

  const duplicateDemo = async (demo) => {
    const duplicate = {
      ...demo,
      title: `${demo.title} (Copy)`,
      status: "draft",
      embed_id: `demo-${Date.now()}`
    };
    delete duplicate.id;
    delete duplicate.created_date;
    delete duplicate.updated_date;
    
    await Demo.create(duplicate);
    loadDemos();
  };

  const deleteDemo = async (demoId) => {
    if (confirm("Are you sure you want to delete this demo?")) {
      await Demo.delete(demoId);
      loadDemos();
    }
  };

  const bulkDelete = async () => {
    if (confirm(`Delete ${selectedDemos.length} selected demos?`)) {
      for (const id of selectedDemos) {
        await Demo.delete(id);
      }
      setSelectedDemos([]);
      loadDemos();
    }
  };

  const toggleDemoSelection = (demoId) => {
    setSelectedDemos(prev => 
      prev.includes(demoId) 
        ? prev.filter(id => id !== demoId)
        : [...prev, demoId]
    );
  };

  const statusColors = {
    draft: "bg-yellow-100 text-yellow-800",
    published: "bg-green-100 text-green-800",
    archived: "bg-gray-100 text-gray-800"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Demo Library</h1>
            <p className="text-slate-600 mt-1">
              Manage all your interactive product demos
            </p>
          </div>
          <Link to={createPageUrl("Builder")}>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Create New Demo
            </Button>
          </Link>
        </div>

        {/* Filters & Search */}
        <Card className="mb-6 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search demos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button 
                  variant={viewMode === "grid" ? "default" : "outline"} 
                  size="icon"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3x3 className="w-4 h-4" />
                </Button>
                <Button 
                  variant={viewMode === "list" ? "default" : "outline"} 
                  size="icon"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {selectedDemos.length > 0 && (
              <div className="mt-4 flex items-center justify-between bg-blue-50 rounded-lg p-3">
                <span className="text-sm text-blue-900 font-medium">
                  {selectedDemos.length} selected
                </span>
                <Button variant="destructive" size="sm" onClick={bulkDelete}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Selected
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Demos Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDemos.map((demo, index) => (
              <motion.div
                key={demo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm overflow-hidden">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={selectedDemos.includes(demo.id)}
                      onChange={() => toggleDemoSelection(demo.id)}
                      className="absolute top-3 left-3 z-10 w-5 h-5 rounded"
                    />
                    <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center relative overflow-hidden">
                      {demo.screens?.[0]?.image_url ? (
                        <img 
                          src={demo.screens[0].image_url} 
                          alt={demo.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Eye className="w-12 h-12 text-slate-400" />
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                        <Link to={createPageUrl(`Builder?demo=${demo.id}`)}>
                          <Button 
                            size="sm" 
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Demo
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-slate-900 truncate flex-1">
                        {demo.title}
                      </h3>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => duplicateDemo(demo)}>
                            <Copy className="w-4 h-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share2 className="w-4 h-4 mr-2" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="w-4 h-4 mr-2" />
                            Export
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => deleteDemo(demo.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <p className="text-sm text-slate-500 mb-3 line-clamp-2">
                      {demo.description || "No description"}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge className={statusColors[demo.status]}>
                        {demo.status}
                      </Badge>
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {demo.view_count || 0}
                        </span>
                        <span>{demo.screens?.length || 0} screens</span>
                      </div>
                    </div>
                    <div className="text-xs text-slate-400 mt-2">
                      Updated {format(new Date(demo.updated_date), "MMM d, yyyy")}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-0">
              {filteredDemos.map((demo, index) => (
                <motion.div
                  key={demo.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="flex items-center gap-4 p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedDemos.includes(demo.id)}
                    onChange={() => toggleDemoSelection(demo.id)}
                    className="w-5 h-5 rounded"
                  />
                  <div className="w-24 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center overflow-hidden">
                    {demo.screens?.[0]?.image_url ? (
                      <img 
                        src={demo.screens[0].image_url} 
                        alt={demo.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Eye className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 truncate">
                      {demo.title}
                    </h3>
                    <p className="text-sm text-slate-500 truncate">
                      {demo.description || "No description"}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <Badge className={`${statusColors[demo.status]} text-xs`}>
                        {demo.status}
                      </Badge>
                      <span className="text-xs text-slate-400">
                        {demo.screens?.length || 0} screens
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right mr-4">
                      <div className="text-sm font-medium text-slate-900">
                        {demo.view_count || 0} views
                      </div>
                      <div className="text-xs text-slate-400">
                        {format(new Date(demo.updated_date), "MMM d")}
                      </div>
                    </div>
                    <Link to={createPageUrl(`Builder?demo=${demo.id}`)}>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => duplicateDemo(demo)}>
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => deleteDemo(demo.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        )}

        {filteredDemos.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              No demos found
            </h3>
            <p className="text-slate-500">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
