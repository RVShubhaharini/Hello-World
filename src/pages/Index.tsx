import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, BookOpen, BarChart3, Music, Film, User, LogOut, Activity, Heart, Download, DollarSign } from 'lucide-react';
import MoodCalendar from '@/components/MoodCalendar';
import MoodEntryForm from '@/components/MoodEntry';
import MoodVisualization from '@/components/MoodVisualization';
import MoodStats from '@/components/MoodStats';
import HealthChecker from '@/components/HealthChecker';
import HealthStats from '@/components/HealthStats';
import HealthVisualization from '@/components/HealthVisualization';
import DataExport from '@/components/DataExport';
import RecommendationPanel from '@/components/RecommendationPanel';
import UserProfile from '@/components/UserProfile';
import LoginForm from '@/components/auth/LoginForm';
import FloatingParticles from '@/components/FloatingParticles';
import BudgetManager from '@/components/BudgetManager';
import { HealthEntry } from '@/types/health';
// import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface MoodEntryData {
  date: string;
  mood: string;
  emoji: string;
  description?: string;
}

interface BudgetEntry {
  id: string;
  date: string;
  monthlyIncome: number;
  monthlyExpenses: number;
  dailyBudget: number;
  remainingBudget: number;
  advice: string;
  investmentTotal: number;
}

