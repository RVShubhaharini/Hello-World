import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Activity, 
  Calendar, 
  Target, 
  Heart,
  Zap,
  Moon,
  Brain,
  Apple,
  Droplets,
  Shield,
  Dumbbell
} from 'lucide-react';
import { HealthEntry, HealthStats as HealthStatsType } from '@/types/health';

interface HealthStatsProps {
  healthEntries: Record<string, HealthEntry>;
}

const HealthStats: React.FC<HealthStatsProps> = ({ healthEntries }) => {
  const entries = Object.values(healthEntries);
  const totalEntries = entries.length;

  if (totalEntries === 0) {
    return (
      <Card className="p-8 glass-effect border-0 text-center">
        <div className="space-y-4">
          <div className="text-6xl">💪</div>
          <h3 className="text-xl font-caveat font-semibold gradient-text">
            Start tracking your health!
          </h3>
          <p className="text-muted-foreground">
            Begin logging your daily health data to see your progress and insights.
          </p>
        </div>
      </Card>
    );
  }

  // Calculate statistics
  const totalExerciseMinutes = entries.reduce((sum, entry) => sum + entry.exercise.duration, 0);
  const averageHealthScore = entries.reduce((sum, entry) => sum + entry.overallHealthScore, 0) / totalEntries;
  
  // Exercise streak calculation
  const sortedDates = Object.keys(healthEntries).sort().reverse();
  let exerciseStreak = 0;
  const today = new Date().toISOString().split('T')[0];
  
  for (let i = 0; i < sortedDates.length; i++) {
    const date = new Date(sortedDates[i]);
    const expectedDate = new Date();
    expectedDate.setDate(expectedDate.getDate() - i);
    
    if (sortedDates[i] === expectedDate.toISOString().split('T')[0] && 
        healthEntries[sortedDates[i]].exercise.duration > 0) {
      exerciseStreak++;
    } else {
      break;
    }
  }

  // Most common exercise type
  const exerciseTypes = entries.reduce((acc, entry) => {
    if (entry.exercise.type) {
      acc[entry.exercise.type] = (acc[entry.exercise.type] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const mostCommonExercise = Object.entries(exerciseTypes).reduce(
    (max, [type, count]) => count > max.count ? { type, count } : max,
    { type: '', count: 0 }
  );

  // Weekly averages
  const weeklyAverage = {
    exercise: entries.reduce((sum, entry) => sum + entry.exercise.duration, 0) / totalEntries,
    sleep: entries.reduce((sum, entry) => sum + entry.healthQuestions.sleep, 0) / totalEntries,
    energy: entries.reduce((sum, entry) => sum + entry.healthQuestions.energy, 0) / totalEntries,
    stress: entries.reduce((sum, entry) => sum + entry.healthQuestions.stress, 0) / totalEntries,
    nutrition: entries.reduce((sum, entry) => sum + entry.healthQuestions.nutrition, 0) / totalEntries,
    hydration: entries.reduce((sum, entry) => sum + entry.healthQuestions.hydration, 0) / totalEntries,
    pain: entries.reduce((sum, entry) => sum + entry.healthQuestions.pain, 0) / totalEntries,
  };

  // Health trend calculation
  const recentEntries = entries.slice(0, Math.min(7, entries.length));
  const olderEntries = entries.slice(7, Math.min(14, entries.length));
  
  const recentAvg = recentEntries.reduce((sum, entry) => sum + entry.overallHealthScore, 0) / recentEntries.length;
  const olderAvg = olderEntries.length > 0 ? 
    olderEntries.reduce((sum, entry) => sum + entry.overallHealthScore, 0) / olderEntries.length : recentAvg;
  
  const healthTrend = recentAvg > olderAvg + 5 ? 'improving' : 
                     recentAvg < olderAvg - 5 ? 'declining' : 'stable';

  const trendColors = {
    improving: 'text-green-500',
    stable: 'text-blue-500',
    declining: 'text-red-500'
  };

  const trendIcons = {
    improving: TrendingUp,
    stable: Target,
    declining: TrendingUp
  };

  const TrendIcon = trendIcons[healthTrend];

  return (
    <div className="space-y-6">
      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 glass-effect border-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Exercise</p>
              <p className="text-2xl font-bold gradient-text">{totalExerciseMinutes} min</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 glass-effect border-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Target className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Health Score</p>
              <p className="text-2xl font-bold gradient-text">{Math.round(averageHealthScore)}/100</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 glass-effect border-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Exercise Streak</p>
              <p className="text-2xl font-bold gradient-text">{exerciseStreak} days</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 glass-effect border-0">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${trendColors[healthTrend].replace('text-', 'bg-').replace('-500', '-500/20')}`}>
              <TrendIcon className={`h-5 w-5 ${trendColors[healthTrend]}`} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Health Trend</p>
              <p className={`text-lg font-bold capitalize ${trendColors[healthTrend]}`}>
                {healthTrend}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Health Metrics */}
      <Card className="p-6 glass-effect border-0">
        <h4 className="font-caveat font-semibold mb-4 gradient-text">Health Metrics Overview</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { key: 'exercise', label: 'Exercise (min/day)', icon: Dumbbell, value: weeklyAverage.exercise, max: 60, color: 'bg-blue-500' },
            { key: 'sleep', label: 'Sleep Quality', icon: Moon, value: weeklyAverage.sleep, max: 10, color: 'bg-purple-500' },
            { key: 'energy', label: 'Energy Level', icon: Zap, value: weeklyAverage.energy, max: 10, color: 'bg-yellow-500' },
            { key: 'stress', label: 'Stress Level', icon: Brain, value: weeklyAverage.stress, max: 10, color: 'bg-red-500' },
            { key: 'nutrition', label: 'Nutrition', icon: Apple, value: weeklyAverage.nutrition, max: 10, color: 'bg-green-500' },
            { key: 'hydration', label: 'Hydration', icon: Droplets, value: weeklyAverage.hydration, max: 10, color: 'bg-cyan-500' },
            { key: 'pain', label: 'Pain Level', icon: Shield, value: weeklyAverage.pain, max: 10, color: 'bg-orange-500' },
          ].map(({ key, label, icon: Icon, value, max, color }) => (
            <div key={key} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{label}</span>
                </div>
                <span className="text-sm font-bold">
                  {key === 'exercise' ? Math.round(value) : value.toFixed(1)}
                  {key === 'exercise' ? ' min' : '/10'}
                </span>
              </div>
              <Progress 
                value={(value / max) * 100} 
                className="h-2"
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Exercise Types */}
      {mostCommonExercise.type && (
        <Card className="p-6 glass-effect border-0">
          <h4 className="font-caveat font-semibold mb-4 gradient-text">Exercise Breakdown</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Most Common Exercise</span>
              <Badge variant="secondary" className="bg-white/20">
                {mostCommonExercise.type} ({mostCommonExercise.count} times)
              </Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(exerciseTypes).map(([type, count]) => (
                <Badge 
                  key={type} 
                  variant="outline" 
                  className="flex items-center space-x-1 bg-white/20 backdrop-blur-sm"
                >
                  <Dumbbell className="h-3 w-3" />
                  <span>{type}</span>
                  <span className="text-xs bg-white/30 px-1 rounded">{count}</span>
                </Badge>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Recent Health Scores */}
      <Card className="p-6 glass-effect border-0">
        <h4 className="font-caveat font-semibold mb-4 gradient-text">Recent Health Scores</h4>
        <div className="space-y-2">
          {entries.slice(0, 7).map((entry) => (
            <div key={entry.date} className="flex items-center justify-between p-2 bg-accent/20 rounded">
              <span className="text-sm">
                {new Date(entry.date).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">
                  {entry.exercise.duration}min exercise
                </span>
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${
                    entry.overallHealthScore >= 80 ? 'bg-green-500/20 text-green-600' :
                    entry.overallHealthScore >= 60 ? 'bg-yellow-500/20 text-yellow-600' :
                    'bg-red-500/20 text-red-600'
                  }`}
                >
                  {entry.overallHealthScore}/100
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default HealthStats;
