
import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import GlassPanel from "@/components/ui/GlassPanel";
import { 
  Settings2, 
  Save,
  Download,
  CloudUpload,
  Trash2,
  RefreshCw,
  LogOut
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  // App settings
  const [settings, setSettings] = useState({
    darkMode: false,
    autoSave: true,
    notifications: true,
    highPrecision: true,
    experimentalFeatures: false,
    dataSync: true,
  });

  // Load settings on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('chemflow-settings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
      } catch (e) {
        console.error("Error loading settings:", e);
      }
    }
    
    // Check dark mode from localStorage
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'dark') {
      setSettings(prev => ({ ...prev, darkMode: true }));
    }
  }, []);

  const handleSettingChange = (setting: string, value: boolean | number) => {
    const newSettings = {
      ...settings,
      [setting]: value
    };
    
    setSettings(newSettings);
    localStorage.setItem('chemflow-settings', JSON.stringify(newSettings));
    
    // If changing dark mode, update the document class and localStorage
    if (setting === 'darkMode') {
      document.documentElement.classList.toggle('dark', value as boolean);
      localStorage.setItem('darkMode', (value as boolean) ? 'dark' : 'light');
    }
    
    toast({
      title: "Setting updated",
      description: `${setting.charAt(0).toUpperCase() + setting.slice(1).replace(/([A-Z])/g, ' $1')} has been ${typeof value === 'boolean' ? (value ? 'enabled' : 'disabled') : `set to ${value}`}.`
    });
  };

  const clearAllData = () => {
    // Clear all simulations and settings, except the darkMode setting
    const darkMode = localStorage.getItem('darkMode');
    localStorage.clear();
    if (darkMode) {
      localStorage.setItem('darkMode', darkMode);
    }
    
    toast({
      title: "All data cleared",
      description: "All saved simulations and settings have been reset."
    });
    
    // Reset settings (keep dark mode)
    setSettings({
      darkMode: settings.darkMode,
      autoSave: true,
      notifications: true,
      highPrecision: true,
      experimentalFeatures: false,
      dataSync: true,
    });
  };

  const exportAllData = () => {
    const data = {
      settings: settings,
      simulations: JSON.parse(localStorage.getItem('chemflow-simulations') || '[]'),
      simulationData: localStorage.getItem('chemflow-simulation-data')
    };
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `chemflow-backup-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
    toast({
      title: "Data exported",
      description: "All your settings and simulations have been exported."
    });
  };

  const handleSignOut = () => {
    localStorage.removeItem("auth");
    toast({
      title: "Signed out",
      description: "You have been signed out successfully."
    });
    navigate('/sign-in');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-purple-900">
      <Navbar />
      
      <main className="flex-1 py-16 px-6">
        <div className="max-w-screen-xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold mb-2 text-purple-800 dark:text-purple-300">App Settings</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your application preferences</p>
          </div>
          
          <div className="space-y-6">
            <GlassPanel className="p-6 bg-white bg-opacity-70 dark:bg-gray-800 dark:border-gray-700">
              <h3 className="text-lg font-medium mb-6 text-indigo-700 dark:text-indigo-300">Application Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-purple-100 dark:border-purple-900 rounded-lg bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
                  <div>
                    <h4 className="font-medium text-purple-800 dark:text-purple-300">Dark Mode</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Use dark theme throughout the application</p>
                  </div>
                  <Switch 
                    checked={settings.darkMode}
                    onCheckedChange={(checked) => handleSettingChange('darkMode', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 border border-purple-100 dark:border-purple-900 rounded-lg bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
                  <div>
                    <h4 className="font-medium text-purple-800 dark:text-purple-300">Auto Save</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Automatically save simulations while editing</p>
                  </div>
                  <Switch 
                    checked={settings.autoSave}
                    onCheckedChange={(checked) => handleSettingChange('autoSave', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 border border-purple-100 dark:border-purple-900 rounded-lg bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
                  <div>
                    <h4 className="font-medium text-purple-800 dark:text-purple-300">High Precision Mode</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Use higher numerical precision for calculations</p>
                  </div>
                  <Switch 
                    checked={settings.highPrecision}
                    onCheckedChange={(checked) => handleSettingChange('highPrecision', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 border border-purple-100 dark:border-purple-900 rounded-lg bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
                  <div>
                    <h4 className="font-medium text-purple-800 dark:text-purple-300">Experimental Features</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Enable early access to experimental features</p>
                  </div>
                  <Switch 
                    checked={settings.experimentalFeatures}
                    onCheckedChange={(checked) => handleSettingChange('experimentalFeatures', checked)}
                  />
                </div>
              </div>
            </GlassPanel>
            
            <GlassPanel className="p-6 bg-white bg-opacity-70 dark:bg-gray-800 dark:border-gray-700">
              <h3 className="text-lg font-medium mb-6 text-indigo-700 dark:text-indigo-300">Data Management</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-purple-100 dark:border-purple-900 rounded-lg bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
                  <div>
                    <h4 className="font-medium text-purple-800 dark:text-purple-300">Export All Data</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Export all your settings and simulations</p>
                  </div>
                  <Button
                    variant="outline"
                    className="border-purple-300 text-purple-700 hover:bg-purple-100 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-900"
                    onClick={exportAllData}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-purple-100 dark:border-purple-900 rounded-lg bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
                  <div>
                    <h4 className="font-medium text-purple-800 dark:text-purple-300">Clear All Data</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Reset all application data and settings</p>
                  </div>
                  <Button
                    variant="destructive"
                    className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
                    onClick={clearAllData}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear Data
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-purple-100 dark:border-purple-900 rounded-lg bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
                  <div>
                    <h4 className="font-medium text-purple-800 dark:text-purple-300">Sign Out</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Sign out from your account</p>
                  </div>
                  <Button
                    variant="outline"
                    className="border-purple-300 text-purple-700 hover:bg-purple-100 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-900"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </GlassPanel>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
