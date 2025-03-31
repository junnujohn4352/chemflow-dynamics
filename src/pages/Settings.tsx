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
  CloudUpload,
  Key,
  Lock,
  FileText,
  AlertTriangle,
  Trash2,
  MailCheck
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  Alert,
  AlertTitle,
  AlertDescription
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

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
    telemetry: true,
    twoFactorAuth: false,
    passwordResetRequired: false,
    dataRetentionDays: 90,
    anonymizeData: false,
    encryptSensitiveData: true,
    secureLogin: true,
    loginNotifications: true,
    shareUsageStats: true,
    showSecurityNotifications: true,
    emailNotificationsLevel: 2,
    pushNotificationsEnabled: false,
    automaticBackups: true,
    backupFrequency: 7,
    logRetentionPeriod: 30
  });

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send data to a server
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved successfully."
    });
  };

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

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <GlassPanel className="p-6">
        <h3 className="text-lg font-medium mb-6">Account Security</h3>
        <div className="space-y-4">
          <Alert className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Security Status</AlertTitle>
            <AlertDescription>
              Your account security is good. Last login: 2 days ago from United States.
            </AlertDescription>
          </Alert>
          
          <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
            <div>
              <h4 className="font-medium">Two-Factor Authentication</h4>
              <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
            </div>
            <Switch 
              checked={settings.twoFactorAuth}
              onCheckedChange={(checked) => handleSettingChange('twoFactorAuth', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
            <div>
              <h4 className="font-medium">Login Notifications</h4>
              <p className="text-sm text-gray-600">Get notified of new logins to your account</p>
            </div>
            <Switch 
              checked={settings.loginNotifications}
              onCheckedChange={(checked) => handleSettingChange('loginNotifications', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
            <div>
              <h4 className="font-medium">Secure Login Sessions</h4>
              <p className="text-sm text-gray-600">Enforce secure connection for all login sessions</p>
            </div>
            <Switch 
              checked={settings.secureLogin}
              onCheckedChange={(checked) => handleSettingChange('secureLogin', checked)}
            />
          </div>
          
          <div className="mt-6">
            <Button 
              variant="outline" 
              className="mr-2"
              onClick={() => {
                toast({
                  title: "Password Reset Email Sent",
                  description: "Check your inbox for instructions to reset your password."
                });
              }}
            >
              <Lock className="mr-2 h-4 w-4" />
              Change Password
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => {
                toast({
                  title: "Recovery Codes Downloaded",
                  description: "Keep these codes in a safe place to recover your account if needed."
                });
              }}
            >
              <Key className="mr-2 h-4 w-4" />
              Download Recovery Codes
            </Button>
          </div>
        </div>
      </GlassPanel>
      
      <GlassPanel className="p-6">
        <h3 className="text-lg font-medium mb-6">Login Sessions</h3>
        <div className="space-y-4">
          <div className="p-4 border border-gray-100 rounded-lg">
            <div className="flex justify-between">
              <div>
                <h4 className="font-medium">Current Session</h4>
                <p className="text-sm text-gray-600">Chrome on Windows • United States</p>
              </div>
              <div className="text-sm text-gray-500">Active now</div>
            </div>
          </div>
          
          <div className="p-4 border border-gray-100 rounded-lg">
            <div className="flex justify-between">
              <div>
                <h4 className="font-medium">Mobile App</h4>
                <p className="text-sm text-gray-600">iPhone 13 • California, United States</p>
              </div>
              <div className="text-sm text-gray-500">2 days ago</div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => {
                toast({
                  title: "Session Terminated",
                  description: "The selected session has been logged out."
                });
              }}
            >
              End Session
            </Button>
          </div>
        </div>
      </GlassPanel>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <GlassPanel className="p-6">
        <h3 className="text-lg font-medium mb-6">Notification Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
            <div>
              <h4 className="font-medium">Email Notifications</h4>
              <p className="text-sm text-gray-600">Receive notifications via email</p>
            </div>
            <Switch 
              checked={settings.emailAlerts}
              onCheckedChange={(checked) => handleSettingChange('emailAlerts', checked)}
            />
          </div>
          
          {settings.emailAlerts && (
            <div className="p-4 border border-gray-100 rounded-lg">
              <h4 className="font-medium mb-2">Email Frequency</h4>
              <p className="text-sm text-gray-600 mb-4">Choose how many emails you receive</p>
              <div className="px-4">
                <Slider
                  defaultValue={[settings.emailNotificationsLevel]}
                  max={3}
                  min={1}
                  step={1}
                  onValueChange={([value]) => handleSettingChange('emailNotificationsLevel', value)}
                  className="mb-6"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Minimal</span>
                  <span>Important</span>
                  <span>All Updates</span>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
            <div>
              <h4 className="font-medium">Push Notifications</h4>
              <p className="text-sm text-gray-600">Receive notifications in browser</p>
            </div>
            <Switch 
              checked={settings.pushNotificationsEnabled}
              onCheckedChange={(checked) => handleSettingChange('pushNotificationsEnabled', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
            <div>
              <h4 className="font-medium">Security Alerts</h4>
              <p className="text-sm text-gray-600">Get notified about security events</p>
            </div>
            <Switch 
              checked={settings.showSecurityNotifications}
              onCheckedChange={(checked) => handleSettingChange('showSecurityNotifications', checked)}
            />
          </div>
        </div>
      </GlassPanel>
      
      <GlassPanel className="p-6">
        <h3 className="text-lg font-medium mb-6">Notification Categories</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
            <div>
              <h4 className="font-medium">Simulation Results</h4>
              <p className="text-sm text-gray-600">When simulations complete or encounter errors</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
            <div>
              <h4 className="font-medium">System Updates</h4>
              <p className="text-sm text-gray-600">New features and system improvements</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
            <div>
              <h4 className="font-medium">Account Activity</h4>
              <p className="text-sm text-gray-600">Login attempts and account changes</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
        
        <div className="mt-6">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => {
              toast({
                title: "Test Notification Sent",
                description: "A test notification has been sent to verify your settings."
              });
            }}
          >
            <MailCheck className="mr-2 h-4 w-4" />
            Send Test Notification
          </Button>
        </div>
      </GlassPanel>
    </div>
  );

  const renderDataPrivacyTab = () => (
    <div className="space-y-6">
      <GlassPanel className="p-6">
        <h3 className="text-lg font-medium mb-6">Data Privacy Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
            <div>
              <h4 className="font-medium">Encrypt Sensitive Data</h4>
              <p className="text-sm text-gray-600">Use enhanced encryption for sensitive information</p>
            </div>
            <Switch 
              checked={settings.encryptSensitiveData}
              onCheckedChange={(checked) => handleSettingChange('encryptSensitiveData', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
            <div>
              <h4 className="font-medium">Anonymize Usage Data</h4>
              <p className="text-sm text-gray-600">Remove personal identifiers from analytics</p>
            </div>
            <Switch 
              checked={settings.anonymizeData}
              onCheckedChange={(checked) => handleSettingChange('anonymizeData', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
            <div>
              <h4 className="font-medium">Share Usage Statistics</h4>
              <p className="text-sm text-gray-600">Help improve ChemFlow by sharing anonymous usage data</p>
            </div>
            <Switch 
              checked={settings.shareUsageStats}
              onCheckedChange={(checked) => handleSettingChange('shareUsageStats', checked)}
            />
          </div>
          
          <div className="p-4 border border-gray-100 rounded-lg">
            <h4 className="font-medium mb-2">Data Retention Period</h4>
            <p className="text-sm text-gray-600 mb-4">How long we store your simulation data</p>
            <div className="px-4">
              <Slider
                defaultValue={[settings.dataRetentionDays]}
                max={365}
                min={30}
                step={30}
                onValueChange={([value]) => handleSettingChange('dataRetentionDays', value)}
                className="mb-6"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>30 days</span>
                <span>6 months</span>
                <span>1 year</span>
              </div>
            </div>
          </div>
        </div>
      </GlassPanel>
      
      <GlassPanel className="p-6">
        <h3 className="text-lg font-medium mb-6">Data Management</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
            <div>
              <h4 className="font-medium">Automatic Backups</h4>
              <p className="text-sm text-gray-600">Regularly back up your simulations and settings</p>
            </div>
            <Switch 
              checked={settings.automaticBackups}
              onCheckedChange={(checked) => handleSettingChange('automaticBackups', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
            <div>
              <h4 className="font-medium">Backup Frequency</h4>
              <p className="text-sm text-gray-600">Every {settings.backupFrequency} days</p>
            </div>
            <div className="w-32">
              <Slider
                defaultValue={[settings.backupFrequency]}
                max={30}
                min={1}
                step={1}
                onValueChange={([value]) => handleSettingChange('backupFrequency', value)}
              />
            </div>
          </div>
        </div>
        
        <div className="mt-6 space-x-2">
          <Button 
            variant="outline"
            onClick={() => {
              toast({
                title: "Data Exported",
                description: "Your data has been exported successfully."
              });
            }}
          >
            <Download className="mr-2 h-4 w-4" />
            Export All Data
          </Button>
          
          <Button 
            variant="outline" 
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => {
              toast({
                title: "Request Submitted",
                description: "Your data deletion request has been submitted and will be processed."
              });
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Request Data Deletion
          </Button>
        </div>
      </GlassPanel>
      
      <GlassPanel className="p-6">
        <h3 className="text-lg font-medium mb-3">Legal Documents</h3>
        <div className="space-y-2">
          <a href="#" className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg">
            <FileText className="mr-3 h-5 w-5 text-gray-500" />
            <span>Privacy Policy</span>
          </a>
          <a href="#" className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg">
            <FileText className="mr-3 h-5 w-5 text-gray-500" />
            <span>Terms of Service</span>
          </a>
          <a href="#" className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg">
            <FileText className="mr-3 h-5 w-5 text-gray-500" />
            <span>Data Processing Agreement</span>
          </a>
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
              {activeTab === "notifications" && renderNotificationsTab()}
              {activeTab === "security" && renderSecurityTab()}
              {activeTab === "data" && renderDataPrivacyTab()}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Settings;
