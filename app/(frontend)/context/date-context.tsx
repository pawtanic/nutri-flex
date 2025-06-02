'use client';

import { createContext, use, useState, type ReactNode, useEffect } from 'react';
import { useUrlParams } from '@/hooks/useUrlParams';
import { format } from 'date-fns';
import { useSearchParams } from 'next/navigation';

type DateContextType = {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
};

const DateContext = createContext<DateContextType | undefined>(undefined);

export function DateProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const date = searchParams.get('date');
  const [selectedDate, setSelectedDate] = useState<Date>(date ? new Date(date) : new Date());

  return (
    <DateContext.Provider value={{ selectedDate, setSelectedDate }}>
      {children}
    </DateContext.Provider>
  );
}

export function useDate() {
  const context = use(DateContext);
  if (context === undefined) {
    throw new Error('useDate must be used within a DateProvider');
  }
  return context;
}
