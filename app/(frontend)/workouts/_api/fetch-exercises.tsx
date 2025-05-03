'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Loader2, ChevronRight, Dumbbell, ArrowLeft, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Exercise } from '@/app/(frontend)/api/public-api';
import { MuscleGroup, useFetchExerciseByMuscleGroup } from '@/hooks/fetchExercises';
import { muscleGroups } from '@/app/(frontend)/utils/constants';
import { capitalize, getDifficultyColor } from '@/app/(frontend)/utils/helpers';
import WarningAlert from '@/components/common/WarningAlert';
import Link from 'next/link';

interface ExerciseApiFetchProps {
  onSelectExercise: (exercise: Exercise) => void;
}

type SortOptions = 'name-asc' | 'name-desc' | 'difficulty-asc' | 'difficulty-desc';
type EquipmentOptions = 'all' | 'barbell' | 'dumbbell';
type DifficultyOptions = 'beginner' | 'intermediate' | 'expert' | 'all';

export function ExerciseApiFetch({ onSelectExercise }: ExerciseApiFetchProps) {
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup>('');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);

  // Add filter and sort states
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentOptions>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyOptions>('all');
  const [selectedSort, setSelectedSort] = useState<SortOptions>('name-asc');
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Use the exerciseApi and exerciseKeys from the public API layer
  const { data, isLoading, error } = useFetchExerciseByMuscleGroup({ selectedMuscle });

  const handleMuscleSelect = (muscle: MuscleGroup) => {
    setSelectedMuscle(muscle);
    setSelectedExercise(null);
  };

  const handleExerciseSelect = (exercise: Exercise) => {
    setSelectedExercise(exercise);
  };

  const handleAddExercise = () => {
    if (selectedExercise) {
      onSelectExercise(selectedExercise);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="muscle-group">Select Muscle Group</Label>
        <Select value={selectedMuscle} onValueChange={handleMuscleSelect}>
          <SelectTrigger id="muscle-group" className="mt-1 shadow border-none">
            <SelectValue placeholder="Choose a muscle group" />
          </SelectTrigger>
          <SelectContent>
            {muscleGroups?.map(muscle => (
              <SelectItem key={muscle} value={muscle}>
                {capitalize(muscle)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {selectedMuscle && !selectedExercise && (
        <Collapsible
          open={filtersOpen}
          onOpenChange={setFiltersOpen}
          className="rounded-md shadow bg-white"
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className={`flex w-full justify-between p-4 h-auto ${filtersOpen ? 'hover:bg-white' : ''}`}
            >
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                <span>Filters & Sorting</span>
              </div>
              <Badge variant="outline" className="ml-2">
                {filteredExercises.length} exercises
              </Badge>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="px-4 pb-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="equipment-filter">Equipment</Label>
                <Select
                  value={selectedEquipment}
                  onValueChange={setSelectedEquipment as (value: string) => void}
                >
                  <SelectTrigger id="equipment-filter" className="mt-1">
                    <SelectValue placeholder="All equipment" />
                  </SelectTrigger>
                  <SelectContent>
                    {['all', 'barbell', 'dumbbell'].map(equipment => (
                      <SelectItem key={equipment} value={equipment}>
                        {equipment === 'all' ? 'All equipment' : capitalize(equipment)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="difficulty-filter">Difficulty</Label>
                <Select
                  value={selectedDifficulty}
                  onValueChange={setSelectedDifficulty as (value: string) => void}
                >
                  <SelectTrigger id="difficulty-filter" className="mt-1">
                    <SelectValue placeholder="All levels" />
                  </SelectTrigger>
                  <SelectContent>
                    {['beginner', 'intermediate', 'expert', 'all'].map(difficulty => (
                      <SelectItem key={difficulty} value={difficulty}>
                        {difficulty === 'all' ? 'All levels' : capitalize(difficulty)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Sort By</Label>
              <RadioGroup
                value={selectedSort}
                onValueChange={setSelectedSort as (value: string) => void}
                className="grid grid-cols-2 gap-4 mt-1"
              >
                {[
                  { value: 'name-asc', label: 'Name (A-Z)' },
                  { value: 'name-desc', label: 'Name (Z-A)' },
                  { value: 'difficulty-asc', label: 'Difficulty (Low-High)' },
                  { value: 'difficulty-desc', label: 'Difficulty (High-Low)' },
                ].map(option => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label htmlFor={option.value} className="cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
      {error && <p className="text-red-500">Error fetching exercises: {error.message}</p>}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading exercises...</span>
        </div>
      ) : selectedExercise ? (
        <div className="space-y-4">
          <Button
            variant="ghost"
            size="sm"
            className="pl-0"
            onClick={() => setSelectedExercise(null)}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to exercises
          </Button>

          <Card className="shadow-md">
            <CardContent className="p-4 space-y-4">
              <div>
                <h3 className="text-xl font-bold">{selectedExercise.name}</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {/*component*/}
                  <Badge
                    variant="outline"
                    className={getDifficultyColor(selectedExercise.difficulty)}
                  >
                    {capitalize(selectedExercise.difficulty)}
                  </Badge>

                  {/*component*/}
                  <Badge variant="outline">
                    {selectedExercise.equipment === 'barbell' ||
                    selectedExercise.equipment === 'dumbbell' ? (
                      <Dumbbell className="h-4 w-4 mr-1" />
                    ) : (
                      ''
                    )}
                    {capitalize(selectedExercise.equipment)}
                  </Badge>

                  {/*component*/}
                  <Badge variant="outline">{capitalize(selectedExercise.type)}</Badge>
                </div>
              </div>

              <hr />

              <div>
                <h4 className="font-medium mb-2">Instructions</h4>
                <p className="text-muted-foreground whitespace-pre-line">
                  {selectedExercise.instructions}
                </p>
              </div>

              <Button className="w-full" onClick={handleAddExercise}>
                Add This Exercise
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : data && data.length > 0 ? (
        <ScrollArea className="h-[400px]">
          <div className="space-y-2">
            {data.map((exercise, index) => (
              <Card
                key={index}
                className="cursor-pointer hover:bg-accent/50 transition-colors shadow"
              >
                <CardContent
                  className="p-3 flex items-center justify-between"
                  onClick={() => handleExerciseSelect(exercise)}
                >
                  <div>
                    <h3 className="font-medium">{exercise.name}</h3>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className={getDifficultyColor(exercise.difficulty)}>
                        {exercise.difficulty}
                      </Badge>
                      <Badge variant="outline" className="bg-gray-100">
                        {exercise.equipment.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground mr-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      ) : selectedMuscle ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No exercises found for this muscle group</p>
        </div>
      ) : (
        <div className="text-center py-8">
          <Dumbbell className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">Select a muscle group to see exercises</p>
        </div>
      )}
      <WarningAlert description="The results rely on free data from Ninja API">
        <Link href="https://api-ninjas.com/api/exercises" className="ml-2 underline">
          Learn more
        </Link>
      </WarningAlert>
    </div>
  );
}
