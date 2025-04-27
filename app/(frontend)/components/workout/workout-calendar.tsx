'use client';

import { useDate } from '@/app/(frontend)/context/date-context';
import { Calendar } from '@/components/ui/calendar';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { isSameDay } from 'date-fns';
import { RoutesConfig } from '../navigation';

// Sample data for dates with workouts
const workoutDates = [
  new Date(2025, 3, 10),
  new Date(2025, 3, 12),
  new Date(2025, 3, 15),
  new Date(2025, 3, 17),
];

export function WorkoutCalendar() {
  const { selectedDate, setSelectedDate } = useDate();
  const router = useRouter();

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      router.push(RoutesConfig.workout);
    }
  };

  // Function to check if a date has a workout
  const hasWorkout = (date: Date | undefined) => {
    if (!date) return false;

    return workoutDates.some(workoutDate => isSameDay(workoutDate, date));
  };

  return (
    <Calendar
      mode="single"
      selected={selectedDate}
      onSelect={handleDateSelect}
      className="rounded-md border shadow-sm"
      modifiers={{
        workout: workoutDates,
      }}
      modifiersClassNames={{
        workout: 'bg-workout/20 font-bold',
      }}
      components={{
        DayContent: props => {
          // Make sure we have a valid date object
          const dateObj = props.date;

          return (
            <div
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-md p-0 transition-all duration-200',
                hasWorkout(dateObj) &&
                  'relative after:absolute after:bottom-1 after:h-1.5 after:w-1.5 after:rounded-full after:bg-workout hover:scale-110'
              )}
            >
              {props.day}
            </div>
          );
        },
      }}
    />
  );
}
