import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calculator, 
  Target, 
  AlertCircle, 
  CheckCircle, 
  PiggyBank,
  BarChart3,
  Calendar,
  Lightbulb
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InvestmentEntry {
  id: string;
  date: string;
  type: 'stocks' | 'bonds' | 'crypto' | 'real_estate' | 'savings' | 'other';
  amount: number;
  description: string;
  isGoodInvestment: boolean;
  notes?: string;
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

interface BudgetManagerProps {
  selectedDate: string;
  existingBudgetEntry?: BudgetEntry;
  onSave: (entry: BudgetEntry) => void;
}

const BudgetManager: React.FC<BudgetManagerProps> = ({
  selectedDate,
  existingBudgetEntry,
  onSave
}) => {
  const [investments, setInvestments] = useState<InvestmentEntry[]>([]);
  const [monthlyIncome, setMonthlyIncome] = useState(existingBudgetEntry?.monthlyIncome || 0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(existingBudgetEntry?.monthlyExpenses || 0);
  const [investmentAmount, setInvestmentAmount] = useState(0);
  const [investmentType, setInvestmentType] = useState<InvestmentEntry['type']>('stocks');
  const [investmentDescription, setInvestmentDescription] = useState('');
  const [isGoodInvestment, setIsGoodInvestment] = useState(true);
  const [investmentNotes, setInvestmentNotes] = useState('');
  const [budgetAdvice, setBudgetAdvice] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // Load budget entries from localStorage
    const stored = localStorage.getItem('moodvibe-budget-entries');
    if (stored) {
      try {
        const budgetEntries = JSON.parse(stored);
        const todayEntry = budgetEntries[selectedDate];
        if (todayEntry) {
          setMonthlyIncome(todayEntry.monthlyIncome || 0);
          setMonthlyExpenses(todayEntry.monthlyExpenses || 0);
          setBudgetAdvice(todayEntry.advice || '');
        }
      } catch (error) {
        console.error('Error loading budget entries:', error);
      }
    }

    // Load investments from localStorage
    const storedInvestments = localStorage.getItem('moodvibe-investments');
    if (storedInvestments) {
      try {
        const allInvestments = JSON.parse(storedInvestments);
        const todayInvestments = allInvestments[selectedDate] || [];
        setInvestments(todayInvestments);
      } catch (error) {
        console.error('Error loading investments:', error);
      }
    }
  }, [selectedDate]);

  const calculateDailyBudget = () => {
    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    const remainingDays = daysInMonth - new Date().getDate() + 1;
    const remainingIncome = monthlyIncome - monthlyExpenses;
    return remainingIncome / remainingDays;
  };

  const calculateRemainingBudget = () => {
    const dailyBudget = calculateDailyBudget();
    const totalInvestments = investments.reduce((sum, inv) => sum + inv.amount, 0);
    return dailyBudget - totalInvestments;
  };

  const generateBudgetAdvice = () => {
    const dailyBudget = calculateDailyBudget();
    const remainingBudget = calculateRemainingBudget();
    const totalInvestments = investments.reduce((sum, inv) => sum + inv.amount, 0);
    const investmentPercentage = monthlyIncome > 0 ? (totalInvestments / monthlyIncome) * 100 : 0;

    let advice = '';

    if (investmentPercentage > 30) {
      advice = `⚠️ You're investing ${investmentPercentage.toFixed(1)}% of your income. Consider reducing investments to maintain financial stability.`;
    } else if (investmentPercentage > 20) {
      advice = `✅ Good investment ratio! You're investing ${investmentPercentage.toFixed(1)}% of your income.`;
    } else if (investmentPercentage > 10) {
      advice = `💡 Consider increasing your investments. You're only investing ${investmentPercentage.toFixed(1)}% of your income.`;
    } else {
      advice = `📈 Start investing! You're only investing ${investmentPercentage.toFixed(1)}% of your income.`;
    }

    if (remainingBudget < 0) {
      advice += `\n🚨 You're overspending by $${Math.abs(remainingBudget).toFixed(2)} today. Cut back on expenses.`;
    } else if (remainingBudget < dailyBudget * 0.5) {
      advice += `\n⚠️ You have $${remainingBudget.toFixed(2)} left for today. Spend wisely!`;
    } else {
      advice += `\n💰 You have $${remainingBudget.toFixed(2)} left for today. Great job managing your budget!`;
    }

    return advice;
  };

  const addInvestment = () => {
    if (investmentAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid investment amount.",
        variant: "destructive",
      });
      return;
    }

    const newInvestment: InvestmentEntry = {
      id: Date.now().toString(),
      date: selectedDate,
      type: investmentType,
      amount: investmentAmount,
      description: investmentDescription,
      isGoodInvestment,
      notes: investmentNotes,
    };

    const updatedInvestments = [...investments, newInvestment];
    setInvestments(updatedInvestments);

    // Save to localStorage
    const storedInvestments = localStorage.getItem('moodvibe-investments');
    const allInvestments = storedInvestments ? JSON.parse(storedInvestments) : {};
    allInvestments[selectedDate] = updatedInvestments;
    localStorage.setItem('moodvibe-investments', JSON.stringify(allInvestments));

    // Reset form
    setInvestmentAmount(0);
    setInvestmentDescription('');
    setInvestmentNotes('');
    setIsGoodInvestment(true);

    toast({
      title: "Investment Added! 💰",
      description: `Added $${investmentAmount} ${investmentType} investment.`,
    });
  };

  const removeInvestment = (id: string) => {
    const updatedInvestments = investments.filter(inv => inv.id !== id);
    setInvestments(updatedInvestments);

    // Save to localStorage
    const storedInvestments = localStorage.getItem('moodvibe-investments');
    const allInvestments = storedInvestments ? JSON.parse(storedInvestments) : {};
    allInvestments[selectedDate] = updatedInvestments;
    localStorage.setItem('moodvibe-investments', JSON.stringify(allInvestments));

    toast({
      title: "Investment Removed",
      description: "Investment has been removed from your records.",
    });
  };

  const saveBudgetEntry = () => {
    const dailyBudget = calculateDailyBudget();
    const remainingBudget = calculateRemainingBudget();
    const totalInvestments = investments.reduce((sum, inv) => sum + inv.amount, 0);
    const advice = generateBudgetAdvice();

    const budgetEntry: BudgetEntry = {
      id: Date.now().toString(),
      date: selectedDate,
      monthlyIncome,
      monthlyExpenses,
      dailyBudget,
      remainingBudget,
      advice,
      investmentTotal: totalInvestments,
    };

    onSave(budgetEntry);
  };

  const investmentTypeLabels = {
    stocks: 'Stocks',
    bonds: 'Bonds',
    crypto: 'Cryptocurrency',
    real_estate: 'Real Estate',
    savings: 'Savings Account',
    other: 'Other'
  };

  const dailyBudget = calculateDailyBudget();
  const remainingBudget = calculateRemainingBudget();
  const totalInvestments = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const investmentPercentage = monthlyIncome > 0 ? (totalInvestments / monthlyIncome) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Budget Overview */}
      <Card className="p-6 glass-effect border-0 fade-in-scale">
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <DollarSign className="h-6 w-6 text-green-500" />
            <h3 className="text-xl font-caveat font-semibold text-white">Budget Overview</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="monthlyIncome" className="text-white/90">Monthly Income</Label>
              <Input
                id="monthlyIncome"
                type="number"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                placeholder="Enter monthly income"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="monthlyExpenses" className="text-white/90">Monthly Expenses</Label>
              <Input
                id="monthlyExpenses"
                type="number"
                value={monthlyExpenses}
                onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                placeholder="Enter monthly expenses"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="text-center p-4 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold text-white">${dailyBudget.toFixed(2)}</div>
              <div className="text-sm text-white/70">Daily Budget</div>
            </div>
            <div className="text-center p-4 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold text-white">${remainingBudget.toFixed(2)}</div>
              <div className="text-sm text-white/70">Remaining Today</div>
            </div>
            <div className="text-center p-4 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold text-white">${totalInvestments.toFixed(2)}</div>
              <div className="text-sm text-white/70">Total Investments</div>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-sm text-white/70 mb-2">
              <span>Investment Ratio</span>
              <span>{investmentPercentage.toFixed(1)}%</span>
            </div>
            <Progress value={investmentPercentage} className="h-2" />
          </div>
        </div>
      </Card>

      {/* Investment Tracker */}
      <Card className="p-6 glass-effect border-0 fade-in-scale">
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="h-6 w-6 text-blue-500" />
            <h3 className="text-xl font-caveat font-semibold text-white">Today's Investments</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="investmentAmount" className="text-white/90">Investment Amount</Label>
              <Input
                id="investmentAmount"
                type="number"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                placeholder="Enter amount"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="investmentType" className="text-white/90">Investment Type</Label>
              <select
                id="investmentType"
                value={investmentType}
                onChange={(e) => setInvestmentType(e.target.value as InvestmentEntry['type'])}
                className="w-full p-2 rounded-md bg-white/10 border border-white/20 text-white"
              >
                {Object.entries(investmentTypeLabels).map(([value, label]) => (
                  <option key={value} value={value} className="bg-gray-800">
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="investmentDescription" className="text-white/90">Description</Label>
            <Input
              id="investmentDescription"
              value={investmentDescription}
              onChange={(e) => setInvestmentDescription(e.target.value)}
              placeholder="Describe your investment"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="investmentNotes" className="text-white/90">Notes</Label>
            <Textarea
              id="investmentNotes"
              value={investmentNotes}
              onChange={(e) => setInvestmentNotes(e.target.value)}
              placeholder="Additional notes about this investment"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isGoodInvestment"
              checked={isGoodInvestment}
              onChange={(e) => setIsGoodInvestment(e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="isGoodInvestment" className="text-white/90">
              This is a good investment decision
            </Label>
          </div>

          <Button onClick={addInvestment} className="w-full hover-lift">
            <PiggyBank className="h-4 w-4 mr-2" />
            Add Investment
          </Button>
        </div>
      </Card>

      {/* Investment List */}
      {investments.length > 0 && (
        <Card className="p-6 glass-effect border-0 fade-in-scale">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <BarChart3 className="h-6 w-6 text-purple-500" />
              <h3 className="text-xl font-caveat font-semibold text-white">Investment History</h3>
            </div>

            <div className="space-y-3">
              {investments.map((investment) => (
                <div key={investment.id} className="flex items-center justify-between p-4 bg-white/10 rounded-lg hover-lift">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-white">${investment.amount}</span>
                      <Badge variant="outline" className="bg-white/20">
                        {investmentTypeLabels[investment.type]}
                      </Badge>
                      {investment.isGoodInvestment ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    <p className="text-sm text-white/70 mt-1">{investment.description}</p>
                    {investment.notes && (
                      <p className="text-xs text-white/60 mt-1">{investment.notes}</p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeInvestment(investment.id)}
                    className="text-red-400 hover:bg-red-500/20"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Budget Advice */}
      <Card className="p-6 glass-effect border-0 fade-in-scale">
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <Lightbulb className="h-6 w-6 text-yellow-500" />
            <h3 className="text-xl font-caveat font-semibold text-white">Budget Advice</h3>
          </div>

          <div className="p-4 bg-white/10 rounded-lg">
            <p className="text-white/90 whitespace-pre-line">
              {budgetAdvice || generateBudgetAdvice()}
            </p>
          </div>

          <Button onClick={saveBudgetEntry} className="w-full hover-lift glow-effect">
            <Target className="h-4 w-4 mr-2" />
            Save Budget Entry
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default BudgetManager;
