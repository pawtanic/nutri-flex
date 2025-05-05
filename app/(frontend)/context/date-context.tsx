'use client';

import { createContext, use, useState, type ReactNode, useEffect } from 'react';
import { useUrlParams } from '@/hooks/useUrlParams';
import { format } from 'date-fns';

type DateContextType = {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
};

const DateContext = createContext<DateContextType | undefined>(undefined);

export function DateProvider({ children }: { children: ReactNode }) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  // const { updateParams } = useUrlParams();
  //
  // useEffect(() => {
  //   updateParams({ date: format(selectedDate, 'yyyy-MM-dd') });
  // }, [selectedDate, updateParams]);

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
