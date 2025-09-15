import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, Calendar, Heart, Activity, DollarSign } from 'lucide-react';
import { HealthEntry } from '@/types/health';

interface MoodEntry {
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

interface DataExportProps {
  moodEntries: Record<string, MoodEntry>;
  healthEntries: Record<string, HealthEntry>;
  budgetEntries?: Record<string, BudgetEntry>;
}

const DataExport: React.FC<DataExportProps> = ({ moodEntries, healthEntries, budgetEntries = {} }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const generateMoodReport = (): string => {
    const entries = Object.values(moodEntries).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    let report = 'MOOD JOURNAL REPORT\n';
    report += '==================\n\n';
    report += `Generated on: ${new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}\n\n`;

    report += `Total Entries: ${entries.length}\n\n`;

    // Mood statistics
    const moodCounts = entries.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    report += 'MOOD STATISTICS:\n';
    report += '----------------\n';
    Object.entries(moodCounts).forEach(([mood, count]) => {
      const percentage = ((count / entries.length) * 100).toFixed(1);
      report += `${mood.charAt(0).toUpperCase() + mood.slice(1)}: ${count} entries (${percentage}%)\n`;
    });

    report += '\nDETAILED ENTRIES:\n';
    report += '-----------------\n\n';

    entries.forEach((entry, index) => {
      report += `${index + 1}. ${formatDate(entry.date)}\n`;
      report += `   Mood: ${entry.emoji} ${entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1)}\n`;
      if (entry.description) {
        report += `   Description: ${entry.description}\n`;
      }
      report += '\n';
    });

    return report;
  };

  const generateHealthReport = (): string => {
    const entries = Object.values(healthEntries).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    let report = 'HEALTH TRACKING REPORT\n';
    report += '=====================\n\n';
    report += `Generated on: ${new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}\n\n`;

    report += `Total Entries: ${entries.length}\n\n`;

    if (entries.length === 0) {
      report += 'No health data available.\n';
      return report;
    }

    // Health statistics
    const totalExercise = entries.reduce((sum, entry) => sum + entry.exercise.duration, 0);
    const avgHealthScore = entries.reduce((sum, entry) => sum + entry.overallHealthScore, 0) / entries.length;
    const avgSleep = entries.reduce((sum, entry) => sum + entry.healthQuestions.sleep, 0) / entries.length;
    const avgEnergy = entries.reduce((sum, entry) => sum + entry.healthQuestions.energy, 0) / entries.length;
    const avgStress = entries.reduce((sum, entry) => sum + entry.healthQuestions.stress, 0) / entries.length;
    const avgNutrition = entries.reduce((sum, entry) => sum + entry.healthQuestions.nutrition, 0) / entries.length;
    const avgHydration = entries.reduce((sum, entry) => sum + entry.healthQuestions.hydration, 0) / entries.length;
    const avgPain = entries.reduce((sum, entry) => sum + entry.healthQuestions.pain, 0) / entries.length;

    report += 'HEALTH STATISTICS:\n';
    report += '------------------\n';
    report += `Total Exercise Time: ${totalExercise} minutes\n`;
    report += `Average Health Score: ${avgHealthScore.toFixed(1)}/100\n`;
    report += `Average Sleep Quality: ${avgSleep.toFixed(1)}/10\n`;
    report += `Average Energy Level: ${avgEnergy.toFixed(1)}/10\n`;
    report += `Average Stress Level: ${avgStress.toFixed(1)}/10\n`;
    report += `Average Nutrition: ${avgNutrition.toFixed(1)}/10\n`;
    report += `Average Hydration: ${avgHydration.toFixed(1)}/10\n`;
    report += `Average Pain Level: ${avgPain.toFixed(1)}/10\n\n`;

    // Exercise types
    const exerciseTypes = entries.reduce((acc, entry) => {
      if (entry.exercise.type) {
        acc[entry.exercise.type] = (acc[entry.exercise.type] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    if (Object.keys(exerciseTypes).length > 0) {
      report += 'EXERCISE TYPES:\n';
      report += '---------------\n';
      Object.entries(exerciseTypes).forEach(([type, count]) => {
        report += `${type}: ${count} times\n`;
      });
      report += '\n';
    }

    report += 'DETAILED ENTRIES:\n';
    report += '-----------------\n\n';

    entries.forEach((entry, index) => {
      report += `${index + 1}. ${formatDate(entry.date)}\n`;
      report += `   Health Score: ${entry.overallHealthScore}/100\n`;
      report += `   Exercise: ${entry.exercise.duration} minutes (${entry.exercise.type || 'Not specified'})\n`;
      report += `   Intensity: ${entry.exercise.intensity}\n`;
      if (entry.exercise.activities.length > 0) {
        report += `   Activities: ${entry.exercise.activities.join(', ')}\n`;
      }
      report += `   Sleep: ${entry.healthQuestions.sleep}/10\n`;
      report += `   Energy: ${entry.healthQuestions.energy}/10\n`;
      report += `   Stress: ${entry.healthQuestions.stress}/10\n`;
      report += `   Nutrition: ${entry.healthQuestions.nutrition}/10\n`;
      report += `   Hydration: ${entry.healthQuestions.hydration}/10\n`;
      report += `   Pain: ${entry.healthQuestions.pain}/10\n`;
      if (entry.suggestions.length > 0) {
        report += `   Suggestions:\n`;
        entry.suggestions.forEach(suggestion => {
          report += `     - ${suggestion}\n`;
        });
      }
      report += '\n';
    });

    return report;
  };

  const generateBudgetReport = (): string => {
    const entries = Object.values(budgetEntries).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    let report = 'BUDGET TRACKING REPORT\n';
    report += '=====================\n\n';
    report += `Generated on: ${new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}\n\n`;

    report += `Total Entries: ${entries.length}\n\n`;

    if (entries.length === 0) {
      report += 'No budget data available.\n';
      return report;
    }

    // Budget statistics
    const totalIncome = entries.reduce((sum, entry) => sum + entry.monthlyIncome, 0);
    const totalExpenses = entries.reduce((sum, entry) => sum + entry.monthlyExpenses, 0);
    const totalInvestments = entries.reduce((sum, entry) => sum + entry.investmentTotal, 0);
    const avgDailyBudget = entries.reduce((sum, entry) => sum + entry.dailyBudget, 0) / entries.length;
    const avgRemainingBudget = entries.reduce((sum, entry) => sum + entry.remainingBudget, 0) / entries.length;

    report += 'BUDGET STATISTICS:\n';
    report += '------------------\n';
    report += `Total Income: $${totalIncome.toFixed(2)}\n`;
    report += `Total Expenses: $${totalExpenses.toFixed(2)}\n`;
    report += `Total Investments: $${totalInvestments.toFixed(2)}\n`;
    report += `Average Daily Budget: $${avgDailyBudget.toFixed(2)}\n`;
    report += `Average Remaining Budget: $${avgRemainingBudget.toFixed(2)}\n`;
    report += `Investment Ratio: ${totalIncome > 0 ? ((totalInvestments / totalIncome) * 100).toFixed(1) : 0}%\n\n`;

    report += 'DETAILED ENTRIES:\n';
    report += '-----------------\n\n';

    entries.forEach((entry, index) => {
      report += `${index + 1}. ${formatDate(entry.date)}\n`;
      report += `   Monthly Income: $${entry.monthlyIncome.toFixed(2)}\n`;
      report += `   Monthly Expenses: $${entry.monthlyExpenses.toFixed(2)}\n`;
      report += `   Daily Budget: $${entry.dailyBudget.toFixed(2)}\n`;
      report += `   Remaining Budget: $${entry.remainingBudget.toFixed(2)}\n`;
      report += `   Investment Total: $${entry.investmentTotal.toFixed(2)}\n`;
      report += `   Advice: ${entry.advice}\n`;
      report += '\n';
    });

    return report;
  };

  const generateCombinedReport = (): string => {
    const allDates = new Set([
      ...Object.keys(moodEntries),
      ...Object.keys(healthEntries),
      ...Object.keys(budgetEntries)
    ]);
    
    const sortedDates = Array.from(allDates).sort((a, b) => 
      new Date(a).getTime() - new Date(b).getTime()
    );

    let report = 'COMPLETE MOOD, HEALTH & BUDGET JOURNAL\n';
    report += '========================================\n\n';
    report += `Generated on: ${new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}\n\n`;

    report += `Total Days Tracked: ${sortedDates.length}\n`;
    report += `Mood Entries: ${Object.keys(moodEntries).length}\n`;
    report += `Health Entries: ${Object.keys(healthEntries).length}\n`;
    report += `Budget Entries: ${Object.keys(budgetEntries).length}\n\n`;

    report += 'DAILY ENTRIES:\n';
    report += '==============\n\n';

    sortedDates.forEach((date, index) => {
      const moodEntry = moodEntries[date];
      const healthEntry = healthEntries[date];
      const budgetEntry = budgetEntries[date];

      report += `${index + 1}. ${formatDate(date)}\n`;
      report += '   ' + '='.repeat(50) + '\n';

      if (moodEntry) {
        report += `   MOOD: ${moodEntry.emoji} ${moodEntry.mood.charAt(0).toUpperCase() + moodEntry.mood.slice(1)}\n`;
        if (moodEntry.description) {
          report += `   Description: ${moodEntry.description}\n`;
        }
      } else {
        report += `   MOOD: No entry\n`;
      }

      if (healthEntry) {
        report += `   HEALTH SCORE: ${healthEntry.overallHealthScore}/100\n`;
        report += `   EXERCISE: ${healthEntry.exercise.duration} minutes (${healthEntry.exercise.type || 'Not specified'})\n`;
        report += `   SLEEP: ${healthEntry.healthQuestions.sleep}/10 | ENERGY: ${healthEntry.healthQuestions.energy}/10\n`;
        report += `   STRESS: ${healthEntry.healthQuestions.stress}/10 | NUTRITION: ${healthEntry.healthQuestions.nutrition}/10\n`;
        report += `   HYDRATION: ${healthEntry.healthQuestions.hydration}/10 | PAIN: ${healthEntry.healthQuestions.pain}/10\n`;
        if (healthEntry.suggestions.length > 0) {
          report += `   SUGGESTIONS:\n`;
          healthEntry.suggestions.forEach(suggestion => {
            report += `     - ${suggestion}\n`;
          });
        }
      } else {
        report += `   HEALTH: No entry\n`;
      }

      if (budgetEntry) {
        report += `   BUDGET:\n`;
        report += `     Monthly Income: $${budgetEntry.monthlyIncome.toFixed(2)}\n`;
        report += `     Monthly Expenses: $${budgetEntry.monthlyExpenses.toFixed(2)}\n`;
        report += `     Daily Budget: $${budgetEntry.dailyBudget.toFixed(2)}\n`;
        report += `     Remaining Budget: $${budgetEntry.remainingBudget.toFixed(2)}\n`;
        report += `     Investment Total: $${budgetEntry.investmentTotal.toFixed(2)}\n`;
        report += `     Advice: ${budgetEntry.advice}\n`;
      } else {
        report += `   BUDGET: No entry\n`;
      }

      report += '\n';
    });

    return report;
  };

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportMood = () => {
    const content = generateMoodReport();
    const filename = `mood-journal-${new Date().toISOString().split('T')[0]}.txt`;
    downloadFile(content, filename);
  };

  const handleExportHealth = () => {
    const content = generateHealthReport();
    const filename = `health-tracking-${new Date().toISOString().split('T')[0]}.txt`;
    downloadFile(content, filename);
  };

  const handleExportBudget = () => {
    const content = generateBudgetReport();
    const filename = `budget-tracking-${new Date().toISOString().split('T')[0]}.txt`;
    downloadFile(content, filename);
  };

  const handleExportCombined = () => {
    const content = generateCombinedReport();
    const filename = `complete-journal-${new Date().toISOString().split('T')[0]}.txt`;
    downloadFile(content, filename);
  };

  const moodCount = Object.keys(moodEntries).length;
  const healthCount = Object.keys(healthEntries).length;
  const budgetCount = Object.keys(budgetEntries).length;

  return (
    <Card className="p-6 glass-effect border-0">
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Download className="h-6 w-6 text-primary" />
          <h3 className="text-xl font-caveat font-semibold gradient-text">
            Export Your Data
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-accent/20 rounded-lg">
            <Heart className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-sm font-medium">Mood Entries</p>
            <p className="text-2xl font-bold gradient-text">{moodCount}</p>
          </div>
          <div className="text-center p-4 bg-accent/20 rounded-lg">
            <Activity className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-sm font-medium">Health Entries</p>
            <p className="text-2xl font-bold gradient-text">{healthCount}</p>
          </div>
          <div className="text-center p-4 bg-accent/20 rounded-lg">
            <DollarSign className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-sm font-medium">Budget Entries</p>
            <p className="text-2xl font-bold gradient-text">{budgetCount}</p>
          </div>
          <div className="text-center p-4 bg-accent/20 rounded-lg">
            <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-sm font-medium">Total Days</p>
            <p className="text-2xl font-bold gradient-text">
              {new Set([...Object.keys(moodEntries), ...Object.keys(healthEntries), ...Object.keys(budgetEntries)]).size}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-accent/20 rounded-lg">
            <div className="flex items-center space-x-3">
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Mood Journal Report</p>
                <p className="text-sm text-muted-foreground">
                  Complete mood tracking data with statistics
                </p>
              </div>
            </div>
            <Button 
              onClick={handleExportMood}
              disabled={moodCount === 0}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-accent/20 rounded-lg">
            <div className="flex items-center space-x-3">
              <Activity className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Health Tracking Report</p>
                <p className="text-sm text-muted-foreground">
                  Exercise and health assessment data
                </p>
              </div>
            </div>
            <Button 
              onClick={handleExportHealth}
              disabled={healthCount === 0}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-accent/20 rounded-lg">
            <div className="flex items-center space-x-3">
              <DollarSign className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Budget Tracking Report</p>
                <p className="text-sm text-muted-foreground">
                  Investment and budget management data
                </p>
              </div>
            </div>
            <Button 
              onClick={handleExportBudget}
              disabled={budgetCount === 0}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-primary/20 rounded-lg border border-primary/30">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Complete Journal Report</p>
                <p className="text-sm text-muted-foreground">
                  Combined mood and health data for each day
                </p>
              </div>
            </div>
            <Button 
              onClick={handleExportCombined}
              disabled={moodCount === 0 && healthCount === 0 && budgetCount === 0}
              className="flex items-center space-x-2 bg-primary hover:bg-primary/90"
            >
              <Download className="h-4 w-4" />
              <span>Export All</span>
            </Button>
          </div>
        </div>

        <div className="text-sm text-muted-foreground bg-accent/20 p-3 rounded">
          <p className="font-medium mb-1">📄 Export Format:</p>
          <p>All exports are saved as text files (.txt) that you can open in any text editor or import into other applications.</p>
        </div>
      </div>
    </Card>
  );
};

export default DataExport;
