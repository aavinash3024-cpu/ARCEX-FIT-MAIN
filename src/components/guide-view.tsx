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
  ArrowRight
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
    { role: 'ai', text: "Hello! I'm your PulseFlow Guide. How can I help you optimize your performance today?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const options = [
    { label: "Overall nutrition performance", value: 'overall' },
    { label: "Macro analysis performance", value: 'macros' },
    { label: "Micro analysis performance", value: 'micros' },
    { label: "What should I eat next?", value: 'suggestion' }
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
      <div className="flex items-center gap-4 py-4 px-1 sticky top-0 bg-background/80 backdrop-blur-md z-10">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full bg-muted/50 w-9 h-9">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold font-headline leading-none">Personal Guide</h1>
          <p className="text-[10px] font-black text-primary uppercase tracking-widest mt-1">AI Pulse Support</p>
        </div>
      </div>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-1 space-y-4 py-4 swipe-container"
      >
        {messages.map((msg, i) => (
          <div 
            key={i} 
            className={cn(
              "flex w-full",
              msg.role === 'user' ? "justify-end" : "justify-start"
            )}
          >
            <div className={cn(
              "max-w-[85%] rounded-2xl p-4 shadow-sm text-sm leading-relaxed",
              msg.role === 'user' 
                ? "bg-primary text-white rounded-tr-none" 
                : "bg-card border border-muted/20 rounded-tl-none text-foreground/90"
            )}>
              <div className="flex items-center gap-2 mb-1.5 opacity-50">
                {msg.role === 'user' ? (
                  <User className="w-3 h-3 ml-auto order-2" />
                ) : (
                  <Sparkles className="w-3 h-3 text-primary" />
                )}
                <span className="text-[8px] font-black uppercase tracking-widest">
                  {msg.role === 'user' ? 'You' : 'PulseFlow AI'}
                </span>
              </div>
              <p className="font-medium">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-card border border-muted/20 rounded-2xl rounded-tl-none p-4 shadow-sm flex items-center gap-3">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Analyzing Data...</span>
            </div>
          </div>
        )}
      </div>

      {/* Statements / Options */}
      <div className="px-1 mt-4 space-y-2">
        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] px-2 mb-3">SELECT ANALYSIS</p>
        <div className="grid gap-2">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleQuery(opt.label, opt.value as any)}
              disabled={isLoading}
              className="w-full text-left bg-card hover:bg-primary/5 border border-muted/20 p-4 rounded-2xl transition-all group flex items-center justify-between active:scale-[0.98] disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-foreground/80">{opt.label}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary transition-all group-hover:translate-x-1" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
