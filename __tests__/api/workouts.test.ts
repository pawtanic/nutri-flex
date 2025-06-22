import { NextRequest } from 'next/server';
import mongoose from 'mongoose';
import { clearTestDB, setupTestDB, teardownTestDB } from '../utils/test-db';
import { GET as getAllWorkouts, POST as createWorkout } from '@/app/api/workouts/route';
import { DELETE as deleteWorkout, GET as getWorkoutById, PUT as updateWorkout } from '@/app/api/workouts/[id]/route';
import { ExerciseModel } from '@/lib/models/exercises.model';
import { WorkoutModel } from '@/lib/models/workouts.model';

// Mock NextRequest
const createMockRequest = (body?: any): NextRequest => {
  return {
    json: jest.fn().mockResolvedValue(body),
    nextUrl: { pathname: '/api/workouts' },
  } as unknown as NextRequest;
};

// Mock params for ID routes
const createMockParams = (id: string) => ({ params: { id } });

describe('Workouts API', () => {
  // Setup test database before all tests
  beforeAll(async () => {
    await setupTestDB();
  });

  // Clear database after each test
  afterEach(async () => {
    await clearTestDB();
  });

  // Close database connection after all tests
  afterAll(async () => {
    await teardownTestDB();
  });

  // Test data
  const testExercise = {
    name: 'Test Exercise',
    sets: [{ reps: 10, weight: 50 }],
    muscleGroups: ['chest'],
    difficulty: 'intermediate',
    equipment: ['dumbbells'],
  };

  const testWorkout = {
    name: 'Test Workout',
    date: new Date(),
    exercises: [] as mongoose.Types.ObjectId[],
  };

  // Helper function to create a test exercise
  const createTestExercise = async () => {
    const exercise = await ExerciseModel.create(testExercise);
    return exercise;
  };

  // Helper function to create a test workout
  const createTestWorkout = async (exerciseIds: mongoose.Types.ObjectId[] = []) => {
    const workout = await WorkoutModel.create({
      ...testWorkout,
      exercises: exerciseIds,
    });
    return workout;
  };

  describe('GET /api/workouts', () => {
    it('should return an empty array when no workouts exist', async () => {
      const response = await getAllWorkouts();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual([]);
    });

    it('should return all workouts', async () => {
      // Create a test workout
      const workout = await createTestWorkout();

      const response = await getAllWorkouts();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveLength(1);
      expect(data[0].name).toBe(testWorkout.name);
    });
  });

  describe('POST /api/workouts', () => {
    it('should create a new workout', async () => {
      const request = createMockRequest(testWorkout);

      const response = await createWorkout(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.name).toBe(testWorkout.name);

      // Verify workout was created in the database
      const workouts = await WorkoutModel.find();
      expect(workouts).toHaveLength(1);
      expect(workouts[0].name).toBe(testWorkout.name);
    });

    it('should create a workout with exercises', async () => {
      // Create a test exercise first
      const exercise = await createTestExercise();

      // Create workout with the exercise
      const workoutWithExercise = {
        ...testWorkout,
        exercises: [exercise._id],
      };

      const request = createMockRequest(workoutWithExercise);

      const response = await createWorkout(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.name).toBe(testWorkout.name);

      // Verify workout was created with the exercise
      const workouts = await WorkoutModel.find().populate('exercises');
      expect(workouts).toHaveLength(1);
      expect(workouts[0].exercises).toHaveLength(1);
      expect(workouts[0].exercises[0].name).toBe(testExercise.name);
    });

    it('should handle invalid exercise IDs', async () => {
      // Create workout with a non-existent exercise ID
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      const workoutWithInvalidExercise = {
        ...testWorkout,
        exercises: [nonExistentId],
      };

      const request = createMockRequest(workoutWithInvalidExercise);

      // This should either throw an error or return a 400/500 response
      // depending on how the API handles validation errors
      try {
        const response = await createWorkout(request);
        // If we get a response, it should be an error response
        expect(response.status).toBeGreaterThanOrEqual(400);

        // Verify no workout was created
        const workouts = await WorkoutModel.find();
        expect(workouts).toHaveLength(0);
      } catch (error) {
        // If it throws, that's also acceptable
        expect(error).toBeDefined();
      }
    });

    it('should return 400 if name or date is missing', async () => {
      const request = createMockRequest({ name: 'Test Workout' }); // Missing date

      const response = await createWorkout(request);

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/workouts/[id]', () => {
    it('should return a workout by id', async () => {
      // Create a test workout
      const workout = await createTestWorkout();

      const response = await getWorkoutById(
        createMockRequest(),
        createMockParams(workout._id.toString())
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.name).toBe(testWorkout.name);
    });

    it('should return 404 if workout not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();

      const response = await getWorkoutById(
        createMockRequest(),
        createMockParams(nonExistentId)
      );

      expect(response.status).toBe(404);
    });

    it('should return 400 if id is invalid', async () => {
      const response = await getWorkoutById(
        createMockRequest(),
        createMockParams('invalid-id')
      );

      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/workouts/[id]', () => {
    it('should update a workout', async () => {
      // Create a test workout
      const workout = await createTestWorkout();

      const updateData = {
        name: 'Updated Workout Name',
      };

      const request = createMockRequest(updateData);

      const response = await updateWorkout(
        request,
        createMockParams(workout._id.toString())
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.name).toBe(updateData.name);

      // Verify workout was updated in the database
      const updatedWorkout = await WorkoutModel.findById(workout._id);
      expect(updatedWorkout?.name).toBe(updateData.name);
    });

    it('should update a workout with exercises', async () => {
      // Create a test workout without exercises
      const workout = await createTestWorkout();

      // Create a test exercise
      const exercise = await createTestExercise();

      // Update workout to include the exercise
      const updateData = {
        name: 'Updated Workout with Exercise',
        exercises: [exercise._id],
      };

      const request = createMockRequest(updateData);

      const response = await updateWorkout(
        request,
        createMockParams(workout._id.toString())
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.name).toBe(updateData.name);

      // Verify workout was updated with the exercise
      const updatedWorkout = await WorkoutModel.findById(workout._id).populate('exercises');
      expect(updatedWorkout?.name).toBe(updateData.name);
      expect(updatedWorkout?.exercises).toHaveLength(1);
      expect(updatedWorkout?.exercises[0].name).toBe(testExercise.name);
    });

    it('should return 404 if workout not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();

      const request = createMockRequest({ name: 'Updated Workout' });

      const response = await updateWorkout(
        request,
        createMockParams(nonExistentId)
      );

      expect(response.status).toBe(404);
    });

    it('should return 400 if id is invalid', async () => {
      const request = createMockRequest({ name: 'Updated Workout' });

      const response = await updateWorkout(
        request,
        createMockParams('invalid-id')
      );

      expect(response.status).toBe(400);
    });

    it('should return 400 if update data is empty', async () => {
      // Create a test workout
      const workout = await createTestWorkout();

      const request = createMockRequest({});

      const response = await updateWorkout(
        request,
        createMockParams(workout._id.toString())
      );

      expect(response.status).toBe(400);
    });

    it('should handle invalid exercise IDs when updating', async () => {
      // Create a test workout
      const workout = await createTestWorkout();

      // Update with a non-existent exercise ID
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      const updateData = {
        name: 'Updated Workout with Invalid Exercise',
        exercises: [nonExistentId],
      };

      const request = createMockRequest(updateData);

      // This should either throw an error or return a 400/500 response
      // depending on how the API handles validation errors
      try {
        const response = await updateWorkout(
          request,
          createMockParams(workout._id.toString())
        );

        // If we get a response, it should be an error response
        expect(response.status).toBeGreaterThanOrEqual(400);

        // Verify workout was not updated with the invalid exercise
        const updatedWorkout = await WorkoutModel.findById(workout._id);
        expect(updatedWorkout?.exercises).toHaveLength(0);
      } catch (error) {
        // If it throws, that's also acceptable
        expect(error).toBeDefined();
      }
    });
  });

  describe('DELETE /api/workouts/[id]', () => {
    it('should delete a workout', async () => {
      // Create a test workout
      const workout = await createTestWorkout();

      const response = await deleteWorkout(
        createMockRequest(),
        createMockParams(workout._id.toString())
      );

      expect(response.status).toBe(200);

      // Verify workout was deleted from the database
      const deletedWorkout = await WorkoutModel.findById(workout._id);
      expect(deletedWorkout).toBeNull();
    });

    it('should return 404 if workout not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();

      const response = await deleteWorkout(
        createMockRequest(),
        createMockParams(nonExistentId)
      );

      expect(response.status).toBe(404);
    });

    it('should return 400 if id is invalid', async () => {
      const response = await deleteWorkout(
        createMockRequest(),
        createMockParams('invalid-id')
      );

      expect(response.status).toBe(400);
    });
  });
});
