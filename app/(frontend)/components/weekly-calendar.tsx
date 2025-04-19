'use client';

import { useDate } from '@/app/(frontend)/context/date-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  addDays,
  format,
  startOfWeek,
  endOfWeek,
  isSameDay,
  eachDayOfInterval,
  subWeeks,
  addWeeks,
} from 'date-fns';
import { useState } from 'react';
import { cn } from '@/app/(frontend)/lib/utils';

// Sample data for dates with activities
const workoutDates = [
  new Date(2025, 3, 10),
  new Date(2025, 3, 12),
  new Date(2025, 3, 15),
  new Date(2025, 3, 17),
];

const nutritionDates = [
  new Date(2025, 3, 10),
  new Date(2025, 3, 11),
  new Date(2025, 3, 13),
  new Date(2025, 3, 16),
];

const waterDates = [
  new Date(2025, 3, 10),
  new Date(2025, 3, 11),
  new Date(2025, 3, 12),
  new Date(2025, 3, 14),
  new Date(2025, 3, 16),
];

export function WeeklyCalendar() {
  const { selectedDate, setSelectedDate } = useDate();
  const router = useRouter();
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );

  // Generate days for the current week
  const weekDays = eachDayOfInterval({
    start: currentWeekStart,
    end: endOfWeek(currentWeekStart, { weekStartsOn: 1 }),
  });

  // Navigate to previous week
  const prevWeek = () => {
    setCurrentWeekStart(subWeeks(currentWeekStart, 1));
  };

  // Navigate to next week
  const nextWeek = () => {
    setCurrentWeekStart(addWeeks(currentWeekStart, 1));
  };

  // Handle day click
  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    router.push('/workouts');
  };

  return (
    <Card className="mb-6 card-shadow border-none overflow-hidden">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Weekly Overview</CardTitle>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={prevWeek}
            className="h-8 w-8 bg-primary/5 hover:bg-primary/10"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={nextWeek}
            className="h-8 w-8 bg-primary/5 hover:bg-primary/10"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-2">
        <div className="text-sm text-center mb-2">
          {format(currentWeekStart, 'MMMM d')} -{' '}
          {format(addDays(currentWeekStart, 6), 'MMMM d, yyyy')}
        </div>
        <div className="grid grid-cols-7 gap-2 text-center mb-2">
          {weekDays.map(day => {
            // todo: better name
            const x = day.toString().slice(0, 3);
            const isToday = isSameDay(day, new Date());
            const isSelected = isSameDay(day, selectedDate);

            return (
              <button
                onClick={() => handleDayClick(day)}
                key={day.toString()}
                className={cn(
                  'w-[40px] p-2 py-4 space-y-2 hover:bg-primary/10 rounded-2xl bg-[#FAFCFC]',
                  isToday && 'bg-quinary',
                  isSelected && 'bg-tertiary'
                )}
              >
                <div className="text-xs font-medium mb-1">{x}</div>
                <span className={cn('text-sm font-medium text-primary bg-white p-1 rounded-full')}>
                  {format(day, 'd')}
                </span>
              </button>
            );
          })}
        </div>
        <div className="flex justify-center mt-4 space-x-4 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-tertiary mr-2"></div>
            <span className="text-sm">Selected workout date</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-quinary mr-2"></div>
            <span className="text-sm">Today</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
