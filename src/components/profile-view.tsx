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
  Loader2,
  Rocket
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
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  format,
  parseISO,
  differenceInYears
} from "date-fns";
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
import { useFirestore, useUser, useAuth, setDocumentNonBlocking, initiatePasswordReset, initiateAccountDeletion } from '@/firebase';
import { useToast } from "@/hooks/use-toast";

export type ProfileSubView = 'main' | 'personal-info' | 'subscription' | 'legal' | 'settings' | 'reset' | 'help' | 'privacy' | 'terms' | 'medical';

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
  const { toast } = useToast();

  const [goalData, setGoalData] = useState<any>(null);
  const [weightHistory, setWeightHistory] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
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

  // Coordination Logic: Update Age when DOB changes
  const updateAgeFromDob = (dobString: string) => {
    if (!dobString) return;
    const birthDate = parseISO(dobString);
    if (isNaN(birthDate.getTime())) return;
    const age = differenceInYears(new Date(), birthDate);
    setProfileAge(Math.max(0, Math.min(100, age)).toString());
  };

  // Coordination Logic: Update DOB when Age changes (defaults to Jan 1st of corresponding year)
  const updateDobFromAge = (ageStr: string) => {
    const ageNum = parseInt(ageStr) || 0;
    const currentYear = new Date().getFullYear();
    const birthYear = currentYear - ageNum;
    
    // Try to keep the month/day if valid, otherwise Jan 1st
    const existingDate = parseISO(profileDob);
    const month = isNaN(existingDate.getTime()) ? 0 : existingDate.getMonth();
    const day = isNaN(existingDate.getTime()) ? 1 : existingDate.getDate();
    
    const newDob = new Date(birthYear, month, day);
    setProfileDob(format(newDob, 'yyyy-MM-dd'));
  };

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

  const handleExportData = () => {
    if (!user) return;
    triggerHaptic('success');
    
    const uid = user.uid;
    const data: Record<string, any> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(`arcex_${uid}`)) {
        try {
          data[key] = JSON.parse(localStorage.getItem(key) || "");
        } catch {
          data[key] = localStorage.getItem(key);
        }
      }
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `arcex_fit_data_${format(new Date(), 'yyyyMMdd')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({ title: "Data Exported", description: "Your wellness history has been downloaded." });
  };

  const handleChangePassword = async () => {
    if (!user || !user.email) return;
    triggerHaptic('medium');
    try {
      await initiatePasswordReset(auth, user.email);
      toast({ 
        title: "Reset Link Sent", 
        description: `Check your inbox (${user.email}) for instructions to update your password.` 
      });
    } catch (e) {
      // Error handled by emitter
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    setIsDeleting(true);
    triggerHaptic('warning');
    
    try {
      await initiateAccountDeletion(auth);
      // Clear local storage for this user
      const uid = user.uid;
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key?.startsWith(`arcex_${uid}`)) {
          localStorage.removeItem(key);
        }
      }
      toast({ title: "Account Deleted", description: "All your data has been removed from our systems." });
      window.location.reload();
    } catch (e: any) {
      if (e.code === 'auth/requires-recent-login') {
        toast({ 
          variant: "destructive", 
          title: "Action Required", 
          description: "Please log out and log back in before deleting your account for security reasons." 
        });
      }
    } finally {
      setIsDeleting(false);
    }
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
                  onChange={(e) => {
                    const val = e.target.value === "" ? "" : Math.min(100, parseInt(e.target.value) || 0).toString();
                    setProfileAge(val);
                    if (val !== "") updateDobFromAge(val);
                  }}
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
                  onChange={(e) => {
                    setProfileDob(e.target.value);
                    updateAgeFromDob(e.target.value);
                  }}
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
                { label: 'Split Analysis', desc: 'Muscle coverage & target gaps.', icon: Layout, colors: 'linear-gradient(135deg, #3b82f6) 0%, #2563eb 100%)' },
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
            <LegalItem icon={FileText} label="Terms and Conditions" color="text-blue-600" bg="bg-blue-50" onClick={() => onNavigate('profile-terms')} />
            <LegalItem icon={Lock} label="Privacy Policy" color="text-indigo-600" bg="bg-indigo-50" onClick={() => onNavigate('profile-privacy')} />
            <LegalItem icon={Stethoscope} label="Health and Medical Disclaimer" color="text-rose-600" bg="bg-rose-50" onClick={() => onNavigate('profile-medical')} />
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderHelp = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 pb-20 px-1 pt-12 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
        <Rocket className="w-12 h-12 text-primary animate-bounce" />
      </div>
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-black uppercase tracking-tighter text-foreground">Coming Soon</h2>
        <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest max-w-[200px] mx-auto leading-relaxed">
          Our specialized help center is currently under development. 
        </p>
      </div>
      <Card className="border-none shadow-sm bg-muted/5 rounded-2xl p-6 text-center border border-muted/10 mt-4 max-w-xs">
         <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">EXPECTED RELEASE</p>
         <p className="text-lg font-black text-foreground">PHASE 2.0</p>
      </Card>
    </div>
  );

  const renderPrivacyPolicy = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 pb-20 px-4">
      <div className="space-y-2 border-b border-muted/10 pb-6">
        <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">May 22, 2024</p>
        <h2 className="text-3xl font-black uppercase tracking-tighter">Privacy Policy</h2>
      </div>
      
      <div className="space-y-8 text-sm leading-relaxed text-foreground/80 font-medium">
        <p className="text-base font-bold text-foreground leading-relaxed">
          Welcome to arcex fit. Your privacy is not just a policy for us; it is a core technical requirement. We build our app using a "Local-First" philosophy, ensuring that your most sensitive health data remains under your control on your own device whenever possible.
        </p>

        <section className="space-y-3">
          <h3 className="text-xs font-black uppercase text-primary tracking-widest">1. Data Architecture: UID Namespacing</h3>
          <p>
            We use a sophisticated system called **UID Namespacing** to keep your data safe. Even if multiple people log into their accounts on the same phone, our app partitions the local storage using your unique Firebase ID (UID). This ensures that User A's meal logs and weight history are physically isolated from User B's, and neither can ever "see" the other's private records.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="text-xs font-black uppercase text-primary tracking-widest">2. Information We Collect</h3>
          <div className="space-y-4">
            <div className="bg-muted/5 p-4 rounded-2xl border border-muted/10">
              <p className="text-[10px] font-black uppercase text-foreground mb-1">Identity & Account</p>
              <p className="text-xs">Your name, email address, and basic profile details required for authentication and account recovery via Google Firebase.</p>
            </div>
            <div className="bg-muted/5 p-4 rounded-2xl border border-muted/10">
              <p className="text-[10px] font-black uppercase text-foreground mb-1">Biological Metrics</p>
              <p className="text-xs">Age, gender, height, and weight. These are used locally to calculate your Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE).</p>
            </div>
            <div className="bg-muted/5 p-4 rounded-2xl border border-muted/10">
              <p className="text-[10px] font-black uppercase text-foreground mb-1">Wellness History</p>
              <p className="text-xs">Daily logs of your meals (macros and micros), water intake, step counts, and exercise routines.</p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-xs font-black uppercase text-primary tracking-widest">3. Artificial Intelligence & Data Processing</h3>
          <p>
            Our app utilizes **Gemini 2.5 Flash AI** to parse your natural language meal descriptions (e.g., "I ate two eggs and a slice of toast").
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><span className="font-bold">Privacy Filtering:</span> When you log a meal, only the text of the meal description is sent to the AI processing engine.</li>
            <li><span className="font-bold">No Personal Linkage:</span> Your name, email, and biological metrics are NEVER sent to the AI during nutritional analysis.</li>
            <li><span className="font-bold">Local Learning:</span> Once the AI identifies a food, we save that result to your private "AI Food Cache" on your device, reducing the need for future external processing.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h3 className="text-xs font-black uppercase text-primary tracking-widest">4. Cloud Synchronization & Backups</h3>
          <p>
            While your primary database lives on your phone, we use **Google Firebase Firestore** for secure cloud backups.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><span className="font-bold">Encryption:</span> All data is encrypted during transit (using SSL/TLS) and while resting on Google's highly secure servers.</li>
            <li><span className="font-bold">Security Rules:</span> We enforce server-side code that forbids any person or machine from reading a record unless their verified Authentication ID matches the owner of that record.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h3 className="text-xs font-black uppercase text-primary tracking-widest">5. Data Retention & Your Rights</h3>
          <p>You have absolute sovereignty over your wellness data:</p>
          <div className="grid gap-3">
            <div className="flex gap-3 items-start">
              <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3 h-3 text-primary" /></div>
              <p><span className="font-bold">Right to Export:</span> Use the "Export Data" button in Settings to download your entire history as a structured JSON file at any time.</p>
            </div>
            <div className="flex gap-3 items-start">
              <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3 h-3 text-primary" /></div>
              <p><span className="font-bold">Right to Erasure:</span> Deleting your account will trigger a purge of your data from both your local device and our cloud backup servers.</p>
            </div>
          </div>
        </section>

        <section className="space-y-3 pt-4 border-t border-muted/5">
          <p className="text-[11px] font-bold text-muted-foreground italic text-center">
            At arcex fit, we do not sell, trade, or rent your personal health information to third-party advertisers. Our business model is based on helping you reach your goals, not selling your privacy.
          </p>
        </section>
      </div>
    </div>
  );

  const renderTermsConditions = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 pb-20 px-1">
      <Card className="border-none shadow-md bg-card rounded-3xl overflow-hidden border border-muted/10">
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2 border-b border-muted/10 pb-4">
            <h2 className="text-lg font-black uppercase tracking-tighter">Terms & Conditions</h2>
            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Agreement of Use</p>
          </div>
          
          <div className="space-y-6 text-sm leading-relaxed text-foreground/80 font-medium">
            <section className="space-y-2">
              <h3 className="text-xs font-black uppercase text-primary">1. Your Responsibility</h3>
              <p>You agree to provide honest information (like weight and age) to ensure the app’s calculations remain as safe as possible for you.</p>
            </section>

            <section className="space-y-2">
              <h3 className="text-xs font-black uppercase text-primary">2. Account Safety</h3>
              <p>You are responsible for keeping your login details safe. Please do not share your password with others.</p>
            </section>

            <section className="space-y-2">
              <h3 className="text-xs font-black uppercase text-primary">3. Data & Storage</h3>
              <p>We provide cloud backups for your convenience, but your primary data lives on your phone. We are not responsible for data lost if you clear your browser cache without syncing.</p>
            </section>

            <section className="space-y-2">
              <h3 className="text-xs font-black uppercase text-primary">4. Usage Limits</h3>
              <p>To keep the app fast and fair, we limit AI meal logs to 20 per day. Abusing the system or attempting to hack the app will result in account deletion.</p>
            </section>

            <section className="space-y-2">
              <h3 className="text-xs font-black uppercase text-primary">5. Results</h3>
              <p>While we strive to help you reach your goals, we cannot guarantee specific fitness results. Your progress depends on your consistency and personal health factors.</p>
            </section>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderMedicalDisclaimer = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 pb-20 px-1">
      <Card className="border-none shadow-md bg-card rounded-3xl overflow-hidden border border-muted/10">
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2 border-b border-muted/10 pb-4">
            <h2 className="text-lg font-black uppercase tracking-tighter">Health Disclaimer</h2>
            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Read Before Starting</p>
          </div>
          
          <div className="space-y-6 text-sm leading-relaxed text-foreground/80 font-medium">
            <div className="bg-amber-500/10 p-4 rounded-2xl border border-amber-500/20 flex gap-3 items-start">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs font-bold text-amber-900 leading-relaxed uppercase tracking-tight">
                This app is for information only and is not a substitute for professional medical advice.
              </p>
            </div>

            <section className="space-y-2">
              <h3 className="text-xs font-black uppercase text-primary">Not a Medical Provider</h3>
              <p>arcex fit is a digital tool. We are not doctors, nutritionists, or medical professionals.</p>
            </section>

            <section className="space-y-2">
              <h3 className="text-xs font-black uppercase text-primary">Consult Your Physician</h3>
              <p>Always talk to a doctor before starting any new workout routine or changing your diet, especially if you have existing health conditions or are pregnant.</p>
            </section>

            <section className="space-y-2">
              <h3 className="text-xs font-black uppercase text-primary">AI Estimations</h3>
              <p>Our AI provides "smart estimates." While we aim for accuracy, these numbers should not be used to manage medical conditions like diabetes or severe allergies.</p>
            </section>

            <section className="space-y-2">
              <h3 className="text-xs font-black uppercase text-primary">Listen to Your Body</h3>
              <p>If you feel pain, dizziness, or shortness of breath during any workout, stop immediately and seek medical help.</p>
            </section>

            <section className="space-y-2 border-t border-muted/5 pt-4">
              <p className="text-[10px] font-bold text-muted-foreground italic">By using this app, you assume all risk of injury or health complications.</p>
            </section>
          </div>
        </CardContent>
      </Card>
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
            <SettingsButton 
              icon={Database} 
              label="Export Data" 
              subLabel="Download your wellness history" 
              color="text-amber-600" 
              bg="bg-amber-50"
              onClick={handleExportData}
            />
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
            <SettingsButton 
              icon={Key} 
              label="Change Password" 
              subLabel="Update security credentials" 
              color="text-sky-500" 
              bg="bg-sky-50"
              onClick={handleChangePassword}
            />
            <SettingsButton icon={LogOut} label="Log Out" subLabel="Sync and sign out" color="text-amber-600" bg="bg-amber-50" onClick={handleLogout} />
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="w-full p-4 flex items-center justify-between transition-all text-left group last:border-0">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm bg-destructive/5 text-destructive">
                      <Trash2 className="w-5 h-5" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-sm font-bold text-foreground/90 block leading-tight">Delete Account</span>
                      <span className="text-[10px] font-medium text-muted-foreground">Permanently remove all data</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/20 group-hover:text-primary transition-all" />
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-[2.5rem] w-[90%] max-sm border-none shadow-2xl">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-center font-black uppercase tracking-tighter text-xl text-destructive">Delete Account?</AlertDialogTitle>
                  <AlertDialogDescription className="text-center text-xs font-medium px-2 leading-relaxed">
                    This will permanently delete your identity and all wellness history from arcexfit. This action is final.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-col gap-2 sm:flex-col mt-4">
                  <AlertDialogAction 
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                    className="w-full h-12 rounded-2xl bg-destructive hover:bg-destructive/90 text-white font-black uppercase text-[10px] tracking-widest"
                  >
                    {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Yes, Delete My Data"}
                  </AlertDialogAction>
                  <AlertDialogCancel className="w-full h-12 rounded-2xl border-muted/20 font-black uppercase text-[10px] tracking-widest mt-0">
                    Cancel
                  </AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#4ade80] to-[#3b82f6] flex items-center justify-center shadow-xl border-4 border-white relative z-10">
                  <span className="text-xl font-black text-white">{profileName.charAt(0)}</span>
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
        { id: 'profile-personal-info', icon: User, label: "Personal Information", subLabel: "Name and identity", color: "text-blue-500", bg: "bg-blue-50" },
        { id: 'profile-subscription', icon: CreditCard, label: "Subscription Plan", subLabel: "Elite Premium", color: "text-purple-500", bg: "bg-purple-50" },
        { id: 'profile-reset', icon: RefreshCw, label: "Reset Progress", subLabel: "Fresh start, keep profile", color: "text-rose-500", bg: "bg-rose-50" },
      ]
    },
    {
      title: "Security & Privacy",
      items: [
        { id: 'profile-help', icon: HelpCircle, label: "Help Center", subLabel: "FAQs and support", color: "text-sky-500", bg: "bg-sky-50" },
        { id: 'profile-legal', icon: Shield, label: "Legal", subLabel: "Privacy and terms", color: "text-green-500", bg: "bg-green-50" },
      ]
    },
    {
      title: "App Settings",
      items: [
        { id: 'profile-settings', icon: Settings, label: "Settings", subLabel: "App preferences", color: "text-slate-500", bg: "bg-slate-50" },
        { id: 'logout', icon: LogOut, label: "Log Out", subLabel: "Sync and sign out", color: "text-amber-600", bg: "bg-amber-50", onClick: handleLogout },
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
           activeView === 'reset' ? 'Start Fresh' : 
           activeView === 'privacy' ? 'Privacy Policy' :
           activeView === 'terms' ? 'Terms of Use' :
           activeView === 'medical' ? 'Health Disclaimer' :
           activeView === 'help' ? 'Help' : 'Profile'}
        </h1>
      </div>

      {activeView === 'main' && renderMain()}
      {activeView === 'personal-info' && renderPersonalInfo()}
      {activeView === 'subscription' && renderSubscription()}
      {activeView === 'legal' && renderLegal()}
      {activeView === 'settings' && renderSettings()}
      {activeView === 'reset' && renderReset()}
      {activeView === 'help' && renderHelp()}
      {activeView === 'privacy' && renderPrivacyPolicy()}
      {activeView === 'terms' && renderTermsConditions()}
      {activeView === 'medical' && renderMedicalDisclaimer()}
    </div>
  );
}

function LegalItem({ icon: Icon, label, color, bg, onClick }: { icon: any, label: string, color?: string, bg?: string, onClick?: () => void }) {
  return (
    <button onClick={onClick} className="w-full p-4 flex items-center justify-between transition-all text-left group border-b border-muted/5 last:border-0">
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
