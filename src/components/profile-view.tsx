
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Ruler,
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
  Zap
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ProfileViewProps {
  onBack: () => void;
}

type SubView = 'main' | 'personal-info' | 'subscription' | 'legal' | 'settings';

export function ProfileView({ onBack }: ProfileViewProps) {
  const [activeSubView, setActiveSubView] = useState<SubView>('main');
  const [goalData, setGoalData] = useState<any>(null);
  const [weightHistory, setWeightHistory] = useState<any[]>([]);

  useEffect(() => {
    const savedGoal = localStorage.getItem('pulseflow_goal_data');
    if (savedGoal) {
      try {
        const data = JSON.parse(savedGoal);
        setGoalData(data);
      } catch (e) {
        console.error("Failed to parse goal data", e);
      }
    }

    const savedWeight = localStorage.getItem('pulseflow_weight_history');
    if (savedWeight) {
      try {
        setWeightHistory(JSON.parse(savedWeight));
      } catch (e) {
        console.error("Failed to parse weight history", e);
      }
    }
  }, []);

  const handleBack = () => {
    if (activeSubView !== 'main') {
      setActiveSubView('main');
    } else {
      onBack();
    }
  };

  // Mock user data
  const user = {
    name: "Alex Johnson",
    email: "alex.j@pulseflow.ai",
    location: "London, UK",
    dob: "15 May 1998",
    membership: "Premium Member",
    joined: "Jan 2024"
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
        { id: 'subscription', icon: CreditCard, label: "Subscription Plan", subLabel: user.membership, color: "text-purple-500", bg: "bg-purple-50" },
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
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="px-1 space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/60 px-3">Identity Details</h3>
        <Card className="border-none shadow-md bg-white rounded-3xl overflow-hidden border border-muted/10">
          <CardContent className="p-0 divide-y divide-muted/5">
            <InfoRow icon={User} label="Username" value={user.name} />
            <InfoRow icon={FileText} label="Email" value={user.email} />
            <InfoRow icon={Calendar} label="Age" value={goalData?.age ? `${goalData.age} Years` : "--"} />
            <InfoRow icon={MapPin} label="Location" value={user.location} />
            <InfoRow icon={User} label="Sex" value={goalData?.gender?.toUpperCase() || "--"} />
            <InfoRow icon={Calendar} label="Date of Birth" value={user.dob} />
          </CardContent>
        </Card>
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
            <SettingsButton icon={Smartphone} label="Haptics" subLabel="Tactile feedback" color="text-sky-500" bg="bg-sky-50" />
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

  const renderMain = () => (
    <>
      <div className="px-1 space-y-4">
        {/* Profile Identity Card */}
        <Card className="border-none bg-white shadow-sm rounded-[2.5rem] overflow-hidden border border-white/20 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-white to-transparent pointer-events-none" />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center gap-5">
              <div className="relative shrink-0">
                <div className="w-20 h-20 rounded-full bg-[#6b85a3] flex items-center justify-center shadow-xl border-4 border-white relative z-10">
                  <span className="text-2xl font-black text-white">{user.name.charAt(0)}</span>
                </div>
                <div className="absolute -bottom-1 -right-1 z-20 bg-[#6b85a3] text-white p-1.5 rounded-full border-2 border-white shadow-lg">
                  <Trophy className="w-2.5 h-2.5" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-black text-foreground tracking-tighter truncate">{user.name}</h2>
                <div className="space-y-0.5 mt-0.5">
                  <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                    {goalData?.age || "--"} Yrs • {goalData?.gender?.toUpperCase() || "--"}
                  </p>
                  <p className="text-[10px] font-bold text-muted-foreground/60 tracking-tight truncate">{user.email}</p>
                </div>
                <Badge variant="secondary" className="mt-2 bg-primary/10 text-primary hover:bg-primary/10 text-[8px] font-black uppercase tracking-widest px-2 h-4 border-none">
                  {user.membership}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sleek Weight Progress Card */}
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
           activeSubView === 'settings' ? 'Settings' : 'Profile'}
        </h1>
      </div>

      {activeSubView === 'main' && renderMain()}
      {activeSubView === 'personal-info' && renderPersonalInfo()}
      {activeSubView === 'subscription' && renderSubscription()}
      {activeSubView === 'legal' && renderLegal()}
      {activeSubView === 'settings' && renderSettings()}
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="p-4 flex items-center justify-between bg-white border-b border-muted/5 last:border-0">
      <div className="flex items-center gap-4">
        <div className="w-9 h-9 rounded-xl bg-primary/5 text-primary/60 flex items-center justify-center shadow-sm">
          <Icon className="w-4 h-4" />
        </div>
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-tight">{label}</p>
      </div>
      <p className="text-sm font-black text-foreground">{value}</p>
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

function CheckCircle2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
