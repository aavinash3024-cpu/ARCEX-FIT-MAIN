
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
  Camera
} from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export function NutritionView() {
  const [logTab, setLogTab] = useState("log");

  const meals = [
    { type: "Breakfast", name: "Avocado Toast & Egg", calories: 420, carbs: "35g", protein: "18g", fat: "22g", time: "08:30 AM" },
    { type: "Lunch", name: "Chicken Quinoa Bowl", calories: 650, carbs: "55g", protein: "42g", fat: "15g", time: "01:15 PM" },
  ];

  const recentMeals = [
    { name: "Greek Yogurt Parfait", calories: 280 },
    { name: "Protein Shake", calories: 180 },
    { name: "Almond Butter Toast", calories: 320 },
  ];

  const analysisImage = PlaceHolderImages.find(img => img.id === 'ai-analysis-meal');

  return (
    <div className="space-y-5 pb-24">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-headline">Nutrition</h1>
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" className="rounded-full w-9 h-9 p-0 bg-muted/50">
            <Search className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Compact Analysis Card */}
      <Card className="border-none shadow-sm bg-primary/5 border-l-4 border-l-primary overflow-hidden">
        <CardContent className="p-0 flex items-center">
          <div className="shrink-0 w-24 h-24 relative">
            <Image 
              src={analysisImage?.imageUrl || "https://picsum.photos/seed/meal-bowl/200/200"} 
              alt="AI Analysis"
              fill
              className="object-cover"
              data-ai-hint="noodle bowl"
            />
          </div>
          <div className="flex-1 p-3 min-w-0">
            <h3 className="text-[10px] font-black flex items-center gap-1.5 uppercase tracking-wider text-primary">
              <Sparkles className="w-3 h-3" /> AI Analysis
            </h3>
            <p className="text-[11px] text-muted-foreground font-medium leading-tight mt-0.5 line-clamp-2">
              Fiber is lower than usual today. Adding a serving of broccoli or chia seeds to your dinner would bridge the 12g gap.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* AI Meal Log Hub - Structured with Header & Tabs */}
      <Card className="border-none shadow-md overflow-hidden bg-white/50 backdrop-blur-sm">
        {/* Upper Area Header - Icon on the Left */}
        <div className="px-5 pt-5 pb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-muted/40 rounded-full shrink-0">
              <Utensils className="w-4 h-4 text-muted-foreground/60" />
            </div>
            <div className="space-y-0.5">
              <h2 className="text-xs font-black uppercase tracking-[0.15em] text-foreground/80">Meal Logging</h2>
              <div className="flex items-center gap-2">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Today's Credits:</p>
                <Badge variant="secondary" className="text-[9px] bg-primary/10 text-primary border-none h-4">25 / 25</Badge>
              </div>
            </div>
          </div>
        </div>

        <CardContent className="p-0">
          <Tabs value={logTab} onValueChange={setLogTab} className="w-full">
            <div className="px-4">
              <TabsList className="grid w-full grid-cols-3 h-9 bg-muted/50 p-1 rounded-xl">
                <TabsTrigger value="log" className="text-[9px] font-bold uppercase tracking-tight gap-1.5 rounded-lg">
                  <Plus className="w-3 h-3" /> Log
                </TabsTrigger>
                <TabsTrigger value="recent" className="text-[9px] font-bold uppercase tracking-tight gap-1.5 rounded-lg">
                  <Clock className="w-3 h-3" /> Recent
                </TabsTrigger>
                <TabsTrigger value="saved" className="text-[9px] font-bold uppercase tracking-tight gap-1.5 rounded-lg">
                  <Bookmark className="w-3 h-3" /> Saved
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="log" className="p-4 mt-0 space-y-3">
              <div className="relative group">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Sparkles className="w-4 h-4 text-primary/40 group-focus-within:text-primary transition-colors" />
                </div>
                <input 
                  type="text" 
                  placeholder="Describe your meal..." 
                  className="w-full h-11 pl-10 pr-20 bg-white border border-muted-foreground/10 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                />
                <div className="absolute inset-y-0 right-2 flex items-center gap-1">
                  <Button size="icon" variant="ghost" className="w-7 h-7 rounded-full text-muted-foreground">
                    <Mic className="w-3.5 h-3.5" />
                  </Button>
                  <Button size="icon" variant="ghost" className="w-7 h-7 rounded-full text-muted-foreground">
                    <Camera className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>

              {/* Explicit Log Button */}
              <Button className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                Log This Meal Now
              </Button>

              <p className="text-[8px] text-center text-muted-foreground font-bold uppercase tracking-widest px-4 opacity-60">
                AI estimates calories and macros automatically
              </p>
            </TabsContent>

            <TabsContent value="recent" className="p-4 mt-0">
              <div className="space-y-2">
                {recentMeals.map((meal, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 bg-white/60 rounded-xl border border-muted/20">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                        <Utensils className="w-4 h-4 text-muted-foreground/60" />
                      </div>
                      <span className="text-xs font-semibold">{meal.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold text-muted-foreground">{meal.calories} kcal</span>
                      <Button size="icon" variant="ghost" className="w-6 h-6 rounded-full bg-primary/10 text-primary">
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="saved" className="p-4 mt-0">
               <div className="text-center py-6 text-muted-foreground">
                  <Bookmark className="w-8 h-8 mx-auto opacity-10 mb-2" />
                  <p className="text-[10px] font-bold uppercase tracking-wider">No saved meals</p>
               </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Logged Meals Section */}
      <section className="space-y-3">
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 px-1">Today's Log</h2>
        <div className="grid gap-3">
          {meals.map((meal, idx) => (
            <Card key={idx} className="border-none shadow-sm overflow-hidden bg-white/80">
              <CardContent className="p-0 flex h-24">
                <div className="w-24 relative bg-muted shrink-0">
                  <Image 
                    src={PlaceHolderImages.find(img => img.id === 'meal-healthy')?.imageUrl || "https://picsum.photos/seed/meal/200/200"} 
                    alt={meal.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 p-3 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <p className="text-[8px] font-black text-primary uppercase tracking-[0.15em]">{meal.type}</p>
                      <span className="text-[9px] font-bold text-muted-foreground/50">{meal.time}</span>
                    </div>
                    <h4 className="font-bold text-sm text-foreground/90 line-clamp-1">{meal.name}</h4>
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
          ))}
        </div>
      </section>

      {/* Meal History & Calorie Trends */}
      <div className="grid grid-cols-2 gap-3 pb-4">
        <Card className="border-none shadow-sm cursor-pointer active:scale-95 transition-all bg-sky-50/50 group">
          <CardContent className="p-4 flex flex-col items-center text-center gap-2">
            <div className="p-2.5 bg-sky-100 rounded-xl group-hover:scale-110 transition-transform">
              <History className="w-5 h-5 text-sky-600" />
            </div>
            <p className="text-[9px] font-black uppercase tracking-widest text-sky-900/60">Meal History</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm cursor-pointer active:scale-95 transition-all bg-purple-50/50 group">
          <CardContent className="p-4 flex flex-col items-center text-center gap-2">
            <div className="p-2.5 bg-purple-100 rounded-xl group-hover:scale-110 transition-transform">
              <PieChart className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-[9px] font-black uppercase tracking-widest text-purple-900/60">Trends</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
