'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface InstructionsListProps {
  instructions: string[];
}

export function InstructionsList({ instructions }: InstructionsListProps) {
  const [showInstructions, setShowInstructions] = useState(false);

  return (
    <div>
      <button
        onClick={() => setShowInstructions(!showInstructions)}
        className="flex items-center text-sm font-medium text-primary w-full justify-between"
      >
        <span>Cooking Instructions</span>
        {showInstructions ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>

      {showInstructions && (
        <ol className="mt-2 space-y-1 list-decimal list-inside">
          {instructions.map((step, index) => (
            <InstructionStep key={index} step={step} />
          ))}
        </ol>
      )}
    </div>
  );
}

interface InstructionStepProps {
  step: string;
}

function InstructionStep({ step }: InstructionStepProps) {
  return (
    <li className="text-sm pl-1">
      {step}
    </li>
  );
}