'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Copy, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Workout } from '@/lib/models/workouts.model';

const mockId = (id: number) => `00000000000000000000000${id}` as unknown as any;

// Sample template data - in a real app, this would come from your database or API
const initialTemplatesLocal: Workout[] = [
  {
    _id: 'template-1' as any,
    name: 'Upper Body',
    date: new Date(),
    exercises: [
      { exercise: mockId(1), sets: [{ reps: 10, weight: 60 }], notes: '' },
      { exercise: mockId(2), sets: [{ reps: 8, weight: 0 }], notes: '' },
      { exercise: mockId(3), sets: [{ reps: 12, weight: 30 }], notes: '' },
      { exercise: mockId(4), sets: [{ reps: 12, weight: 15 }], notes: '' },
      { exercise: mockId(5), sets: [{ reps: 12, weight: 15 }], notes: '' },
    ],
  },
  {
    _id: 'template-2' as any,
    name: 'Lower Body',
    date: new Date(),
    exercises: [
      { exercise: mockId(6), sets: [{ reps: 10, weight: 80 }], notes: '' },
      { exercise: mockId(7), sets: [{ reps: 8, weight: 100 }], notes: '' },
      { exercise: mockId(8), sets: [{ reps: 12, weight: 20 }], notes: '' },
      { exercise: mockId(9), sets: [{ reps: 12, weight: 120 }], notes: '' },
      { exercise: mockId(10), sets: [{ reps: 15, weight: 40 }], notes: '' },
    ],
  },
];

interface WorkoutTemplatesProps {
  initialTemplates?: Workout[];
  onUseTemplateAction: (template: Workout) => void;
  currentWorkout: Workout;
}

export function WorkoutTemplates({ onUseTemplateAction, currentWorkout, initialTemplates }: WorkoutTemplatesProps) {
  const [templates, setTemplates] = useState<Workout[]>(initialTemplates ?? initialTemplatesLocal);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleSaveTemplate = () => {
    if (!newTemplateName.trim()) {
      toast({
        title: 'Template name required',
        description: 'Please enter a name for your template',
        variant: 'destructive',
      });
      return;
    }

    if (!currentWorkout.exercises || currentWorkout.exercises.length === 0) {
      toast({
        title: 'No exercises to save',
        description: 'Add some exercises before saving as a template',
        variant: 'destructive',
      });
      return;
    }

    // Deep clone to ensure serializability
    const newTemplate: Workout = {
      ...JSON.parse(JSON.stringify(currentWorkout)),
      name: newTemplateName,
    };

    setTemplates([...templates, newTemplate]);
    setNewTemplateName('');
    setSaveDialogOpen(false);

    toast({
      title: 'Template saved',
      description: `"${newTemplateName}" has been saved to your templates`,
    });
  };

  const handleUseTemplate = (template: Workout) => {
    onUseTemplateAction(template);
    toast({
      title: 'Template applied',
      description: `"${template.name}" has been applied to your workout`,
    });
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Workout Templates</CardTitle>
          <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Save className="h-4 w-4 mr-1" />
                Save Current
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Save as Template</DialogTitle>
                <DialogDescription>
                  Save your current workout as a template for future use.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Label htmlFor="template-name" className="text-right">
                  Template Name
                </Label>
                <Input
                  id="template-name"
                  value={newTemplateName}
                  onChange={e => setNewTemplateName(e.target.value)}
                  placeholder="e.g., Upper Body, Leg Day"
                  className="mt-1"
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveTemplate}>Save Template</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-60 pr-4">
          <div className="space-y-2">
            {templates.map((template, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 border rounded-md hover:bg-accent/50 transition-colors"
              >
                <div>
                  <div className="font-medium">{template.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {template.exercises.length} exercises
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleUseTemplate(template)}>
                  <Copy className="h-4 w-4 mr-1" />
                  Use
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
