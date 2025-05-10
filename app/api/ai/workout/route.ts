import { NextRequest } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { RequiredDataFromCollectionSlug } from 'payload';
import { DataUtils } from '@/lib/utils/data';
import BotService from '@/lib/services/BotService';
import { Workout } from '@/payload-types';

/**
 * Interface for the workout request body
 */
interface WorkoutRequestBody {
  question: string;
  instruction?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  duration?: number;
  type?: 'strength' | 'cardio' | 'hiit' | 'flexibility' | 'hybrid';
  targetMuscleGroups?: string[];
  equipment?: string[];
}

/**
 * POST handler for the workout route
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body: WorkoutRequestBody = await request.json();

    // Validate the request
    if (!body.question) {
      return Response.json({ error: 'Question is required' }, { status: 400 });
    }

    // Initialize the payload instance
    const payload = await getPayload({
      config: configPromise,
    });

    // Prepare the context for the AI request
    const context: Record<string, any> = {};

    // Add optional parameters to the context if provided
    if (body.level) context.level = body.level;
    if (body.duration) context.duration = body.duration;
    if (body.type) context.type = body.type;
    if (body.targetMuscleGroups) context.targetMuscleGroups = body.targetMuscleGroups;
    if (body.equipment) context.equipment = body.equipment;

    // Define the expected response format that matches the database schema
    const responseFormat: RequiredDataFromCollectionSlug<'workouts'> = {
      name: 'Workout Name',
      date: new Date().toISOString(),
      exercises: [
        {
          exerciseName: 'Exercise Name',
          sets: [
            {
              reps: 10,
              weight: 20,
            },
          ],
        },
      ],
      notes: DataUtils.convertToRichText('Additional notes for the workout'),
    };

    // Custom formatting instructions for the workout response that matches the database schema
    const formattingInstructions = `
    {
      "name": "Workout Name", // REQUIRED: Provide a descriptive name for the workout
      "date": "${new Date().toISOString()}", // Current date in ISO format
      "exercises": [
        {
          "exerciseName": "Exercise Name", // REQUIRED: Name of the exercise
          "sets": [
            {
              "reps": 10, // REQUIRED: Number of repetitions (between 1 and 100)
              "weight": 20 // REQUIRED: Weight in pounds/kg (minimum 0)
            },
            // Add more sets as needed
            {
              "reps": 10,
              "weight": 20
            }
          ]
        },
        // Add more exercises as needed, at least 3-5 exercises for a complete workout
        {
          "exerciseName": "Another Exercise",
          "sets": [
            {
              "reps": 12,
              "weight": 15
            }
          ]
        }
      ],
      "notes": {
        "root": {
          "type": "root",
          "children": [
            {
              "type": "paragraph",
              "children": [{"text": "Detailed instructions for the workout, including warm-up and cool-down recommendations."}]
            }
          ],
          "direction": null,
          "format": "",
          "indent": 0,
          "version": 1
        }
      }
    }`;

    // Call the AI service to generate the workout directly in the database format
    const workoutData = await BotService.generateResponse<
      RequiredDataFromCollectionSlug<'workouts'>
    >({
      query: body.question,
      instruction:
        body.instruction ||
        'You are a fitness expert with knowledge of various workout types and exercises.',
      context,
      responseFormat,
      formattingInstructions,
    });

    // Helper function to validate and sanitize workout data
    const validateWorkoutData = (data: any): RequiredDataFromCollectionSlug<'workouts'> => {
      // Ensure exercises have valid values
      const validatedExercises = Array.isArray(data.exercises)
        ? data.exercises.map((exercise: any) => ({
            exerciseName: exercise.exerciseName || 'Unnamed Exercise',
            sets: Array.isArray(exercise.sets)
              ? exercise.sets.map((set: any) => ({
                  reps: typeof set.reps === 'number' ? Math.max(1, Math.min(set.reps, 100)) : 10,
                  weight: typeof set.weight === 'number' ? Math.max(0, set.weight) : 0,
                }))
              : [{ reps: 10, weight: 0 }],
          }))
        : [];

      // Ensure notes has valid structure
      const validatedNotes =
        data.notes && data.notes.root && data.notes.root.children
          ? data.notes
          : DataUtils.convertToRichText('Additional notes for the workout');

      // Return the validated workout data
      return {
        name: data.name || 'Untitled Workout',
        date: data.date || new Date().toISOString(),
        exercises: validatedExercises,
        notes: validatedNotes,
      };
    };

    // Save the workout to the database
    try {
      // Validate and ensure the response has all required fields
      const workoutToSave = validateWorkoutData(workoutData);

      // Create the workout in the database and get the created workout object
      const createdWorkout = await payload.create({
        collection: 'workouts',
        data: workoutToSave,
      });

      // Return the created workout
      return Response.json(createdWorkout);
    } catch (error) {
      console.error('Error saving workout to database:', error);

      // Check if it's a validation error
      if (error instanceof Error && error.name === 'ValidationError') {
        return Response.json(
          {
            error: 'Validation error when saving workout',
            details: error.message || 'Unknown validation error',
          },
          { status: 400 }
        );
      }

      return Response.json({ error: 'Failed to save workout to database' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error processing workout request:', error);
    return Response.json({ error: 'Failed to process workout request' }, { status: 500 });
  }
}

/**
 * The workout route handles AI-generated workout plans.
 *
 * The service handles:
 * - Constructing the prompt with the user's query and context
 * - Calling the AI model
 * - Parsing and returning the response directly in the database format
 *
 * The response format is structured to match the database schema exactly,
 * eliminating the need for post-processing before saving to the database.
 * This includes properly formatted rich text fields for notes.
 *
 * See the GeminiAIService.ts file for more details on how to use the service
 * for other AI generation needs.
 */
