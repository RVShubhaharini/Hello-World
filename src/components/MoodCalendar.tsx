import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Heart, Activity } from 'lucide-react';
import { HealthEntry } from '@/types/health';

interface MoodEntry {
  date: string;
  mood: string;
  emoji: string;
  description?: string;
}

interface MoodCalendarProps {
  onDateSelect: (date: string) => void;
  selectedDate: string;
  moodEntries: Record<string, MoodEntry>;
  healthEntries?: Record<string, HealthEntry>;
}

const MoodCalendar: React.FC<MoodCalendarProps> = ({ onDateSelect, selectedDate, moodEntries, healthEntries = {} }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const moodColors = {
    happy: 'bg-happy',
    calm: 'bg-calm',
    energetic: 'bg-energetic',
    sad: 'bg-sad',
    excited: 'bg-excited',
    peaceful: 'bg-peaceful',
    anxious: 'bg-anxious',
    grateful: 'bg-grateful',
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const formatDateKey = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const days = getDaysInMonth(currentDate);
  const currentMonth = monthNames[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();

  return (
    <Card className="p-6 glass-effect border-0">
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigateMonth('prev')}
          className="hover:bg-accent/20"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-caveat font-semibold gradient-text">
          {currentMonth} {currentYear}
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigateMonth('next')}
          className="hover:bg-accent/20"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-center text-xs font-medium text-muted-foreground p-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          if (!day) {
            return <div key={index} className="p-2" />;
          }

          const dateKey = formatDateKey(day);
          const moodEntry = moodEntries[dateKey];
          const healthEntry = healthEntries[dateKey];
          const isSelected = selectedDate === dateKey;
          const isToday = dateKey === formatDateKey(new Date());

          return (
            <div
              key={dateKey}
              className={`calendar-day p-2 cursor-pointer border-2 transition-all duration-300 ${
                isSelected 
                  ? 'border-primary shadow-lg mood-glow' 
                  : isToday 
                    ? 'border-accent' 
                    : 'border-transparent hover:border-accent/50'
              }`}
              onClick={() => onDateSelect(dateKey)}
            >
              <div className="text-center">
                <span className={`text-sm ${isSelected ? 'font-bold' : ''}`}>
                  {day.getDate()}
                </span>
                <div className="flex justify-center items-center space-x-1 mt-1">
                  {moodEntry && (
                    <div className={`mood-indicator ${moodColors[moodEntry.mood as keyof typeof moodColors] || 'bg-muted'}`}>
                      <span className="text-xs">{moodEntry.emoji}</span>
                    </div>
                  )}
                  {healthEntry && (
                    <div className="health-indicator bg-green-500/20 rounded-full p-1">
                      <Activity className="h-2 w-2 text-green-600" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default MoodCalendar;