
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
  ChevronRight
} from "lucide-react";

interface ProfileViewProps {
  onBack: () => void;
}

export function ProfileView({ onBack }: ProfileViewProps) {
  // Mock user data
  const user = {
    name: "Alex Johnson",
    email: "alex.j@pulseflow.ai",
    joined: "January 2024",
    membership: "Premium"
  };

  const sections = [
    {
      title: "Account",
      items: [
        { icon: User, label: "Personal Information", color: "text-blue-500" },
        { icon: CreditCard, label: "Subscription Plan", color: "text-purple-500" },
        { icon: Mail, label: "Email Preferences", color: "text-amber-500" },
      ]
    },
    {
      title: "Security & Privacy",
      items: [
        { icon: Shield, label: "Privacy Settings", color: "text-green-500" },
        { icon: Bell, label: "Push Notifications", color: "text-rose-500" },
      ]
    },
    {
      title: "Support",
      items: [
        { icon: HelpCircle, label: "Help Center", color: "text-sky-500" },
        { icon: Settings, label: "App Settings", color: "text-slate-500" },
      ]
    }
  ];

  return (
    <div className="space-y-6 pb-32 pt-4 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-4 pt-2 px-1">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full bg-muted/50 w-9 h-9">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold font-headline">My Profile</h1>
      </div>

      <div className="flex flex-col items-center py-4 space-y-3">
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border-4 border-white shadow-xl">
          <User className="w-10 h-10 text-primary" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-black text-foreground">{user.name}</h2>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{user.membership} Member</p>
        </div>
      </div>

      <div className="space-y-6 px-1">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-3">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 px-2">
              {section.title}
            </h3>
            <Card className="border-none shadow-sm bg-white overflow-hidden rounded-2xl border border-muted/10">
              <CardContent className="p-0 divide-y divide-muted/5">
                {section.items.map((item, i) => (
                  <button key={i} className="w-full p-4 flex items-center justify-between hover:bg-muted/5 transition-colors text-left group">
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-xl bg-muted/30 flex items-center justify-center ${item.color}`}>
                        <item.icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-bold text-foreground/80">{item.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground/20 group-hover:text-primary transition-all" />
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>
        ))}

        <Button variant="ghost" className="w-full h-14 rounded-2xl text-destructive hover:text-destructive hover:bg-destructive/5 font-black uppercase text-[11px] tracking-[0.2em] mt-4">
          <LogOut className="w-4 h-4 mr-2" /> Sign Out
        </Button>
      </div>
    </div>
  );
}
