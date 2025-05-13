import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { getExerciseDisplayName } from '@/app/(frontend)/utils/helpers';
import { ActionResponse } from '@/app/(frontend)/types/common-types';
import { Exercises, Set } from './workout-form-types';
import { ExerciseCardContent } from './exercise-card-content';

interface ExerciseAccordionProps {
  readonly expandedSections: string[];
  readonly onAccordionChange: (newExpandedSections: string[]) => void;
  readonly exercises: Exercises;
  readonly state: ActionResponse;
  readonly onRemoveExercise: (index: number) => void;
  readonly onUpdateExercise: (index: number, field: string, value: string | Set[]) => void;
  readonly onUpdateSet: (exerciseIndex: number, setIndex: number, field: string, value: string) => void;
  readonly onAddSet: (exerciseIndex: number) => void;
  readonly onRemoveSet: (exerciseIndex: number, setIndex: number) => void;
}

export function ExerciseAccordion({
  expandedSections,
  onAccordionChange,
  exercises,
  state,
  onRemoveExercise,
  onUpdateExercise,
  onUpdateSet,
  onAddSet,
  onRemoveSet,
}: ExerciseAccordionProps) {
  return (
    <Accordion
      type="multiple"
      value={expandedSections}
      onValueChange={onAccordionChange}
      className="space-y-3 bg-white"
    >
      {exercises.map((exercise, index) => {
        const exerciseName = getExerciseDisplayName(exercise, index);
        const isExpanded = expandedSections.includes(`exercise-${index}`);
        const accordionId = `exercise-${index}`;

        return (
          <AccordionItem
            key={index}
            value={accordionId}
            className="border rounded-md overflow-hidden"
          >
            <AccordionTrigger
              className={`px-4 py-3 hover:no-underline ${isExpanded ? 'before:content-[""] before:flex-1' : ''}`}
              aria-expanded={isExpanded}
              aria-controls={`content-${accordionId}`}
            >
              {!isExpanded && exerciseName}
            </AccordionTrigger>
            <AccordionContent id={`content-${accordionId}`}>
              <div className="px-4">
                <ExerciseCardContent
                  index={index}
                  state={state}
                  exercises={exercises}
                  onRemoveExercise={onRemoveExercise}
                  onUpdateExercise={onUpdateExercise}
                  onUpdateSet={onUpdateSet}
                  onAddSet={onAddSet}
                  onRemoveSet={onRemoveSet}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
