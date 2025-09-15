import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import FloatingParticles from './FloatingParticles';

interface MoodEntry {
  date: string;
  mood: string;
  emoji: string;
  description?: string;
}

interface MoodVisualizationProps {
  moodEntry?: MoodEntry;
}

const MoodVisualization: React.FC<MoodVisualizationProps> = ({ moodEntry }) => {
  if (!moodEntry) {
    return (
      <Card className="p-8 glass-effect border-0 relative overflow-hidden">
        <div className="text-center space-y-4">
          <div className="text-6xl">🌟</div>
          <h3 className="text-xl font-caveat font-semibold gradient-text">
            Select a date to see your vibe
          </h3>
          <p className="text-muted-foreground">
            Your mood journey awaits...
          </p>
        </div>
        <FloatingParticles mood="calm" count={15} />
      </Card>
    );
  }

  const moodBackgrounds = {
    happy: 'bg-happy',
    calm: 'bg-calm',
    energetic: 'bg-energetic',
    sad: 'bg-sad',
    excited: 'bg-excited',
    peaceful: 'bg-peaceful',
    anxious: 'bg-anxious',
    grateful: 'bg-grateful',
  };

  const moodMessages = {
    happy: "Radiating joy and positivity! ✨",
    calm: "Finding peace in the present moment 🌊",
    energetic: "Buzzing with amazing energy! ⚡",
    sad: "It's okay to feel sad - you're not alone 💙",
    excited: "Your excitement is contagious! 🎉",
    peaceful: "Embracing tranquility and balance 🕊️",
    anxious: "Take a deep breath - you've got this 🌸",
    grateful: "Gratitude fills your heart today 🙏",
  };

  const backgroundClass = moodBackgrounds[moodEntry.mood as keyof typeof moodBackgrounds] || 'bg-calm';
  const message = moodMessages[moodEntry.mood as keyof typeof moodMessages] || "Feeling your unique vibe!";

  return (
    <Card className={`p-8 relative overflow-hidden border-0 ${backgroundClass}`}>
      <div className="relative z-10 text-center space-y-6">
        <div className="space-y-2">
          <div className="text-8xl mb-4 animate-pulse">{moodEntry.emoji}</div>
          <Badge variant="secondary" className="text-lg px-4 py-2 bg-white/20 backdrop-blur-sm border-white/30">
            {new Date(moodEntry.date).toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric',
              year: 'numeric'
            })}
          </Badge>
        </div>

        <div className="space-y-4">
          <h3 className="text-2xl font-caveat font-bold text-white drop-shadow-lg">
            {message}
          </h3>
          
          {moodEntry.description && (
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30">
              <p className="text-white font-medium leading-relaxed">
                "{moodEntry.description}"
              </p>
            </div>
          )}
        </div>
      </div>
      
      <FloatingParticles mood={moodEntry.mood} count={25} />
    </Card>
  );
};

export default MoodVisualization;