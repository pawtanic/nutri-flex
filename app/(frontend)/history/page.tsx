'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DateHeader } from '@/components/date-header';
import { WorkoutHistoryCalendar } from '@/components/workout-history-calendar';
import { WorkoutStats } from '@/components/workout-stats';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export default function HistoryPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedType, setSelectedType] = useState('all');

  return (
    <div className="container max-w-md mx-auto pb-20 pt-6 px-4">
      <DateHeader title="Workout History" />

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <Label htmlFor="period" className="text-sm mb-1 block">
            Time Period
          </Label>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger id="period">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="3months">3 Months</SelectItem>
              <SelectItem value="6months">6 Months</SelectItem>
              <SelectItem value="year">Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="type" className="text-sm mb-1 block">
            Workout Type
          </Label>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger id="type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Workouts</SelectItem>
              <SelectItem value="strength">Strength</SelectItem>
              <SelectItem value="cardio">Cardio</SelectItem>
              <SelectItem value="flexibility">Flexibility</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="calendar" className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>
        <TabsContent value="calendar" className="mt-4">
          <Card className="card-shadow border-none overflow-hidden">
            <CardHeader className="pb-2 text-white">
              <CardTitle className="text-lg">Workout Frequency</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <WorkoutHistoryCalendar period={selectedPeriod} workoutType={selectedType} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="stats" className="mt-4">
          <WorkoutStats period={selectedPeriod} workoutType={selectedType} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
