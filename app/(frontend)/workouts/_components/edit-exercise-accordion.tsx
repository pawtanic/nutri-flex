import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import FormErrorMessage from '@/components/common/form-error-message/form-error-message';
import { ActionResponse } from '@/app/(frontend)/types/common-types';
import { Exercises, Set } from './workout-form-types';
import { EditExerciseSetRow } from './edit-exercise-set-row';

interface EditExerciseAccordionProps {
  readonly expandedSections: string[];
  readonly onAccordionChange: (newExpandedSections: string[]) => void;
  readonly exercises: Exercises;
  readonly state: ActionResponse;
  readonly onRemoveExercise: (index: number) => Promise<void>;
  readonly onUpdateExercise: (index: number, field: string, value: string | Set[]) => void;
  readonly onUpdateSet: (
    exerciseIndex: number,
    setIndex: number,
    field: string,
    value: string
  ) => void;
}

export function EditExerciseAccordion({
  expandedSections,
  onAccordionChange,
  exercises,
  state,
  onRemoveExercise,
  onUpdateExercise,
  onUpdateSet,
}: EditExerciseAccordionProps) {
  return (
    <Accordion
      type="multiple"
      value={expandedSections}
      onValueChange={onAccordionChange}
      className="space-y-3 bg-white mb-2"
    >
      {exercises.map((exercise, index) => {
        const exerciseName = exercise.exerciseName || `Exercise ${index + 1}`;
        const isExpanded = expandedSections.includes(`exercise-${index}`);
        const exerciseErrors = state.errors?.[index] || null;
        const savedExerciseName = state?.inputs?.exercises?.[index]?.exerciseName;

        return (
          <AccordionItem
            key={index}
            value={`exercise-${index}`}
            className="border rounded-md overflow-hidden"
          >
            <AccordionTrigger
              className={`px-4 py-3 hover:no-underline ${isExpanded ? 'before:content-[""] before:flex-1' : ''}`}
            >
              {!isExpanded && exerciseName}
            </AccordionTrigger>
            <AccordionContent>
              <div className="px-4 pt-2 pb-4">
                <div className="grid grid-cols-[1fr,auto] gap-2">
                  <Input
                    id={`exercise-name-${index}`}
                    placeholder="Exercise name"
                    name="exerciseName"
                    value={exerciseName}
                    onChange={e => onUpdateExercise(index, 'exerciseName', e.target.value)}
                    defaultValue={savedExerciseName}
                    aria-invalid={!!exerciseErrors?.exerciseName}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => onRemoveExercise(index)}
                    aria-label="Remove exercise from workout"
                  >
                    <Trash2 style={{ width: '24px', height: '24px' }} aria-hidden="true" />
                  </Button>
                  {exerciseErrors?.exerciseName && (
                    <FormErrorMessage
                      id={`exercise-name-${index}`}
                      errorMessage={exerciseErrors.exerciseName[0] || state.message}
                    />
                  )}

                  <div className="col-span-2 mt-4">
                    {exercise.sets.map((_, setIndex) => (
                      <EditExerciseSetRow
                        key={setIndex}
                        index={index}
                        setIndex={setIndex}
                        state={state}
                        exercises={exercises}
                        exerciseErrors={exerciseErrors}
                        onUpdateSet={onUpdateSet}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
