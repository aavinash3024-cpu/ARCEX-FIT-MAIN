
"use client";

import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Trash2,
  AlertCircle,
  ClipboardList,
  MoreVertical,
  Save
} from "lucide-react";
import { addDays, format, startOfToday, isSameDay } from 'date-fns';
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  priority: Priority;
  completed: boolean;
  date: Date;
  details?: string;
}

interface TasksViewProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  onBack: () => void;
}

export function TasksView({ tasks, setTasks, onBack }: TasksViewProps) {
  const [selectedDate, setSelectedDate] = useState(startOfToday());
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [selectedPriority, setSelectedPriority] = useState<Priority>('medium');
  
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [detailsText, setDetailsText] = useState("");

  const priorityBgColor = {
    low: 'bg-green-500',
    medium: 'bg-amber-500',
    high: 'bg-destructive'
  };

  const dotColor = {
    low: 'bg-green-500',
    medium: 'bg-amber-500',
    high: 'bg-destructive'
  };

  const priorityWeight: Record<Priority, number> = {
    high: 3,
    medium: 2,
    low: 1
  };
  
  const filteredTasks = tasks
    .filter(t => isSameDay(new Date(t.date), selectedDate))
    .sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority]);

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTaskTitle,
      priority: selectedPriority,
      completed: false,
      date: selectedDate,
      details: ""
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle("");
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const openEditDetails = (task: Task) => {
    setEditingTask(task);
    setDetailsText(task.details || "");
  };

  const saveDetails = () => {
    if (!editingTask) return;
    setTasks(tasks.map(t => t.id === editingTask.id ? { ...t, details: detailsText } : t));
    setEditingTask(null);
  };

  const getStats = () => {
    const daily = filteredTasks;
    const high = daily.filter(t => t.priority === 'high');
    const medium = daily.filter(t => t.priority === 'medium');
    const low = daily.filter(t => t.priority === 'low');
    
    return {
      high: { done: high.filter(t => t.completed).length, total: high.length },
      medium: { done: medium.filter(t => t.completed).length, total: medium.length },
      low: { done: low.filter(t => t.completed).length, total: low.length },
      total: { done: daily.filter(t => t.completed).length, total: daily.length }
    };
  };

  const stats = getStats();

  return (
    <div className="space-y-4 pb-32 pt-4 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-4 pt-2">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full bg-muted/50 w-9 h-9">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold font-headline">Daily Tasks</h1>
      </div>

      {/* Simplified Date Shifter */}
      <div className="flex items-center justify-between bg-white p-3 rounded-2xl shadow-sm border border-muted/20">
        <Button variant="ghost" size="icon" onClick={() => setSelectedDate(addDays(selectedDate, -1))} className="rounded-full hover:bg-muted">
          <ChevronLeft className="w-5 h-5 text-primary" />
        </Button>
        
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest leading-none mb-1">Active Date</span>
          <span className="text-sm font-black text-foreground">
            {format(selectedDate, 'EEEE, MMMM do')}
          </span>
        </div>

        <Button variant="ghost" size="icon" onClick={() => setSelectedDate(addDays(selectedDate, 1))} className="rounded-full hover:bg-muted">
          <ChevronRight className="w-5 h-5 text-primary" />
        </Button>
      </div>

      <Card className="border-none shadow-md bg-white overflow-hidden">
        <CardContent className="p-0">
          <div className="p-6 space-y-6 border-b border-muted/10">
            <div className="space-y-1">
              <h2 className="text-lg font-black text-foreground uppercase tracking-tight">Daily objectives</h2>
              <p className="text-xs text-muted-foreground font-medium">Log tasks for {format(selectedDate, 'EEEE, MMM do')}</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                  NEW OBJECTIVE
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Plus className="w-4 h-4 text-primary/40 group-focus-within:text-primary transition-colors" />
                  </div>
                  <input 
                    type="text" 
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="What needs to be done?" 
                    className="w-full h-12 pl-10 pr-4 bg-muted/5 border border-muted-foreground/10 rounded-xl text-xs focus:ring-1 focus:ring-primary/20 transition-all font-bold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                  SET PRIORITY
                </label>
                <div className="grid grid-cols-3 gap-1 bg-muted/10 p-1 rounded-xl">
                  {(['low', 'medium', 'high'] as Priority[]).map((p) => (
                    <button
                      key={p}
                      onClick={() => setSelectedPriority(p)}
                      className={cn(
                        "py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                        selectedPriority === p 
                          ? "bg-white text-primary shadow-sm scale-[1.02] border border-primary/5" 
                          : "text-muted-foreground hover:text-foreground/70"
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <Button 
                onClick={addTask}
                className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
              >
                Add to List
              </Button>
            </div>
          </div>

          <div className="h-[216px] overflow-y-auto swipe-container scroll-smooth">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12 flex flex-col items-center gap-3 opacity-20">
                <div className="w-12 h-12 rounded-full border-2 border-dashed border-foreground/30 flex items-center justify-center">
                  <ClipboardList className="w-6 h-6" />
                </div>
                <p className="text-[9px] font-black uppercase tracking-widest">Awaiting tasks...</p>
              </div>
            ) : (
              <div className="divide-y divide-muted/10">
                {filteredTasks.map((task) => (
                  <div 
                    key={task.id} 
                    className="relative flex items-center justify-between group hover:bg-muted/5 transition-colors p-4 pl-6"
                  >
                    <div className={cn("absolute left-0 top-0 bottom-0 w-1.5", priorityBgColor[task.priority])} />
                    
                    <div className="flex items-center gap-4 min-w-0">
                      <Checkbox 
                        checked={task.completed} 
                        onCheckedChange={() => toggleTask(task.id)}
                        className="h-5 w-5 rounded-md border-2 border-primary/20 data-[state=checked]:bg-primary"
                      />
                      <div className="space-y-0.5 min-w-0">
                        <p className={cn(
                          "text-xs font-bold transition-all truncate",
                          task.completed ? "text-muted-foreground line-through opacity-50" : "text-foreground"
                        )}>
                          {task.title}
                        </p>
                        {task.details && (
                          <p className="text-[10px] text-muted-foreground truncate max-w-[200px] italic font-medium">
                            {task.details}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground/40 hover:text-foreground">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl">
                        <DropdownMenuItem onClick={() => openEditDetails(task)} className="text-xs font-bold gap-2">
                          Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => deleteTask(task.id)} className="text-xs font-bold gap-2 text-destructive">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-lg bg-white border border-muted/10">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3 border-b border-muted/20 pb-2">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <AlertCircle className="w-3 h-3" /> Daily Summary
            </h4>
          </div>
          <div className="space-y-3 px-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn("w-2.5 h-2.5 rounded-full", dotColor.high)} />
                <span className="text-sm font-medium text-foreground/70">High Priority Task</span>
              </div>
              <span className="text-xs font-black text-muted-foreground">{stats.high.done}/{stats.high.total}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn("w-2.5 h-2.5 rounded-full", dotColor.medium)} />
                <span className="text-sm font-medium text-foreground/70">Medium Priority Task</span>
              </div>
              <span className="text-xs font-black text-muted-foreground">{stats.medium.done}/{stats.medium.total}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn("w-2.5 h-2.5 rounded-full", dotColor.low)} />
                <span className="text-sm font-medium text-foreground/70">Low Priority Task</span>
              </div>
              <span className="text-xs font-black text-muted-foreground">{stats.low.done}/{stats.low.total}</span>
            </div>
            <div className="pt-3 mt-3 border-t border-muted/20 flex items-center justify-between">
              <span className="text-[11px] font-black text-foreground uppercase tracking-widest">Total Tasks</span>
              <span className="text-[11px] font-black text-primary uppercase">{stats.total.total}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!editingTask} onOpenChange={(open) => !open && setEditingTask(null)}>
        <DialogContent className="rounded-2xl w-[90%] max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-[11px] font-black uppercase tracking-widest text-primary">
              Edit Task Details
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                OBJECTIVE
              </label>
              <div className="p-3 rounded-xl border border-muted/20 bg-muted/5">
                <p className="text-sm font-bold text-foreground">{editingTask?.title}</p>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                ADDITIONAL NOTES
              </label>
              <Textarea 
                value={detailsText}
                onChange={(e) => setDetailsText(e.target.value)}
                placeholder="Add more information about this task..."
                className="min-h-[120px] rounded-xl border border-muted-foreground/10 text-xs font-medium focus:ring-primary/20 bg-muted/5"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={saveDetails} className="w-full h-12 rounded-xl bg-primary font-black uppercase text-[11px] tracking-widest gap-2 shadow-lg shadow-primary/20">
              <Save className="w-4 h-4" /> Save Details
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
