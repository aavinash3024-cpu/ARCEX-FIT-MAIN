"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  Sparkles, 
  User, 
  Loader2, 
  MessageSquare,
  ArrowRight,
  TrendingUp,
  PieChart,
  Activity,
  Flame,
  Zap,
  Target
} from "lucide-react";
import { personalGuide } from '@/ai/flows/personal-guide-flow';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'ai';
  text: string;
}

interface GuideViewProps {
  goalData: any;
  loggedMeals: any[];
  onBack: () => void;
}

export function GuideView({ goalData, loggedMeals, onBack }: GuideViewProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: "Hello! I'm your PulseFlow Guide.\n\nSelect a performance analysis module below to analyze your real-time wellness data." }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const options = [
    { label: "Overall nutrition performance", value: 'overall', icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: "Macro analysis performance", value: 'macros', icon: PieChart, color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: "Micro analysis performance", value: 'micros', icon: Activity, color: 'text-purple-500', bg: 'bg-purple-50' },
    { label: "What should I eat next?", value: 'suggestion', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50' }
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleQuery = async (label: string, type: 'overall' | 'macros' | 'micros' | 'suggestion') => {
    if (isLoading) return;

    const userMsg: Message = { role: 'user', text: label };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const result = await personalGuide({
        profile: goalData,
        todayNutrition: loggedMeals,
        queryType: type
      });
      
      const aiMsg: Message = { role: 'ai', text: result.response };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: "I'm sorry, I encountered an error analyzing your data. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-500 pb-24">
      {/* Header */}
      <div className="flex items-center gap-4 py-4 px-1 sticky top-0 bg-background/80 backdrop-blur-md z-10 border-b border-muted/10">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full bg-muted/50 w-9 h-9">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-lg font-black uppercase tracking-tighter text-foreground">PulseFlow AI</h1>
          <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">Performance Analyst</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-primary animate-pulse" />
        </div>
      </div>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-2 space-y-6 py-6 swipe-container"
      >
        {messages.map((msg, i) => (
          <div 
            key={i} 
            className={cn(
              "flex w-full animate-in fade-in slide-in-from-bottom-2",
              msg.role === 'user' ? "justify-end" : "justify-start"
            )}
          >
            <div className={cn(
              "max-w-[90%] rounded-[1.5rem] p-5 shadow-sm text-xs leading-relaxed",
              msg.role === 'user' 
                ? "bg-primary text-white rounded-tr-none" 
                : "bg-card border border-muted/20 rounded-tl-none text-foreground/90"
            )}>
              <div className="flex items-center gap-2 mb-2 opacity-40">
                {msg.role === 'user' ? (
                  <User className="w-3 h-3 ml-auto order-2" />
                ) : (
                  <Sparkles className="w-3 h-3 text-primary" />
                )}
                <span className="text-[8px] font-black uppercase tracking-widest">
                  {msg.role === 'user' ? 'Identity' : 'PulseFlow Analyst'}
                </span>
              </div>
              <p className="font-bold whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2">
            <div className="bg-card border border-muted/20 rounded-[1.5rem] rounded-tl-none p-5 shadow-sm flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span className="text-[9px] font-black uppercase tracking-widest text-primary">Scanning Performance Data...</span>
              </div>
              <div className="h-1.5 w-32 bg-muted/20 rounded-full overflow-hidden">
                <div className="h-full bg-primary/40 animate-progress w-full origin-left" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Options Panel */}
      <div className="px-2 mt-4 space-y-4">
        <div className="flex items-center justify-between px-2">
          <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.25em]">Precision Modules</p>
          <div className="h-px flex-1 mx-4 bg-muted/20" />
        </div>
        
        <div className="grid grid-cols-2 gap-3 pb-4">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleQuery(opt.label, opt.value as any)}
              disabled={isLoading}
              className="group relative text-left bg-card hover:bg-muted/5 border border-muted/20 p-4 rounded-[1.5rem] transition-all active:scale-[0.98] disabled:opacity-50 flex flex-col gap-3 overflow-hidden"
            >
              <div className="absolute -right-4 -top-4 w-12 h-12 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-all" />
              <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center transition-all group-hover:scale-110", opt.bg, opt.color)}>
                <opt.icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-tight text-foreground/70 leading-tight pr-4">
                {opt.label}
              </span>
              <ArrowRight className="absolute bottom-4 right-4 w-3 h-3 text-muted-foreground/30 group-hover:text-primary transition-all group-hover:translate-x-1" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
