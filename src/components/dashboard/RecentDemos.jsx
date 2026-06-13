import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Play, 
  Eye, 
  Edit3, 
  ExternalLink,
  MoreVertical
} from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const statusColors = {
  draft: "bg-yellow-100 text-yellow-800 border-yellow-300",
  published: "bg-green-100 text-green-800 border-green-300", 
  archived: "bg-gray-100 text-gray-800 border-gray-300"
};

export default function RecentDemos({ demos, isLoading }) {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
      <CardHeader className="p-6 border-b border-slate-100">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold text-slate-900">Recent Demos</CardTitle>
          <Link to={createPageUrl("Library")}>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="space-y-4 p-6">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 border border-slate-100 rounded-lg">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-16 h-16 rounded-lg" />
                  <div>
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <Skeleton className="h-8 w-20" />
              </div>
            ))}
          </div>
        ) : demos.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Play className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No demos yet</h3>
            <p className="text-slate-500 mb-6">Create your first interactive demo to get started</p>
            <Link to={createPageUrl("Builder")}>
              <Button>Create Demo</Button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {demos.map((demo, index) => (
              <motion.div
                key={demo.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 hover:bg-slate-50 transition-colors duration-200 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center group-hover:shadow-md transition-shadow duration-200">
                      <Play className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 truncate mb-1">
                        {demo.title}
                      </h3>
                      <p className="text-sm text-slate-500 truncate mb-2">
                        {demo.description || 'No description'}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span>Updated {format(new Date(demo.updated_date), 'MMM d, yyyy')}</span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {demo.view_count || 0} views
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className={statusColors[demo.status]}>
                      {demo.status}
                    </Badge>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Link to={createPageUrl(`Builder?demo=${demo.id}`)}>
                        <Button variant="ghost" size="icon">
                          <Edit3 className="w-4 h-4" />
                        </Button>
                      </Link>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Preview Demo
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            View Analytics
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}