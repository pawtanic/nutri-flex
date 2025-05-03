'use client';

import { useEffect, useState } from 'react';
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
// import { Separator } from '@/components/ui/separator';

interface Exercise {
  name: string;
  type: string;
  muscle: string;
  equipment: string;
  difficulty: string;
  instructions: string;
}

const muscleGroups = [
  'abdominals',
  'abductors',
  'adductors',
  'biceps',
  'calves',
  'chest',
  'forearms',
  'glutes',
  'hamstrings',
  'lats',
  'lower_back',
  'middle_back',
  'neck',
  'quadriceps',
  'traps',
  'triceps',
];

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner':
      return 'bg-green-100 text-green-800';
    case 'intermediate':
      return 'bg-blue-100 text-blue-800';
    case 'expert':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export function ExerciseApiFetch({
  onSelectExercise,
}: {
  onSelectExercise: (exercise: Exercise) => void;
}) {
  // todo - manipulate url !
  // add react query !!
  // wrap this component in suspense and error boundary
  // https://api.api-ninjas.com/v1/exercises?muscle=biceps
  const [selectedMuscle, setSelectedMuscle] = useState<string>('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);

  // Add filter and sort states
  const [selectedEquipment, setSelectedEquipment] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedSort, setSelectedSort] = useState<string>('name-asc');
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    if (selectedMuscle) {
      fetch(`https://api.api-ninjas.com/v1/exercises?muscle=${selectedMuscle}`, {
        headers: {
          'X-Api-Key': process.env.NEXT_PUBLIC_NINJAS_API_KEY || '',
        },
      })
        .then(response => response.json())
        .then(data => setExercises(data))
        .catch(error => console.error(error));
    }
  }, [selectedMuscle]);

  console.log(selectedMuscle);

  const handleMuscleSelect = (muscle: string) => {
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

  const getEquipmentIcon = (equipment: string) => {
    return <Dumbbell className="h-4 w-4 mr-1" />;
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="muscle-group">Select Muscle Group</Label>
        <Select value={selectedMuscle} onValueChange={handleMuscleSelect}>
          <SelectTrigger id="muscle-group" className="mt-1">
            <SelectValue placeholder="Choose a muscle group" />
          </SelectTrigger>
          <SelectContent>
            {muscleGroups?.map(muscle => (
              <SelectItem key={muscle} value={muscle}>
                {muscle.charAt(0).toUpperCase() + muscle.slice(1).replace('_', ' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedMuscle && !selectedExercise && (
        <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen} className="border rounded-md">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="flex w-full justify-between p-4 h-auto">
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
                <Label htmlFor="equipment-filter" className="text-sm">
                  Equipment
                </Label>
                <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
                  <SelectTrigger id="equipment-filter" className="mt-1">
                    <SelectValue placeholder="All equipment" />
                  </SelectTrigger>
                  <SelectContent>
                    {[].map(equipment => (
                      <SelectItem key={equipment} value={equipment}>
                        {equipment === 'all'
                          ? 'All equipment'
                          : equipment.charAt(0).toUpperCase() +
                            equipment.slice(1).replace('_', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="difficulty-filter" className="text-sm">
                  Difficulty
                </Label>
                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger id="difficulty-filter" className="mt-1">
                    <SelectValue placeholder="All levels" />
                  </SelectTrigger>
                  <SelectContent>
                    {[].map(difficulty => (
                      <SelectItem key={difficulty} value={difficulty}>
                        {difficulty === 'all'
                          ? 'All levels'
                          : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-sm">Sort By</Label>
              <RadioGroup
                value={selectedSort}
                onValueChange={setSelectedSort}
                className="grid grid-cols-2 gap-2 mt-1"
              >
                {[].map(option => (
                  <Label
                    key={option.value}
                    htmlFor={option.value}
                    className={`flex items-center justify-center border rounded-md p-2 cursor-pointer text-sm ${
                      selectedSort === option.value ? 'bg-primary/10 border-primary' : ''
                    }`}
                  >
                    <RadioGroupItem value={option.value} id={option.value} className="sr-only" />
                    {option.label}
                  </Label>
                ))}
              </RadioGroup>
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
      {/*{isLoading ? (*/}
      {/*  <div className="flex items-center justify-center py-8">*/}
      {/*    <Loader2 className="h-8 w-8 animate-spin text-primary" />*/}
      {/*    <span className="ml-2">Loading exercises...</span>*/}
      {/*  </div>*/}
      {/*) : */}

      {selectedExercise ? (
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

          <Card>
            <CardContent className="p-4 space-y-4">
              <div>
                <h3 className="text-xl font-bold">{selectedExercise.name}</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge
                    variant="outline"
                    className={getDifficultyColor(selectedExercise.difficulty)}
                  >
                    {selectedExercise.difficulty.charAt(0).toUpperCase() +
                      selectedExercise.difficulty.slice(1)}
                  </Badge>
                  <Badge variant="outline">
                    {getEquipmentIcon(selectedExercise.equipment)}
                    {selectedExercise.equipment.charAt(0).toUpperCase() +
                      selectedExercise.equipment.slice(1).replace('_', ' ')}
                  </Badge>
                  <Badge variant="outline">
                    {selectedExercise.type.charAt(0).toUpperCase() + selectedExercise.type.slice(1)}
                  </Badge>
                </div>
              </div>

              {/*<Separator />*/}

              <div>
                <h4 className="font-medium mb-2">Instructions</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {selectedExercise.instructions}
                </p>
              </div>

              <Button className="w-full" onClick={handleAddExercise}>
                Add This Exercise
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : exercises.length > 0 ? (
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-2">
            {exercises.map((exercise, index) => (
              <Card key={index} className="cursor-pointer hover:bg-accent/50 transition-colors">
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
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
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
    </div>
  );
}
