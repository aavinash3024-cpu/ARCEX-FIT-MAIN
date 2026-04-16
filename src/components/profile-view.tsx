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
  Crown
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
  initialSubView?: ProfileSubView;
}

export function ProfileView({ onBack, initialSubView = 'main' }: ProfileViewProps) {
  const [activeSubView, setActiveSubView] = useState<ProfileSubView>(initialSubView);
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

  // STABLE SCROLL RESET - INTERNAL NAVIGATION
  useEffect(() => {
    const scrollContainer = document.querySelector('.swipe-container');
    if (scrollContainer) {
      scrollContainer.scrollTop = 0;
      scrollContainer.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [activeSubView]);

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
        ...updatedGoal,
        gender: profileGender,
        age: parseInt(profileAge) || goalData.age
      };
      localStorage.setItem('pulseflow_goal_data', JSON.stringify(updatedGoal));
      setGoalData(updatedGoal);
    }

    setTimeout(() => {
      setIsSaving(false);
      setActiveSubView('main');
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

  const handleBack = () => {
    if (activeSubView !== 'main') {
      setActiveSubView('main');
    } else {
      onBack();
    }
  };

  const menuSections = [
    {
      title: "My Account",
      items: [
        { id: 'personal-info', icon: User, label: "Personal Information", subLabel: "Name, email, and identity", color: "text-blue-500", bg: "bg-blue-50" },
        { id: 'subscription', icon: CreditCard, label: "Subscription Plan", subLabel: "Elite Premium", color: "text-purple-500", bg: "bg-purple-50" },
        { id: 'reset', icon: RefreshCw, label: "Reset Progress", subLabel: "Fresh start, keep profile", color: "text-rose-500", bg: "bg-rose-50" },
      ]
    },
    {
      title: "Security & Privacy",
      items: [
        { id: 'help', icon: HelpCircle, label: "Help Center", subLabel: "FAQs and troubleshooting", color: "text-sky-500", bg: "bg-sky-50" },
        { id: 'legal', icon: Shield, label: "Legal", subLabel: "Privacy policy & terms", color: "text-green-500", bg: "bg-green-50" },
      ]
    },
    {
      title: "App Settings",
      items: [
        { id: 'settings', icon: Settings, label: "Settings", subLabel: "Units and app preferences", color: "text-slate-500", bg: "bg-slate-50" },
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
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500 px-1">
      {/* Compact Membership Card */}
      <Card className="border-none bg-gradient-to-br from-[#0f172a] to-[#1e293b] shadow-2xl rounded-[1.5rem] overflow-hidden text-white relative h-40 flex flex-col justify-between p-6 group transition-all hover:scale-[1.02]">
        {/* Background Symbol */}
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform pointer-events-none">
          <Zap className="w-48 h-48 text-white" />
        </div>
        
        <div className="flex justify-between items-start relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/60">Elite Member</p>
            </div>
            <h2 className="text-xl font-black tracking-tighter">ARCEX PREMIUM</h2>
          </div>
          
          {/* Gold Metallic Chip */}
          <div className="w-10 h-7 rounded-md bg-gradient-to-br from-[#fcd34d] via-[#fbbf24] to-[#d97706] shadow-[inset_0_1px_2px_rgba(255,255,255,0.5),0_2px_4px_rgba(0,0,0,0.3)] flex items-center justify-center border border-white/20 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)]" />
            <div className="grid grid-cols-2 gap-0.5 w-full h-full p-1.5">
              <div className="border-r border-b border-black/10" />
              <div className="border-b border-black/10" />
              <div className="border-r border-black/10" />
              <div className="border-black/10" />
            </div>
          </div>
        </div>

        <div className="relative z-10 flex justify-between items-end">
          <div className="space-y-0.5">
            <p className="text-[8px] font-black text-white/40 uppercase tracking-widest leading-none">Member Name</p>
            <p className="text-sm font-black uppercase truncate max-w-[180px] tracking-tight">{profileName}</p>
          </div>
          <div className="text-right space-y-0.5">
            <p className="text-[8px] font-black text-white/40 uppercase tracking-widest leading-none">Member Since</p>
            <p className="text-xs font-bold tracking-widest">JAN / 2024</p>
          </div>
        </div>
      </Card>

      {/* Subscription Strategy Plans */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between px-3">
          <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/60">Choose Your Strategy</h3>
          <span className="text-[8px] font-black text-primary uppercase tracking-widest animate-pulse">Save up to 60%</span>
        </div>
        
        <div className="grid gap-4">
          {[
            { 
              id: 'monthly', 
              name: 'Entry Strategy', 
              price: '229', 
              original: null,
              discount: null,
              period: 'Month', 
              description: 'Standard monthly commitment',
              features: ['Daily AI Meal Parsing', 'Basic Workout Tracking', 'Email Support']
            },
            { 
              id: 'half-year', 
              name: 'Progressive Elite', 
              price: '699', 
              original: '1374',
              discount: '49% OFF',
              period: '6 Months', 
              description: 'Our most balanced approach', 
              popular: true,
              features: ['Unlimited AI Parsing', 'Advanced Muscle Analysis', 'Priority Support', 'Custom AI Analyst']
            },
            { 
              id: 'yearly', 
              name: 'Legendary Performance', 
              price: '1099', 
              original: '2748',
              discount: '60% OFF',
              period: 'Year', 
              description: 'Absolute commitment to excellence', 
              saving: 'Best Value',
              features: ['Full Executive Access', 'Beta Testing Perks', 'Exclusive Community', 'Personal Success Manager']
            },
          ].map((plan) => (
            <Card key={plan.id} className={cn(
              "border-none shadow-md rounded-[1.5rem] overflow-hidden border transition-all cursor-pointer group",
              plan.popular ? "bg-primary/5 ring-2 ring-primary/20" : "bg-card border-muted/10"
            )}>
              <CardContent className="p-0">
                <div className="p-5 flex items-center justify-between border-b border-muted/5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-sm uppercase tracking-tight text-foreground/80">{plan.name}</h4>
                      {plan.discount && (
                        <Badge className="bg-emerald-500 text-white border-none font-black uppercase text-[7px] px-1.5 h-4">{plan.discount}</Badge>
                      )}
                    </div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">{plan.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-baseline justify-end gap-1">
                      {plan.original && (
                        <span className="text-[10px] font-bold text-muted-foreground/40 line-through tracking-tighter">
                          {plan.original}
                        </span>
                      )}
                      <span className="text-xl font-black text-foreground">{plan.price}</span>
                    </div>
                    <p className="text-[8px] font-black text-muted-foreground/40 uppercase tracking-widest">/ {plan.period}</p>
                  </div>
                </div>
                
                <div className="p-5 bg-muted/5">
                  <div className="grid gap-2">
                    {plan.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                        <span className="text-[10px] font-bold text-foreground/60 uppercase">{feat}</span>
                      </div>
                    ))}
                  </div>
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
                    onClick={() => setActiveSubView(item.id as ProfileSubView)}
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
        <Button variant="ghost" size="icon" onClick={handleBack} className="rounded-full bg-muted/50 w-9 h-9">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold font-headline">
          {activeSubView === 'personal-info' ? 'Personal Info' :
           activeSubView === 'subscription' ? 'Subscription' :
           activeSubView === 'legal' ? 'Legal' :
           activeSubView === 'settings' ? 'Settings' : 
           activeSubView === 'reset' ? 'Start Fresh' : 'Profile'}
        </h1>
      </div>

      {activeSubView === 'main' && renderMain()}
      {activeSubView === 'personal-info' && renderPersonalInfo()}
      {activeSubView === 'subscription' && renderSubscription()}
      {activeSubView === 'legal' && renderLegal()}
      {activeSubView === 'settings' && renderSettings()}
      {activeSubView === 'reset' && renderReset()}
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
