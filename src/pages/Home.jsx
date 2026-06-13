import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createPageUrl } from "@/utils";
import { User } from "@/api/entities";
import { 
  Sparkles, 
  Zap, 
  BarChart3, 
  Code,
  Play,
  CheckCircle2,
  ArrowRight,
  Star
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Play,
    title: "Visual Demo Builder",
    description: "Create interactive demos with our intuitive drag-and-drop interface"
  },
  {
    icon: Sparkles,
    title: "Interactive Hotspots",
    description: "Add tooltips, modals, and highlights to guide your visitors"
  },
  {
    icon: Code,
    title: "Easy Embedding",
    description: "Copy-paste embed codes to add demos anywhere on your site"
  },
  {
    icon: BarChart3,
    title: "Analytics & Insights",
    description: "Track views, engagement, and conversion rates in real-time"
  }
];

const steps = [
  { title: "Upload Screenshots", description: "Add images of your product" },
  { title: "Add Hotspots", description: "Make it interactive with clickable points" },
  { title: "Customize & Style", description: "Match your brand colors and style" },
  { title: "Embed & Share", description: "Add to your website with one line of code" }
];

export default function Home() {
  const [user, setUser] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      // Redirect to dashboard if already logged in
      window.location.href = createPageUrl("Dashboard");
    } catch (error) {
      // User not logged in, show landing page
      setUser(null);
    }
    setIsLoading(false);
  };

  const handleLogin = async () => {
    await User.login();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
        
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            {/* Logo */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-slate-900">DemoMagic</h1>
            </div>

            {/* Hero Text */}
            <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Create Interactive Product Demos
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                That Convert
              </span>
            </h2>
            
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Transform your product screenshots into engaging, interactive experiences. 
              No coding required. Embed anywhere in minutes.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 text-lg px-8 py-6"
                onClick={handleLogin}
              >
                <Zap className="w-5 h-5 mr-2" />
                Get Started Free
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg px-8 py-6"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>

            {/* Social Proof */}
            <div className="mt-12 flex items-center justify-center gap-6 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>Free forever plan</span>
              </div>
            </div>
          </motion.div>

          {/* Hero Image/Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-20"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-purple-600/20 rounded-3xl blur-3xl" />
              <img 
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=600&fit=crop"
                alt="DemoMagic Interface"
                className="relative rounded-2xl shadow-2xl border border-slate-200"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 px-4 py-2 text-sm">
            <Star className="w-4 h-4 mr-2 inline" />
            Powerful Features
          </Badge>
          <h3 className="text-4xl font-bold text-slate-900 mb-4">
            Everything You Need to Create Amazing Demos
          </h3>
          <p className="text-xl text-slate-600">
            Professional demo builder with enterprise-grade features
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm border-slate-200">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-slate-900 mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-slate-600">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 px-4 py-2 text-sm">
              Simple Process
            </Badge>
            <h3 className="text-4xl font-bold text-slate-900 mb-4">
              Create Your Demo in 4 Easy Steps
            </h3>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold shadow-lg">
                    {index + 1}
                  </div>
                  <h4 className="text-xl font-semibold text-slate-900 mb-2">
                    {step.title}
                  </h4>
                  <p className="text-slate-600">
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className="hidden md:block absolute top-8 -right-4 w-8 h-8 text-slate-300" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <Card className="bg-gradient-to-br from-blue-600 to-purple-600 border-none text-white overflow-hidden relative">
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
          <CardContent className="relative p-12 text-center">
            <h3 className="text-4xl font-bold mb-4">
              Ready to Create Your First Demo?
            </h3>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of companies using DemoMagic to showcase their products
            </p>
            <Button 
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50 shadow-xl text-lg px-8 py-6"
              onClick={handleLogin}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Start Building Now - It's Free
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">DemoMagic</span>
            </div>
            <div className="flex gap-6 text-slate-600">
              <a href="#" className="hover:text-blue-600 transition-colors">Features</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Pricing</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Docs</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Support</a>
            </div>
            <p className="text-slate-500 text-sm">
              © 2024 DemoMagic. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}