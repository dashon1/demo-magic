import Layout from "./Layout.jsx";

import AIStudio from "./AIStudio";

import AdminActivity from "./AdminActivity";

import AdminDashboard from "./AdminDashboard";

import AdminSettings from "./AdminSettings";

import AdminUsers from "./AdminUsers";

import AdvancedAnalytics from "./AdvancedAnalytics";

import Analytics from "./Analytics";

import Assets from "./Assets";

import Builder from "./Builder";

import CRMLeads from "./CRMLeads";

import Dashboard from "./Dashboard";

import FeatureGuide from "./FeatureGuide";

import Home from "./Home";

import Library from "./Library";

import NotFound from "./NotFound";

import Player from "./Player";

import Settings from "./Settings";

import SystemStatus from "./SystemStatus";

import Team from "./Team";

import Templates from "./Templates";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

import Login from './Login';

const PAGES = {
    
    AIStudio: AIStudio,
    
    AdminActivity: AdminActivity,
    
    AdminDashboard: AdminDashboard,
    
    AdminSettings: AdminSettings,
    
    AdminUsers: AdminUsers,
    
    AdvancedAnalytics: AdvancedAnalytics,
    
    Analytics: Analytics,
    
    Assets: Assets,
    
    Builder: Builder,
    
    CRMLeads: CRMLeads,
    
    Dashboard: Dashboard,
    
    FeatureGuide: FeatureGuide,
    
    Home: Home,
    
    Library: Library,
    
    NotFound: NotFound,
    
    Player: Player,
    
    Settings: Settings,
    
    SystemStatus: SystemStatus,
    
    Team: Team,
    
    Templates: Templates,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    if (/\/login$/i.test(location.pathname)) {
        return <Routes><Route path="/login" element={<Login />} /><Route path="/Login" element={<Login />} /></Routes>;
    }

    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<AIStudio />} />
                
                
                <Route path="/AIStudio" element={<AIStudio />} />
                
                <Route path="/AdminActivity" element={<AdminActivity />} />
                
                <Route path="/AdminDashboard" element={<AdminDashboard />} />
                
                <Route path="/AdminSettings" element={<AdminSettings />} />
                
                <Route path="/AdminUsers" element={<AdminUsers />} />
                
                <Route path="/AdvancedAnalytics" element={<AdvancedAnalytics />} />
                
                <Route path="/Analytics" element={<Analytics />} />
                
                <Route path="/Assets" element={<Assets />} />
                
                <Route path="/Builder" element={<Builder />} />
                
                <Route path="/CRMLeads" element={<CRMLeads />} />
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/FeatureGuide" element={<FeatureGuide />} />
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/Library" element={<Library />} />
                
                <Route path="/NotFound" element={<NotFound />} />
                
                <Route path="/Player" element={<Player />} />
                
                <Route path="/Settings" element={<Settings />} />
                
                <Route path="/SystemStatus" element={<SystemStatus />} />
                
                <Route path="/Team" element={<Team />} />
                
                <Route path="/Templates" element={<Templates />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}