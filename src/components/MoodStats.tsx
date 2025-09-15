import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Heart, Calendar, Sparkles } from 'lucide-react';

interface MoodEntry {
  date: string;
  mood: string;
  emoji: string;
  description?: string;
}

interface MoodStatsProps {
  moodEntries: Record<string, MoodEntry>;
}

const MoodStats: React.FC<MoodStatsProps> = ({ moodEntries }) => {
  const entries = Object.values(moodEntries);
  const totalEntries = entries.length;

  // Calculate mood frequency
  const moodCounts = entries.reduce((acc, entry) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostFrequentMood = Object.entries(moodCounts).reduce(
    (max, [mood, count]) => count > max.count ? { mood, count } : max,
    { mood: '', count: 0 }
  );

  const moodLabels = {
    happy: 'Happy',
    calm: 'Calm',
    energetic: 'Energetic',
    sad: 'Sad',
    excited: 'Excited',
    peaceful: 'Peaceful',
    anxious: 'Anxious',
    grateful: 'Grateful',
  };

  const moodEmojis = {
    happy: '😊',
    calm: '😌',
    energetic: '⚡',
    sad: '😢',
    excited: '🤩',
    peaceful: '🕊️',
    anxious: '😰',
    grateful: '🙏',
  };

  // Get recent streak
  const sortedDates = Object.keys(moodEntries).sort().reverse();
  let currentStreak = 0;
  const today = new Date().toISOString().split('T')[0];
  
  for (let i = 0; i < sortedDates.length; i++) {
    const date = new Date(sortedDates[i]);
    const expectedDate = new Date();
    expectedDate.setDate(expectedDate.getDate() - i);
    
    if (sortedDates[i] === expectedDate.toISOString().split('T')[0]) {
      currentStreak++;
    } else {
      break;
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-4 glass-effect border-0">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Entries</p>
            <p className="text-2xl font-bold gradient-text">{totalEntries}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 glass-effect border-0">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-excited/20 rounded-lg">
            <TrendingUp className="h-5 w-5 text-excited" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Current Streak</p>
            <p className="text-2xl font-bold gradient-text">{currentStreak} days</p>
          </div>
        </div>
      </Card>

      {mostFrequentMood.mood && (
        <Card className="p-4 glass-effect border-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-grateful/20 rounded-lg">
              <Heart className="h-5 w-5 text-grateful" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Most Common</p>
              <div className="flex items-center space-x-1">
                <span className="text-lg">
                  {moodEmojis[mostFrequentMood.mood as keyof typeof moodEmojis]}
                </span>
                <span className="font-semibold">
                  {moodLabels[mostFrequentMood.mood as keyof typeof moodLabels]}
                </span>
              </div>
            </div>
          </div>
        </Card>
      )}

      <Card className="p-4 glass-effect border-0">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-happy/20 rounded-lg">
            <Sparkles className="h-5 w-5 text-happy" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Mood Variety</p>
            <p className="text-2xl font-bold gradient-text">
              {Object.keys(moodCounts).length}
            </p>
          </div>
        </div>
      </Card>

      {Object.keys(moodCounts).length > 0 && (
        <Card className="p-4 glass-effect border-0 md:col-span-2 lg:col-span-4">
          <h4 className="font-caveat font-semibold mb-3 gradient-text">Mood Breakdown</h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(moodCounts).map(([mood, count]) => (
              <Badge 
                key={mood} 
                variant="secondary" 
                className="flex items-center space-x-1 bg-white/20 backdrop-blur-sm"
              >
                <span>{moodEmojis[mood as keyof typeof moodEmojis]}</span>
                <span>{moodLabels[mood as keyof typeof moodLabels]}</span>
                <span className="text-xs bg-white/30 px-1 rounded">{count}</span>
              </Badge>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default MoodStats;