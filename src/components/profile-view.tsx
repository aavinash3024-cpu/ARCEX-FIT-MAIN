
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
  Star,
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
  Check,
  Bell,
  Zap,
  Save,
  CheckCircle2,
  PieChart,
  Droplets,
  Footprints,
  Activity
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
import { cn } from "@/lib/utils";

interface ProfileViewProps {
  onBack: () => void;
}

type SubView = 'main' | 'personal-info' | 'subscription' | 'legal' | 'settings' | 'goals';

export function ProfileView({ onBack }: ProfileViewProps) {
  const [activeSubView, setActiveSubView] = useState<SubView>('main');
  const [goalData, setGoalData] = useState<any>(null);
  const [weightHistory, setWeightHistory] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);

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
    
    // 1. Save general profile
    const profileData = {
      name: profileName,
      email: profileEmail,
      location: profileLocation,
      dob: profileDob
    };
    localStorage.setItem('pulseflow_user_profile', JSON.stringify(profileData));

    // 2. Sync with Goal Data (Age and Gender)
    if (goalData) {
      const updatedGoal = {
        ...goalData,
        gender: profileGender,
        age: parseInt(profileAge) || goalData.age
      };
      localStorage.setItem('pulseflow_goal_data', JSON.stringify(updatedGoal));
      setGoalData(updatedGoal);
    }

    // Simulate network delay
    setTimeout(() => {
      setIsSaving(false);
      setActiveSubView('main');
    }, 800);
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
        { id: 'reset', icon: RefreshCw, label: "Reset", subLabel: "Clear daily progress data", color: "text-rose-500", bg: "bg-rose-50" },
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
          {/* Objective Summary Card */}
          <Card className="border-none shadow-md bg-primary text-primary-foreground rounded-[2rem] overflow-hidden">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Main Focus</p>
                <h3 className="text-2xl font-black uppercase tracking-tight leading-none">
                  {goalData.objective} Weight
                </h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                <Activity className="w-6 h-6 text-white" />
              </div>
            </CardContent>
          </Card>

          {/* Weight Milestone Card */}
          <section className="space-y-3">
            <div className="px-2 flex items-center justify-between">
              <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Scale className="w-3 h-3 text-primary" /> Body Milestone
              </h4>
              <span className="text-[10px] font-black text-primary uppercase">{weightProgressPercent}% Complete</span>
            </div>
            <Card className="border-none shadow-sm bg-white rounded-3xl p-5 space-y-4">
              <Progress value={weightProgressPercent} className="h-2 bg-muted rounded-full" />
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center p-3 bg-muted/5 rounded-2xl border border-muted/10">
                  <p className="text-[8px] font-bold text-muted-foreground uppercase">Start</p>
                  <p className="text-sm font-black">{startWeight}kg</p>
                </div>
                <div className="text-center p-3 bg-primary/5 rounded-2xl border border-primary/10">
                  <p className="text-[8px] font-bold text-primary uppercase">Current</p>
                  <p className="text-sm font-black">{currentWeight.toFixed(1)}kg</p>
                </div>
                <div className="text-center p-3 bg-muted/5 rounded-2xl border border-muted/10">
                  <p className="text-[8px] font-bold text-muted-foreground uppercase">Goal</p>
                  <p className="text-sm font-black">{targetWeight}kg</p>
                </div>
              </div>
            </Card>
          </section>

          {/* Lifestyle Targets Grid */}
          <section className="space-y-3">
            <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-2 flex items-center gap-2">
              <Zap className="w-3 h-3 text-amber-500" /> Lifestyle Targets
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <Card className="border-none shadow-sm bg-white rounded-3xl p-5 space-y-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Droplets className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-foreground uppercase">Hydration</p>
                  <p className="text-lg font-black text-blue-600">{goalData.hydrationTargetLiters || "3.0"}<span className="text-[10px] ml-1">LITERS</span></p>
                </div>
              </Card>
              <Card className="border-none shadow-sm bg-white rounded-3xl p-5 space-y-3">
                <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center">
                  <Footprints className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-foreground uppercase">Daily Steps</p>
                  <p className="text-lg font-black text-green-600">10,000</p>
                </div>
              </Card>
            </div>
          </section>

          {/* Nutrition Strategy Card */}
          <section className="space-y-3">
            <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-2 flex items-center gap-2">
              <PieChart className="w-3 h-3 text-primary" /> Energy & Nutrition
            </h4>
            <Card className="border-none shadow-sm bg-white rounded-3xl p-6 space-y-6">
              <div className="flex justify-between items-center border-b border-muted/10 pb-4">
                <p className="text-[10px] font-black text-muted-foreground uppercase">Daily Budget</p>
                <p className="text-2xl font-black text-primary">{goalData.finalCalories} <span className="text-xs">KCAL</span></p>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="space-y-1">
                  <p className="text-sm font-black text-amber-500">{goalData.protein}g</p>
                  <p className="text-[8px] font-bold text-muted-foreground uppercase">Protein</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-black text-blue-500">{goalData.carbs}g</p>
                  <p className="text-[8px] font-bold text-muted-foreground uppercase">Carbs</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-black text-orange-500">{goalData.fats}g</p>
                  <p className="text-[8px] font-bold text-muted-foreground uppercase">Fats</p>
                </div>
              </div>
            </Card>
          </section>

          {/* Timeline Analysis */}
          <section className="space-y-3">
            <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-2 flex items-center gap-2">
              <Calendar className="w-3 h-3 text-orange-400" /> Estimated Timeline
            </h4>
            <Card className="border-none shadow-sm bg-muted/5 border border-muted/10 rounded-3xl p-5">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-sm font-black text-foreground">{goalData.derivedWeeklyRate} kg</p>
                  <p className="text-[8px] font-bold text-muted-foreground uppercase">Weekly Rate</p>
                </div>
                <div className="h-8 w-px bg-muted/20" />
                <div className="text-right space-y-1">
                  <p className="text-sm font-black text-primary">{goalData.weeksToGoal} Weeks</p>
                  <p className="text-[8px] font-bold text-muted-foreground uppercase">Duration</p>
                </div>
              </div>
            </Card>
          </section>
        </div>
      ) : (
        <Card className="border-none shadow-md bg-white p-12 text-center space-y-4 rounded-3xl">
          <div className="w-16 h-16 bg-muted/10 rounded-full flex items-center justify-center mx-auto">
            <Target className="w-8 h-8 text-muted-foreground/40" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-lg">No Active Goal</h3>
            <p className="text-sm text-muted-foreground">Setup your fitness journey to track progress.</p>
          </div>
          <Button variant="outline" className="rounded-xl border-primary/20 text-primary font-black uppercase text-[10px] tracking-widest">
            Setup Goal Now
          </Button>
        </Card>
      )}
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
           activeSubView === 'goals' ? 'My Goals' : 'Profile'}
        </h1>
      </div>

      {activeSubView === 'main' && renderMain()}
      {activeSubView === 'personal-info' && renderPersonalInfo()}
      {activeSubView === 'subscription' && renderSubscription()}
      {activeSubView === 'legal' && renderLegal()}
      {activeSubView === 'settings' && renderSettings()}
      {activeSubView === 'goals' && renderGoals()}
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
