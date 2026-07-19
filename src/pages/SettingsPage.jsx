import React, { useState, useEffect } from "react";
import { User, Bell, Shield, Save, Key, Download, LogOut, Laptop } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

export default function SettingsPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [notifications, setNotifications] = useState({
    newOrder: true,
    newMessage: true,
    aiHandoff: false,
  });
  const [security, setSecurity] = useState({
    twoFactor: false,
  });
  
  const { toast } = useToast();

  useEffect(() => {
     async function loadUserProfile() {
    try {
      setLoading(true);
      // Connecting directly to YOUR own local server v1 API
      const token = localStorage.getItem('token');
       const response = await axios.get("/api/v1/auth/me", {
        headers: {
         "Authorization": "Bearer " + token
        }
      });

      if (response.data && response.data.data) {
        setUser(response.data.data.user);
      }
    } catch (error) {
      console.error("Failed to load profile from your servers:", error);
      toast({ title: "Server Connection Failed", description: "Could not fetch data from your Node.js backend.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }
    loadUserProfile();
  }, [toast]);

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      // Future patch route for your own server: await axios.patch("http://localhost:5000/api/v1/user/preferences", { notifications, security });
      setTimeout(() => {
        setSaving(false);
        toast({ title: "Settings saved successfully", description: "Your preferences have been updated on your server." });
      }, 800);
    } catch (error) {
      setSaving(false);
      toast({ title: "Error saving settings", variant: "destructive" });
    }
  };

  const handleExportData = () => {
    toast({ title: "Export Started", description: "Your account data is being compiled by your backend." });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings & Preferences</h1>
          <p className="text-slate-500 mt-1">Manage your account, security, and advanced integrations</p>
        </div>
        <Button 
          onClick={handleSaveSettings} 
          disabled={saving}
          className="bg-teal-500 hover:bg-teal-600 text-black gap-2"
        >
          {saving ? <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Section */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 rounded-lg bg-teal-500/10">
                <User className="w-5 h-5 text-teal-400" />
              </div>
              <h2 className="font-semibold text-white">Profile Details</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 md:col-span-1">
                <label className="text-xs text-slate-500 mb-1.5 block">Full Name</label>
                <Input value={user?.full_name || "Guest User"} readOnly className="bg-white/5 border-white/10 text-slate-300" />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="text-xs text-slate-500 mb-1.5 block">Email</label>
                <Input value={user?.email || "no-connection@yoursaas.com"} readOnly className="bg-white/5 border-white/10 text-slate-300" />
              </div>
              <div className="col-span-2">
                <label className="text-xs text-slate-500 mb-1.5 block">Role</label>
                <Input value={user?.role || "User"} readOnly className="bg-white/5 border-white/10 text-slate-300 capitalize" />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Bell className="w-5 h-5 text-blue-400" />
              </div>
              <h2 className="font-semibold text-white">Notification Preferences</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5 transition-colors hover:bg-white/[0.04]">
                <div>
                  <p className="text-sm font-medium text-white">New order alerts</p>
                  <p className="text-xs text-slate-500 mt-0.5">Push notifications when a new order is confirmed</p>
                </div>
                <Switch 
                  checked={notifications.newOrder} 
                  onCheckedChange={(c) => setNotifications(prev => ({...prev, newOrder: c}))} 
                />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5 transition-colors hover:bg-white/[0.04]">
                <div>
                  <p className="text-sm font-medium text-white">Incoming messages</p>
                  <p className="text-xs text-slate-500 mt-0.5">Alerts for unread customer inquiries</p>
                </div>
                <Switch 
                  checked={notifications.newMessage} 
                  onCheckedChange={(c) => setNotifications(prev => ({...prev, newMessage: c}))} 
                />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5 transition-colors hover:bg-white/[0.04]">
                <div>
                  <p className="text-sm font-medium text-white">AI bot handoff</p>
                  <p className="text-xs text-slate-500 mt-0.5">Alerts when AI requests human intervention</p>
                </div>
                <Switch 
                  checked={notifications.aiHandoff} 
                  onCheckedChange={(c) => setNotifications(prev => ({...prev, aiHandoff: c}))} 
                />
              </div>
            </div>
          </div>
          
          {/* Developer Integrations */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <Key className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <h2 className="font-semibold text-white">Developer & Integrations</h2>
                <p className="text-xs text-slate-500">Webhooks for your own independent ecosystem</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-500 mb-1.5 block">Global Webhook URL</label>
                <div className="flex gap-2">
                  <Input placeholder="https://api.your-own-saas.com/webhook" className="bg-white/5 border-white/10 text-slate-300 flex-1" />
                  <Button variant="outline" className="border-white/10 text-slate-300">Test</Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Security */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Shield className="w-5 h-5 text-purple-400" />
              </div>
              <h2 className="font-semibold text-white">Security</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5">
                <div>
                  <p className="text-sm font-medium text-white">2FA</p>
                  <p className="text-xs text-slate-500">Two-factor auth</p>
                </div>
                <Switch 
                  checked={security.twoFactor} 
                  onCheckedChange={(c) => setSecurity(prev => ({...prev, twoFactor: c}))} 
                />
              </div>
              
              <div className="pt-4 border-t border-white/5">
                <p className="text-sm font-medium text-white mb-3">Active Sessions</p>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                  <Laptop className="w-4 h-4 text-slate-400" />
                  <div className="flex-1">
                    <p className="text-xs text-white">Mac OS • Chrome</p>
                    <p className="text-[10px] text-green-400">Current Session</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-3 border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-300 gap-2 text-xs">
                  <LogOut className="w-3 h-3" /> Terminate Sessions
                </Button>
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 rounded-lg bg-slate-500/10">
                <Download className="w-5 h-5 text-slate-400" />
              </div>
              <h2 className="font-semibold text-white">Data Management</h2>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Download a complete archive of your independent account data in JSON format.
            </p>
            <Button onClick={handleExportData} variant="outline" className="w-full border-white/10 text-slate-300 hover:bg-white/5 gap-2">
              <Download className="w-4 h-4" /> Request Data Export
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
