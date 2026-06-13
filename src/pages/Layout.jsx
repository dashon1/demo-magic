
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { 
  LayoutDashboard, 
  Wand2, 
  FolderOpen, 
  BarChart3, 
  Settings,
  Sparkles,
  Users,
  Shield,
  Target,
  Activity
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: LayoutDashboard,
  },
  {
    title: "Demo Builder",
    url: createPageUrl("Builder"),
    icon: Wand2,
  },
  {
    title: "Demo Library",
    url: createPageUrl("Library"),
    icon: FolderOpen,
  },
  {
    title: "Analytics",
    url: createPageUrl("Analytics"),
    icon: BarChart3,
  },
  {
    title: "Settings",
    url: createPageUrl("Settings"),
    icon: Settings,
  },
];

const advancedItems = [
  {
    title: "AI Studio",
    url: createPageUrl("AIStudio"),
    icon: Sparkles,
    badge: "New"
  },
  {
    title: "Advanced Analytics",
    url: createPageUrl("AdvancedAnalytics"),
    icon: BarChart3,
    badge: "Pro"
  },
  {
    title: "Team",
    url: createPageUrl("Team"),
    icon: Users,
  },
];

const adminItems = [
  {
    title: "Admin Dashboard",
    url: createPageUrl("AdminDashboard"),
    icon: Shield,
  },
  {
    title: "User Management",
    url: createPageUrl("AdminUsers"),
    icon: Users,
  },
  {
    title: "CRM & Leads",
    url: createPageUrl("CRMLeads"),
    icon: Target,
  },
  {
    title: "Activity Logs",
    url: createPageUrl("AdminActivity"),
    icon: Activity,
  },
  {
    title: "System Settings",
    url: createPageUrl("AdminSettings"),
    icon: Settings,
    badge: "Pro"
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [currentUser, setCurrentUser] = React.useState(null);

  React.useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await base44.auth.me();
        setCurrentUser(user);
      } catch (error) {
        console.error("Error loading user:", error);
      }
    };
    loadUser();
  }, []);

  // Don't show sidebar for home/player pages
  if (currentPageName === "Home" || currentPageName === "Player") {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 to-blue-50">
        <Sidebar className="border-r border-slate-200 bg-white/80 backdrop-blur-sm">
          <SidebarHeader className="border-b border-slate-200 p-6">
            <Link to={createPageUrl("Dashboard")} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-lg">DemoMagic</h2>
                <p className="text-xs text-slate-500">Interactive Product Demos</p>
              </div>
            </Link>
          </SidebarHeader>
          
          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 rounded-xl mb-1 group ${
                          location.pathname === item.url ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-slate-600'
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                          <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2">
                Advanced
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {advancedItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`hover:bg-purple-50 hover:text-purple-700 transition-all duration-200 rounded-xl mb-1 group ${
                          location.pathname === item.url ? 'bg-purple-50 text-purple-700 shadow-sm' : 'text-slate-600'
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                          <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                          <span className="font-medium">{item.title}</span>
                          {item.badge && (
                            <span className="ml-auto text-xs bg-gradient-to-r from-purple-600 to-blue-600 text-white px-2 py-0.5 rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {currentUser?.role === "admin" && (
              <SidebarGroup>
                <SidebarGroupLabel className="text-xs font-semibold text-red-500 uppercase tracking-wider px-3 py-2">
                  Admin
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {adminItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                          asChild 
                          className={`hover:bg-red-50 hover:text-red-700 transition-all duration-200 rounded-xl mb-1 group ${
                            location.pathname === item.url ? 'bg-red-50 text-red-700 shadow-sm' : 'text-slate-600'
                          }`}
                        >
                          <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                            <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                            <span className="font-medium">{item.title}</span>
                            {item.badge && (
                              <span className="ml-auto text-xs bg-gradient-to-r from-red-600 to-pink-600 text-white px-2 py-0.5 rounded-full">
                                {item.badge}
                              </span>
                            )}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )}
            </SidebarContent>

          <SidebarFooter className="border-t border-slate-200 p-4">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">U</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900 text-sm">Demo Creator</p>
                  <p className="text-xs text-slate-500">Pro Plan</p>
                </div>
              </div>
              <div className="text-xs text-slate-600">
                Create unlimited interactive demos
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-slate-100 p-2 rounded-lg transition-colors duration-200" />
              <h1 className="text-xl font-bold text-slate-900">DemoMagic</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
