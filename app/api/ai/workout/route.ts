import { NextRequest } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { RequiredDataFromCollectionSlug } from 'payload';
import {DataUtils} from "@/lib/utils/data";
import BotService from "@/lib/services/BotService";
import { Workout } from '@/payload-types';
import { WorkoutExercise } from '@/lib/collections/types';

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
 * Example response directly in the database format:
 * {
 *   "name": "Full Body HIIT Circuit",
 *   "description": "A high-intensity interval training workout that targets all major muscle groups...",
 *   "level": "intermediate",
 *   "duration": 45,
 *   "type": "hiit",
 *   "targetMuscleGroups": ["chest", "back", "shoulders", "arms", "legs", "core"],
 *   "exercises": [
 *     {
 *       "exercise": "60f1a5c3e4b0f2001c1e1a01", // ID of the exercise in the database
 *       "sets": 3,
 *       "reps": "15",
 *       "restBetweenSets": 30,
 *       "notes": "Focus on form and control throughout the movement"
 *     }
 *   ],
 *   "notes": {
 *     "root": {
 *       "type": "root",
 *       "children": [
 *         {
 *           "type": "paragraph",
 *           "children": [{"text": "Warm up for 5 minutes before starting the workout..."}]
 *         }
 *       ],
 *       "direction": null,
 *       "format": "",
 *       "indent": 0,
 *       "version": 1
 *     }
 *   }
 * }
 */

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
    if (body.level) {
      context.level = body.level;
    }
    if (body.duration) {
      context.duration = body.duration;
    }
    if (body.type) {
      context.type = body.type;
    }
    if (body.targetMuscleGroups) {
      context.targetMuscleGroups = body.targetMuscleGroups;
    }
    if (body.equipment) {
      context.equipment = body.equipment;
    }

    // Define the expected response format that matches the database schema
    const responseFormat: RequiredDataFromCollectionSlug<'workouts'> = {
      name: "Workout Name",
      description: "Brief overview of the workout",
      level: "intermediate", // Default level
      duration: 45, // Example duration in minutes
      type: "strength", // Default type
      targetMuscleGroups: ["chest", "back"], // Example target muscle groups
      exercises: [
        {
          exercise: "", // This would be an ID in a real implementation
          sets: 3,
          reps: "10",
          restBetweenSets: 60,
          notes: "Focus on form"
        }
      ],
      notes: DataUtils.convertToRichText("Additional notes for the workout")
    };

    // Custom formatting instructions for the workout response that matches the database schema
    const formattingInstructions = `
    {
      "name": "Workout Name", // REQUIRED: Provide a descriptive name for the workout
      "description": "Brief overview of the workout", // REQUIRED: Provide a concise description of the workout
      "level": "${body.level || 'intermediate'}", // REQUIRED: Use one of: beginner, intermediate, advanced
      "duration": ${body.duration || 45}, // REQUIRED: Total workout duration in minutes (between 5 and 180)
      "type": "${body.type || 'strength'}", // REQUIRED: Use one of: strength, cardio, hiit, flexibility, hybrid
      "targetMuscleGroups": ${JSON.stringify(body.targetMuscleGroups || ["chest", "back", "shoulders", "arms", "legs", "core"])}, // REQUIRED: Use any combination of: chest, back, shoulders, arms, legs, core, fullBody
      "exercises": [
        {
          "exercise": "", // This would be an ID in a real implementation, leave empty for now
          "sets": 3, // REQUIRED: Number of sets (between 1 and 20)
          "reps": "10", // REQUIRED: Number of reps as a string (e.g., "10", "8-12", "Until failure")
          "restBetweenSets": 60, // REQUIRED: Rest time between sets in seconds (between 0 and 300)
          "notes": "Focus on form and control throughout the movement" // Optional: Additional notes for this exercise
        },
        // Add more exercises as needed, at least 3-5 exercises for a complete workout
        {
          "exercise": "",
          "sets": 4,
          "reps": "12-15",
          "restBetweenSets": 45,
          "notes": "Maintain proper form throughout the exercise"
        },
        {
          "exercise": "",
          "sets": 3,
          "reps": "8-10",
          "restBetweenSets": 90,
          "notes": "Use a weight that challenges you for the last 2 reps"
        }
      ],
      "notes": {
        "root": {
          "type": "root",
          "children": [
            {
              "type": "paragraph",
              "children": [{"text": "Detailed instructions for the workout, including warm-up and cool-down recommendations. Provide guidance on proper form, breathing techniques, and any modifications for different fitness levels."}]
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
    const workoutData = await BotService.generateResponse<RequiredDataFromCollectionSlug<'workouts'>>({
      query: body.question,
      instruction: body.instruction || 'You are a fitness expert with knowledge of various workout types and exercises.',
      context,
      responseFormat,
      formattingInstructions
    });

    // Helper function to validate and sanitize workout data
    const validateWorkoutData = (data: any): RequiredDataFromCollectionSlug<'workouts'> => {
      // Ensure exercises have valid values
      const validatedExercises = Array.isArray(data.exercises) 
        ? data.exercises.map((exercise: WorkoutExercise, index: number) => ({
            exercise: exercise.exercise || '', // This would be an ID in a real implementation
            sets: typeof exercise.sets === 'number' ? Math.max(1, Math.min(exercise.sets, 20)) : 3,
            reps: exercise.reps || '10',
            restBetweenSets: typeof exercise.restBetweenSets === 'number' ? Math.max(0, Math.min(exercise.restBetweenSets, 300)) : 60,
            notes: exercise.notes || null,
          }))
        : [];

      // Ensure notes has valid structure
      const validatedNotes = (data.notes && data.notes.root && data.notes.root.children) 
        ? data.notes 
        : DataUtils.convertToRichText("Additional notes for the workout");

      // Ensure targetMuscleGroups is valid
      const validMuscleGroups = ['chest', 'back', 'shoulders', 'arms', 'legs', 'core', 'fullBody'];
      const validatedTargetMuscleGroups = Array.isArray(data.targetMuscleGroups) 
        ? data.targetMuscleGroups.filter((group: string) => validMuscleGroups.includes(group))
        : ['fullBody'];

      // If no valid muscle groups were found, default to fullBody
      if (validatedTargetMuscleGroups.length === 0) {
        validatedTargetMuscleGroups.push('fullBody');
      }

      // Return the validated workout data
      return {
        name: data.name || 'Untitled Workout',
        description: data.description || '',
        level: ['beginner', 'intermediate', 'advanced'].includes(data.level) ? data.level : 'intermediate',
        duration: typeof data.duration === 'number' ? Math.max(5, Math.min(data.duration, 180)) : 45,
        type: ['strength', 'cardio', 'hiit', 'flexibility', 'hybrid'].includes(data.type) ? data.type : 'strength',
        targetMuscleGroups: validatedTargetMuscleGroups,
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
        return Response.json({
          error: 'Validation error when saving workout',
          details: error.message || 'Unknown validation error'
        }, { status: 400 });
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