const Index = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeView, setActiveView] = useState<'journal' | 'stats' | 'recommendations' | 'health' | 'export' | 'budget'>('journal');
  const [localMoodEntries, setLocalMoodEntries] = useState<Record<string, MoodEntryData>>({});
  const [localHealthEntries, setLocalHealthEntries] = useState<Record<string, HealthEntry>>({});
  const [localBudgetEntries, setLocalBudgetEntries] = useState<Record<string, BudgetEntry>>({});
  // Mock auth values for now
  const user = null;
  const loading = false;
  const moodEntries = {};
  const saveMoodEntry = async () => {};
  const signOut = async () => {};
  const { toast } = useToast();

  // Load mood entries from localStorage on component mount
  useEffect(() => {
    const stored = localStorage.getItem('moodvibe-entries');
    if (stored) {
      try {
        setLocalMoodEntries(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading mood entries:', error);
      }
    }
  }, []);

  // Load health entries from localStorage on component mount
  useEffect(() => {
    const stored = localStorage.getItem('moodvibe-health-entries');
    if (stored) {
      try {
        setLocalHealthEntries(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading health entries:', error);
      }
    }
  }, []);

  // Load budget entries from localStorage on component mount
  useEffect(() => {
    const stored = localStorage.getItem('moodvibe-budget-entries');
    if (stored) {
      try {
        setLocalBudgetEntries(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading budget entries:', error);
      }
    }
  }, []);

  // Save mood entries to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('moodvibe-entries', JSON.stringify(localMoodEntries));
  }, [localMoodEntries]);

  // Save health entries to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('moodvibe-health-entries', JSON.stringify(localHealthEntries));
  }, [localHealthEntries]);

  // Save budget entries to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('moodvibe-budget-entries', JSON.stringify(localBudgetEntries));
  }, [localBudgetEntries]);

  const handleSaveMoodEntry = (entry: MoodEntryData) => {
    // Always save to localStorage for now
    setLocalMoodEntries(prev => ({
      ...prev,
      [entry.date]: entry
    }));
    
    toast({
      title: "Vibe Saved! ✨",
      description: `Your ${entry.mood} mood has been captured for ${new Date(entry.date).toLocaleDateString()}.`,
    });
  };

  const handleSaveHealthEntry = (entry: HealthEntry) => {
    setLocalHealthEntries(prev => ({
      ...prev,
      [entry.date]: entry
    }));
    
    toast({
      title: "Health Data Saved! 💪",
      description: `Your health data has been saved for ${new Date(entry.date).toLocaleDateString()}.`,
    });
  };

  const handleSaveBudgetEntry = (entry: BudgetEntry) => {
    setLocalBudgetEntries(prev => ({
      ...prev,
      [entry.date]: entry
    }));
    
    toast({
      title: "Budget Data Saved! 💰",
      description: `Your budget data has been saved for ${new Date(entry.date).toLocaleDateString()}.`,
    });
  };

  const handleSignOut = async () => {
    try {
      console.log('Attempting to sign out...');
      await signOut();
      console.log('Sign out successful');
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl">🌟</div>
          <h2 className="text-2xl font-caveat font-semibold gradient-text">
            Loading your mood journal...
          </h2>
        </div>
      </div>
    );
  }

  // For now, let's skip authentication and work with localStorage directly
  // if (!user) {
  //   return <LoginForm />;
  // }

  const selectedEntry = localMoodEntries[selectedDate];
  const selectedHealthEntry = localHealthEntries[selectedDate];
  const selectedBudgetEntry = localBudgetEntries[selectedDate];

  return (
    <div className="min-h-screen animated-gradient relative overflow-hidden">
      <FloatingParticles mood={selectedEntry?.mood || 'calm'} count={30} />
      
      <div className="relative z-10 container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 py-8 slide-in-up">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="h-8 w-8 text-white rotate-animation" />
            <h1 className="text-5xl font-caveat font-bold text-white drop-shadow-lg bounce-animation">
              MoodVibe Journal
            </h1>
            <Sparkles className="h-8 w-8 text-white rotate-animation" />
          </div>
          <p className="text-xl text-white/90 font-inter drop-shadow-md">
            Capture your daily vibes and watch your emotional journey unfold ✨
          </p>
          
          <div className="flex items-center justify-center space-x-2 mt-6 flex-wrap gap-2">
            <Button
              variant={activeView === 'journal' ? 'default' : 'outline'}
              onClick={() => setActiveView('journal')}
              className="flex items-center space-x-2 hover-lift glow-effect"
            >
              <BookOpen className="h-4 w-4" />
              <span>Journal</span>
            </Button>
            <Button
              variant={activeView === 'health' ? 'default' : 'outline'}
              onClick={() => setActiveView('health')}
              className="flex items-center space-x-2 hover-lift glow-effect"
            >
              <Activity className="h-4 w-4" />
              <span>Health</span>
            </Button>
            <Button
              variant={activeView === 'stats' ? 'default' : 'outline'}
              onClick={() => setActiveView('stats')}
              className="flex items-center space-x-2 hover-lift glow-effect"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Stats</span>
            </Button>
            <Button
              variant={activeView === 'recommendations' ? 'default' : 'outline'}
              onClick={() => setActiveView('recommendations')}
              className="flex items-center space-x-2 hover-lift glow-effect"
            >
              <Music className="h-4 w-4" />
              <span>Recommendations</span>
            </Button>
            <Button
              variant={activeView === 'export' ? 'default' : 'outline'}
              onClick={() => setActiveView('export')}
              className="flex items-center space-x-2 hover-lift glow-effect"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>
            <Button
              variant={activeView === 'budget' ? 'default' : 'outline'}
              onClick={() => setActiveView('budget')}
              className="flex items-center space-x-2 hover-lift glow-effect"
            >
              <DollarSign className="h-4 w-4" />
              <span>Budget</span>
            </Button>
          </div>
        </div>

        {activeView === 'journal' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Calendar */}
            <div className="lg:col-span-1 fade-in-scale">
              <MoodCalendar
                onDateSelect={setSelectedDate}
                selectedDate={selectedDate}
                moodEntries={localMoodEntries}
                healthEntries={localHealthEntries}
              />
            </div>

            {/* Mood Entry Form */}
            <div className="lg:col-span-1 fade-in-scale">
              <MoodEntryForm
                selectedDate={selectedDate}
                existingEntry={selectedEntry}
                onSave={handleSaveMoodEntry}
              />
            </div>

            {/* Mood Visualization */}
            <div className="lg:col-span-1 fade-in-scale">
              <MoodVisualization moodEntry={selectedEntry} />
            </div>
          </div>
        ) : activeView === 'health' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Calendar */}
            <div className="lg:col-span-1 fade-in-scale">
              <MoodCalendar
                onDateSelect={setSelectedDate}
                selectedDate={selectedDate}
                moodEntries={localMoodEntries}
                healthEntries={localHealthEntries}
              />
            </div>

            {/* Health Checker */}
            <div className="lg:col-span-1 fade-in-scale">
              <HealthChecker
                selectedDate={selectedDate}
                existingHealthEntry={selectedHealthEntry}
                onSave={handleSaveHealthEntry}
              />
            </div>

            {/* Health Stats */}
            <div className="lg:col-span-1 fade-in-scale">
              <HealthStats healthEntries={localHealthEntries} />
            </div>
          </div>
        ) : activeView === 'stats' ? (
          <div className="space-y-8">
            <div className="fade-in-scale">
              <MoodStats moodEntries={localMoodEntries} />
            </div>
            <div className="fade-in-scale">
              <HealthVisualization healthEntries={localHealthEntries} />
            </div>
          </div>
        ) : activeView === 'export' ? (
          <div className="space-y-8 fade-in-scale">
            <DataExport 
              moodEntries={localMoodEntries} 
              healthEntries={localHealthEntries}
              budgetEntries={localBudgetEntries}
            />
          </div>
        ) : activeView === 'budget' ? (
          <div className="space-y-8 fade-in-scale">
            <BudgetManager
              selectedDate={selectedDate}
              existingBudgetEntry={selectedBudgetEntry}
              onSave={handleSaveBudgetEntry}
            />
          </div>
        ) : activeView === 'recommendations' ? (
          <div className="space-y-8 fade-in-scale">
            {selectedEntry ? (
              <RecommendationPanel 
                mood={selectedEntry.mood} 
                moodEmoji={selectedEntry.emoji} 
              />
            ) : (
              <Card className="p-8 glass-effect border-0 text-center hover-lift">
                <div className="space-y-4">
                  <div className="text-6xl bounce-animation">🎵</div>
                  <h3 className="text-xl font-caveat font-semibold text-white">
                    Select a mood to get recommendations
                  </h3>
                  <p className="text-white/70">
                    Choose a date with a mood entry to see personalized music and movie suggestions!
                  </p>
                  <Button
                    onClick={() => setActiveView('journal')}
                    className="flex items-center space-x-2 hover-lift glow-effect"
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>Go to Journal</span>
                  </Button>
                </div>
              </Card>
            )}
          </div>
        ) : null}

        {/* Info Card for Features */}
        <Card className="p-6 glass-effect border-0 text-center hover-lift shimmer-effect">
          <div className="space-y-3">
            <h3 className="text-lg font-caveat font-semibold text-white bounce-animation">
              ✨ Your Personal Mood Journal
            </h3>
            <p className="text-white/80">
              Track your daily moods, get personalized recommendations, and watch your emotional journey unfold. 
              Your data is saved locally and will persist between sessions.
            </p>
            <div className="flex items-center justify-center space-x-2 flex-wrap gap-2">
              <Badge variant="outline" className="bg-white/20">
                <BookOpen className="h-3 w-3 mr-1" />
                Journal
              </Badge>
              <Badge variant="outline" className="bg-white/20">
                <Activity className="h-3 w-3 mr-1" />
                Health
              </Badge>
              <Badge variant="outline" className="bg-white/20">
                <BarChart3 className="h-3 w-3 mr-1" />
                Analytics
              </Badge>
              <Badge variant="outline" className="bg-white/20">
                <Music className="h-3 w-3 mr-1" />
                Music
              </Badge>
              <Badge variant="outline" className="bg-white/20">
                <Film className="h-3 w-3 mr-1" />
                Movies
              </Badge>
              <Badge variant="outline" className="bg-white/20">
                <Download className="h-3 w-3 mr-1" />
                Export
              </Badge>
              <Badge variant="outline" className="bg-white/20">
                <DollarSign className="h-3 w-3 mr-1" />
                Budget
              </Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;
