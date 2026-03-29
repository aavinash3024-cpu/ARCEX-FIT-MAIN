
"use client";

import React, { useState, useEffect } from 'react';
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
  Calendar,
  Zap,
  Activity,
  Scale,
  Ruler,
  Target,
  RefreshCw,
  Star
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProfileViewProps {
  onBack: () => void;
}

export function ProfileView({ onBack }: ProfileViewProps) {
  const [goalData, setGoalData] = useState<any>(null);

  useEffect(() => {
    const savedGoal = localStorage.getItem('pulseflow_goal_data');
    if (savedGoal) {
      try {
        setGoalData(JSON.parse(savedGoal));
      } catch (e) {
        console.error("Failed to parse goal data", e);
      }
    }
  }, []);

  // Mock user data
  const user = {
    name: "Alex Johnson",
    email: "alex.j@pulseflow.ai",
    joined: "Jan 2024",
    membership: "Premium",
    level: "Intermediate"
  };

  const sections = [
    {
      title: "Account Settings",
      items: [
        { icon: User, label: "Personal Information", subLabel: "Name, email, and identity", color: "text-blue-500", bg: "bg-blue-50" },
        { icon: CreditCard, label: "Subscription Plan", subLabel: user.membership + " Membership", color: "text-purple-500", bg: "bg-purple-50" },
        { icon: Target, label: "Goals", subLabel: "Active fitness objectives", color: "text-primary", bg: "bg-primary/5" },
        { icon: RefreshCw, label: "Reset", subLabel: "Clear daily progress data", color: "text-rose-500", bg: "bg-rose-50" },
      ]
    },
    {
      title: "Security & Privacy",
      items: [
        { icon: HelpCircle, label: "Help Center", subLabel: "FAQs and troubleshooting", color: "text-sky-500", bg: "bg-sky-50" },
        { icon: Shield, label: "Legal", subLabel: "Privacy policy & terms", color: "text-green-500", bg: "bg-green-50" },
      ]
    },
    {
      title: "Pulse Support",
      items: [
        { icon: Settings, label: "Settings", subLabel: "Units and app preferences", color: "text-slate-500", bg: "bg-slate-50" },
        { icon: Star, label: "Rate the App", subLabel: "Share your feedback", color: "text-amber-500", bg: "bg-amber-50" },
      ]
    }
  ];

  const stats = [
    { label: "Level", value: user.level, icon: Activity, color: "text-primary" },
    { label: "Joined", value: user.joined, icon: Calendar, color: "text-orange-500" },
    { label: "Status", value: "Active", icon: Zap, color: "text-yellow-500" },
  ];

  return (
    <div className="space-y-6 pb-32 pt-4 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-4 pt-2 px-1">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full bg-muted/50 w-9 h-9">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold font-headline">Profile</h1>
      </div>

      {/* Hero Profile Section */}
      <div className="px-1">
        <Card className="border-none bg-gradient-to-br from-primary/10 via-background to-accent/10 shadow-sm rounded-[2.5rem] overflow-hidden border border-white/20">
          <CardContent className="p-6 space-y-6">
            {/* Top Row: Info */}
            <div className="flex items-center gap-5">
              <div className="relative shrink-0">
                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-xl border-4 border-white relative z-10">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <div className="absolute -bottom-1 -right-1 z-20 bg-primary text-white p-1.5 rounded-full border-2 border-white shadow-lg">
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
                  {user.membership} Member
                </Badge>
              </div>
            </div>

            {/* Separator */}
            <div className="h-px w-full bg-muted-foreground/10" />

            {/* Bottom Row: Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0">
                  <Scale className="w-4 h-4 text-primary/60" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.15em] leading-none mb-1">Weight</p>
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-lg font-black text-foreground">{goalData?.weight || "--"}</span>
                    <span className="text-[9px] font-bold text-muted-foreground uppercase">kg</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0">
                  <Ruler className="w-4 h-4 text-primary/60" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.15em] leading-none mb-1">Height</p>
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-lg font-black text-foreground">{goalData?.height || "--"}</span>
                    <span className="text-[9px] font-bold text-muted-foreground uppercase">cm</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 px-1">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm bg-white rounded-2xl">
            <CardContent className="p-3 flex flex-col items-center justify-center text-center space-y-1">
              <stat.icon className={cn("w-3.5 h-3.5", stat.color)} />
              <p className="text-[11px] font-black text-foreground uppercase tracking-tight leading-none">{stat.value}</p>
              <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest leading-none">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Settings Sections */}
      <div className="space-y-8 px-1">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-3">
            <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/60 px-3">
              {section.title}
            </h3>
            <Card className="border-none shadow-md bg-white overflow-hidden rounded-3xl border border-muted/10">
              <CardContent className="p-0">
                {section.items.map((item, i) => (
                  <button 
                    key={i} 
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

        <div className="px-2 pt-2">
          <Button 
            variant="ghost" 
            className="w-full h-14 rounded-2xl text-destructive hover:text-destructive hover:bg-destructive/5 font-black uppercase text-[11px] tracking-[0.2em] border-2 border-dashed border-destructive/10"
          >
            <LogOut className="w-4 h-4 mr-2" /> Sign Out of Account
          </Button>
          <p className="text-center text-[8px] font-bold text-muted-foreground uppercase tracking-widest mt-4 opacity-40">
            PulseFlow AI v3.2.0 • Build 2024.01
          </p>
        </div>
      </div>
    </div>
  );
}
