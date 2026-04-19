"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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
  Timer,
  Loader2
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
import { doc } from 'firebase/firestore';
import { useFirestore, useUser, useAuth, setDocumentNonBlocking } from '@/firebase';

export type ProfileSubView = 'main' | 'personal-info' | 'subscription' | 'legal' | 'settings' | 'reset';

interface ProfileViewProps {
  onBack: () => void;
  activeView?: ProfileSubView;
  onNavigate: (tab: string) => void;
  onShowSplash?: () => void;
  onSyncAndLogout?: () => Promise<void>;
  isSyncing?: boolean;
}

export function ProfileView({ onBack, activeView = 'main', onNavigate, onShowSplash, onSyncAndLogout, isSyncing }: ProfileViewProps) {
  const firestore = useFirestore();
  const { user } = useUser();
  const auth = useAuth();

  const [goalData, setGoalData] = useState<any>(null);
  const [weightHistory, setWeightHistory] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState('yearly');

  // Guard for theme/preference initialization to prevent layout shifts/accidental resets
  const [isReady, setIsReady] = useState(false);

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

  const triggerHaptic = (type: 'light' | 'medium' | 'success' | 'warning' = 'light') => {
    if (!hapticsEnabled || typeof window === 'undefined' || !window.navigator.vibrate) return;
    switch(type) {
      case 'light': window.navigator.vibrate(15); break;
      case 'medium': window.navigator.vibrate(30); break;
      case 'success': window.navigator.vibrate([20, 40, 20]); break;
      case 'warning': window.navigator.vibrate([40, 40, 40]); break;
    }
  };

  useEffect(() => {
    if (!user) return;
    const uid = user.uid;
    
    // Load Goal Data
    const savedGoal = localStorage.getItem(`arcex_${uid}_goal_data`);
    if (savedGoal) {
      try {
        const data = JSON.parse(savedGoal);
        setGoalData(data);
        if (data.gender) setProfileGender(data.gender);
        if (data.age) setProfileAge(data.age.toString());
      } catch (e) {
        console.error("Failed to load goal data", e);
      }
    }

    // Load Weight History
    const savedWeight = localStorage.getItem(`arcex_${uid}_weight_history`);
    if (savedWeight) {
      try {
        setWeightHistory(JSON.parse(savedWeight));
      } catch (e) {
        console.error("Failed to parse weight history", e);
      }
    }

    // Load Profile Specific Data
    const savedProfile = localStorage.getItem(`arcex_${uid}_user_profile`);
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
    const savedDarkMode = localStorage.getItem('pulseflow_dark_mode') === 'true';
    setDarkMode(savedDarkMode);
    
    const savedHaptics = localStorage.getItem('pulseflow_haptics');
    if (savedHaptics !== null) setHapticsEnabled(savedHaptics === 'true');
    
    const savedNotify = localStorage.getItem('pulseflow_notifications');
    if (savedNotify !== null) setNotificationsEnabled(savedNotify === 'true');

    setIsReady(true);
  }, [user]);

  // Track changes to enable/disable save button
  const hasChanges = useMemo(() => {
    if (!isReady || !user) return false;
    const uid = user.uid;
    
    const storedProfileStr = localStorage.getItem(`arcex_${uid}_user_profile`);
    const storedProfile = storedProfileStr ? JSON.parse(storedProfileStr) : {};
    
    const storedGoalStr = localStorage.getItem(`arcex_${uid}_goal_data`);
    const storedGoal = storedGoalStr ? JSON.parse(storedGoalStr) : {};

    const nameDiff = profileName !== (storedProfile.name || "Alex Johnson");
    const locationDiff = profileLocation !== (storedProfile.location || "London, UK");
    const dobDiff = profileDob !== (storedProfile.dob || "1998-05-15");
    const genderDiff = profileGender !== (storedGoal.gender || "male");
    const ageDiff = profileAge !== (storedGoal.age?.toString() || "25");

    return nameDiff || locationDiff || dobDiff || genderDiff || ageDiff;
  }, [profileName, profileLocation, profileDob, profileGender, profileAge, user, isReady]);

  // Theme Side Effect
  useEffect(() => {
    if (!isReady) return;
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('pulseflow_dark_mode', darkMode.toString());
  }, [darkMode, isReady]);

  // Haptics & Notifications Side Effects
  useEffect(() => {
    if (!isReady) return;
    localStorage.setItem('pulseflow_haptics', hapticsEnabled.toString());
  }, [hapticsEnabled, isReady]);

  useEffect(() => {
    if (!isReady) return;
    localStorage.setItem('pulseflow_notifications', notificationsEnabled.toString());
  }, [notificationsEnabled, isReady]);

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
    if (!user) return;
    triggerHaptic('success');
    setIsSaving(true);
    
    const uid = user.uid;
    const profileData = {
      name: profileName,
      email: profileEmail,
      location: profileLocation,
      dob: profileDob
    };
    localStorage.setItem(`arcex_${uid}_user_profile`, JSON.stringify(profileData));

    // Update Firestore
    if (firestore) {
      const userRef = doc(firestore, 'userProfiles', uid);
      const nameParts = profileName.trim().split(' ');
      const firstName = nameParts[0] || 'User';
      const lastName = nameParts.slice(1).join(' ') || '';

      const firestoreProfile = {
        firstName,
        lastName,
        gender: profileGender,
        activityLevel: goalData?.activity || 'moderate',
        updatedAt: new Date().toISOString()
      };
      setDocumentNonBlocking(userRef, firestoreProfile, { merge: true });
    }

    if (goalData) {
      const updatedGoal = {
        ...goalData,
        gender: profileGender,
        age: parseInt(profileAge) || goalData.age
      };
      localStorage.setItem(`arcex_${uid}_goal_data`, JSON.stringify(updatedGoal));
      setGoalData(updatedGoal);
    }

    setTimeout(() => {
      setIsSaving(false);
      onBack();
    }, 800);
  };

  const handleLogout = async () => {
    if (onSyncAndLogout) {
      await onSyncAndLogout();
    } else if (auth) {
      await auth.signOut();
      window.location.reload();
    }
  };

  const handleResetApp = () => {
    if (!user) return;
    triggerHaptic('warning');
    setIsResetting(true);
    
    const uid = user.uid;
    const keysToRemove = [
      `arcex_${uid}_goal_data`,
      `arcex_${uid}_tasks`,
      `arcex_${uid}_hydration`,
      `arcex_${uid}_hydration_history`,
      `arcex_${uid}_steps`,
      `arcex_${uid}_steps_history`,
      `arcex_${uid}_weight_history`,
      `arcex_${uid}_today_logged_meals`,
      `arcex_${uid}_recent_meals`,
      `arcex_${uid}_saved_meals`,
      `arcex_${uid}_all_meals_history`,
      `arcex_${uid}_workout_split`,
      `arcex_${uid}_extra_moves`,
      `arcex_${uid}_workout_logs`,
      `arcex_${uid}_workout_history`,
      `arcex_${uid}_streak_v3`,
      `arcex_${uid}_last_reset_date`,
      `arcex_${uid}_sent_milestones`,
      `arcex_${uid}_notifications_data_v2`,
      `arcex_${uid}_onboarding_complete`
    ];

    keysToRemove.forEach(key => localStorage.removeItem(key));

    setTimeout(() => {
      setIsResetting(false);
      window.location.reload();
    }, 1500);
  };

  const handleRestartOnboarding = () => {
    if (!user) return;
    triggerHaptic('medium');
    localStorage.removeItem(`arcex_${user.uid}_onboarding_complete`);
    if (firestore) {
      const userRef = doc(firestore, 'userProfiles', user.uid);
      setDocumentNonBlocking(userRef, { onboardingComplete: false }, { merge: true });
    }
    window.location.reload();
  };

  const renderPersonalInfo = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 pb-20">
      <div className="px-1 space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/60 px-3">Identity Details</h3>
        <Card className="border-none shadow-md bg-card rounded-3xl overflow-hidden border border-muted/10">
          <CardContent className="p-6 space-y-5">
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Username</Label>
                <span className="text-[9px] font-black text-muted-foreground/40">{profileName.length}/20</span>
              </div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                <Input 
                  value={profileName} 
                  onChange={(e) => setProfileName(e.target.value.substring(0, 20))}
                  maxLength={20}
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
                  readOnly
                  className="pl-10 h-12 rounded-xl bg-muted/10 border-muted-foreground/10 font-bold text-xs opacity-60 cursor-not-allowed"
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
          disabled={isSaving || !hasChanges}
          className="w-full h-14 rounded-2xl bg-primary text-white font-black uppercase text-[11px] tracking-widest shadow-xl shadow-primary/20 gap-2 mt-4 disabled:opacity-50"
        >
          {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Personal Details
        </Button>
      </div>
    </div>
  );

  const renderSubscription = () => (
    <div className="space-y-2 animate-in fade-in slide-in-from-right-4 duration-500 pb-20">
      <div className="px-1 space-y-4 pt-0">
        <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/60 px-3 text-center">See Subscription Plans</h3>
        <div className="grid grid-cols-2 gap-3 px-1 pt-4">
          {[
            { id: 'monthly', name: 'Monthly', price: '229', original: '299', save: '23%', perDay: '7.6' },
            { id: 'yearly', name: 'Yearly', price: '1299', original: '2748', save: '52%', perDay: '3.5' }
          ].map((plan) => {
            const isSelected = selectedPlanId === plan.id;
            return (
              <div 
                key={plan.id}
                onClick={() => {
                  triggerHaptic('light');
                  setSelectedPlanId(plan.id);
                }}
                className={cn(
                  "relative p-[1.5px] rounded-2xl transition-all cursor-pointer group",
                  isSelected 
                    ? "bg-gradient-to-br from-[#4ade80] via-[#2dd4bf] to-[#3b82f6] shadow-lg scale-[1.02]" 
                    : "bg-muted/20"
                )}
              >
                <div className={cn(
                  "absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2 py-0.5 rounded-full z-10 border border-white/20 backdrop-blur-md shadow-sm transition-all",
                  isSelected ? "bg-gradient-to-r from-primary to-emerald-400" : "bg-muted text-muted-foreground"
                )}>
                  <p className={cn("text-[8px] font-black uppercase tracking-widest whitespace-nowrap", isSelected ? "text-white" : "text-muted-foreground/80")}>
                    JUST ₹{plan.perDay} / DAY
                  </p>
                </div>

                <Card className="border-none bg-card rounded-[calc(1rem-0.5px)] h-full overflow-hidden">
                  <CardContent className="p-3 pt-4 flex flex-col items-center text-center gap-1.5">
                    <h5 className={cn("font-black text-[10px] uppercase tracking-[0.2em]", isSelected ? "text-primary" : "text-muted-foreground")}>
                      {plan.name}
                    </h5>

                    <div className="flex items-center justify-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold text-red-500 line-through opacity-80">₹{plan.original}</span>
                      <span className="text-xl font-black text-foreground">₹{plan.price}</span>
                    </div>

                    <Badge variant="secondary" className={cn("text-[8px] font-black uppercase px-2 h-4 border-none shadow-sm bg-emerald-500/10 text-emerald-500")}>
                      SAVE {plan.save}
                    </Badge>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      <div className="px-1 space-y-6 pt-6">
        <div className="space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-primary px-3">Elite Premium Coverage</h3>
          <Card className="border-none shadow-md bg-card rounded-3xl overflow-hidden border border-muted/10">
            <CardContent className="p-6 grid gap-6">
              {[
                { label: 'Strength Growth', desc: 'Detailed power progress trends.', icon: TrendingUp, colors: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)' },
                { label: 'Split Analysis', desc: 'Muscle coverage & target gaps.', icon: Layout, colors: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' },
                { label: 'Meal Logging', desc: '20 daily AI parse credits.', icon: UtensilsCrossed, colors: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
                { label: 'Skin-Based Micro Tracking', desc: 'Track micronutrients optimized for skin health and clarity.', icon: HeartPulse, colors: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)' },
                { label: 'Recovery-Based Macro Tracking', desc: 'Track macronutrients vital for muscle repair and recovery.', icon: Zap, colors: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
                { label: 'Intake Reports', desc: 'Daily, Weekly, Monthly history.', icon: BarChart3, colors: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' },
                { label: 'PERSONAL ANALYZER', desc: 'UNLIMITED progress insights.', icon: Sparkles, colors: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)', highlight: true }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-sm border p-[1.5px]",
                    item.highlight ? "border-primary/40" : "border-muted/20"
                  )}>
                    <div className={cn("w-full h-full rounded-full flex items-center justify-center text-white")} style={{ background: item.colors }}>
                      <item.icon className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <h5 className={cn("text-[10px] font-black uppercase tracking-tight", item.highlight ? "text-primary" : "text-foreground/90")}>{item.label}</h5>
                    <p className="text-[9px] font-bold text-muted-foreground/60 leading-tight uppercase tracking-tight">{item.desc}</p>
                  </div>
                </div>
              ))}
              <div className="pt-4 border-t border-muted/5 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-3 h-3 text-primary" />
                <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest text-center">Includes everything in Free</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/60 px-3">Standard Free Features</h3>
          <Card className="border-none shadow-md bg-card rounded-3xl overflow-hidden border border-muted/10 opacity-70">
            <CardContent className="p-6 grid gap-6">
              {[
                { label: 'Hydration Tracking', desc: 'Weekly water intake analysis.', icon: HeartPulse, colors: 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)' },
                { label: 'Steps Tracking', desc: 'Movement tracking & trends.', icon: Activity, colors: 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)' },
                { label: 'Streaks', desc: 'Daily consistency badges.', icon: Zap, colors: 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)' },
                { label: 'Tasks', desc: 'Objective manager system.', icon: ListTodo, colors: 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)' },
                { label: 'Workouts', desc: 'Custom routine creation.', icon: Dumbbell, colors: 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)' }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-9 h-9 rounded-full border border-muted/20 p-[1.5px] shrink-0">
                    <div className={cn("w-full h-full rounded-full flex items-center justify-center text-white shadow-inner")} style={{ background: item.colors }}>
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
              onCheckedChange={(val) => {
                triggerHaptic('light');
                setDarkMode(val);
              }}
            />
            <SettingsSwitch 
              icon={Smartphone} 
              label="Haptics" 
              subLabel="Tactile feedback" 
              color="text-sky-500" 
              bg="bg-slate-50"
              checked={hapticsEnabled}
              onCheckedChange={(val) => {
                setHapticsEnabled(val);
                if (val && typeof window !== 'undefined' && window.navigator.vibrate) {
                  window.navigator.vibrate(15);
                }
              }}
            />
            <SettingsSwitch 
              icon={Bell} 
              label="Notifications" 
              subLabel="Manage app alerts" 
              color="text-primary" 
              bg="bg-primary/5"
              checked={notificationsEnabled}
              onCheckedChange={(val) => {
                triggerHaptic('light');
                setNotificationsEnabled(val);
              }}
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
        <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/60 px-3">Testing & Development</h3>
        <Card className="border-none shadow-md bg-card rounded-3xl overflow-hidden border border-muted/10">
          <CardContent className="p-0">
            <SettingsButton 
              icon={RefreshCw} 
              label="Restart Setup Process" 
              subLabel="Re-run the compulsory onboarding" 
              color="text-amber-500" 
              bg="bg-amber-50"
              onClick={handleRestartOnboarding}
            />
            <SettingsButton 
              icon={Layout} 
              label="Preview Splash Screen" 
              subLabel="Test the app entry animation" 
              color="text-primary" 
              bg="bg-primary/5"
              onClick={() => {
                triggerHaptic('light');
                onShowSplash?.();
              }}
            />
          </CardContent>
        </Card>
      </div>

      <div className="px-1 space-y-3">
        <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/60 px-3">Data & Security</h3>
        <Card className="border-none shadow-md bg-card rounded-3xl overflow-hidden border border-muted/10">
          <CardContent className="p-0">
            <SettingsButton icon={Database} label="Export Data" subLabel="Download your wellness history" />
            <SettingsButton icon={Key} label="Change Password" subLabel="Update security credentials" />
            <SettingsButton icon={LogOut} label="Logout" subLabel="Sign out of this session" color="text-amber-600" bg="bg-amber-50" onClick={handleLogout} />
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
                  <Trophy className="w-2" />
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
                    onClick={() => {
                      triggerHaptic('light');
                      if (item.onClick) item.onClick();
                      else onNavigate(item.id);
                    }}
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

        {isSyncing && (
          <div className="fixed inset-0 z-[600] bg-black/40 backdrop-blur-md flex items-center justify-center">
            <div className="bg-card p-8 rounded-3xl flex flex-col items-center gap-4 shadow-2xl border border-white/10 animate-in zoom-in-95">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
              <div className="text-center">
                <p className="text-sm font-black uppercase tracking-tighter">Syncing to Cloud</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Safeguarding your progress...</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );

  const menuSections = [
    {
      title: "My Account",
      items: [
        { id: 'profile-personal-info', icon: User, label: "Personal Information", subLabel: "Name, email, and identity", color: "text-blue-500", bg: "bg-blue-50" },
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
        { id: 'logout', icon: LogOut, label: "Logout", subLabel: "Sync and sign out", color: "text-amber-600", bg: "bg-amber-50", onClick: handleLogout },
      ]
    }
  ];

  return (
    <div className="space-y-4 pb-2 pt-4 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-4 pt-2 px-1">
        <Button variant="ghost" size="icon" onClick={() => {
           triggerHaptic('light');
           onBack();
        }} className="rounded-full bg-muted/50 w-9 h-9">
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

function SettingsButton({ icon: Icon, label, subLabel, color, bg, onClick }: { icon: any, label: string, subLabel: string, color?: string, bg?: string, onClick?: () => void }) {
  return (
    <button onClick={onClick} className="w-full p-4 flex items-center justify-between transition-all text-left group border-b border-muted/5 last:border-0">
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
