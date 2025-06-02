'use client';

import { format } from 'date-fns';
import { useDate } from '@/app/(frontend)/context/date-context';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useEffect } from 'react';
import { normalizeDate } from '@/app/(frontend)/workouts/_components/workouts';
import { useRouter, useSearchParams } from 'next/navigation';

interface DateHeaderProps {
  title?: string;
}

export function DateHeader({ title }: DateHeaderProps) {
  const { selectedDate, setSelectedDate } = useDate();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const formattedDate = normalizeDate(selectedDate);
    params.set('date', formattedDate);

    // Update the URL without causing a page reload - cleaner way ?
    router.replace(`${window.location.pathname}?${params.toString()}`, { scroll: false });
  }, [selectedDate]);

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          {title}
        </h1>
        <p className="text-muted-foreground">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</p>
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            aria-label="Select workout date from calendar"
            variant="outline"
            size="icon"
            className="shadow-sm hover:shadow-md transition-all"
          >
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={date => date && setSelectedDate(date)}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
