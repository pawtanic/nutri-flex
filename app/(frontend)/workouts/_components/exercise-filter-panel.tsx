'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Filter } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { capitalize } from '@/app/(frontend)/utils/helpers';
import {
  EQUIPMENT_OPTIONS,
  DIFFICULTY_OPTIONS,
  SORT_OPTIONS,
  SORT_OPTION_LABELS,
  EquipmentOption,
  DifficultyOption,
  SortOption,
} from '@/app/(frontend)/utils/constants';

interface FilterState {
  equipment: EquipmentOption;
  difficulty: DifficultyOption;
  sortBy: SortOption;
  isOpen: boolean;
}

interface ExerciseFilterPanelProps {
  filterState: FilterState;
  onFilterChange: (newState: Partial<FilterState>) => void;
  exerciseCount: number;
}

export function ExerciseFilterPanel({
  filterState,
  onFilterChange,
  exerciseCount,
}: ExerciseFilterPanelProps) {
  const { equipment, difficulty, sortBy, isOpen } = filterState;

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={(open) => onFilterChange({ isOpen: open })}
      className="rounded-md shadow bg-white"
    >
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className={`flex w-full justify-between p-4 h-auto ${isOpen ? 'hover:bg-white' : ''}`}
        >
          <div className="flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            <span>Filters & Sorting</span>
          </div>
          <Badge variant="outline" className="ml-2">
            {exerciseCount} exercises
          </Badge>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="px-4 pb-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="equipment-filter">Equipment</Label>
            <Select
              value={equipment}
              onValueChange={(value) => onFilterChange({ equipment: value as EquipmentOption })}
            >
              <SelectTrigger id="equipment-filter" className="mt-1">
                <SelectValue placeholder="All equipment" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(EQUIPMENT_OPTIONS).map((equipmentOption) => (
                  <SelectItem key={equipmentOption} value={equipmentOption}>
                    {equipmentOption === EQUIPMENT_OPTIONS.ALL
                      ? 'All equipment'
                      : capitalize(equipmentOption)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="difficulty-filter">Difficulty</Label>
            <Select
              value={difficulty}
              onValueChange={(value) => onFilterChange({ difficulty: value as DifficultyOption })}
            >
              <SelectTrigger id="difficulty-filter" className="mt-1">
                <SelectValue placeholder="All levels" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(DIFFICULTY_OPTIONS).map((difficultyOption) => (
                  <SelectItem key={difficultyOption} value={difficultyOption}>
                    {difficultyOption === DIFFICULTY_OPTIONS.ALL
                      ? 'All levels'
                      : capitalize(difficultyOption)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label>Sort By</Label>
          <RadioGroup
            value={sortBy}
            onValueChange={(value) => onFilterChange({ sortBy: value as SortOption })}
            className="grid grid-cols-2 gap-4 mt-1"
          >
            {Object.entries(SORT_OPTIONS).map(([key, value]) => (
              <div key={value} className="flex items-center space-x-2">
                <RadioGroupItem value={value} id={value} />
                <Label htmlFor={value} className="cursor-pointer">
                  {SORT_OPTION_LABELS[value]}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}