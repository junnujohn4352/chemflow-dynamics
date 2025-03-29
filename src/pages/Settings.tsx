
import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GlassPanel from "@/components/ui/GlassPanel";
import { 
  User, 
  Bell, 
  Shield, 
  Settings2, 
  Database, 
  Save,
  Download,
  CloudUpload
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");

  // Mock user profile data
  const [profile, setProfile] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    company: "ChemTech Solutions",
    role: "Process Engineer"
  });

  // Mock app settings
  const [settings, setSettings] = useState({
    darkMode: false,
    autoSave: true,
    notifications: true,
    emailAlerts: false,
    highPrecision: true,
    experimentalFeatures: false,
    dataSync: true,
    telemetry: true
  });

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send data to a server
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved successfully."
    });
  };

  const handleSettingChange = (setting: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
    toast({
      title: "Setting updated",
      description: `${setting.charAt(0).toUpperCase() + setting.slice(1).replace(/([A-Z])/g, ' $1')} has been ${value ? 'enabled' : 'disabled'}.`
    });
  };

  const handleProfileChange = (field: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      <GlassPanel className="p-6">
        <h3 className="text-lg font-medium mb-6">User Profile</h3>
        <form onSubmit={handleProfileUpdate}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <Input 
                value={profile.name}
                onChange={(e) => handleProfileChange('name', e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <Input 
                type="email"
                value={profile.email}
                onChange={(e) => handleProfileChange('email', e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
              <Input 
                value={profile.company}
                onChange={(e) => handleProfileChange('company', e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Role</label>
              <Input 
                value={profile.role}
                onChange={(e) => handleProfileChange('role', e.target.value)}
                className="w-full"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button 
              type="submit"
              className="inline-flex items-center px-4 py-2 rounded-lg bg-flow-blue text-white hover:bg-flow-blue/90 transition-colors"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </button>
          </div>
        </form>
      </GlassPanel>
      
      <GlassPanel className="p-6">
        <h3 className="text-lg font-medium mb-6">Export & Import</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
            <div>
              <h4 className="font-medium">Export All Simulations</h4>
              <p className="text-sm text-gray-600">Download all your simulations as a JSON file</p>
            </div>
            <button className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors">
              <Download className="mr-2 h-4 w-4" />
              Export
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
            <div>
              <h4 className="font-medium">Import Simulations</h4>
              <p className="text-sm text-gray-600">Upload previously exported simulation files</p>
            </div>
            <button className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors">
              <CloudUpload className="mr-2 h-4 w-4" />
              Import
            </button>
          </div>
        </div>
      </GlassPanel>
    </div>
  );
  
  const renderAppSettingsTab = () => (
    <div className="space-y-6">
      <GlassPanel className="p-6">
        <h3 className="text-lg font-medium mb-6">Application Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
            <div>
              <h4 className="font-medium">Dark Mode</h4>
              <p className="text-sm text-gray-600">Use dark theme throughout the application</p>
            </div>
            <Switch 
              checked={settings.darkMode}
              onCheckedChange={(checked) => handleSettingChange('darkMode', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
            <div>
              <h4 className="font-medium">Auto Save</h4>
              <p className="text-sm text-gray-600">Automatically save simulations while editing</p>
            </div>
            <Switch 
              checked={settings.autoSave}
              onCheckedChange={(checked) => handleSettingChange('autoSave', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
            <div>
              <h4 className="font-medium">High Precision Mode</h4>
              <p className="text-sm text-gray-600">Use higher numerical precision for calculations</p>
            </div>
            <Switch 
              checked={settings.highPrecision}
              onCheckedChange={(checked) => handleSettingChange('highPrecision', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
            <div>
              <h4 className="font-medium">Experimental Features</h4>
              <p className="text-sm text-gray-600">Enable early access to experimental features</p>
            </div>
            <Switch 
              checked={settings.experimentalFeatures}
              onCheckedChange={(checked) => handleSettingChange('experimentalFeatures', checked)}
            />
          </div>
        </div>
      </GlassPanel>
      
      <GlassPanel className="p-6">
        <h3 className="text-lg font-medium mb-6">Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
            <div>
              <h4 className="font-medium">In-App Notifications</h4>
              <p className="text-sm text-gray-600">Receive notifications within the application</p>
            </div>
            <Switch 
              checked={settings.notifications}
              onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
            <div>
              <h4 className="font-medium">Email Alerts</h4>
              <p className="text-sm text-gray-600">Receive important alerts via email</p>
            </div>
            <Switch 
              checked={settings.emailAlerts}
              onCheckedChange={(checked) => handleSettingChange('emailAlerts', checked)}
            />
          </div>
        </div>
      </GlassPanel>
      
      <GlassPanel className="p-6">
        <h3 className="text-lg font-medium mb-6">Data & Privacy</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
            <div>
              <h4 className="font-medium">Cloud Sync</h4>
              <p className="text-sm text-gray-600">Sync your simulations across devices</p>
            </div>
            <Switch 
              checked={settings.dataSync}
              onCheckedChange={(checked) => handleSettingChange('dataSync', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
            <div>
              <h4 className="font-medium">Usage Data</h4>
              <p className="text-sm text-gray-600">Share anonymous usage data to improve the app</p>
            </div>
            <Switch 
              checked={settings.telemetry}
              onCheckedChange={(checked) => handleSettingChange('telemetry', checked)}
            />
          </div>
        </div>
      </GlassPanel>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-16 px-6 bg-gray-50">
        <div className="max-w-screen-xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold mb-2">Settings</h1>
            <p className="text-gray-600">Manage your account and application preferences</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <div className="md:w-1/4">
              <GlassPanel className="p-0 overflow-hidden">
                <nav className="flex flex-col">
                  <button 
                    onClick={() => setActiveTab("profile")}
                    className={`flex items-center gap-3 px-6 py-4 text-left transition-colors ${
                      activeTab === "profile" 
                        ? "bg-blue-50 text-flow-blue border-l-4 border-flow-blue" 
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <User className="h-5 w-5" />
                    <span>User Profile</span>
                  </button>
                  
                  <button 
                    onClick={() => setActiveTab("app")}
                    className={`flex items-center gap-3 px-6 py-4 text-left transition-colors ${
                      activeTab === "app" 
                        ? "bg-blue-50 text-flow-blue border-l-4 border-flow-blue" 
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <Settings2 className="h-5 w-5" />
                    <span>App Settings</span>
                  </button>
                  
                  <button 
                    onClick={() => setActiveTab("notifications")}
                    className={`flex items-center gap-3 px-6 py-4 text-left transition-colors ${
                      activeTab === "notifications" 
                        ? "bg-blue-50 text-flow-blue border-l-4 border-flow-blue" 
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <Bell className="h-5 w-5" />
                    <span>Notifications</span>
                  </button>
                  
                  <button 
                    onClick={() => setActiveTab("security")}
                    className={`flex items-center gap-3 px-6 py-4 text-left transition-colors ${
                      activeTab === "security" 
                        ? "bg-blue-50 text-flow-blue border-l-4 border-flow-blue" 
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <Shield className="h-5 w-5" />
                    <span>Security</span>
                  </button>
                  
                  <button 
                    onClick={() => setActiveTab("data")}
                    className={`flex items-center gap-3 px-6 py-4 text-left transition-colors ${
                      activeTab === "data" 
                        ? "bg-blue-50 text-flow-blue border-l-4 border-flow-blue" 
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <Database className="h-5 w-5" />
                    <span>Data & Privacy</span>
                  </button>
                </nav>
              </GlassPanel>
            </div>
            
            {/* Content */}
            <div className="md:w-3/4">
              {activeTab === "profile" && renderProfileTab()}
              {activeTab === "app" && renderAppSettingsTab()}
              {(activeTab === "notifications" || activeTab === "security" || activeTab === "data") && (
                <GlassPanel className="p-10 text-center">
                  <h3 className="text-xl font-medium mb-2">Coming Soon</h3>
                  <p className="text-gray-600 mb-4">This section is currently being developed</p>
                  <button 
                    onClick={() => setActiveTab("profile")}
                    className="inline-flex items-center px-4 py-2 rounded-lg bg-flow-blue text-white hover:bg-flow-blue/90 transition-colors"
                  >
                    Return to Profile
                  </button>
                </GlassPanel>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Settings;
