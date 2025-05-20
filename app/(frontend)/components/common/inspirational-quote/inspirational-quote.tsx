'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Quote } from 'lucide-react';

export function InspirationalQuote() {
  return (
    <Card className="mb-6 overflow-hidden border-none card-shadow">
      <CardContent className="p-5">
        <div className="flex items-start">
          <div className="bg-primary/10 p-2 rounded-full mr-3 flex-shrink-0">
            <Quote className="h-5 w-5 text-primary" />
          </div>
          <p className="text-lg font-medium leading-relaxed">
            People who track workouts are 2x more likely to stick with their goals.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
