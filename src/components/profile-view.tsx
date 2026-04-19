
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
  Wifi,
  Contact
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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
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
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
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
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 px-1 pb-24">
      {/* CREDIT CARD STYLE STATUS CARD */}
      <div className="px-1">
        <div className="relative w-full h-52 rounded-[1.75rem] overflow-hidden shadow-2xl transition-transform hover:scale-[1.02] active:scale-[0.98]">
          {/* Main Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#2d3436] to-[#0f172a]" />
          
          {/* Decorative Gloss & Accents */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-[60px] -ml-24 -mb-24 pointer-events-none" />
          
          <div className="relative h-full p-6 flex flex-col justify-between text-white">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-emerald-400 p-[1.5px]">
                    <div className="w-full h-full rounded-[7px] bg-black/40 backdrop-blur-sm flex items-center justify-center">
                      <Crown className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <span className="font-black text-sm uppercase tracking-tighter italic">PulseFlow <span className="text-primary">Elite</span></span>
                </div>
                <p className="text-[8px] font-black text-white/40 uppercase tracking-[0.3em] pl-0.5">ESTABLISHED 2024</p>
              </div>
              <Wifi className="w-5 h-5 text-white/20 rotate-90" />
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-[7px] font-black text-white/30 uppercase tracking-[0.4em]">MEMBERSHIP HOLDER</p>
                <h3 className="text-lg font-black uppercase tracking-tighter truncate">{profileName}</h3>
              </div>
              
              <div className="flex justify-between items-end">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-[6px] font-black text-white/30 uppercase tracking-[0.2em]">CURRENT TIER</p>
                    <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/20 text-[8px] font-black uppercase px-2 h-4 rounded-md">PREMIUM</Badge>
                  </div>
                  <div>
                    <p className="text-[6px] font-black text-white/30 uppercase tracking-[0.2em]">EXPIRY</p>
                    <p className="text-[10px] font-black tracking-widest">10 / 25</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                   <div className="w-10 h-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded flex items-center justify-center overflow-hidden">
                      <div className="w-full h-full flex">
                         <div className="w-1/2 bg-white/10" />
                         <div className="w-1/2 bg-primary/20" />
                      </div>
                   </div>
                   <p className="text-[6px] font-black text-white/20 uppercase mt-1">SECURE ACCESS</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2 px-3 pt-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/60">Tier Intelligence</h3>
        <p className="text-sm font-bold text-foreground/80">Swipe to compare strategy features.</p>
      </div>

      {/* FEATURES SLIDER */}
      <div className="px-1">
        <Carousel className="w-full">
          <CarouselContent className="-ml-2">
            {/* PREMIUM CARD */}
            <CarouselItem className="pl-2 basis-[92%]">
              <Card className="border-none bg-gradient-to-br from-card to-muted/20 rounded-[2rem] border border-muted/10 shadow-xl overflow-hidden relative h-full">
                <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none">
                  <Crown className="w-32 h-32 text-primary" />
                </div>
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center">
                        <Crown className="w-4 h-4 text-primary" />
                      </div>
                      <h4 className="text-sm font-black uppercase tracking-tight text-primary">Elite Premium</h4>
                    </div>
                    <Badge className="bg-primary text-white text-[7px] font-black uppercase">POWERED BY AI</Badge>
                  </div>
                  
                  <div className="grid gap-3">
                    {[
                      { label: 'Workout Strength Growth Analytics', icon: TrendingUp },
                      { label: 'Advanced Workout Split Analysis', icon: Layout },
                      { label: 'AI Meal Logging (Unlimited)', icon: UtensilsCrossed },
                      { label: 'Full Nutrient Breakdown History', icon: BarChart3 },
                      { label: 'PERSONAL AI PROGRESS ANALYSIS', icon: Sparkles, highlight: true }
                    ].map((item, i) => (
                      <div key={i} className={cn("flex items-start gap-3", item.highlight && "bg-primary/10 p-2.5 -mx-2 rounded-xl border border-primary/10")}>
                        <div className="mt-0.5">
                          <CheckCircle2 className={cn("w-4 h-4", item.highlight ? "text-primary fill-primary/20" : "text-primary/40")} />
                        </div>
                        <span className={cn("text-xs font-black uppercase tracking-tight", item.highlight ? "text-primary" : "text-foreground/80")}>
                          {item.label}
                        </span>
                      </div>
                    ))}
                    
                    <div className="pt-2 border-t border-muted/10">
                      <div className="flex items-center gap-2 opacity-50">
                        <Check className="w-3 h-3 text-muted-foreground" />
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">Includes all Standard features</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>

            {/* FREE CARD */}
            <CarouselItem className="pl-2 basis-[92%]">
              <Card className="border-none bg-card rounded-[2rem] border border-muted/10 shadow-sm overflow-hidden h-full">
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center">
                      <Shield className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <h4 className="text-sm font-black uppercase tracking-tight text-muted-foreground">Standard Free</h4>
                  </div>
                  <div className="grid gap-3">
                    {[
                      { label: 'Hydration Tracking with Weekly Analysis', icon: HeartPulse },
                      { label: 'Steps Tracking with Weekly Analysis', icon: Activity },
                      { label: 'Activity Streak & Badges', icon: Zap },
                      { label: 'Daily Task Management System', icon: ListTodo },
                      { label: 'Custom Workout Creation', icon: Dumbbell }
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="mt-0.5">
                          <Check className="w-3.5 h-3.5 text-muted-foreground/30" />
                        </div>
                        <span className="text-xs font-bold text-foreground/50 uppercase tracking-tight">
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      </div>

      {/* COMMITMENT PLANS */}
      <div className="space-y-4 pt-4 px-1 pb-12">
        <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/60 px-3">Elite Commitment Plans</h3>
        
        <div className="grid gap-3">
          {[
            { id: 'monthly', name: 'Monthly Elite', price: '229', period: 'Month', label: 'Basic Strategy' },
            { id: 'quarterly', name: 'Quarterly Elite', price: '599', period: '3 Months', label: 'Recommended', popular: true, save: 'Save 15%' },
            { id: 'half-year', name: 'Elite Performance', price: '1099', period: '6 Months', label: 'Best Value', save: 'Save 20%' }
          ].map((plan) => (
            <Card key={plan.id} className={cn(
              "border-none shadow-md rounded-2xl overflow-hidden border transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99]",
              plan.popular 
                ? "bg-gradient-to-r from-primary/10 via-primary/5 to-transparent text-foreground ring-2 ring-primary ring-offset-2" 
                : "bg-card border-muted/10"
            )}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h5 className="font-black text-xs uppercase tracking-widest">{plan.name}</h5>
                    {plan.save && (
                      <Badge className={cn("text-[7px] font-black uppercase px-1.5 h-4", plan.popular ? "bg-primary text-white" : "bg-primary/10 text-primary")}>
                        {plan.save}
                      </Badge>
                    )}
                  </div>
                  <p className={cn("text-[8px] font-black uppercase tracking-widest opacity-60")}>
                    {plan.label}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-baseline justify-end gap-1">
                    <span className="text-lg font-black">{plan.price}</span>
                  </div>
                  <p className={cn("text-[7px] font-black uppercase tracking-widest opacity-60")}>
                    / {plan.period}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  const renderLegal = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
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
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
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
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 px-1">
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

      <div className="space-y-8 px-1 mt-6">
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
    <div className="space-y-6 pb-24 pt-4 animate-in fade-in slide-in-from-right-4 duration-500">
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
