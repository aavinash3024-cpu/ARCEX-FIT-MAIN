"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ChevronLeft, 
  User, 
  Settings, 
  Shield, 
  LogOut,
  CreditCard,
  HelpCircle,
  ChevronRight,
  Trophy,
  RefreshCw,
  MapPin,
  Calendar,
  Key,
  Database,
  Trash2,
  Smartphone,
  Palette,
  FileText,
  Lock,
  Stethoscope,
  Banknote,
  Bell,
  Zap,
  Save,
  CheckCircle2,
  X,
  Star,
  AlertTriangle,
  Check,
  Scale,
  Crown,
  HeartPulse,
  Layout,
  UtensilsCrossed,
  BarChart3,
  LineChart,
  ListTodo,
  Activity,
  Dumbbell,
  TrendingUp,
  Sparkles,
  Wifi
} from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

export type ProfileSubView = 'main' | 'personal-info' | 'subscription' | 'legal' | 'settings' | 'reset';

interface ProfileViewProps {
  onBack: () => void;
  activeView?: ProfileSubView;
  onNavigate: (tab: string) => void;
}

export function ProfileView({ onBack, activeView = 'main', onNavigate }: ProfileViewProps) {
  const [goalData, setGoalData] = useState<any>(null);
  const [weightHistory, setWeightHistory] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState('half-year');

  // Preference States
  const [darkMode, setDarkMode] = useState(false);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Profile Form State
  const [profileName, setProfileName] = useState("Alex Johnson");
  const [profileEmail, setProfileEmail] = useState("alex.j@pulseflow.ai");
  const [profileLocation, setProfileLocation] = useState("London, UK");
  const [profileDob, setProfileDob] = useState("1998-05-15");
  const [profileGender, setProfileGender] = useState("male");
  const [profileAge, setProfileAge] = useState("25");

  useEffect(() => {
    // Load Goal Data
    const savedGoal = localStorage.getItem('pulseflow_goal_data');
    if (savedGoal) {
      try {
        const data = JSON.parse(savedGoal);
        setGoalData(data);
        if (data.gender) setProfileGender(data.gender);
        if (data.age) setProfileAge(data.age.toString());
      } catch (e) {
        console.error("Failed to parse goal data", e);
      }
    }

    // Load Weight History
    const savedWeight = localStorage.getItem('pulseflow_weight_history');
    if (savedWeight) {
      try {
        setWeightHistory(JSON.parse(savedWeight));
      } catch (e) {
        console.error("Failed to parse weight history", e);
      }
    }

    // Load Profile Specific Data
    const savedProfile = localStorage.getItem('pulseflow_user_profile');
    if (savedProfile) {
      try {
        const data = JSON.parse(savedProfile);
        if (data.name) setProfileName(data.name);
        if (data.email) setProfileEmail(data.email);
        if (data.location) setProfileLocation(data.location);
        if (data.dob) setProfileDob(data.dob);
      } catch (e) {
        console.error("Failed to parse profile data", e);
      }
    }

    // Load Preferences
    const savedDarkMode = localStorage.getItem('pulseflow_dark_mode');
    if (savedDarkMode !== null) setDarkMode(savedDarkMode === 'true');
    const savedHaptics = localStorage.getItem('pulseflow_haptics');
    if (savedHaptics !== null) setHapticsEnabled(savedHaptics === 'true');
    const savedNotify = localStorage.getItem('pulseflow_notifications');
    if (savedNotify !== null) setNotificationsEnabled(savedNotify === 'true');
  }, []);

  // Theme Side Effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('pulseflow_dark_mode', darkMode.toString());
  }, [darkMode]);

  // Haptics & Notifications Side Effects
  useEffect(() => {
    localStorage.setItem('pulseflow_haptics', hapticsEnabled.toString());
  }, [hapticsEnabled]);

  useEffect(() => {
    localStorage.setItem('pulseflow_notifications', notificationsEnabled.toString());
  }, [notificationsEnabled]);

  const { startWeight, targetWeight, currentWeight, progressPercent } = useMemo(() => {
    const sW = goalData?.weight ? parseFloat(goalData.weight) : 0;
    const tW = goalData?.targetWeight ? parseFloat(goalData.targetWeight) : 0;
    const cW = weightHistory?.length > 0 
      ? weightHistory[weightHistory.length - 1].weight 
      : sW;

    if (!sW || !tW || sW === tW) {
      return { startWeight: sW, targetWeight: tW, currentWeight: cW, progressPercent: 0 };
    }
    
    const objective = goalData?.objective || 'loss';
    let progress = 0;
    
    if (objective === 'loss') {
      if (cW >= sW) progress = 0;
      else progress = ((sW - cW) / (sW - tW)) * 100;
    } else if (objective === 'gain') {
      if (cW <= sW) progress = 0;
      else progress = ((cW - sW) / (tW - sW)) * 100;
    } else {
      progress = 100;
    }
    
    return {
      startWeight: sW,
      targetWeight: tW,
      currentWeight: cW,
      progressPercent: Math.min(100, Math.max(0, Math.round(progress)))
    };
  }, [goalData, weightHistory]);

  const handleSaveProfile = () => {
    setIsSaving(true);
    
    const profileData = {
      name: profileName,
      email: profileEmail,
      location: profileLocation,
      dob: profileDob
    };
    localStorage.setItem('pulseflow_user_profile', JSON.stringify(profileData));

    if (goalData) {
      const updatedGoal = {
        ...goalData,
        gender: profileGender,
        age: parseInt(profileAge) || goalData.age
      };
      localStorage.setItem('pulseflow_goal_data', JSON.stringify(updatedGoal));
      setGoalData(updatedGoal);
    }

    setTimeout(() => {
      setIsSaving(false);
      onNavigate('profile');
    }, 800);
  };

  const handleResetApp = () => {
    setIsResetting(true);
    
    const keysToRemove = [
      'pulseflow_goal_data',
      'pulseflow_tasks',
      'pulseflow_hydration',
      'pulseflow_hydration_history',
      'pulseflow_steps',
      'pulseflow_steps_history',
      'pulseflow_weight_history',
      'pulseflow_today_logged_meals',
      'pulseflow_recent_meals',
      'pulseflow_saved_meals',
      'pulseflow_all_meals_history',
      'pulseflow_workout_split',
      'pulseflow_extra_moves',
      'pulseflow_workout_logs',
      'pulseflow_workout_history',
      'pulseflow_streak_v3',
      'pulseflow_last_reset_date'
    ];

    keysToRemove.forEach(key => localStorage.removeItem(key));

    setTimeout(() => {
      setIsResetting(false);
      window.location.reload();
    }, 1500);
  };

  const menuSections = [
    {
      title: "My Account",
      items: [
        { id: 'profile-personal', icon: User, label: "Personal Information", subLabel: "Name, email, and identity", color: "text-blue-500", bg: "bg-blue-50" },
        { id: 'profile-subscription', icon: CreditCard, label: "Subscription Plan", subLabel: "Elite Premium", color: "text-purple-500", bg: "bg-purple-50" },
        { id: 'profile-reset', icon: RefreshCw, label: "Reset Progress", subLabel: "Fresh start, keep profile", color: "text-rose-500", bg: "bg-rose-50" },
      ]
    },
    {
      title: "Security & Privacy",
      items: [
        { id: 'help', icon: HelpCircle, label: "Help Center", subLabel: "FAQs and troubleshooting", color: "text-sky-500", bg: "bg-sky-50" },
        { id: 'profile-legal', icon: Shield, label: "Legal", subLabel: "Privacy policy & terms", color: "text-green-500", bg: "bg-green-50" },
      ]
    },
    {
      title: "App Settings",
      items: [
        { id: 'profile-settings', icon: Settings, label: "Settings", subLabel: "Units and app preferences", color: "text-slate-500", bg: "bg-slate-50" },
        { id: 'rate', icon: Star, label: "Rate the App", subLabel: "Share your feedback", color: "text-amber-500", bg: "bg-amber-50" },
      ]
    }
  ];

  const renderPersonalInfo = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 pb-20">
      <div className="px-1 space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/60 px-3">Identity Details</h3>
        <Card className="border-none shadow-md bg-card rounded-3xl overflow-hidden border border-muted/10">
          <CardContent className="p-6 space-y-5">
            <div className="space-y-2">
              <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                <Input 
                  value={profileName} 
                  onChange={(e) => setProfileName(e.target.value)}
                  className="pl-10 h-12 rounded-xl bg-muted/5 border-muted-foreground/10 font-bold text-xs"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">Email Address</Label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                <Input 
                  value={profileEmail} 
                  onChange={(e) => setProfileEmail(e.target.value)}
                  className="pl-10 h-12 rounded-xl bg-muted/5 border-muted-foreground/10 font-bold text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">Age</Label>
                <Input 
                  type="number"
                  value={profileAge} 
                  onChange={(e) => setProfileAge(e.target.value === "" ? "" : Math.min(100, parseInt(e.target.value) || 0).toString())}
                  className="h-12 rounded-xl bg-muted/5 border-muted-foreground/10 font-bold text-xs"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">Sex</Label>
                <Select value={profileGender} onValueChange={setProfileGender}>
                  <SelectTrigger className="h-12 rounded-xl bg-muted/5 border-muted-foreground/10 font-bold text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="male" className="text-xs font-bold">Male</SelectItem>
                    <SelectItem value="female" className="text-xs font-bold">Female</SelectItem>
                    <SelectItem value="other" className="text-xs font-bold">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                <Input 
                  value={profileLocation} 
                  onChange={(e) => setProfileLocation(e.target.value)}
                  className="pl-10 h-12 rounded-xl bg-muted/5 border-muted-foreground/10 font-bold text-xs"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">Date of Birth</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                <Input 
                  type="date"
                  value={profileDob} 
                  onChange={(e) => setProfileDob(e.target.value)}
                  className="pl-10 h-12 rounded-xl bg-muted/5 border-muted-foreground/10 font-bold text-xs"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Button 
          onClick={handleSaveProfile}
          disabled={isSaving}
          className="w-full h-14 rounded-2xl bg-primary text-white font-black uppercase text-[11px] tracking-widest shadow-xl shadow-primary/20 gap-2 mt-4"
        >
          {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Personal Details
        </Button>
      </div>
    </div>
  );

  const renderSubscription = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-24">
      {/* 1. MEMBERSHIP STATUS CARD (CREDIT CARD STYLE) */}
      <div className="px-1">
        <div className="relative w-full h-32 rounded-[1.75rem] overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#2d3436] to-[#0f172a]" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />
          
          <div className="relative h-full p-5 flex flex-col justify-between text-white">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-emerald-400 p-[0.5px] overflow-hidden flex items-center justify-center shadow-lg">
                  <div className="w-full h-full bg-black/40 backdrop-blur-sm flex items-center justify-center rounded-full">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="font-black text-lg uppercase tracking-tighter italic leading-none">ARCEX <span className="text-primary">FIT</span></h3>
                  <Badge variant="secondary" className="mt-1 bg-primary/20 text-primary border-none text-[7px] font-black uppercase px-1.5 h-3.5 rounded-md">PREMIUM ELITE</Badge>
                </div>
              </div>
              <Wifi className="w-5 h-5 text-white/20 rotate-90" />
            </div>

            <div className="flex justify-between items-end">
              <div className="space-y-0.5">
                <h3 className="text-sm font-black uppercase tracking-tighter truncate opacity-90">{profileName}</h3>
              </div>
              <div className="text-right">
                <p className="text-[6px] font-black text-white/30 uppercase tracking-[0.2em]">RENEWAL</p>
                <p className="text-[9px] font-black tracking-widest uppercase">OCT 2025</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SUBSCRIPTION PLANS (HORIZONTAL GRID WITH GRADIENT BOUNDARY) */}
      <div className="px-1 space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/60 px-3">Subscription Plans</h3>
        <div className="grid grid-cols-3 gap-2.5">
          {[
            { id: 'monthly', name: 'Monthly', price: '229', original: '299', save: '23%' },
            { id: 'half-year', name: 'Half-Year', price: '699', original: '1374', save: '49%' },
            { id: 'yearly', name: 'Yearly', price: '1299', original: '2748', save: '52%' }
          ].map((plan) => {
            const isSelected = selectedPlanId === plan.id;
            return (
              <div 
                key={plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                className={cn(
                  "relative p-[1.5px] rounded-2xl transition-all cursor-pointer",
                  isSelected ? "bg-gradient-to-br from-primary via-emerald-400 to-primary shadow-lg scale-[1.02]" : "bg-muted/20"
                )}
              >
                <Card className="border-none bg-card rounded-[calc(1rem-0.5px)] h-full overflow-hidden">
                  <CardContent className="p-3 flex flex-col items-center text-center gap-2">
                    <h5 className={cn("font-black text-[9px] uppercase tracking-widest", isSelected ? "text-primary" : "text-muted-foreground")}>
                      {plan.name}
                    </h5>
                    <div className="space-y-0.5 flex flex-col items-center">
                      <span className="text-[8px] font-bold text-rose-500 line-through">₹{plan.original}</span>
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-sm font-black text-foreground">₹{plan.price}</span>
                      </div>
                      <Badge className="bg-rose-500/10 text-rose-500 text-[7px] font-black uppercase px-1.5 h-3.5 border-none mt-1 shadow-sm">
                        SAVE {plan.save}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. PREMIUM & FREE FEATURES (CLEAN CARDS, NO HEADER/FOOTER) */}
      <div className="px-1 space-y-6">
        {/* PREMIUM CARD */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-primary px-3">Elite Premium Coverage</h3>
          <Card className="border-none shadow-md bg-card rounded-3xl overflow-hidden border border-muted/10">
            <CardContent className="p-6 grid gap-6">
              {[
                { label: 'Strength Growth', desc: 'Detailed power progress trends.', icon: TrendingUp, colors: 'from-amber-400 to-orange-500' },
                { label: 'Split Analysis', desc: 'Muscle coverage & target gaps.', icon: Layout, colors: 'from-blue-400 to-indigo-600' },
                { label: 'Meal Logging', desc: '20 daily AI parse credits.', icon: UtensilsCrossed, colors: 'from-emerald-400 to-teal-600' },
                { label: 'Intake Reports', desc: 'Daily, Weekly, Monthly history.', icon: BarChart3, colors: 'from-purple-400 to-pink-600' },
                { label: 'PERSONAL ANALYZER', desc: 'UNLIMITED personal progress insights.', icon: Sparkles, colors: 'from-cyan-400 to-blue-600', highlight: true }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-sm border p-[1.5px]",
                    item.highlight ? "border-primary/40" : "border-muted/20"
                  )}>
                    <div className={cn("w-full h-full rounded-full flex items-center justify-center bg-gradient-to-br text-white", item.colors)}>
                      <item.icon className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h5 className={cn("text-[10px] font-black uppercase tracking-tight", item.highlight ? "text-primary" : "text-foreground/90")}>{item.label}</h5>
                    <p className="text-[9px] font-bold text-muted-foreground/60 leading-tight uppercase tracking-tight">{item.desc}</p>
                  </div>
                </div>
              ))}
              <div className="pt-4 border-t border-muted/5 flex items-center gap-2">
                <CheckCircle2 className="w-3 h-3 text-primary" />
                <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Includes everything in Free</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FREE CARD */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/60 px-3">Standard Free Features</h3>
          <Card className="border-none shadow-md bg-card rounded-3xl overflow-hidden border border-muted/10 opacity-70">
            <CardContent className="p-6 grid gap-6">
              {[
                { label: 'Hydration', desc: 'Weekly water intake analysis.', icon: HeartPulse, colors: 'from-blue-300 to-blue-500' },
                { label: 'Steps', desc: 'Movement tracking & trends.', icon: Activity, colors: 'from-green-300 to-green-500' },
                { label: 'Streaks', desc: 'Daily consistency badges.', icon: Zap, colors: 'from-yellow-300 to-orange-400' },
                { label: 'Tasks', desc: 'Objective manager system.', icon: ListTodo, colors: 'from-slate-300 to-slate-500' },
                { label: 'Workouts', desc: 'Custom routine creation.', icon: Dumbbell, colors: 'from-red-300 to-red-500' }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-9 h-9 rounded-full border border-muted/20 p-[1.5px] shrink-0">
                    <div className={cn("w-full h-full rounded-full flex items-center justify-center bg-gradient-to-br text-white shadow-inner", item.colors)}>
                      <item.icon className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h5 className="text-[10px] font-black uppercase tracking-tight text-foreground/80">{item.label}</h5>
                    <p className="text-[9px] font-bold text-muted-foreground/40 leading-tight uppercase tracking-tight">{item.desc}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderLegal = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 pb-20">
      <div className="px-1 space-y-3">
        <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/60 px-3">Documentation</h3>
        <Card className="border-none shadow-md bg-card rounded-3xl overflow-hidden border border-muted/10">
          <CardContent className="p-0">
            <LegalItem icon={FileText} label="Terms and Conditions" color="text-blue-600" bg="bg-blue-50" />
            <LegalItem icon={Lock} label="Privacy Policy" color="text-indigo-600" bg="bg-indigo-50" />
            <LegalItem icon={Stethoscope} label="Health and Medical Disclaimer" color="text-rose-600" bg="bg-rose-50" />
            <LegalItem icon={Banknote} label="Payment and Subscription Policy" color="text-emerald-600" bg="bg-emerald-50" />
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-20">
      <div className="px-1 space-y-3">
        <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/60 px-3">Preferences</h3>
        <Card className="border-none shadow-md bg-card rounded-3xl overflow-hidden border border-muted/10">
          <CardContent className="p-0">
            <SettingsSwitch 
              icon={Palette} 
              label="Dark Theme" 
              subLabel="Switch app appearance" 
              color="text-slate-500" 
              bg="bg-slate-50"
              checked={darkMode}
              onCheckedChange={setDarkMode}
            />
            <SettingsSwitch 
              icon={Smartphone} 
              label="Haptics" 
              subLabel="Tactile feedback" 
              color="text-sky-500" 
              bg="bg-slate-50"
              checked={hapticsEnabled}
              onCheckedChange={setHapticsEnabled}
            />
            <SettingsSwitch 
              icon={Bell} 
              label="Notifications" 
              subLabel="Manage app alerts" 
              color="text-primary" 
              bg="bg-primary/5"
              checked={notificationsEnabled}
              onCheckedChange={setNotificationsEnabled}
            />
          </CardContent>
        </Card>
      </div>

      <div className="px-1 space-y-3">
        <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/60 px-3">Sync & Devices</h3>
        <Card className="border-none shadow-md bg-card rounded-3xl overflow-hidden border border-muted/10">
          <CardContent className="p-0">
            <SettingsButton icon={Zap} label="Health Connect" subLabel="Sync steps from your device" color="text-green-600" bg="bg-green-50" />
          </CardContent>
        </Card>
      </div>

      <div className="px-1 space-y-3">
        <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/60 px-3">Data & Security</h3>
        <Card className="border-none shadow-md bg-card rounded-3xl overflow-hidden border border-muted/10">
          <CardContent className="p-0">
            <SettingsButton icon={Database} label="Export Data" subLabel="Download your wellness history" />
            <SettingsButton icon={Key} label="Change Password" subLabel="Update security credentials" />
            <SettingsButton icon={LogOut} label="Logout" subLabel="Sign out of this session" color="text-amber-600" bg="bg-amber-50" />
            <SettingsButton icon={Trash2} label="Delete Account" subLabel="Permanently remove all data" color="text-destructive" bg="bg-destructive/5" />
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderReset = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 px-1 pb-10">
      <Card className="border-none shadow-xl bg-card rounded-[2.5rem] overflow-hidden border border-muted/10">
        <CardContent className="p-8 space-y-8">
          <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto border-4 border-white shadow-lg">
            <RefreshCw className="w-8 h-8 text-rose-500" />
          </div>
          
          <div className="text-center space-y-3">
            <h2 className="text-2xl font-black tracking-tighter text-foreground">Start Fresh?</h2>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed">
              Resetting will clear your active goals, nutrition logs, and workout history. You can start your journey from day one again.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-muted/5 p-4 rounded-2xl border border-muted/10 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-green-600" />
                </div>
                <p className="text-[11px] font-bold text-foreground/70 leading-tight">
                  <span className="text-foreground font-black uppercase block text-[9px] tracking-widest mb-0.5">Will NOT Affect:</span>
                  Your personal identity details (Name, Email, Location) and your Learned AI Food Cache will be preserved.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertTriangle className="w-3 h-3 text-rose-600" />
                </div>
                <p className="text-[11px] font-bold text-foreground/70 leading-tight">
                  <span className="text-rose-600 font-black uppercase block text-[9px] tracking-widest mb-0.5">Will Clear:</span>
                  All weight history, meal logs, hydration charts, workout splits, and active goals.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  disabled={isResetting}
                  className="w-full h-14 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-black uppercase text-[11px] tracking-widest shadow-xl shadow-rose-200 transition-all active:scale-[0.98] gap-2"
                >
                  {isResetting ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Confirm Full App Reset"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-[2.5rem] w-[90%] max-sm">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-center font-black uppercase tracking-tighter text-xl">Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription className="text-center text-xs font-medium px-2">
                    This will permanently delete your progress history and goals. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-col gap-2 sm:flex-col mt-4">
                  <AlertDialogAction 
                    onClick={handleResetApp}
                    className="w-full h-12 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-black uppercase text-[10px] tracking-widest"
                  >
                    Yes, Reset Everything
                  </AlertDialogAction>
                  <AlertDialogCancel className="w-full h-12 rounded-2xl border-muted/20 font-black uppercase text-[10px] tracking-widest mt-0">
                    Cancel
                  </AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <p className="text-[9px] text-center text-muted-foreground/40 font-black uppercase tracking-widest mt-4">This action is irreversible</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderMain = () => (
    <>
      <div className="px-1 space-y-4">
        <Card className="border-none bg-card shadow-sm rounded-[2rem] overflow-hidden border border-white/20 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-card to-transparent pointer-events-none" />
          <CardContent className="p-4 relative z-10">
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                <div className="w-16 h-16 rounded-full bg-[#6b85a3] flex items-center justify-center shadow-xl border-4 border-white relative z-10">
                  <span className="text-xl font-black text-white">{profileName.charAt(0)}</span>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 z-20 bg-[#6b85a3] text-white p-1 rounded-full border-2 border-white shadow-lg">
                  <Trophy className="w-2 h-2" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-black text-foreground tracking-tighter truncate">{profileName}</h2>
                <div className="space-y-0.5 mt-0.5">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                    {profileAge} Yrs • {profileGender?.toUpperCase()}
                  </p>
                  <p className="text-[9px] font-bold text-muted-foreground/60 tracking-tight truncate">{profileEmail}</p>
                </div>
                <Badge variant="secondary" className="mt-1.5 bg-primary/10 text-primary hover:bg-primary/10 text-[7px] font-black uppercase tracking-widest px-2 h-3.5 border-none">
                  Premium Member
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {goalData && (
          <Card className="border-none shadow-sm bg-card rounded-[1.5rem] border border-muted/10 overflow-hidden">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Weight Goal</span>
                </div>
                <span className="text-xs font-black text-primary">{progressPercent}%</span>
              </div>
              
              <div className="space-y-2">
                <Progress value={progressPercent} className="h-1.5 bg-muted" />
                <div className="flex justify-between items-center text-[8px] font-black text-muted-foreground uppercase tracking-widest">
                  <span>Start: {startWeight.toFixed(1)}kg</span>
                  <span className="text-primary">Current: {currentWeight.toFixed(1)}kg</span>
                  <span>Goal: {targetWeight.toFixed(1)}kg</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="space-y-8 px-1 mt-6 pb-20">
        {menuSections.map((section, idx) => (
          <div key={idx} className="space-y-3">
            <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/60 px-3">
              {section.title}
            </h3>
            <Card className="border-none shadow-md bg-card overflow-hidden rounded-3xl border border-muted/10">
              <CardContent className="p-0">
                {section.items.map((item, i) => (
                  <button 
                    key={i} 
                    onClick={() => onNavigate(item.id)}
                    className="w-full p-4 flex items-center justify-between transition-all text-left group border-b border-muted/5 last:border-0"
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm shrink-0", item.bg, item.color)}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-sm font-bold text-foreground/90 block leading-tight">{item.label}</span>
                        <span className="text-[10px] font-medium text-muted-foreground line-clamp-1">{item.subLabel}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <ChevronRight className="w-4 h-4 text-muted-foreground/20 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <div className="space-y-6 pb-2 pt-4 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-4 pt-2 px-1">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full bg-muted/50 w-9 h-9">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold font-headline">
          {activeView === 'personal-info' ? 'Personal Info' :
           activeView === 'subscription' ? 'Subscription' :
           activeView === 'legal' ? 'Legal' :
           activeView === 'settings' ? 'Settings' : 
           activeView === 'reset' ? 'Start Fresh' : 'Profile'}
        </h1>
      </div>

      {activeView === 'main' && renderMain()}
      {activeView === 'personal-info' && renderPersonalInfo()}
      {activeView === 'subscription' && renderSubscription()}
      {activeView === 'legal' && renderLegal()}
      {activeView === 'settings' && renderSettings()}
      {activeView === 'reset' && renderReset()}
    </div>
  );
}

function LegalItem({ icon: Icon, label, color, bg }: { icon: any, label: string, color?: string, bg?: string }) {
  return (
    <button className="w-full p-4 flex items-center justify-between transition-all text-left group border-b border-muted/5 last:border-0">
      <div className="flex items-center gap-4">
        <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shadow-sm", bg || "bg-blue-50", color || "text-blue-600")}>
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-sm font-bold text-foreground/90">{label}</span>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground/20 group-hover:text-primary transition-all" />
    </button>
  );
}

function SettingsButton({ icon: Icon, label, subLabel, color, bg }: { icon: any, label: string, subLabel: string, color?: string, bg?: string }) {
  return (
    <button className="w-full p-4 flex items-center justify-between transition-all text-left group border-b border-muted/5 last:border-0">
      <div className="flex items-center gap-4">
        <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm", bg || "bg-muted/30", color || "text-muted-foreground")}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="space-y-0.5">
          <span className="text-sm font-bold text-foreground/90 block leading-tight">{label}</span>
          <span className="text-[10px] font-medium text-muted-foreground">{subLabel}</span>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground/20 group-hover:text-primary transition-all" />
    </button>
  );
}

function SettingsSwitch({ icon: Icon, label, subLabel, color, bg, checked, onCheckedChange }: { 
  icon: any, 
  label: string, 
  subLabel: string, 
  color?: string, 
  bg?: string,
  checked: boolean,
  onCheckedChange: (val: boolean) => void
}) {
  return (
    <div className="w-full p-4 flex items-center justify-between group border-b border-muted/5 last:border-0">
      <div className="flex items-center gap-4">
        <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm", bg || "bg-muted/30", color || "text-muted-foreground")}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="space-y-0.5">
          <span className="text-sm font-bold text-foreground/90 block leading-tight">{label}</span>
          <span className="text-[10px] font-medium text-muted-foreground">{subLabel}</span>
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} className="data-[state=checked]:bg-primary" />
    </div>
  );
}
