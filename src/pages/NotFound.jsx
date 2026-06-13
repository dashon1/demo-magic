import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Home, Search, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="text-9xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text"
          >
            404
          </motion.div>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Search className="w-6 h-6 text-slate-400" />
            <h1 className="text-2xl font-semibold text-slate-900">
              Page Not Found
            </h1>
          </div>
          <p className="text-slate-600 mt-4 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved. 
            Let's get you back on track.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to={createPageUrl("Dashboard")}>
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Home className="w-5 h-5 mr-2" />
              Go to Dashboard
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </Button>
        </div>

        <div className="mt-12 p-6 bg-blue-50 rounded-xl max-w-md mx-auto">
          <p className="text-sm text-blue-900 font-medium mb-2">
            💡 Quick Links
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link to={createPageUrl("Dashboard")}>
              <Button variant="link" size="sm" className="text-blue-700">
                Dashboard
              </Button>
            </Link>
            <Link to={createPageUrl("Builder")}>
              <Button variant="link" size="sm" className="text-blue-700">
                Create Demo
              </Button>
            </Link>
            <Link to={createPageUrl("Library")}>
              <Button variant="link" size="sm" className="text-blue-700">
                Demo Library
              </Button>
            </Link>
            <Link to={createPageUrl("Analytics")}>
              <Button variant="link" size="sm" className="text-blue-700">
                Analytics
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}