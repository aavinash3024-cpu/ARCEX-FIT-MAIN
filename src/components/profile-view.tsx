
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
  Scale,
  Target,
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
  PieChart,
  Droplets,
  Footprints,
  Activity,
  X,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Timer,
  AlertTriangle,
  Check
} from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
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

interface ProfileViewProps {
  onBack: () => void;
}

const MACRO_COLORS = {
  protein: "#FFC107",
  carbs: "#42A5F5",
  fat: "#FF7043",
  fiber: "#10b981"
};

type SubView = 'main' | 'personal-info' | 'subscription' | 'legal' | 'settings' | 'goals' | 'reset';

export function ProfileView({ onBack }: ProfileViewProps) {
  const [activeSubView, setActiveSubView] = useState<SubView>('main');
  const [goalData, setGoalData] = useState<any>(null);
  const [weightHistory, setWeightHistory] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

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
  }, []);

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
      setActiveSubView('main');
    }, 800);
  };

  const handleResetApp = () => {
    setIsResetting(true);
    
    // Define keys to remove (progress, logs, goals)
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

    // Remove the keys
    keysToRemove.forEach(key => localStorage.removeItem(key));

    // Note: We EXPLICITLY do NOT remove 'pulseflow_user_profile' or 'pulseflow_food_cache'
    // This preserves personal details and AI efficiency as requested.

    setTimeout(() => {
      setIsResetting(false);
      window.location.reload(); // Force reload to apply clean state
    }, 1500);
  };

  const handleBack = () => {
    if (activeSubView !== 'main') {
      setActiveSubView('main');
    } else {
      onBack();
    }
  };

  const currentWeight = useMemo(() => {
    if (weightHistory.length > 0) {
      return weightHistory[weightHistory.length - 1].weight;
    }
    return goalData?.weight ? parseFloat(goalData.weight) : 0;
  }, [weightHistory, goalData]);

  const startWeight = goalData?.weight ? parseFloat(goalData.weight) : 0;
  const targetWeight = goalData?.targetWeight ? parseFloat(goalData.targetWeight) : 0;

  const weightProgressPercent = useMemo(() => {
    if (!startWeight || !targetWeight || startWeight === targetWeight) return 0;
    const objective = goalData?.objective || 'loss';
    let progress = 0;
    if (objective === 'loss') {
      if (currentWeight >= startWeight) return 0;
      progress = ((startWeight - currentWeight) / (startWeight - targetWeight)) * 100;
    } else {
      if (currentWeight <= startWeight) return 0;
      progress = ((currentWeight - startWeight) / (targetWeight - startWeight)) * 100;
    }
    return Math.min(100, Math.max(0, Math.round(progress)));
  }, [startWeight, targetWeight, currentWeight, goalData]);

  const menuSections = [
    {
      title: "My Account",
      items: [
        { id: 'personal-info', icon: User, label: "Personal Information", subLabel: "Name, email, and identity", color: "text-blue-500", bg: "bg-blue-50" },
        { id: 'subscription', icon: CreditCard, label: "Subscription Plan", subLabel: "Elite Premium", color: "text-purple-500", bg: "bg-purple-50" },
        { id: 'goals', icon: Target, label: "Goals", subLabel: "Active fitness objectives", color: "text-primary", bg: "bg-primary/5" },
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
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 pb-20">
      <div className="px-1 space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/60 px-3">Identity Details</h3>
        <Card className="border-none shadow-md bg-white rounded-3xl overflow-hidden border border-muted/10">
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
                  onChange={(e) => setProfileAge(e.target.value)}
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
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 px-1">
      <Card className="border-none bg-gradient-to-br from-purple-500 to-indigo-600 shadow-xl rounded-[2.5rem] overflow-hidden text-white relative">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Trophy className="w-32 h-32" />
        </div>
        <CardContent className="p-8 space-y-6 relative z-10">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Current Plan</p>
            <h2 className="text-3xl font-black tracking-tighter">Elite Premium</h2>
          </div>
          <div className="h-px w-full bg-white/20" />
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-white" />
              </div>
              <p className="text-sm font-bold">Unlimited AI Meal Parsing</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-white" />
              </div>
              <p className="text-sm font-bold">Advanced Workout Analytics</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-white" />
              </div>
              <p className="text-sm font-bold">Priority Performance Support</p>
            </div>
          </div>
          <div className="pt-2">
            <Badge variant="secondary" className="bg-white/20 text-white border-none font-black uppercase text-[10px] px-3 h-6">
              Renews Jan 15, 2025
            </Badge>
          </div>
        </CardContent>
      </Card>
      <Button variant="outline" className="w-full h-14 rounded-2xl border-2 border-indigo-100 text-indigo-600 font-black uppercase text-[11px] tracking-widest hover:bg-indigo-50">
        Manage Subscription
      </Button>
    </div>
  );

  const renderLegal = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="px-1 space-y-3">
        <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/60 px-3">Documentation</h3>
        <Card className="border-none shadow-md bg-white rounded-3xl overflow-hidden border border-muted/10">
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
        <Card className="border-none shadow-md bg-white rounded-3xl overflow-hidden border border-muted/10">
          <CardContent className="p-0">
            <SettingsButton icon={Palette} label="Theme" subLabel="Light / Dark / System" color="text-slate-500" bg="bg-slate-50" />
            <SettingsButton icon={Smartphone} label="Haptics" subLabel="Tactile feedback" color="text-sky-500" bg="bg-slate-50" />
            <SettingsButton icon={Bell} label="Notifications" subLabel="Manage app alerts" color="text-primary" bg="bg-primary/5" />
          </CardContent>
        </Card>
      </div>

      <div className="px-1 space-y-3">
        <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/60 px-3">Sync & Devices</h3>
        <Card className="border-none shadow-md bg-white rounded-3xl overflow-hidden border border-muted/10">
          <CardContent className="p-0">
            <SettingsButton icon={Zap} label="Health Connect" subLabel="Sync steps from your device" color="text-green-600" bg="bg-green-50" />
          </CardContent>
        </Card>
      </div>

      <div className="px-1 space-y-3">
        <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/60 px-3">Data & Security</h3>
        <Card className="border-none shadow-md bg-white rounded-3xl overflow-hidden border border-muted/10">
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

  const renderGoals = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 pb-20 px-1">
      {goalData ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3">
            <Card className="border-none shadow-sm bg-white p-4 space-y-1">
              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-tight">Weight Objective</p>
              <div className="flex items-center gap-1">
                <span className="text-sm font-black text-primary uppercase">{goalData.objective}</span>
              </div>
            </Card>
            <Card className="border-none shadow-sm bg-white p-4 space-y-1">
              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-tight">Total Progress</p>
              <div className="flex items-center gap-1 text-green-600">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span className="text-sm font-black">{weightProgressPercent}%</span>
              </div>
            </Card>
          </div>

          <Card className="border-none shadow-sm bg-white overflow-hidden rounded-3xl border border-muted/10">
            <CardContent className="p-5 space-y-4">
              <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                <Scale className="w-3.5 h-3.5 text-primary" /> Body Milestone
              </h3>
              <div className="space-y-2.5">
                <Progress value={weightProgressPercent} className="h-2.5 bg-muted rounded-full overflow-hidden" />
                <div className="flex justify-between items-center text-[10px] font-black text-muted-foreground/60 uppercase px-1">
                  <div className="text-left">
                    <p className="text-[8px] opacity-50">START</p>
                    <p>{startWeight}kg</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[8px] opacity-50">CURRENT</p>
                    <p className="text-primary">{currentWeight.toFixed(1)}kg</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] opacity-50">GOAL</p>
                    <p>{targetWeight}kg</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white overflow-hidden rounded-3xl border border-muted/10">
            <CardContent className="p-5 space-y-4">
              <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-orange-400" /> Timeline Strategy
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1 border-l-2 border-muted/10 pl-3">
                  <p className="text-[8px] font-bold text-muted-foreground uppercase">Weekly Rate</p>
                  <p className="text-sm font-black">{goalData.derivedWeeklyRate} kg</p>
                  <p className="text-[8px] font-black text-primary/60 uppercase">Target Pace</p>
                </div>
                <div className="space-y-1 border-l-2 border-muted/10 pl-3">
                  <p className="text-[8px] font-bold text-muted-foreground uppercase">Est. Duration</p>
                  <p className="text-sm font-black">{goalData.weeksToGoal} Weeks</p>
                  <p className="text-[8px] font-black text-primary/60 uppercase">To Milestone</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            <Card className="border-none shadow-sm bg-white p-4 space-y-1">
              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-tight">Daily Budget</p>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-primary">{goalData.finalCalories}</span>
                <span className="text-[8px] font-bold text-muted-foreground uppercase">Kcal</span>
              </div>
            </Card>
            <Card className="border-none shadow-sm bg-white p-4 space-y-1">
              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-tight">Maintenance</p>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-foreground/40">{goalData.tdee}</span>
                <span className="text-[8px] font-bold text-muted-foreground uppercase">TDEE</span>
              </div>
            </Card>
          </div>

          <Card className="border-none shadow-sm bg-white rounded-3xl border border-muted/10 overflow-hidden">
            <CardContent className="p-5 space-y-4">
              <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                <PieChart className="w-3.5 h-3.5 text-primary" /> Strategy Split
              </h3>
              <div className="space-y-3">
                <div className="flex h-3 w-full rounded-full overflow-hidden bg-muted/20">
                  <div style={{ width: `${goalData.proteinPct}%`, backgroundColor: MACRO_COLORS.protein }} className="h-full" />
                  <div style={{ width: `${goalData.carbPct}%`, backgroundColor: MACRO_COLORS.carbs }} className="h-full" />
                  <div style={{ width: `${goalData.fatPct}%`, backgroundColor: MACRO_COLORS.fat }} className="h-full" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <p className="text-[7px] font-black text-muted-foreground uppercase">PROTEIN</p>
                    <p className="text-xs font-black" style={{ color: MACRO_COLORS.protein }}>{goalData.proteinPct}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[7px] font-black text-muted-foreground uppercase">CARBS</p>
                    <p className="text-xs font-black" style={{ color: MACRO_COLORS.carbs }}>{goalData.carbPct}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[7px] font-black text-muted-foreground uppercase">FATS</p>
                    <p className="text-xs font-black" style={{ color: MACRO_COLORS.fat }}>{goalData.fatPct}%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white rounded-3xl border border-muted/10">
            <CardContent className="p-5 space-y-5">
              <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                <BarChart3 className="w-3.5 h-3.5 text-primary" /> Target Metrics
              </h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                {[
                  { label: 'PROTEIN', val: goalData.protein, unit: 'G', color: MACRO_COLORS.protein },
                  { label: 'CARBS', val: goalData.carbs, unit: 'G', color: MACRO_COLORS.carbs },
                  { label: 'FATS', val: goalData.fats, unit: 'G', color: MACRO_COLORS.fat },
                  { label: 'FIBER', val: goalData.fiber, unit: 'G', color: MACRO_COLORS.fiber }
                ].map(m => (
                  <div key={m.label} className="space-y-1.5">
                    <div className="flex justify-between items-baseline">
                      <p className="text-[8px] font-black uppercase text-muted-foreground/60">{m.label}</p>
                      <span className="text-[10px] font-black" style={{ color: m.color }}>{m.val}{m.unit}</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted/30 rounded-full overflow-hidden">
                      <div className="h-full" style={{ width: '100%', backgroundColor: m.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] px-2">Activity Targets</h3>
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-muted/10 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Droplets className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-black text-foreground/80 uppercase">Hydration</p>
                  <p className="text-[8px] font-bold text-muted-foreground uppercase">Daily Target</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-blue-600">{goalData.hydrationTargetLiters || "3.0"} L</p>
              </div>
            </div>

            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-muted/10 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                  <Footprints className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-black text-foreground/80 uppercase">Movement</p>
                  <p className="text-[8px] font-bold text-muted-foreground uppercase">Step Goal</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-green-600">10,000</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Card className="border-none shadow-md bg-white p-16 text-center space-y-5 rounded-[2.5rem] border border-muted/10">
          <div className="w-20 h-20 bg-muted/5 rounded-full flex items-center justify-center mx-auto border border-muted/10">
            <Target className="w-10 h-10 text-muted-foreground/30" />
          </div>
          <div className="space-y-2">
            <h3 className="font-black text-xl tracking-tight">No Active Goals</h3>
            <p className="text-xs text-muted-foreground font-medium leading-relaxed px-4">Setup your fitness journey to track weight, nutrition, and lifestyle progress.</p>
          </div>
          <Button variant="outline" className="rounded-2xl border-primary/20 text-primary font-black uppercase text-[11px] tracking-widest h-12 px-8">
            Setup Goal Now
          </Button>
        </Card>
      )}
    </div>
  );

  const renderReset = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 pb-20 px-1">
      <Card className="border-none shadow-xl bg-white rounded-[2.5rem] overflow-hidden border border-muted/10">
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
              <AlertDialogContent className="rounded-[2.5rem] w-[90%] max-w-sm">
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
        <Card className="border-none bg-white shadow-sm rounded-[2.5rem] overflow-hidden border border-white/20 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-white to-transparent pointer-events-none" />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center gap-5">
              <div className="relative shrink-0">
                <div className="w-20 h-20 rounded-full bg-[#6b85a3] flex items-center justify-center shadow-xl border-4 border-white relative z-10">
                  <span className="text-2xl font-black text-white">{profileName.charAt(0)}</span>
                </div>
                <div className="absolute -bottom-1 -right-1 z-20 bg-[#6b85a3] text-white p-1.5 rounded-full border-2 border-white shadow-lg">
                  <Trophy className="w-2.5 h-2.5" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-black text-foreground tracking-tighter truncate">{profileName}</h2>
                <div className="space-y-0.5 mt-0.5">
                  <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                    {profileAge} Yrs • {profileGender?.toUpperCase()}
                  </p>
                  <p className="text-[10px] font-bold text-muted-foreground/60 tracking-tight truncate">{profileEmail}</p>
                </div>
                <Badge variant="secondary" className="mt-2 bg-primary/10 text-primary hover:bg-primary/10 text-[8px] font-black uppercase tracking-widest px-2 h-4 border-none">
                  Premium Member
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none bg-white shadow-sm rounded-2xl overflow-hidden border border-muted/10">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Scale className="w-3.5 h-3.5 text-primary" /> Weight Goal
              </h3>
              <span className="text-[10px] font-black text-primary">{weightProgressPercent}%</span>
            </div>
            
            <div className="space-y-1.5">
              <Progress value={weightProgressPercent} className="h-1.5 bg-muted" />
              <div className="flex justify-between items-center text-[9px] font-black text-muted-foreground/60 uppercase">
                <span>Start: {startWeight > 0 ? startWeight.toFixed(1) : "--"}kg</span>
                <span className="text-primary">Current: {currentWeight > 0 ? currentWeight.toFixed(1) : "--"}kg</span>
                <span>Goal: {targetWeight > 0 ? targetWeight.toFixed(1) : "--"}kg</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-8 px-1 mt-6">
        {menuSections.map((section, idx) => (
          <div key={idx} className="space-y-3">
            <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/60 px-3">
              {section.title}
            </h3>
            <Card className="border-none shadow-md bg-white overflow-hidden rounded-3xl border border-muted/10">
              <CardContent className="p-0">
                {section.items.map((item, i) => (
                  <button 
                    key={i} 
                    onClick={() => setActiveSubView(item.id as SubView)}
                    className="w-full p-4 flex items-center justify-between hover:bg-muted/5 transition-all text-left group border-b border-muted/5 last:border-0"
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
    <div className="space-y-6 pb-32 pt-4 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-4 pt-2 px-1">
        <Button variant="ghost" size="icon" onClick={handleBack} className="rounded-full bg-muted/50 w-9 h-9">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold font-headline">
          {activeSubView === 'personal-info' ? 'Personal Info' :
           activeSubView === 'subscription' ? 'Subscription' :
           activeSubView === 'legal' ? 'Legal' :
           activeSubView === 'settings' ? 'Settings' : 
           activeSubView === 'reset' ? 'Start Fresh' : 
           activeSubView === 'goals' ? 'My Goals' : 'Profile'}
        </h1>
      </div>

      {activeSubView === 'main' && renderMain()}
      {activeSubView === 'personal-info' && renderPersonalInfo()}
      {activeSubView === 'subscription' && renderSubscription()}
      {activeSubView === 'legal' && renderLegal()}
      {activeSubView === 'settings' && renderSettings()}
      {activeSubView === 'goals' && renderGoals()}
      {activeSubView === 'reset' && renderReset()}
    </div>
  );
}

function LegalItem({ icon: Icon, label, color, bg }: { icon: any, label: string, color?: string, bg?: string }) {
  return (
    <button className="w-full p-4 flex items-center justify-between hover:bg-muted/5 transition-all text-left group border-b border-muted/5 last:border-0">
      <div className="flex items-center gap-4">
        <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shadow-sm", bg || "bg-green-50", color || "text-green-600")}>
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
    <button className="w-full p-4 flex items-center justify-between hover:bg-muted/5 transition-all text-left group border-b border-muted/5 last:border-0">
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
