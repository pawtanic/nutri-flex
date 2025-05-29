import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CircleHelp } from 'lucide-react';

function ActivityLevelPopup() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button type="button" className="ml-2 text-muted-foreground">
          <CircleHelp className="h-4 w-4 inline" />
          <span className="sr-only">Activity level information</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="space-y-2">
          <p className="font-medium">Activity Levels:</p>
          <ul className="list-disc pl-4 space-y-1 text-sm">
            <li>
              <strong>None:</strong> Little to no exercise
            </li>
            <li>
              <strong>Light:</strong> Light exercise 1-3 days/week
            </li>
            <li>
              <strong>Moderate:</strong> Moderate exercise 3-5 days/week
            </li>
            <li>
              <strong>Heavy:</strong> Hard exercise 6-7 days/week
            </li>
          </ul>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default ActivityLevelPopup;
