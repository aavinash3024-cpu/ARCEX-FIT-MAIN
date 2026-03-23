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

  return (
    <div className="space-y-5 pb-24">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-headline">Nutrition</h1>
        <Button size="sm" variant="ghost" className="rounded-full w-9 h-9 p-0 bg-muted/50">
          <Search className="w-4 h-4" />
        </Button>
      </div>

      {/* Compact Analysis Card */}
      <Card className="border-none shadow-sm bg-primary/5 border-l-4 border-l-primary">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="shrink-0 w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary flex items-center justify-center">
            <span className="text-xs font-bold">52%</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xs font-bold flex items-center gap-1.5 uppercase tracking-wider text-primary">
              <Sparkles className="w-3 h-3" /> AI Analysis
            </h3>
            <p className="text-[11px] text-muted-foreground leading-tight mt-0.5 line-clamp-2">
              Fiber is low today. Add broccoli to dinner to hit your 35g target.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* AI Meal Log Hub */}
      <Card className="border-none shadow-md overflow-hidden bg-white/50 backdrop-blur-sm">
        {/* Upper Area Header */}
        <div className="px-6 pt-6 pb-2">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-sm font-black uppercase tracking-widest text-foreground/80">Log Your Nutrition</h2>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Today: 1,070 / 2,200 kcal</p>
            </div>
            <Badge variant="outline" className="border-primary/20 text-primary font-bold text-[9px] px-2 py-0">TRACKING</Badge>
          </div>
        </div>

        <CardContent className="p-0">
          <Tabs value={logTab} onValueChange={setLogTab} className="w-full">
            <div className="px-4">
              <TabsList className="grid w-full grid-cols-3 h-9 bg-muted/50 p-1">
                <TabsTrigger value="log" className="text-[10px] font-bold uppercase tracking-tight gap-1.5">
                  <Plus className="w-3 h-3" /> Log
                </TabsTrigger>
                <TabsTrigger value="recent" className="text-[10px] font-bold uppercase tracking-tight gap-1.5">
                  <Clock className="w-3 h-3" /> Recent
                </TabsTrigger>
                <TabsTrigger value="saved" className="text-[10px] font-bold uppercase tracking-tight gap-1.5">
                  <Bookmark className="w-3 h-3" /> Saved
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
                  placeholder="Describe your meal (e.g. 2 eggs and toast)" 
                  className="w-full h-12 pl-10 pr-20 bg-white border border-muted-foreground/10 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
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

              {/* Log Meal Action Button */}
              <Button className="w-full h-12 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs uppercase tracking-widest shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" />
                Log This Meal
              </Button>

              <p className="text-[9px] text-center text-muted-foreground font-medium uppercase tracking-widest px-4">
                AI can estimate calories and macros from your text or photo
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
                  <Bookmark className="w-8 h-8 mx-auto opacity-20 mb-2" />
                  <p className="text-xs font-medium">No saved meals yet</p>
               </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Logged Meals */}
      <section className="space-y-3">
        <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground/70 px-1">Today's Log</h2>
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
                      <p className="text-[9px] font-black text-primary uppercase tracking-widest">{meal.type}</p>
                      <span className="text-[9px] font-bold text-muted-foreground/60">{meal.time}</span>
                    </div>
                    <h4 className="font-bold text-sm text-foreground/90 line-clamp-1">{meal.name}</h4>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="flex gap-2 text-[9px] font-bold text-muted-foreground/70 uppercase">
                      <span>P: {meal.protein}</span>
                      <span>C: {meal.carbs}</span>
                      <span>F: {meal.fat}</span>
                    </div>
                    <Badge variant="secondary" className="text-[10px] h-5 px-2 bg-primary/5 text-primary-foreground/80 font-bold border-none">
                      {meal.calories} KCAL
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* History & Trends */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="border-none shadow-sm cursor-pointer active:scale-95 transition-all bg-sky-50/50 group">
          <CardContent className="p-4 flex flex-col items-center text-center gap-2">
            <div className="p-2.5 bg-sky-100 rounded-xl group-hover:scale-110 transition-transform">
              <History className="w-5 h-5 text-sky-600" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-sky-900/60">Meal History</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm cursor-pointer active:scale-95 transition-all bg-purple-50/50 group">
          <CardContent className="p-4 flex flex-col items-center text-center gap-2">
            <div className="p-2.5 bg-purple-100 rounded-xl group-hover:scale-110 transition-transform">
              <PieChart className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-purple-900/60">Calorie Trends</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
