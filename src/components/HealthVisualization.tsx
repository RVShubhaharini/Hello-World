import React from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { HealthEntry } from '@/types/health';
import { TrendingUp, Activity, Heart, BarChart3 } from 'lucide-react';

interface HealthVisualizationProps {
  healthEntries: Record<string, HealthEntry>;
}

const HealthVisualization: React.FC<HealthVisualizationProps> = ({ healthEntries }) => {
  const entries = Object.values(healthEntries).sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  if (entries.length === 0) {
    return (
      <Card className="p-8 glass-effect border-0 text-center">
        <div className="space-y-4">
          <div className="text-6xl">📊</div>
          <h3 className="text-xl font-caveat font-semibold gradient-text">
            No health data to visualize yet
          </h3>
          <p className="text-muted-foreground">
            Start tracking your health to see beautiful charts and insights!
          </p>
        </div>
      </Card>
    );
  }

  // Prepare data for charts
  const chartData = entries.map(entry => ({
    date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    healthScore: entry.overallHealthScore,
    exercise: entry.exercise.duration,
    sleep: entry.healthQuestions.sleep,
    energy: entry.healthQuestions.energy,
    stress: entry.healthQuestions.stress,
    nutrition: entry.healthQuestions.nutrition,
    hydration: entry.healthQuestions.hydration,
    pain: entry.healthQuestions.pain,
  }));

  // Exercise type distribution
  const exerciseTypes = entries.reduce((acc, entry) => {
    if (entry.exercise.type) {
      acc[entry.exercise.type] = (acc[entry.exercise.type] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const exerciseData = Object.entries(exerciseTypes).map(([type, count]) => ({
    name: type,
    value: count,
  }));

  // Health score distribution
  const healthScoreRanges = {
    'Excellent (80-100)': entries.filter(e => e.overallHealthScore >= 80).length,
    'Good (60-79)': entries.filter(e => e.overallHealthScore >= 60 && e.overallHealthScore < 80).length,
    'Fair (40-59)': entries.filter(e => e.overallHealthScore >= 40 && e.overallHealthScore < 60).length,
    'Poor (0-39)': entries.filter(e => e.overallHealthScore < 40).length,
  };

  const scoreData = Object.entries(healthScoreRanges).map(([range, count]) => ({
    name: range,
    value: count,
  }));

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', '#ff00ff', '#00ffff'];

  return (
    <Card className="p-6 glass-effect border-0">
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <BarChart3 className="h-6 w-6 text-primary" />
          <h3 className="text-xl font-caveat font-semibold gradient-text">
            Health Analytics Dashboard
          </h3>
        </div>

        <Tabs defaultValue="trends" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="trends" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Trends</span>
            </TabsTrigger>
            <TabsTrigger value="exercise" className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>Exercise</span>
            </TabsTrigger>
            <TabsTrigger value="health" className="flex items-center space-x-2">
              <Heart className="h-4 w-4" />
              <span>Health</span>
            </TabsTrigger>
            <TabsTrigger value="distribution" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Distribution</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="space-y-4">
            <div className="h-80">
              <h4 className="text-lg font-semibold mb-4">Health Score & Exercise Trends</h4>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                      border: 'none', 
                      borderRadius: '8px',
                      color: 'white'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="healthScore" 
                    stroke="#8884d8" 
                    strokeWidth={3}
                    dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                    name="Health Score"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="exercise" 
                    stroke="#82ca9d" 
                    strokeWidth={3}
                    dot={{ fill: '#82ca9d', strokeWidth: 2, r: 4 }}
                    name="Exercise (min)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="exercise" className="space-y-4">
            <div className="h-80">
              <h4 className="text-lg font-semibold mb-4">Daily Exercise Duration</h4>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                      border: 'none', 
                      borderRadius: '8px',
                      color: 'white'
                    }} 
                  />
                  <Bar dataKey="exercise" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="health" className="space-y-4">
            <div className="h-80">
              <h4 className="text-lg font-semibold mb-4">Health Metrics Over Time</h4>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                      border: 'none', 
                      borderRadius: '8px',
                      color: 'white'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="sleep" 
                    stackId="1" 
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    fillOpacity={0.6}
                    name="Sleep"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="energy" 
                    stackId="1" 
                    stroke="#82ca9d" 
                    fill="#82ca9d" 
                    fillOpacity={0.6}
                    name="Energy"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="stress" 
                    stackId="1" 
                    stroke="#ffc658" 
                    fill="#ffc658" 
                    fillOpacity={0.6}
                    name="Stress"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="distribution" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-80">
                <h4 className="text-lg font-semibold mb-4">Exercise Types</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={exerciseData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {exerciseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                        border: 'none', 
                        borderRadius: '8px',
                        color: 'white'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="h-80">
                <h4 className="text-lg font-semibold mb-4">Health Score Distribution</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={scoreData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis type="number" stroke="#9ca3af" />
                    <YAxis dataKey="name" type="category" stroke="#9ca3af" width={100} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                        border: 'none', 
                        borderRadius: '8px',
                        color: 'white'
                      }} 
                    />
                    <Bar dataKey="value" fill="#8884d8" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
};

export default HealthVisualization;
