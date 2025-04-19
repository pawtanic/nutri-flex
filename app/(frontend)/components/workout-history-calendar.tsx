'use client';

import { useState, useEffect } from 'react';
import {
  addMonths,
  subMonths,
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/app/(frontend)/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useRouter } from 'next/navigation';
import { useDate } from '@/app/(frontend)/context/date-context';

// Sample workout data - in a real app, this would come from your database
const workoutData = [
  { date: new Date(2025, 3, 1), type: 'strength', intensity: 'high', name: 'Upper Body' },
  { date: new Date(2025, 3, 3), type: 'cardio', intensity: 'medium', name: 'Running' },
  { date: new Date(2025, 3, 5), type: 'strength', intensity: 'medium', name: 'Lower Body' },
  { date: new Date(2025, 3, 8), type: 'flexibility', intensity: 'low', name: 'Yoga' },
  { date: new Date(2025, 3, 10), type: 'strength', intensity: 'high', name: 'Full Body' },
  { date: new Date(2025, 3, 12), type: 'cardio', intensity: 'high', name: 'HIIT' },
  { date: new Date(2025, 3, 15), type: 'strength', intensity: 'medium', name: 'Upper Body' },
  { date: new Date(2025, 3, 17), type: 'cardio', intensity: 'medium', name: 'Cycling' },
  { date: new Date(2025, 3, 19), type: 'flexibility', intensity: 'low', name: 'Stretching' },
  { date: new Date(2025, 3, 22), type: 'strength', intensity: 'high', name: 'Lower Body' },
  { date: new Date(2025, 3, 24), type: 'cardio', intensity: 'medium', name: 'Running' },
  { date: new Date(2025, 3, 26), type: 'strength', intensity: 'medium', name: 'Upper Body' },
  { date: new Date(2025, 3, 29), type: 'flexibility', intensity: 'low', name: 'Yoga' },
  { date: new Date(2025, 4, 1), type: 'strength', intensity: 'high', name: 'Full Body' },
  { date: new Date(2025, 4, 3), type: 'cardio', intensity: 'high', name: 'HIIT' },
  { date: new Date(2025, 4, 6), type: 'strength', intensity: 'medium', name: 'Upper Body' },
];

interface WorkoutHistoryCalendarProps {
  period: string;
  workoutType: string;
}

export function WorkoutHistoryCalendar({ period, workoutType }: WorkoutHistoryCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<Date[]>([]);
  const [filteredWorkouts, setFilteredWorkouts] = useState(workoutData);
  const router = useRouter();
  const { setSelectedDate } = useDate();

  // Generate calendar days for the current month
  useEffect(() => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    setCalendarDays(eachDayOfInterval({ start, end }));
  }, [currentDate]);

  // Filter workouts based on selected type
  useEffect(() => {
    if (workoutType === 'all') {
      setFilteredWorkouts(workoutData);
    } else {
      setFilteredWorkouts(workoutData.filter(workout => workout.type === workoutType));
    }
  }, [workoutType]);

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  // Navigate to next month
  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  // Get workouts for a specific day
  const getWorkoutsForDay = (day: Date) => {
    return filteredWorkouts.filter(workout => isSameDay(workout.date, day));
  };

  // Get intensity color class based on workout intensity
  const getIntensityColorClass = (intensity: string) => {
    switch (intensity) {
      case 'high':
        return 'bg-workout';
      case 'medium':
        return 'bg-workout/60';
      case 'low':
        return 'bg-workout/30';
      default:
        return 'bg-workout/10';
    }
  };

  // Get icon based on workout type
  const getWorkoutTypeIcon = (type: string) => {
    switch (type) {
      case 'strength':
        return '💪';
      case 'cardio':
        return '🏃';
      case 'flexibility':
        return '🧘';
      default:
        return '🏋️';
    }
  };

  // Handle day click
  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    router.push('/workouts');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Button variant="outline" size="icon" onClick={prevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-medium">{format(currentDate, 'MMMM yyyy')}</h2>
        <Button variant="outline" size="icon" onClick={nextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
          <div key={i} className="text-xs font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for days before the start of the month */}
        {Array.from({
          length: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(),
        }).map((_, i) => (
          <div key={`empty-start-${i}`} className="h-10 rounded-md"></div>
        ))}

        {/* Calendar days */}
        {calendarDays.map(day => {
          const dayWorkouts = getWorkoutsForDay(day);
          const hasWorkout = dayWorkouts.length > 0;
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isToday = isSameDay(day, new Date());

          return (
            <TooltipProvider key={day.toString()}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className={cn(
                      'h-10 rounded-md flex flex-col items-center justify-center relative transition-all duration-200',
                      !isCurrentMonth && 'text-muted-foreground opacity-50',
                      isToday && 'border-2 border-primary',
                      hasWorkout && 'cursor-pointer hover:bg-muted hover:scale-110'
                    )}
                    onClick={() => hasWorkout && handleDayClick(day)}
                  >
                    <span className="text-xs">{format(day, 'd')}</span>
                    {hasWorkout && (
                      <div className="flex mt-1 space-x-0.5">
                        {dayWorkouts.map((workout, i) => (
                          <div
                            key={i}
                            className={cn(
                              'w-1.5 h-1.5 rounded-full',
                              getIntensityColorClass(workout.intensity)
                            )}
                          ></div>
                        ))}
                      </div>
                    )}
                  </button>
                </TooltipTrigger>
                {hasWorkout && (
                  <TooltipContent className="shadow-lg border-none">
                    <div className="space-y-1">
                      <p className="font-medium">{format(day, 'MMMM d, yyyy')}</p>
                      {dayWorkouts.map((workout, i) => (
                        <div key={i} className="flex items-center text-sm">
                          <span className="mr-1">{getWorkoutTypeIcon(workout.type)}</span>
                          <span>{workout.name}</span>
                        </div>
                      ))}
                    </div>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          );
        })}

        {/* Empty cells for days after the end of the month */}
        {Array.from({
          length: 6 - new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDay(),
        }).map((_, i) => (
          <div key={`empty-end-${i}`} className="h-10 rounded-md"></div>
        ))}
      </div>

      <div className="mt-4 flex flex-col space-y-2 bg-muted/50 p-3 rounded-lg">
        <div className="text-sm font-medium">Intensity Legend:</div>
        <div className="flex space-x-4 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-workout mr-1"></div>
            <span>High</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-workout/60 mr-1"></div>
            <span>Medium</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-workout/30 mr-1"></div>
            <span>Low</span>
          </div>
        </div>
      </div>
    </div>
  );
}
