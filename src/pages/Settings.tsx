
import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GlassPanel from "@/components/ui/GlassPanel";
import { 
  Settings2, 
  Save,
  Download,
  CloudUpload,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const Settings = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("app");

  // Mock app settings
  const [settings, setSettings] = useState({
    darkMode: false,
    autoSave: true,
    notifications: true,
    emailAlerts: false,
    highPrecision: true,
    experimentalFeatures: false,
    dataSync: true,
    telemetry: true,
  });

  const handleSettingChange = (setting: string, value: boolean | number) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
    
    if (typeof value === 'boolean') {
      toast({
        title: "Setting updated",
        description: `${setting.charAt(0).toUpperCase() + setting.slice(1).replace(/([A-Z])/g, ' $1')} has been ${value ? 'enabled' : 'disabled'}.`
      });
    } else {
      toast({
        title: "Setting updated",
        description: `${setting.charAt(0).toUpperCase() + setting.slice(1).replace(/([A-Z])/g, ' $1')} has been set to ${value}.`
      });
    }
  };

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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-16 px-6 bg-gray-50">
        <div className="max-w-screen-xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold mb-2">App Settings</h1>
            <p className="text-gray-600">Manage your application preferences</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <div className="md:w-1/4">
              <GlassPanel className="p-0 overflow-hidden">
                <nav className="flex flex-col">
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
                </nav>
              </GlassPanel>
            </div>
            
            {/* Content */}
            <div className="md:w-3/4">
              {renderAppSettingsTab()}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Settings;
