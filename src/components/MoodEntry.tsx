import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Heart, Sparkles, Zap, Cloud, Sun, Leaf, AlertTriangle, Star } from 'lucide-react';

interface MoodEntry {
  date: string;
  mood: string;
  emoji: string;
  description?: string;
}

interface MoodEntryProps {
  selectedDate: string;
  existingEntry?: MoodEntry;
  onSave: (entry: MoodEntry) => void;
}

const MoodEntry: React.FC<MoodEntryProps> = ({ selectedDate, existingEntry, onSave }) => {
  const [selectedMood, setSelectedMood] = useState(existingEntry?.mood || '');
  const [description, setDescription] = useState(existingEntry?.description || '');

  // Reset form when selectedDate or existingEntry changes
  useEffect(() => {
    setSelectedMood(existingEntry?.mood || '');
    setDescription(existingEntry?.description || '');
  }, [selectedDate, existingEntry]);

  const moods = [
    { id: 'happy', label: 'Happy', emoji: '😊', icon: Sun, color: 'text-happy' },
    { id: 'calm', label: 'Calm', emoji: '😌', icon: Cloud, color: 'text-calm' },
    { id: 'energetic', label: 'Energetic', emoji: '⚡', icon: Zap, color: 'text-energetic' },
    { id: 'sad', label: 'Sad', emoji: '😢', icon: Cloud, color: 'text-sad' },
    { id: 'excited', label: 'Excited', emoji: '🤩', icon: Sparkles, color: 'text-excited' },
    { id: 'peaceful', label: 'Peaceful', emoji: '🕊️', icon: Leaf, color: 'text-peaceful' },
    { id: 'anxious', label: 'Anxious', emoji: '😰', icon: AlertTriangle, color: 'text-anxious' },
    { id: 'grateful', label: 'Grateful', emoji: '🙏', icon: Star, color: 'text-grateful' },
  ];

  const handleSave = () => {
    if (selectedMood) {
      const mood = moods.find(m => m.id === selectedMood);
      if (mood) {
        onSave({
          date: selectedDate,
          mood: selectedMood,
          emoji: mood.emoji,
          description,
        });
      }
    }
  };

  const selectedMoodData = moods.find(m => m.id === selectedMood);

  return (
    <Card className="p-6 glass-effect border-0">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-caveat font-semibold mb-4 gradient-text">
            How are you feeling today?
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {moods.map((mood) => {
              const Icon = mood.icon;
              return (
                <Button
                  key={mood.id}
                  variant={selectedMood === mood.id ? "default" : "outline"}
                  className={`h-auto p-4 flex flex-col items-center gap-2 transition-all duration-300 ${
                    selectedMood === mood.id 
                      ? 'mood-glow scale-105' 
                      : 'hover:scale-105 hover:bg-accent/20'
                  }`}
                  onClick={() => setSelectedMood(mood.id)}
                >
                  <Icon className={`h-5 w-5 ${mood.color}`} />
                  <span className="text-2xl">{mood.emoji}</span>
                  <span className="text-sm font-medium">{mood.label}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {selectedMood && (
          <div className="space-y-4 animate-in fade-in-50">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Tell me more about your day... ✨
              </label>
              <Textarea
                placeholder="What made you feel this way? Any special moments, thoughts, or experiences you'd like to remember?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[100px] resize-none border-accent/20 focus:border-primary"
              />
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-sm">
                <span className="mr-1">{selectedMoodData?.emoji}</span>
                Feeling {selectedMoodData?.label}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {new Date(selectedDate).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </Badge>
            </div>

            <Button 
              onClick={handleSave} 
              className="w-full bg-primary hover:bg-primary/90 mood-glow"
              size="lg"
            >
              <Heart className="h-4 w-4 mr-2" />
              Save My Vibe
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default MoodEntry;