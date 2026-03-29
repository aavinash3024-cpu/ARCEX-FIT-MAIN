
"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  User, 
  Settings, 
  Shield, 
  Bell, 
  LogOut,
  CreditCard,
  HelpCircle,
  Mail,
  ChevronRight,
  Trophy,
  Calendar,
  Zap,
  Activity
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProfileViewProps {
  onBack: () => void;
}

export function ProfileView({ onBack }: ProfileViewProps) {
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
        { icon: User, label: "Personal Information", subLabel: "Name, email, and goals", color: "text-blue-500", bg: "bg-blue-50" },
        { icon: CreditCard, label: "Subscription Plan", subLabel: user.membership + " Membership", color: "text-purple-500", bg: "bg-purple-50" },
        { icon: Mail, label: "Email Preferences", subLabel: "Newsletter and alerts", color: "text-amber-500", bg: "bg-amber-50" },
      ]
    },
    {
      title: "Security & Privacy",
      items: [
        { icon: Shield, label: "Privacy Settings", subLabel: "Data visibility & sharing", color: "text-green-500", bg: "bg-green-50" },
        { icon: Bell, label: "Push Notifications", subLabel: "Daily reminders & updates", color: "text-rose-500", bg: "bg-rose-50" },
      ]
    },
    {
      title: "Pulse Support",
      items: [
        { icon: HelpCircle, label: "Help Center", subLabel: "FAQ and contact us", color: "text-sky-500", bg: "bg-sky-50" },
        { icon: Settings, label: "App Settings", subLabel: "Units, theme, and more", color: "text-slate-500", bg: "bg-slate-50" },
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
        <Card className="border-none bg-gradient-to-br from-primary/10 via-background to-accent/10 shadow-sm rounded-[2rem] overflow-hidden">
          <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-xl border-4 border-white relative z-10">
                <User className="w-10 h-10 text-primary" />
              </div>
              <div className="absolute -inset-2 bg-gradient-to-tr from-primary to-accent rounded-full blur-lg opacity-20 animate-pulse" />
              <div className="absolute -bottom-1 -right-1 z-20 bg-primary text-white p-1.5 rounded-full border-2 border-white shadow-lg">
                <Trophy className="w-3 h-3" />
              </div>
            </div>
            
            <div className="space-y-1">
              <h2 className="text-xl font-black text-foreground tracking-tight">{user.name}</h2>
              <div className="flex items-center justify-center gap-2">
                <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/10 text-[9px] font-black uppercase tracking-widest px-2 h-5">
                  {user.membership}
                </Badge>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{user.email}</span>
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
