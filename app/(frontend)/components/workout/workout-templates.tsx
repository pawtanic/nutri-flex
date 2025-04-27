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

// Sample template data - in a real app, this would come from your database
const initialTemplates = [
  {
    id: 1,
    name: 'Upper Body',
    exercises: [
      { name: 'Bench Press', sets: 3, reps: 10 },
      { name: 'Pull-ups', sets: 3, reps: 8 },
      { name: 'Shoulder Press', sets: 3, reps: 12 },
      { name: 'Bicep Curls', sets: 3, reps: 12 },
      { name: 'Tricep Extensions', sets: 3, reps: 12 },
    ],
  },
  {
    id: 2,
    name: 'Lower Body',
    exercises: [
      { name: 'Squats', sets: 4, reps: 10 },
      { name: 'Deadlifts', sets: 3, reps: 8 },
      { name: 'Lunges', sets: 3, reps: 12 },
      { name: 'Leg Press', sets: 3, reps: 12 },
      { name: 'Calf Raises', sets: 3, reps: 15 },
    ],
  },
  {
    id: 3,
    name: 'Push Day',
    exercises: [
      { name: 'Bench Press', sets: 4, reps: 8 },
      { name: 'Incline Press', sets: 3, reps: 10 },
      { name: 'Shoulder Press', sets: 3, reps: 10 },
      { name: 'Tricep Pushdowns', sets: 3, reps: 12 },
      { name: 'Lateral Raises', sets: 3, reps: 15 },
    ],
  },
  {
    id: 4,
    name: 'Pull Day',
    exercises: [
      { name: 'Pull-ups', sets: 4, reps: 8 },
      { name: 'Barbell Rows', sets: 3, reps: 10 },
      { name: 'Face Pulls', sets: 3, reps: 15 },
      { name: 'Bicep Curls', sets: 3, reps: 12 },
      { name: 'Hammer Curls', sets: 3, reps: 12 },
    ],
  },
];

interface WorkoutTemplatesProps {
  onUseTemplate: (template: any) => void;
  currentWorkout: any;
}

export function WorkoutTemplates({ onUseTemplate, currentWorkout }: WorkoutTemplatesProps) {
  const [templates, setTemplates] = useState(initialTemplates);
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

    const newTemplate = {
      id: templates.length + 1,
      name: newTemplateName,
      exercises: [...currentWorkout.exercises],
    };

    setTemplates([...templates, newTemplate]);
    setNewTemplateName('');
    setSaveDialogOpen(false);

    toast({
      title: 'Template saved',
      description: `"${newTemplateName}" has been saved to your templates`,
    });
  };

  const handleUseTemplate = (template: any) => {
    onUseTemplate(template);
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
            {templates.map(template => (
              <div
                key={template.id}
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
