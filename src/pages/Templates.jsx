
import React, { useState, useEffect } from "react";
import { Demo, DemoTemplate } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Sparkles, 
  TrendingUp,
  Play,
  Star
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Templates() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    const data = await DemoTemplate.list("-use_count");
    setTemplates(data);
  };

  const handleUseTemplate = async (template) => {
    const demoData = {
      ...template.demo_data,
      title: `${template.name} Demo`,
      status: "draft"
    };

    const newDemo = await Demo.create(demoData);
    await DemoTemplate.update(template.id, { use_count: (template.use_count || 0) + 1 });
    
    navigate(createPageUrl(`Builder?demo=${newDemo.id}`));
  };

  const filteredTemplates = templates.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         t.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || t.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categoryColors = {
    saas: "bg-blue-100 text-blue-800",
    ecommerce: "bg-purple-100 text-purple-800",
    mobile: "bg-green-100 text-green-800",
    landing: "bg-orange-100 text-orange-800",
    onboarding: "bg-pink-100 text-pink-800"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Demo Templates</h1>
          <p className="text-slate-600 text-lg">
            Start with professionally designed templates and customize them to your needs
          </p>
        </div>

        {/* Search & Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-lg"
            />
          </div>

          <Tabs value={categoryFilter} onValueChange={setCategoryFilter} className="w-full">
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="saas">SaaS</TabsTrigger>
              <TabsTrigger value="ecommerce">E-Commerce</TabsTrigger>
              <TabsTrigger value="mobile">Mobile</TabsTrigger>
              <TabsTrigger value="landing">Landing</TabsTrigger>
              <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="group hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm overflow-hidden">
                <div className="relative">
                  {template.is_featured && (
                    <div className="absolute top-3 right-3 z-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
                      <Star className="w-3 h-3" />
                      Featured
                    </div>
                  )}
                  <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center overflow-hidden">
                    {template.thumbnail_url ? (
                      <img 
                        src={template.thumbnail_url} 
                        alt={template.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <Play className="w-16 h-16 text-slate-300" />
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Button
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white text-slate-900 hover:bg-slate-100"
                    onClick={() => handleUseTemplate(template)}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Use Template
                  </Button>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-lg text-slate-900">
                      {template.name}
                    </h3>
                    <Badge className={categoryColors[template.category]}>
                      {template.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                    {template.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>{template.use_count || 0} uses</span>
                    </div>
                    <span>{template.demo_data?.screens?.length || 0} screens</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              No templates found
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
