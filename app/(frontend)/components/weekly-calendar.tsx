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
import { RoutesConfig } from '@/components/common/navigation/navigation';
import { useUrlParams } from '@/hooks/useUrlParams';

export function WeeklyCalendar() {
  const { selectedDate, setSelectedDate } = useDate();
  const router = useRouter();
  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );

  const weekDays = eachDayOfInterval({
    start: currentWeekStart,
    end: endOfWeek(currentWeekStart, { weekStartsOn: 1 }),
  });

  const prevWeek = () => {
    setCurrentWeekStart(subWeeks(currentWeekStart, 1));
  };

  const nextWeek = () => {
    setCurrentWeekStart(addWeeks(currentWeekStart, 1));
  };

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    router.push(RoutesConfig.workout);
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
            className="h-8 w-8 bg-backgroundSecondary hover:bg-primary/10"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={nextWeek}
            className="h-8 w-8 bg-backgroundSecondary hover:bg-primary/10"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-2">
        <div className="text-center mb-2">
          {format(currentWeekStart, 'MMMM d')} -{' '}
          {format(addDays(currentWeekStart, 6), 'MMMM d, yyyy')}
        </div>
        <div className="grid grid-cols-7 gap-2 text-center mb-2">
          {weekDays.map(day => {
            const abbreviatedDayName = day.toString().slice(0, 3);
            const isToday = isSameDay(day, new Date());
            const isSelected = isSameDay(day, selectedDate);

            return (
              <button
                onClick={() => handleDayClick(day)}
                key={day.toString()}
                className={cn(
                  'py-4 space-y-2 hover:bg-primary/10 rounded-2xl bg-backgroundSecondary',
                  isToday && 'bg-quinary',
                  isSelected && 'bg-tertiary'
                )}
              >
                <div className="font-medium mb-1">{abbreviatedDayName}</div>
                <div
                  className={cn(
                    'font-medium text-primary bg-white w-7 h-7 mx-auto flex items-center justify-center rounded-full'
                  )}
                >
                  {format(day, 'd')}
                </div>
              </button>
            );
          })}
        </div>
        <div className="flex justify-center mt-4 space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-tertiary mr-2"></div>
            <p>Selected workout date</p>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-quinary mr-2"></div>
            <p>Today</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
