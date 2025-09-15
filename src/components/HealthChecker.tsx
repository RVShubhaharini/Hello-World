import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Activity, 
  Heart, 
  Moon, 
  Zap, 
  Brain, 
  Apple, 
  Droplets, 
  Shield,
  Dumbbell,
  Clock,
  Target,
  Lightbulb
} from 'lucide-react';
import { HealthEntry } from '@/types/health';

interface HealthCheckerProps {
  selectedDate: string;
  existingHealthEntry?: HealthEntry;
  onSave: (entry: HealthEntry) => void;
}

const HealthChecker: React.FC<HealthCheckerProps> = ({ 
  selectedDate, 
  existingHealthEntry, 
  onSave 
}) => {
  const [exerciseDuration, setExerciseDuration] = useState(existingHealthEntry?.exercise.duration || 0);
  const [exerciseType, setExerciseType] = useState(existingHealthEntry?.exercise.type || '');
  const [exerciseIntensity, setExerciseIntensity] = useState<'low' | 'moderate' | 'high'>(
    existingHealthEntry?.exercise.intensity || 'moderate'
  );
  const [selectedActivities, setSelectedActivities] = useState<string[]>(
    existingHealthEntry?.exercise.activities || []
  );
  const [healthQuestions, setHealthQuestions] = useState({
    sleep: existingHealthEntry?.healthQuestions.sleep || 5,
    energy: existingHealthEntry?.healthQuestions.energy || 5,
    stress: existingHealthEntry?.healthQuestions.stress || 5,
    nutrition: existingHealthEntry?.healthQuestions.nutrition || 5,
    hydration: existingHealthEntry?.healthQuestions.hydration || 5,
    pain: existingHealthEntry?.healthQuestions.pain || 5,
  });

  // Reset form when selectedDate or existingHealthEntry changes
  useEffect(() => {
    setExerciseDuration(existingHealthEntry?.exercise.duration || 0);
    setExerciseType(existingHealthEntry?.exercise.type || '');
    setExerciseIntensity(existingHealthEntry?.exercise.intensity || 'moderate');
    setSelectedActivities(existingHealthEntry?.exercise.activities || []);
    setHealthQuestions({
      sleep: existingHealthEntry?.healthQuestions.sleep || 5,
      energy: existingHealthEntry?.healthQuestions.energy || 5,
      stress: existingHealthEntry?.healthQuestions.stress || 5,
      nutrition: existingHealthEntry?.healthQuestions.nutrition || 5,
      hydration: existingHealthEntry?.healthQuestions.hydration || 5,
      pain: existingHealthEntry?.healthQuestions.pain || 5,
    });
  }, [selectedDate, existingHealthEntry]);

  const exerciseActivities = [
    'Walking', 'Running', 'Cycling', 'Swimming', 'Weight Training',
    'Yoga', 'Pilates', 'Dancing', 'Hiking', 'Sports', 'Cardio',
    'Stretching', 'Martial Arts', 'Rock Climbing', 'Other'
  ];

  const intensityColors = {
    low: 'text-green-500',
    moderate: 'text-yellow-500',
    high: 'text-red-500'
  };

  const calculateHealthScore = (): number => {
    const exerciseScore = Math.min(exerciseDuration / 30 * 20, 20); // Max 20 points for 30+ min exercise
    const healthScore = Object.values(healthQuestions).reduce((sum, value) => sum + value, 0) / 6; // Average of health questions
    return Math.round(exerciseScore + healthScore);
  };

  const generateSuggestions = (): string[] => {
    const suggestions: string[] = [];
    const score = calculateHealthScore();

    // Exercise suggestions
    if (exerciseDuration < 15) {
      suggestions.push("Try to get at least 15-30 minutes of physical activity today");
    } else if (exerciseDuration >= 30) {
      suggestions.push("Great job on your exercise routine! Keep it up!");
    }

    // Health-based suggestions
    if (healthQuestions.sleep < 6) {
      suggestions.push("Consider improving your sleep routine - aim for 7-9 hours");
    }
    if (healthQuestions.energy < 6) {
      suggestions.push("Try some light exercise or a healthy snack to boost energy");
    }
    if (healthQuestions.stress > 7) {
      suggestions.push("Practice deep breathing or meditation to manage stress");
    }
    if (healthQuestions.nutrition < 6) {
      suggestions.push("Focus on eating more fruits, vegetables, and whole foods");
    }
    if (healthQuestions.hydration < 6) {
      suggestions.push("Make sure to drink plenty of water throughout the day");
    }
    if (healthQuestions.pain < 6) {
      suggestions.push("Consider gentle stretching or consult a healthcare provider");
    }

    // Overall suggestions
    if (score >= 80) {
      suggestions.push("Excellent health day! You're doing great!");
    } else if (score >= 60) {
      suggestions.push("Good health day! Small improvements can make a big difference");
    } else {
      suggestions.push("Focus on one small health improvement today");
    }

    return suggestions;
  };

  const handleActivityToggle = (activity: string) => {
    setSelectedActivities(prev => 
      prev.includes(activity) 
        ? prev.filter(a => a !== activity)
        : [...prev, activity]
    );
  };

  const handleSave = () => {
    const healthScore = calculateHealthScore();
    const suggestions = generateSuggestions();

    const healthEntry: HealthEntry = {
      date: selectedDate,
      exercise: {
        duration: exerciseDuration,
        type: exerciseType,
        intensity: exerciseIntensity,
        activities: selectedActivities,
      },
      healthQuestions,
      overallHealthScore: healthScore,
      suggestions,
    };

    onSave(healthEntry);
  };

  const healthScore = calculateHealthScore();
  const suggestions = generateSuggestions();

  return (
    <Card className="p-6 glass-effect border-0">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-caveat font-semibold mb-4 gradient-text">
            How's your health today? 💪
          </h3>
          
          {/* Exercise Section */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <Dumbbell className="h-5 w-5 text-primary" />
              <h4 className="font-semibold">Physical Exercise</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={exerciseDuration}
                  onChange={(e) => setExerciseDuration(Number(e.target.value))}
                  min="0"
                  max="300"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="type">Exercise Type</Label>
                <Input
                  id="type"
                  value={exerciseType}
                  onChange={(e) => setExerciseType(e.target.value)}
                  placeholder="e.g., Running, Yoga, Gym"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label>Intensity Level</Label>
              <div className="flex space-x-4 mt-2">
                {(['low', 'moderate', 'high'] as const).map((intensity) => (
                  <Button
                    key={intensity}
                    variant={exerciseIntensity === intensity ? "default" : "outline"}
                    size="sm"
                    onClick={() => setExerciseIntensity(intensity)}
                    className="capitalize"
                  >
                    {intensity}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label>Activities (select all that apply)</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {exerciseActivities.map((activity) => (
                  <div key={activity} className="flex items-center space-x-2">
                    <Checkbox
                      id={activity}
                      checked={selectedActivities.includes(activity)}
                      onCheckedChange={() => handleActivityToggle(activity)}
                    />
                    <Label htmlFor={activity} className="text-sm">
                      {activity}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Health Questions Section */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <Heart className="h-5 w-5 text-primary" />
              <h4 className="font-semibold">Health Assessment</h4>
            </div>

            {[
              { key: 'sleep', label: 'Sleep Quality', icon: Moon, description: 'How well did you sleep?' },
              { key: 'energy', label: 'Energy Level', icon: Zap, description: 'How energetic do you feel?' },
              { key: 'stress', label: 'Stress Level', icon: Brain, description: 'How stressed are you?' },
              { key: 'nutrition', label: 'Nutrition', icon: Apple, description: 'How well did you eat today?' },
              { key: 'hydration', label: 'Hydration', icon: Droplets, description: 'How well hydrated are you?' },
              { key: 'pain', label: 'Pain Level', icon: Shield, description: 'How much pain/discomfort?' },
            ].map(({ key, label, icon: Icon, description }) => (
              <div key={key} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <Label className="text-sm font-medium">{label}</Label>
                </div>
                <div className="px-2">
                  <Slider
                    value={[healthQuestions[key as keyof typeof healthQuestions]]}
                    onValueChange={(value) => 
                      setHealthQuestions(prev => ({
                        ...prev,
                        [key]: value[0]
                      }))
                    }
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Poor (1)</span>
                    <span className="font-medium">
                      {healthQuestions[key as keyof typeof healthQuestions]}
                    </span>
                    <span>Excellent (10)</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>

          {/* Health Score and Suggestions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-primary" />
                <span className="font-semibold">Today's Health Score</span>
              </div>
              <Badge 
                variant="secondary" 
                className={`text-lg px-3 py-1 ${
                  healthScore >= 80 ? 'bg-green-500/20 text-green-600' :
                  healthScore >= 60 ? 'bg-yellow-500/20 text-yellow-600' :
                  'bg-red-500/20 text-red-600'
                }`}
              >
                {healthScore}/100
              </Badge>
            </div>

            {suggestions.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Lightbulb className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Suggestions</span>
                </div>
                <div className="space-y-1">
                  {suggestions.map((suggestion, index) => (
                    <div key={index} className="text-sm text-muted-foreground bg-accent/20 p-2 rounded">
                      • {suggestion}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button 
              onClick={handleSave} 
              className="w-full bg-primary hover:bg-primary/90 mood-glow"
              size="lg"
            >
              <Heart className="h-4 w-4 mr-2" />
              Save Health Data
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default HealthChecker;
