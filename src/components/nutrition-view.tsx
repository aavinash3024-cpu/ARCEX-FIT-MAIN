'use client';

import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Plus, 
  Search, 
  Utensils, 
  History, 
  PieChart, 
  Sparkles,
  Bookmark,
  Clock,
  Mic,
  Camera,
  ChevronRight
} from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export function NutritionView() {
  const [logTab, setLogTab] = useState("log");

  const meals = [
    { 
      type: "Breakfast", 
      name: "Avocado Toast & Egg", 
      calories: 420, 
      carbs: "35g", 
      protein: "18g", 
      fat: "22g", 
      time: "08:30 AM"
    },
    { 
      type: "Lunch", 
      name: "Chicken Quinoa Bowl", 
      calories: 650, 
      carbs: "55g", 
      protein: "42g", 
      fat: "15g", 
      time: "01:15 PM"
    },
  ];

  const recentMeals = [
    { name: "Greek Yogurt Parfait", calories: 280 },
    { name: "Protein Shake", calories: 180 },
    { name: "Almond Butter Toast", calories: 320 },
  ];

  const analysisImage = PlaceHolderImages.find(img => img.id === 'ai-analysis-meal');

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between pt-2">
        <h1 className="text-2xl font-bold font-headline">Nutrition</h1>
        <Button size="sm" variant="ghost" className="rounded-full w-9 h-9 p-0 bg-muted/50">
          <Search className="w-4 h-4" />
        </Button>
      </div>

      {/* Compact Analysis Card */}
      <Card className="border-none shadow-sm bg-primary/5 border-l-4 border-l-primary overflow-hidden">
        <CardContent className="p-0 flex items-center">
          <div className="shrink-0 w-20 h-20 relative">
            <Image 
              src={analysisImage?.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&auto=format&fit=crop"} 
              alt="AI Analysis"
              fill
              className="object-cover"
              data-ai-hint="noodle bowl"
            />
          </div>
          <div className="flex-1 p-3 min-w-0">
            <h3 className="text-[10px] font-black flex items-center gap-1.5 uppercase tracking-wider text-primary">
              <Sparkles className="w-3 h-3" /> AI Insight
            </h3>
            <p className="text-[11px] text-muted-foreground font-medium leading-tight mt-0.5 line-clamp-2">
              Fiber is lower today. Try adding broccoli or chia seeds to dinner to reach your goal.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* AI Meal Log Hub */}
      <Card className="border-none shadow-md overflow-hidden bg-white/50 backdrop-blur-sm">
        {/* Header - Logo on Left */}
        <div className="px-5 pt-5 pb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full shrink-0">
              <Utensils className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xs font-black uppercase tracking-[0.15em] text-foreground/80">Meal Logging</h2>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
                TODAY'S CREDITS: <span className="text-primary">25/25</span>
              </p>
            </div>
          </div>
        </div>

        <CardContent className="p-0">
          <Tabs value={logTab} onValueChange={setLogTab} className="w-full">
            <div className="px-4 py-2">
              <TabsList className="grid w-full grid-cols-3 h-10 bg-muted/50 p-1 rounded-xl">
                <TabsTrigger value="log" className="text-[10px] font-bold uppercase tracking-tight gap-1.5 rounded-lg data-[state=active]:shadow-sm">
                  <Plus className="w-3.5 h-3.5" /> Log
                </TabsTrigger>
                <TabsTrigger value="recent" className="text-[10px] font-bold uppercase tracking-tight gap-1.5 rounded-lg data-[state=active]:shadow-sm">
                  <Clock className="w-3.5 h-3.5" /> Recent
                </TabsTrigger>
                <TabsTrigger value="saved" className="text-[10px] font-bold uppercase tracking-tight gap-1.5 rounded-lg data-[state=active]:shadow-sm">
                  <Bookmark className="w-3.5 h-3.5" /> Saved
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="log" className="p-4 mt-0 space-y-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Sparkles className="w-4 h-4 text-primary/40 group-focus-within:text-primary transition-colors" />
                </div>
                <input 
                  type="text" 
                  placeholder="What did you eat?" 
                  className="w-full h-12 pl-10 pr-20 bg-white border border-muted-foreground/10 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                />
                <div className="absolute inset-y-0 right-2 flex items-center gap-1">
                  <Button size="icon" variant="ghost" className="w-8 h-8 rounded-full text-muted-foreground">
                    <Mic className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="w-8 h-8 rounded-full text-muted-foreground">
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Button className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-[11px] uppercase tracking-widest shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">
                Log This Meal Now
              </Button>
            </TabsContent>

            <TabsContent value="recent" className="p-4 mt-0">
              <div className="space-y-2">
                {recentMeals.map((meal, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-white/60 rounded-xl border border-muted/20">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                        <Utensils className="w-4 h-4 text-muted-foreground/60" />
                      </div>
                      <span className="text-xs font-semibold">{meal.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold text-muted-foreground">{meal.calories} kcal</span>
                      <Button size="icon" variant="ghost" className="w-7 h-7 rounded-full bg-primary/10 text-primary">
                        <Plus className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="saved" className="p-4 mt-0">
               <div className="text-center py-8 text-muted-foreground">
                  <Bookmark className="w-10 h-10 mx-auto opacity-10 mb-2" />
                  <p className="text-[10px] font-bold uppercase tracking-wider">No saved meals yet</p>
               </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Today's Log Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70">Today's Log</h2>
          <span className="text-[9px] font-bold text-primary uppercase flex items-center">View Summary <ChevronRight className="w-3 h-3 ml-0.5" /></span>
        </div>
        <div className="grid gap-3">
          {meals.map((meal, idx) => {
            return (
              <Card key={idx} className="border-none shadow-sm overflow-hidden bg-white hover:shadow-md transition-shadow group">
                <CardContent className="p-0 flex h-20">
                  <div className="w-20 bg-muted/20 shrink-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-muted/10 group-hover:scale-110 transition-transform duration-300">
                      <Utensils className="w-5 h-5 text-muted-foreground/40" />
                    </div>
                  </div>
                  <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
                    <div className="flex justify-between items-start">
                      <div className="min-w-0">
                        <p className="text-[8px] font-black text-primary uppercase tracking-[0.15em] leading-none mb-1">{meal.type}</p>
                        <h4 className="font-bold text-sm text-foreground/90 truncate">{meal.name}</h4>
                      </div>
                      <span className="text-[9px] font-bold text-muted-foreground/40 shrink-0">{meal.time}</span>
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="flex gap-2 text-[9px] font-bold text-muted-foreground/60 uppercase">
                        <span>P: {meal.protein}</span>
                        <span>C: {meal.carbs}</span>
                        <span>F: {meal.fat}</span>
                      </div>
                      <Badge variant="secondary" className="text-[9px] h-5 px-2 bg-primary/5 text-primary-foreground/80 font-black border-none">
                        {meal.calories} KCAL
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Improved Meal History & Calorie Trends */}
      <div className="grid grid-cols-2 gap-4 pb-6">
        <Card className="border-none shadow-sm bg-white hover:bg-sky-50 transition-all cursor-pointer active:scale-95 group border border-muted/20">
          <CardContent className="p-5 flex flex-col items-start gap-3">
            <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center group-hover:bg-sky-200 transition-colors">
              <History className="w-5 h-5 text-sky-600" />
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Meal History</p>
              <p className="text-xs font-bold text-foreground/80">32 logged</p>
            </div>
            <button className="flex items-center gap-1 mt-1 text-[9px] font-black text-sky-600 uppercase tracking-widest hover:opacity-70 transition-opacity">
              Details <ChevronRight className="w-3 h-3" />
            </button>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm bg-white hover:bg-purple-50 transition-all cursor-pointer active:scale-95 group border border-muted/20">
          <CardContent className="p-5 flex flex-col items-start gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
              <PieChart className="w-5 h-5 text-purple-600" />
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Calorie Trends</p>
              <p className="text-xs font-bold text-foreground/80">Avg. 1,940 kcal</p>
            </div>
            <button className="flex items-center gap-1 mt-1 text-[9px] font-black text-purple-600 uppercase tracking-widest hover:opacity-70 transition-opacity">
              Details <ChevronRight className="w-3 h-3" />
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
