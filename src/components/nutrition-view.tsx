import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Utensils, History, PieChart, Sparkles } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export function NutritionView() {
  const meals = [
    { type: "Breakfast", name: "Avocado Toast & Egg", calories: 420, carbs: "35g", protein: "18g", fat: "22g", time: "08:30 AM" },
    { type: "Lunch", name: "Chicken Quinoa Bowl", calories: 650, carbs: "55g", protein: "42g", fat: "15g", time: "01:15 PM" },
  ];

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-headline">Nutrition</h1>
        <Button size="sm" className="rounded-full gap-2">
          <Plus className="w-4 h-4" /> Log Meal
        </Button>
      </div>

      {/* Analysis Card */}
      <Card className="border-none shadow-sm bg-accent/10">
        <CardContent className="p-6 flex items-center gap-6">
          <div className="flex-shrink-0 relative w-24 h-24">
             <div className="absolute inset-0 rounded-full border-[8px] border-primary/20"></div>
             <div className="absolute inset-0 rounded-full border-[8px] border-primary border-t-transparent -rotate-45"></div>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-bold">1,070</span>
                <span className="text-[8px] text-muted-foreground uppercase">Left</span>
             </div>
          </div>
          <div className="flex-1 space-y-2">
            <h3 className="font-semibold flex items-center gap-1">
              Today's Analysis <Sparkles className="w-3 h-3 text-accent" />
            </h3>
            <p className="text-sm text-muted-foreground">Your fiber intake is low today. Consider adding a portion of vegetables to your dinner.</p>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-[10px]">High Protein</Badge>
              <Badge variant="outline" className="text-[10px]">Low Sugar</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Today's Meals */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Utensils className="w-5 h-5 text-primary" /> Today's Meals
        </h2>
        <div className="grid gap-4">
          {meals.map((meal, idx) => (
            <Card key={idx} className="border-none shadow-sm overflow-hidden">
              <CardContent className="p-0 flex h-28">
                <div className="w-28 relative bg-muted">
                  <Image 
                    src={PlaceHolderImages.find(img => img.id === 'meal-healthy')?.imageUrl || "https://picsum.photos/seed/meal/200/200"} 
                    alt={meal.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <p className="text-[10px] font-bold text-primary uppercase tracking-wider">{meal.type}</p>
                      <span className="text-[10px] text-muted-foreground">{meal.time}</span>
                    </div>
                    <h4 className="font-semibold">{meal.name}</h4>
                  </div>
                  <div className="flex gap-3 text-[10px] text-muted-foreground">
                    <span>{meal.calories} kcal</span>
                    <span>P: {meal.protein}</span>
                    <span>C: {meal.carbs}</span>
                    <span>F: {meal.fat}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* History & Chart */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-none shadow-sm cursor-pointer hover:bg-muted/5 transition-colors">
          <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
            <div className="p-3 bg-blue-50 rounded-2xl">
              <History className="w-6 h-6 text-blue-500" />
            </div>
            <p className="text-sm font-medium">Meal History</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm cursor-pointer hover:bg-muted/5 transition-colors">
          <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
            <div className="p-3 bg-purple-50 rounded-2xl">
              <PieChart className="w-6 h-6 text-purple-500" />
            </div>
            <p className="text-sm font-medium">Calorie Trends</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
