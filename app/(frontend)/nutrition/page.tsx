'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { DateHeader } from '@/components/date-header';
import { useDate } from '@/app/(frontend)/context/date-context';

// Sample nutrition data - in a real app, you'd filter this based on the selected date
const meals = [
  {
    id: 1,
    name: 'Breakfast',
    time: '8:30 AM',
    calories: 450,
    protein: 25,
    carbs: 45,
    fat: 15,
  },
  {
    id: 2,
    name: 'Lunch',
    time: '12:30 PM',
    calories: 650,
    protein: 35,
    carbs: 60,
    fat: 20,
  },
];

// Daily totals
const dailyTotals = {
  calories: { current: 1100, target: 2000 },
  protein: { current: 60, target: 120 },
  carbs: { current: 105, target: 200 },
  fat: { current: 35, target: 65 },
};

export default function NutritionPage() {
  const { selectedDate } = useDate();
  return (
    <div className="container max-w-md mx-auto pb-20 pt-6 px-4">
      <DateHeader title="Nutrition" />
      <div className="flex justify-end mb-6">
        <Link href="/nutrition/add">
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Add Meal
          </Button>
        </Link>
      </div>
      <Card className="mb-6 card-shadow border-none overflow-hidden">
        <CardHeader className="pb-2 nutrition-gradient text-white">
          <CardTitle className="text-lg text-primary">Daily Summary</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-4">
            {/*TODO: depened on data structure from backend consider mapping over it*/}
            <DailySummary
              progressFill="bg-calories"
              title="Calories"
              dailyTotals={dailyTotals.calories}
              unit="kcal"
            />
            <DailySummary
              progressFill="bg-quaternary"
              title="Protein"
              dailyTotals={dailyTotals.protein}
              unit="g"
            />
            <DailySummary
              progressFill="bg-quinary"
              title="Carbs"
              dailyTotals={dailyTotals.carbs}
              unit="g"
            />
            <DailySummary
              progressFill="bg-tertiary"
              title="Fat"
              dailyTotals={dailyTotals.fat}
              unit="g"
            />
          </div>
        </CardContent>
      </Card>

      {/* Meals */}
      <h2 className="text-lg font-medium mb-3">Today&apos;s Meals</h2>
      {meals.map(meal => (
        <Card
          key={meal.id}
          className="mb-4 card-shadow border-none hover:translate-y-[-2px] transition-all duration-200"
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{meal.name}</h3>
                <p className="text-muted-foreground">{meal.time}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{meal.calories} kcal</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-3 bg-muted p-2 rounded-md">
              <div>
                <p className="text-muted-foreground">Protein</p>
                <p className="font-medium">{meal.protein}g</p>
              </div>
              <div>
                <p className="text-muted-foreground">Carbs</p>
                <p className="font-medium">{meal.carbs}g</p>
              </div>
              <div>
                <p className="text-muted-foreground">Fat</p>
                <p className="font-medium">{meal.fat}g</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

interface DailySummaryProps {
  title: string;
  dailyTotals: { current: number; target: number };
  unit: 'g' | 'kcal';
  progressFill: string;
}

function DailySummary({ title, dailyTotals, unit, progressFill }: DailySummaryProps) {
  const formattedValue = `${dailyTotals.current} / ${dailyTotals.target} ${unit}`;
  const progressPercentage = (dailyTotals.current / dailyTotals.target) * 100;

  return (
    <div>
      <div className="flex justify-between mb-1">
        <span>{title}</span>
        <span>{formattedValue}</span>
      </div>
      <Progress progressFill={progressFill} value={progressPercentage} className="h-2 progress" />
    </div>
  );
}
