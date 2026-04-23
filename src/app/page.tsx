'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Dumbbell,
  LineChart as ChartIcon,
  Bell,
  User,
  Crown,
  Loader2,
  Trophy,
  Target,
  Flame,
  HeartPulse,
  CheckCircle2,
  Sparkles,
  Droplets,
  Zap,
  Footprints,
} from 'lucide-react';
import { DashboardView } from '@/components/dashboard-view';
import { NutritionView } from '@/components/nutrition-view';
import { WorkoutView } from '@/components/workout-view';
import { ProgressView } from '@/components/progress-view';
import { HydrationView } from '@/components/hydration-view';
import { StepsView } from '@/components/steps-view';
import { TasksView, type Task } from '@/components/tasks-view';
import { CalculatorsView } from '@/components/calculators-view';
import { GoalSettingView } from '@/components/goal-setting-view';
import { ProfileView } from '@/components/profile-view';
import { GuideView } from '@/components/guide-view';
import { OnboardingView } from '@/components/onboarding-view';
import { AuthView } from '@/components/auth-view';
import { SplashScreen } from '@/components/splash-screen';
import {
  NotificationsView,
  type Notification,
} from '@/components/notifications-view';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { format, isYesterday, isSameDay, subHours, subDays } from 'date-fns';
import {
  useAuth,
  useUser,
  useFirestore,
  setDocumentNonBlocking,
} from '@/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function PulseFlowApp() {
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeCalculator, setActiveCalculator] =
    useState<'bmr' | '1rm' | 'bodyfat'>('bmr');
  const [tasks, setTask] = useState<Task[]>([]);
  const [hydrationAmount, setHydrationAmount] = useState(0);
  const [hydrationHistory, setHydrationHistory] = useState<
    Record<string, number>
  >({});
  const [stepsCount, setStepsCount] = useState(0);
  const [stepsHistory, setStepsHistory] = useState<Record<string, number>>({});
  const [goalData, setGoalData] = useState<any>(null);
  const [weightHistory, setWeightHistory] = useState<any[]>([]);
  const [loggedMeals, setLoggedMeals] = useState<any[]>([]);
  const [streakData, setStreakData] = useState({
    count: 0,
    history: [] as string[],
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [sentMilestones, setSentMilestones] = useState<
    Record<string, string[]>
  >({});
  const [credits, setCredits] = useState(20);
  const [foodCache, setFoodCache] = useState<Record<string, any>>({});
  
  // Steps State
  const [stepsCount, setStepsCount] = useState(0);
  const [stepsHistory, setStepsHistory] = useState<any[]>([]);

  // Workout State (Lifted from WorkoutView)
  const [workoutSplit, setWorkoutSplit] = useState<Record<string, any>>({});
  const [extraMoves, setExtraMoves] = useState<any[]>([]);
  const [loggedSets, setLoggedSets] = useState<Record<string, any[]>>({});
  const [workoutHistory, setWorkoutHistory] = useState<Record<string, any>>({});

  const [isLoaded, setIsLoaded] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isOnboardingChecked, setIsOnboardingChecked] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  // Helper to get UID namespaced keys
  const getKeys = useCallback(
    (uid: string) => ({
      tasks: `arcex_${uid}_tasks`,
      hydration: `arcex_${uid}_hydration`,
      hydrationHistory: `arcex_${uid}_hydration_history`,
      steps: `arcex_${uid}_steps`,
      stepsHistory: `arcex_${uid}_steps_history`,
      goal: `arcex_${uid}_goal_data`,
      weight: `arcex_${uid}_weight_history`,
      meals: `arcex_${uid}_today_logged_meals`,
      streak: `arcex_${uid}_streak_v3`,
      notifications: `arcex_${uid}_notifications_data_v2`,
      milestones: `arcex_${uid}_sent_milestones`,
      lastReset: `arcex_${uid}_last_reset_date`,
      onboarding: `arcex_${uid}_onboarding_complete`,
      userProfile: `arcex_${uid}_user_profile`,
      credits: `arcex_${uid}_meal_credits_v2`,
      foodCache: `arcex_${uid}_food_cache`,
      workoutSplit: `arcex_${uid}_workout_split`,
      extraMoves: `arcex_${uid}_extra_moves`,
      workoutLogs: `arcex_${uid}_workout_logs`,
      workoutHistory: `arcex_${uid}_workout_history`,
    }),
    []
  );

  const triggerHaptic = async (
    type: 'light' | 'medium' | 'success' | 'warning' = 'light'
  ) => {
    const enabled = localStorage.getItem('pulseflow_haptics') !== 'false';
    if (!enabled) return;

    try {
      const { Haptics, ImpactStyle } = await import('@capacitor/haptics');
      switch (type) {
        case 'light':
          await Haptics.impact({ style: ImpactStyle.Light });
          break;
        case 'medium':
          await Haptics.impact({ style: ImpactStyle.Medium });
          break;
        case 'success':
          await Haptics.notification({ type: (await import('@capacitor/haptics')).NotificationType.Success });
          break;
        case 'warning':
          await Haptics.notification({ type: (await import('@capacitor/haptics')).NotificationType.Warning });
          break;
      }
    } catch (e) {
      if (typeof window !== 'undefined' && window.navigator.vibrate) {
        window.navigator.vibrate(type === 'light' ? 15 : 30);
      }
    }
  };

  // Choice B Sync Logic
  const syncDataToFirestore = async () => {
    if (!user || !firestore || !isLoaded) return;
    setIsSyncing(true);
    try {
      const todayStr = format(new Date(), 'yyyy-MM-dd');
      const keys = getKeys(user.uid);

      // 1. Sync Daily Metrics & History
      const metricsRef = doc(
        firestore,
        `userProfiles/${user.uid}/dailyMetrics`,
        todayStr
      );
      await setDoc(
        metricsRef,
        {
          userId: user.uid,
          date: todayStr,
          caloriesConsumed: loggedMeals.reduce(
            (acc, m) => acc + (m.calories || 0),
            0
          ),
          hydrationMl: hydrationAmount,
          stepsCount: stepsCount,
          meals: loggedMeals,
          workouts: loggedSets,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      // 2. Sync Goal & Weight History
      if (goalData) {
        const goalRef = doc(
          firestore,
          `userProfiles/${user.uid}/goals`,
          'primary_goal'
        );
        await setDoc(
          goalRef,
          {
            ...goalData,
            weightHistory,
            userId: user.uid,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      }

      // 3. Sync Workout Split & History
      const workoutRef = doc(firestore, `userProfiles/${user.uid}/workouts`, 'split_and_history');
      await setDoc(workoutRef, {
        split: workoutSplit,
        history: workoutHistory,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      // 4. Sync Other Persistent Data
      const miscRef = doc(firestore, `userProfiles/${user.uid}/settings`, 'misc');
      await setDoc(miscRef, {
        streak: streakData,
        milestones: sentMilestones,
        notifications: notifications.slice(0, 50),
        credits: credits,
        stepsHistory: stepsHistory,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      // 5. Sync Profile
      const userRef = doc(firestore, 'userProfiles', user.uid);
      
      // Get subscription data from local storage to sync
      const savedProfile = localStorage.getItem(keys.userProfile);
      let subscriptionData = null;
      if (savedProfile) {
        try {
          const parsed = JSON.parse(savedProfile);
          subscriptionData = parsed.subscription || null;
        } catch(e) {}
      }

      await setDoc(
        userRef,
        { 
          onboardingComplete: true, 
          updatedAt: new Date().toISOString(),
          subscription: subscriptionData
        },
        { merge: true }
      );

      console.log('Firestore Sync Complete');
    } catch (e) {
      console.error('Sync failed', e);
    } finally {
      setIsSyncing(false);
    }
  };

  // BACKGROUND SYNC LISTENERS
  useEffect(() => {
    if (!user || !isLoaded) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        syncDataToFirestore();
      }
    };

    const handleBeforeUnload = () => {
      syncDataToFirestore();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [user, isLoaded, loggedMeals, hydrationAmount, stepsCount, goalData, workoutSplit, loggedSets]);

  // Splash Screen Timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      // Only release splash if auth loading is done
      if (!isUserLoading) setShowSplash(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, [isUserLoading]);

  // Ensure splash stays until user state is certain
  useEffect(() => {
    if (!isUserLoading && isLoaded) {
      const timer = setTimeout(() => setShowSplash(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isUserLoading, isLoaded]);

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
      mainRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
    window.scrollTo(0, 0);
  }, [activeTab]);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.tab) {
        setActiveTab(event.state.tab);
      } else {
        setActiveTab('dashboard');
      }
    };

    window.addEventListener('popstate', handlePopState);
    if (window.history.state === null) {
      window.history.replaceState({ tab: 'dashboard' }, '');
    }
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (tab: string) => {
    if (tab !== activeTab) {
      triggerHaptic('light');
      window.history.pushState({ tab }, '');
      setActiveTab(tab);
    }
  };

  const addNotification = (
    title: string,
    description: string,
    type: Notification['type'],
    subtype?: Notification['subtype'],
    icon: string = 'bell',
    gradient: string = 'linear-gradient(135deg, #4ade80 0%, #3b82f6 100%)'
  ) => {
    const enabled = localStorage.getItem('pulseflow_notifications') !== 'false';
    if (!enabled) return;

    const newNotif: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      description,
      time: 'Just now',
      timestamp: Date.now(),
      type,
      subtype,
      isRead: false,
      icon,
      gradient,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // CORE DATA LOADING WITH UID NAMESPACING
  useEffect(() => {
    if (!user) {
      setIsLoaded(false);
      return;
    }

    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const keys = getKeys(user.uid);

    const savedDarkMode = localStorage.getItem('pulseflow_dark_mode');
    if (savedDarkMode === 'true') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // CLOUD ONBOARDING CHECK
    const checkOnboarding = async () => {
      if (!firestore) {
        setIsOnboardingChecked(true);
        return;
      }

      // For anonymous users, rely solely on localStorage.
      if (user.isAnonymous) {
        const localOnboardingComplete =
          localStorage.getItem(keys.onboarding) === 'true';
        setShowOnboarding(!localOnboardingComplete);
        setIsOnboardingChecked(true);
        return;
      }

      // For authenticated users, Firestore is the source of truth.
      const userRef = doc(firestore, 'userProfiles', user.uid);
      try {
        const userSnap = await getDoc(userRef);
        if (userSnap.exists() && userSnap.data().onboardingComplete) {
          setShowOnboarding(false);
          
          // Always try to restore data if local storage is missing key items
          if (!localStorage.getItem(keys.goal) || !localStorage.getItem(keys.workoutSplit)) {
            try {
              const profileData = userSnap.data();
              
              // 1. Restore Profile & Subscription
              if (profileData) {
                const existingProfile = JSON.parse(localStorage.getItem(keys.userProfile) || '{}');
                const mergedProfile = { ...existingProfile, ...profileData };
                localStorage.setItem(keys.userProfile, JSON.stringify(mergedProfile));
              }

              // 2. Restore Goal
              const goalRef = doc(firestore, `userProfiles/${user.uid}/goals`, 'primary_goal');
              const goalSnap = await getDoc(goalRef);
              if (goalSnap.exists()) {
                const gd = goalSnap.data();
                setGoalData(gd);
                if (gd.weightHistory) {
                  setWeightHistory(gd.weightHistory);
                  localStorage.setItem(keys.weight, JSON.stringify(gd.weightHistory));
                }
                localStorage.setItem(keys.goal, JSON.stringify(gd));
              }
              
              // 3. Restore Workouts
              const workoutRef = doc(firestore, `userProfiles/${user.uid}/workouts`, 'split_and_history');
              const workoutSnap = await getDoc(workoutRef);
              if (workoutSnap.exists()) {
                const wd = workoutSnap.data();
                if (wd.split) {
                   setWorkoutSplit(wd.split);
                   localStorage.setItem(keys.workoutSplit, JSON.stringify(wd.split));
                }
                if (wd.history) {
                   setWorkoutHistory(wd.history);
                   localStorage.setItem(keys.workoutHistory, JSON.stringify(wd.history));
                }
              }

              // 4. Restore Misc (Streak, Credits, etc.)
              const miscRef = doc(firestore, `userProfiles/${user.uid}/settings`, 'misc');
              const miscSnap = await getDoc(miscRef);
              if (miscSnap.exists()) {
                const md = miscSnap.data();
                if (md.streak) {
                  setStreakData(md.streak);
                  localStorage.setItem(keys.streak, JSON.stringify({...md.streak, lastDate: format(new Date(), 'yyyy-MM-dd')}));
                }
                if (md.credits !== undefined) {
                  setCredits(md.credits);
                  localStorage.setItem(keys.credits, JSON.stringify({ credits: md.credits, date: format(new Date(), 'yyyy-MM-dd') }));
                }
                if (md.notifications) {
                  setNotifications(md.notifications);
                  localStorage.setItem(keys.notifications, JSON.stringify(md.notifications));
                }
                if (md.milestones) {
                  setSentMilestones(md.milestones);
                  localStorage.setItem(keys.milestones, JSON.stringify({ date: format(new Date(), 'yyyy-MM-dd'), milestones: md.milestones }));
                }
                if (md.stepsHistory) {
                  setStepsHistory(md.stepsHistory);
                  localStorage.setItem(keys.stepsHistory, JSON.stringify(md.stepsHistory));
                }
              }

              // 5. Restore Today's Metrics
              const metricsRef = doc(firestore, `userProfiles/${user.uid}/dailyMetrics`, format(new Date(), 'yyyy-MM-dd'));
              const metricsSnap = await getDoc(metricsRef);
              if (metricsSnap.exists()) {
                const md = metricsSnap.data();
                if (md.stepsCount !== undefined) {
                  setStepsCount(md.stepsCount);
                  localStorage.setItem(keys.steps, md.stepsCount.toString());
                }
                if (md.hydrationMl !== undefined) {
                  setHydrationAmount(md.hydrationMl);
                  localStorage.setItem(keys.hydration, md.hydrationMl.toString());
                }
                if (md.meals !== undefined) {
                  setLoggedMeals(md.meals);
                  localStorage.setItem(keys.meals, JSON.stringify(md.meals));
                }
                if (md.workouts !== undefined) {
                  setLoggedSets(md.workouts);
                  localStorage.setItem(keys.workoutLogs, JSON.stringify({ date: format(new Date(), 'yyyy-MM-dd'), data: md.workouts }));
                }
              }
            } catch(syncErr) {
              console.error('Failed to sync past data', syncErr);
            }
          }
        } else {
          // If doc doesn't exist OR onboarding isn't marked complete, show onboarding.
          // OnboardingView will create/update the document upon completion.
          setShowOnboarding(true);
        }
      } catch (e) {
        console.error('Error fetching user profile for onboarding check:', e);
        // As a fallback, if there's an error, don't block the user.
        const localOnboardingComplete =
          localStorage.getItem(keys.onboarding) === 'true';
        setShowOnboarding(!localOnboardingComplete);
      } finally {
        setIsOnboardingChecked(true);
      }
    };
    checkOnboarding();

    const lastResetDate = localStorage.getItem(keys.lastReset);
    const isNewDay = lastResetDate !== todayStr;

    const savedTasks = localStorage.getItem(keys.tasks);
    const savedHydration = localStorage.getItem(keys.hydration);
    const savedHydrationHistory = localStorage.getItem(keys.hydrationHistory);
    const savedSteps = localStorage.getItem(keys.steps);
    const savedStepsHistory = localStorage.getItem(keys.stepsHistory);
    const savedGoal = localStorage.getItem(keys.goal);
    const savedWeight = localStorage.getItem(keys.weight);
    const savedMeals = localStorage.getItem(keys.meals);
    const savedStreak = localStorage.getItem(keys.streak);
    const savedNotifications = localStorage.getItem(keys.notifications);
    const savedMilestones = localStorage.getItem(keys.milestones);
    const savedCreditsData = localStorage.getItem(keys.credits);

    if (savedTasks) {
      try {
        setTask(JSON.parse(savedTasks));
      } catch (e) {}
    }

    if (isNewDay && lastResetDate) {
      // ARCHIVE BEFORE RESET
      const oldHydrationHistory = JSON.parse(savedHydrationHistory || '{}');
      oldHydrationHistory[lastResetDate] = Number(savedHydration || 0);
      localStorage.setItem(keys.hydrationHistory, JSON.stringify(oldHydrationHistory));
      setHydrationHistory(oldHydrationHistory);

      const oldStepsHistory = JSON.parse(savedStepsHistory || '{}');
      oldStepsHistory[lastResetDate] = Number(savedSteps || 0);
      localStorage.setItem(keys.stepsHistory, JSON.stringify(oldStepsHistory));
      setStepsHistory(oldStepsHistory);

      // Archive Workouts
      const oldWorkoutHistory = JSON.parse(localStorage.getItem(keys.workoutHistory) || '{}');
      const todayWorkoutLogs = JSON.parse(localStorage.getItem(keys.workoutLogs) || '{"data":{}}');
      oldWorkoutHistory[lastResetDate] = todayWorkoutLogs.data;
      localStorage.setItem(keys.workoutHistory, JSON.stringify(oldWorkoutHistory));
      setWorkoutHistory(oldWorkoutHistory);
      
      // Daily state reset logic (Step removal)
      setHydrationAmount(0);
      setLoggedMeals([]);
      setTask((prev) => prev.map((t) => ({ ...t, completed: false })));

      localStorage.setItem(keys.hydration, '0');
      localStorage.setItem(keys.meals, '[]');
      setLoggedSets({});
      localStorage.setItem(keys.workoutLogs, JSON.stringify({ date: todayStr, data: {} }));
    } else {
      if (savedHydration) setHydrationAmount(Number(savedHydration));
      if (savedSteps) setStepsCount(Number(savedSteps));
      if (savedMeals) {
        try {
          setLoggedMeals(JSON.parse(savedMeals));
        } catch (e) {}
      }
      
      const savedWorkoutLogs = localStorage.getItem(keys.workoutLogs);
      if (savedWorkoutLogs) {
        try {
          const parsed = JSON.parse(savedWorkoutLogs);
          if (parsed.date === todayStr) setLoggedSets(parsed.data);
          else setLoggedSets({});
        } catch (e) {}
      }
    }

    // Always Load Persistent Data (Never Wiped)
    const savedFoodCache = localStorage.getItem(keys.foodCache);
    if (savedFoodCache) {
      try { setFoodCache(JSON.parse(savedFoodCache)); } catch (e) {}
    }

    const savedWorkoutSplit = localStorage.getItem(keys.workoutSplit);
    if (savedWorkoutSplit) {
      try { setWorkoutSplit(JSON.parse(savedWorkoutSplit)); } catch (e) {}
    }

    const savedExtraMoves = localStorage.getItem(keys.extraMoves);
    if (savedExtraMoves) {
      try {
        const parsed = JSON.parse(savedExtraMoves);
        if (parsed.date === todayStr) setExtraMoves(parsed.moves);
      } catch (e) {}
    }

    const savedWorkoutHistoryData = localStorage.getItem(keys.workoutHistory);
    if (savedWorkoutHistoryData) {
      try { setWorkoutHistory(JSON.parse(savedWorkoutHistoryData)); } catch (e) {}
    }
    
    if (savedCreditsData) {
      try {
        const data = JSON.parse(savedCreditsData);
        if (data.date === todayStr) {
          setCredits(data.credits);
        } else {
          setCredits(20); // Reset on new day
        }
      } catch (e) {
        setCredits(20); // Corrupted data, reset
      }
    } else {
      setCredits(20);
    }

    if (savedHydrationHistory) {
      try {
        setHydrationHistory(JSON.parse(savedHydrationHistory));
      } catch (e) {}
    }
    if (savedStepsHistory) {
      try {
        setStepsHistory(JSON.parse(savedStepsHistory));
      } catch (e) {}
    }
    if (savedGoal) {
      try {
        setGoalData(JSON.parse(savedGoal));
      } catch (e) {}
    }
    if (savedWeight) {
      try {
        setWeightHistory(JSON.parse(savedWeight));
      } catch (e) {}
    }

    if (savedNotifications) {
      try {
        setNotifications(JSON.parse(savedNotifications));
      } catch (e) {}
    }

    if (savedMilestones) {
      try {
        const parsed = JSON.parse(savedMilestones);
        if (parsed.date === todayStr)
          setSentMilestones(parsed.milestones || {});
        else setSentMilestones({});
      } catch (e) {}
    }

    if (isNewDay) {
      setLoggedMeals([]);
      localStorage.setItem(keys.meals, '[]');
    } else if (savedMeals) {
      try {
        setLoggedMeals(JSON.parse(savedMeals));
      } catch (e) {}
    }

    localStorage.setItem(keys.lastReset, todayStr);

    if (savedStreak) {
      try {
        const data = JSON.parse(savedStreak);
        const lastOpen = data.lastDate;
        if (lastOpen === todayStr) {
          setStreakData({ count: data.count, history: data.history });
        } else {
          const lastDateObj = new Date(lastOpen);
          let newCount = 1;
          if (isYesterday(lastDateObj)) newCount = data.count + 1;
          const newHistory = [...data.history, todayStr].slice(-30);
          const newData = {
            count: newCount,
            history: newHistory,
            lastDate: todayStr,
          };
          setStreakData({ count: newCount, history: newHistory });
          localStorage.setItem(keys.streak, JSON.stringify(newData));
        }
      } catch (e) {}
    } else {
      const newData = { count: 1, history: [todayStr], lastDate: todayStr };
      setStreakData({ count: 1, history: [todayStr] });
      localStorage.setItem(keys.streak, JSON.stringify(newData));
    }
    setIsLoaded(true);
  }, [user, firestore, getKeys]);

  const handleOnboardingComplete = () => {
    if (!user) return;
    const keys = getKeys(user.uid);
    localStorage.setItem(keys.onboarding, 'true');
    const data = JSON.parse(localStorage.getItem(keys.goal) || '{}');
    setGoalData(data);
    setShowOnboarding(false);
    syncDataToFirestore();
  };

  // Persistent storage sync WITH UID
  useEffect(() => {
    if (isLoaded && user) {
      const keys = getKeys(user.uid);
      localStorage.setItem(keys.tasks, JSON.stringify(tasks));
    }
  }, [tasks, isLoaded, user, getKeys]);

  useEffect(() => {
    if (isLoaded && user) {
      const keys = getKeys(user.uid);
      localStorage.setItem(keys.hydration, hydrationAmount.toString());
    }
  }, [hydrationAmount, isLoaded, user, getKeys]);

  useEffect(() => {
    if (isLoaded && user) {
      const keys = getKeys(user.uid);
      localStorage.setItem(keys.steps, stepsCount.toString());
    }
  }, [stepsCount, isLoaded, user, getKeys]);

  useEffect(() => {
    if (isLoaded && user) {
      const keys = getKeys(user.uid);
      localStorage.setItem(keys.weight, JSON.stringify(weightHistory));
    }
  }, [weightHistory, isLoaded, user, getKeys]);

  useEffect(() => {
    if (isLoaded && user) {
      const keys = getKeys(user.uid);
      localStorage.setItem(keys.meals, JSON.stringify(loggedMeals));
    }
  }, [loggedMeals, isLoaded, user, getKeys]);

  useEffect(() => {
    if (isLoaded && user) {
      const keys = getKeys(user.uid);
      localStorage.setItem(keys.notifications, JSON.stringify(notifications));
    }
  }, [notifications, isLoaded, user, getKeys]);

  // CONTINUOUS WORKOUT PERSISTENCE
  useEffect(() => {
    if (isLoaded && user) {
      const keys = getKeys(user.uid);
      localStorage.setItem(keys.workoutSplit, JSON.stringify(workoutSplit));
    }
  }, [workoutSplit, isLoaded, user, getKeys]);

  useEffect(() => {
    if (isLoaded && user) {
      const todayStr = format(new Date(), 'yyyy-MM-dd');
      const keys = getKeys(user.uid);
      localStorage.setItem(keys.extraMoves, JSON.stringify({ date: todayStr, moves: extraMoves }));
    }
  }, [extraMoves, isLoaded, user, getKeys]);

  useEffect(() => {
    if (isLoaded && user) {
      const todayStr = format(new Date(), 'yyyy-MM-dd');
      const keys = getKeys(user.uid);
      localStorage.setItem(keys.workoutLogs, JSON.stringify({ date: todayStr, data: loggedSets }));
      
      const historyObj = { ...workoutHistory };
      historyObj[todayStr] = loggedSets;
      localStorage.setItem(keys.workoutHistory, JSON.stringify(historyObj));
    }
  }, [loggedSets, isLoaded, user, getKeys]);

  useEffect(() => {
    if (isLoaded && user) {
      const keys = getKeys(user.uid);
      localStorage.setItem(keys.foodCache, JSON.stringify(foodCache));
    }
  }, [foodCache, isLoaded, user, getKeys]);

  useEffect(() => {
    if (isLoaded && user) {
      const todayStr = format(new Date(), 'yyyy-MM-dd');
      const keys = getKeys(user.uid);
      localStorage.setItem(
        keys.milestones,
        JSON.stringify({ date: todayStr, milestones: sentMilestones })
      );
    }
  }, [sentMilestones, isLoaded, user, getKeys]);
  
  useEffect(() => {
    if (isLoaded && user) {
        const todayStr = format(new Date(), 'yyyy-MM-dd');
        const keys = getKeys(user.uid);
        localStorage.setItem(keys.credits, JSON.stringify({ credits: credits, date: todayStr }));
    }
  }, [credits, isLoaded, user, getKeys]);

  // ACHIEVEMENT MONITORING ENGINE
  useEffect(() => {
    if (!isLoaded || !goalData) return;

    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const checkMilestone = (
      key: string,
      current: number,
      target: number,
      label: string,
      icon: string,
      grad: string
    ) => {
      const milestones = sentMilestones[key] || [];
      const pct = (current / target) * 100;

      if (pct >= 50 && !milestones.includes('50')) {
        addNotification(
          `50% ${label} Achieved`,
          `You've reached the halfway mark for your daily ${label.toLowerCase()} target. Keep going!`,
          'goal',
          '50-percent',
          icon,
          grad
        );
        setSentMilestones((prev) => ({
          ...prev,
          [key]: [...(prev[key] || []), '50'],
        }));
      }

      if (pct >= 100 && !milestones.includes('100')) {
        addNotification(
          `100% ${label} Achieved`,
          `Outstanding! You have successfully reached your full daily ${label.toLowerCase()} goal.`,
          'goal',
          '100-percent',
          icon,
          grad
        );
        setSentMilestones((prev) => ({
          ...prev,
          [key]: [...(prev[key] || []), '100'],
        }));
      }
    };

    const curCal = loggedMeals.reduce((acc, m) => acc + (m.calories || 0), 0);
    const tarCal = goalData.finalCalories || 2200;
    checkMilestone(
      'calories',
      curCal,
      tarCal,
      'Calories',
      'flame',
      'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)'
    );

    const totals = loggedMeals.reduce(
      (acc, m) => ({
        protein: acc.protein + (m.protein || 0),
        carbs: acc.carbs + (m.carbs || 0),
        fat: acc.fat + (m.fat || 0),
        fiber: acc.fiber + (m.fiber || 0),
        vitA: acc.vitA + (m.vitaminA || 0),
        omega3: acc.omega3 + (m.omega3 || 0),
        vitC: acc.vitC + (m.vitaminC || 0),
        zinc: acc.zinc + (m.zinc || 0),
        selenium: acc.selenium + (m.selenium || 0),
        mag: acc.mag + (m.magnesium || 0),
        vitD: acc.vitD + (m.vitaminD || 0),
        potassium: acc.potassium + (m.potassium || 0),
        iron: acc.iron + (m.iron || 0),
        calcium: acc.calcium + (m.calcium || 0),
      }),
      {
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
        vitA: 0,
        omega3: 0,
        vitC: 0,
        zinc: 0,
        selenium: 0,
        mag: 0,
        vitD: 0,
        potassium: 0,
        iron: 0,
        calcium: 0,
      }
    );

    checkMilestone(
      'protein',
      totals.protein,
      goalData.protein || 150,
      'Protein',
      'target',
      'linear-gradient(135deg, #10b981 0%, #059669 100%)'
    );
    checkMilestone(
      'carbs',
      totals.carbs,
      goalData.carbs || 250,
      'Carbohydrates',
      'zap',
      'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
    );
    checkMilestone(
      'fats',
      totals.fat,
      goalData.fats || 70,
      'Fats',
      'flame',
      'linear-gradient(135deg, #f97316 0%, #ea580c 100%)'
    );
    checkMilestone(
      'fiber',
      totals.fiber,
      goalData.fiber || 30,
      'Fiber',
      'zap',
      'linear-gradient(135deg, #10b981 0%, #059669 100%)'
    );

    const userGender = goalData?.gender || 'male';
    const userAge = parseInt(goalData?.age) || 25;

    const microTargets = {
      vitA: userGender === 'male' ? 900 : 700,
      omega3: userGender === 'male' ? 1.6 : 1.1,
      vitC: userGender === 'male' ? 90 : 75,
      zinc: userGender === 'male' ? 11 : 8,
      selenium: 55,
      mag: userGender === 'male' ? 420 : 320,
      vitD: userAge > 70 ? 20 : 15,
      potassium: userGender === 'male' ? 3400 : 2600,
      iron: userGender === 'male' ? 8 : userAge < 50 ? 18 : 8,
      calcium: userAge > 50 && userGender === 'female' ? 1200 : 1000,
    };

    checkMilestone(
      'vitA',
      totals.vitA,
      microTargets.vitA,
      'Vitamin A',
      'sparkles',
      'linear-gradient(135deg, #f97316 0%, #fb923c 100%)'
    );
    checkMilestone(
      'omega3',
      totals.omega3,
      microTargets.omega3,
      'Omega-3',
      'droplets',
      'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)'
    );
    checkMilestone(
      'vitC',
      totals.vitC,
      microTargets.vitC,
      'Vitamin C',
      'zap',
      'linear-gradient(135deg, #eab308 0%, #facc15 100%)'
    );
    checkMilestone(
      'zinc',
      totals.zinc,
      microTargets.zinc,
      'Zinc',
      'shield',
      'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)'
    );
    checkMilestone(
      'selenium',
      totals.selenium,
      microTargets.selenium,
      'Selenium',
      'star',
      'linear-gradient(135deg, #f43f5e 0%, #fb7185 100%)'
    );
    checkMilestone(
      'magnesium',
      totals.mag,
      microTargets.mag,
      'Magnesium',
      'heart-pulse',
      'linear-gradient(135deg, #a855f7 0%, #c084fc 100%)'
    );
    checkMilestone(
      'vitD',
      totals.vitD,
      microTargets.vitD,
      'Vitamin D',
      'sun',
      'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)'
    );
    checkMilestone(
      'potassium',
      totals.potassium,
      microTargets.potassium,
      'Potassium',
      'activity',
      'linear-gradient(135deg, #10b981 0%, #34d399 100%)'
    );
    checkMilestone(
      'iron',
      totals.iron,
      microTargets.iron,
      'Iron',
      'shield',
      'linear-gradient(135deg, #ef4444 0%, #f87171 100%)'
    );
    checkMilestone(
      'calcium',
      totals.calcium,
      microTargets.calcium,
      'Calcium',
      'activity',
      'linear-gradient(135deg, #64748b 0%, #94a3b8 100%)'
    );
  }, [loggedMeals, hydrationAmount, stepsCount, goalData, isLoaded, sentMilestones]);

  const updateHydration = (amount: number) => {
    triggerHaptic('light');
    setHydrationAmount((prev) => Math.min(50000, Math.max(0, prev + amount)));
  };

  const updateSteps = (amount: number) => {
    triggerHaptic('light');
    setStepsCount((prev) => {
      const newVal = Math.max(0, prev + amount);
      if (user) {
         localStorage.setItem(`arcex_${user.uid}_steps`, newVal.toString());
      }
      return newVal;
    });
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const renderContent = () => {
    if (showSplash || isUserLoading || (user && !isOnboardingChecked)) return <SplashScreen />;
    if (!user) return <AuthView />;
    if (showOnboarding)
      return <OnboardingView onComplete={handleOnboardingComplete} />;

    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView
            tasks={tasks}
            onToggleTask={(id) => {
              triggerHaptic('light');
              setTask((prev) =>
                prev.map((t) =>
                  t.id === id ? { ...t, completed: !t.completed } : t
                )
              );
            }}
            hydrationAmount={hydrationAmount}
            onUpdateHydration={updateHydration}
            stepsCount={stepsCount}
            onUpdateSteps={updateSteps}
            goalData={goalData}
            weightHistory={weightHistory}
            loggedMeals={loggedMeals}
            streakData={streakData}
            onViewHydration={() => navigateTo('hydration')}
            onViewSteps={() => navigateTo('steps')}
            onViewTasks={() => navigateTo('tasks')}
            onViewCalculators={(type) => {
              const map: any = {
                '1 Rep Max': '1rm',
                'Body Fat %': 'bodyfat',
                'BMR / TDEE': 'bmr',
              };
              setActiveCalculator(map[type] || 'bmr');
              navigateTo('calculators');
            }}
            onViewGoalSetting={() => navigateTo('goal-setting')}
            onViewProgress={() => navigateTo('rank')}
            onViewGoal={() => navigateTo('goal-setting')}
            onViewGuide={() => navigateTo('guide')}
            onViewNutritionSummary={() => navigateTo('nutrition-summary')}
          />
        );
      case 'nutrition':
      case 'nutrition-summary':
      case 'nutrition-micro':
      case 'nutrition-micro-detail':
      case 'nutrition-macro':
        const nutrView = activeTab.replace('nutrition-', '') as any;
        return (
          <NutritionView
            uid={user?.uid}
            loggedMeals={loggedMeals}
            setLoggedMeals={setLoggedMeals}
            credits={credits}
            setCredits={setCredits}
            foodCache={foodCache}
            setFoodCache={setFoodCache}
            activeView={nutrView === 'nutrition' ? 'log' : nutrView}
            onNavigate={navigateTo}
          />
        );
      case 'workout':
      case 'workout-library':
      case 'workout-split':
      case 'workout-history':
      case 'workout-pr':
      case 'workout-pr-detail':
        const workoutView = activeTab.replace('workout-', '') as any;
        return (
          <WorkoutView
            activeView={workoutView === 'workout' ? 'main' : workoutView}
            split={workoutSplit}
            setSplit={setWorkoutSplit}
            extraMoves={extraMoves}
            setExtraMoves={setExtraMoves}
            loggedSets={loggedSets}
            setLoggedSets={setLoggedSets}
            workoutHistory={workoutHistory}
            onNavigate={navigateTo}
            onAddNotification={addNotification}
          />
        );
      case 'rank':
        return (
          <ProgressView
            goalData={goalData}
            weightHistory={weightHistory}
            onLogWeight={(entry) =>
              setWeightHistory((prev) =>
                [...prev, entry].sort(
                  (a, b) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime()
                )
              )
            }
            onDeleteWeight={(date) =>
              setWeightHistory((prev) => prev.filter((e) => e.date !== date))
            }
          />
        );
      case 'hydration':
        return (
          <HydrationView
            currentMl={hydrationAmount}
            history={hydrationHistory}
            onUpdateMl={updateHydration}
            onBack={() => window.history.back()}
          />
        );
      case 'steps':
        return (
          <StepsView
            currentSteps={stepsCount}
            history={stepsHistory}
            onUpdateSteps={updateSteps}
            targetSteps={goalData?.stepsTarget || 10000}
            onBack={() => window.history.back()}
          />
        );
      case 'tasks':
        return (
          <TasksView
            tasks={tasks}
            setTasks={setTask}
            onBack={() => window.history.back()}
          />
        );
      case 'calculators':
        return (
          <CalculatorsView
            initialType={activeCalculator}
            onBack={() => window.history.back()}
          />
        );
      case 'goal-setting':
        return (
          <GoalSettingView
            onBack={() => window.history.back()}
            onGoalSaved={async () => {
              if (user) {
                const keys = getKeys(user.uid);
                const saved = localStorage.getItem(keys.goal);
                if (saved) {
                   const parsed = JSON.parse(saved);
                   setGoalData(parsed);
                   // Instant Sync to cloud
                   await syncDataToFirestore();
                }
              }
            }}
          />
        );
      case 'profile':
      case 'profile-personal-info':
      case 'profile-personal':
      case 'profile-subscription':
      case 'profile-legal':
      case 'profile-settings':
      case 'profile-reset':
      case 'profile-help':
      case 'profile-privacy':
      case 'profile-terms':
      case 'profile-medical':
        const profileSub =
          activeTab === 'profile'
            ? 'main'
            : (activeTab.replace('profile-', '') as any);
        return (
          <ProfileView
            activeView={profileSub === 'personal' ? 'personal-info' : profileSub}
            onBack={() => {
              triggerHaptic('light');
              if (activeTab === 'profile') setActiveTab('dashboard');
              else if (
                activeTab === 'profile-personal-info' ||
                activeTab === 'profile-subscription' ||
                activeTab === 'profile-legal' ||
                activeTab === 'profile-settings' ||
                activeTab === 'profile-reset' ||
                activeTab === 'profile-help'
              )
                setActiveTab('profile');
              else if (
                activeTab === 'profile-privacy' ||
                activeTab === 'profile-terms' ||
                activeTab === 'profile-medical'
              )
                setActiveTab('profile-legal');
              else setActiveTab('profile');
            }}
            onNavigate={navigateTo}
            onShowSplash={() => {
              setShowSplash(true);
              setTimeout(() => setShowSplash(false), 2500);
            }}
            onSyncAndLogout={async () => {
              await syncDataToFirestore();
              if (auth) await auth.signOut();
              window.location.reload();
            }}
            isSyncing={isSyncing}
          />
        );
      case 'guide':
        return (
          <GuideView
            goalData={goalData}
            loggedMeals={loggedMeals}
            hydrationAmount={hydrationAmount}
            weightHistory={weightHistory}
            onBack={() => window.history.back()}
          />
        );
      case 'notifications':
        return (
          <NotificationsView
            notifications={notifications}
            setNotifications={setNotifications}
            onBack={() => window.history.back()}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen max-w-lg mx-auto bg-background flex flex-col relative shadow-xl border-x">
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="icon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="50%" stopColor="#2dd4bf" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
      </svg>

      {user && !showOnboarding && !showSplash && !isUserLoading && (
        <header className="p-4 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-50 border-b relative">
          <button
            onClick={() => navigateTo('profile')}
            className="w-9 h-9 rounded-full bg-muted/50 flex items-center justify-center"
          >
            <User className="w-4 h-4 text-foreground" />
          </button>
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5 pointer-events-none">
            <span className="font-black text-xl tracking-tighter">arcex</span>
            <span className="font-black text-xl tracking-tighter bg-gradient-to-br from-[#4ade80] via-[#2dd4bf] to-[#3b82f6] bg-clip-text text-transparent">
              fit
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigateTo('profile-subscription')}
              className="rounded-full bg-muted/50 w-9 h-9 flex items-center justify-center"
            >
              <Crown className="w-4 h-4 text-amber-500" />
            </button>
            <button
              onClick={() => navigateTo('notifications')}
              className="rounded-full bg-muted/50 w-9 h-9 relative flex items-center justify-center"
            >
              <Bell className="w-4 h-4 text-foreground" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-destructive text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-background">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>
          </div>
        </header>
      )}

      <main
        ref={mainRef}
        id="main-scroll-container"
        className="flex-1 px-4 overflow-y-auto swipe-container"
      >
        {renderContent()}
      </main>

      {user && !showOnboarding && !showSplash && !isUserLoading && (
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg bg-card/90 backdrop-blur-xl border-t px-4 py-3 flex justify-between items-center z-50">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Home' },
            { id: 'nutrition', icon: UtensilsCrossed, label: 'Food' },
            { id: 'workout', icon: Dumbbell, label: 'Gym' },
            { id: 'rank', icon: ChartIcon, label: 'Progress' },
          ].map((item) => {
            const Icon = item.icon;
            const isNutrition =
              item.id === 'nutrition' &&
              [
                'nutrition-summary',
                'nutrition-micro',
                'nutrition-macro',
                'nutrition-micro-detail',
              ].includes(activeTab);
            const isWorkout =
              item.id === 'workout' &&
              [
                'workout-library',
                'workout-split',
                'workout-history',
                'workout-pr',
                'workout-pr-detail',
              ].includes(activeTab);
            const isProfile =
              item.id === 'profile' && activeTab.startsWith('profile');
            const isActive =
              activeTab === item.id || isNutrition || isWorkout || isProfile;
            return (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 flex-1 justify-center max-w-[110px]',
                  isActive ? 'bg-primary/10' : 'text-muted-foreground'
                )}
              >
                <Icon
                  className="w-4 h-4"
                  style={isActive ? { stroke: 'url(#icon-gradient)', fill: 'none' } : {}}
                />
                <span
                  className={cn(
                    'text-[10px] font-black uppercase tracking-tight transition-all',
                    isActive
                      ? 'opacity-100 ml-1'
                      : 'opacity-0 w-0 h-0 overflow-hidden'
                  )}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
}
