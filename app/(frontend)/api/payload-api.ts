// /**
//  * Payload API Layer
//  *
//  * This file contains the API client and services for internal backend APIs.
//  * It follows a structured approach to make API calls and integrate with TanStack Query.
//  */
//
// import axios, {
//   AxiosInstance,
//   AxiosRequestConfig,
//   AxiosResponse,
//   AxiosError,
// } from "axios";
// import { ApiClient, ApiError, ApiResponse } from "./public-api";
//
// // Create a client for the internal backend API
// const BACKEND_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
// const payloadApiClient = new ApiClient(BACKEND_API_BASE_URL);
//
// // Example of query key factories for internal API resources
// export const workoutKeys = {
//   all: ["workouts"] as const,
//   lists: () => [...workoutKeys.all, "list"] as const,
//   list: (filters: string) => [...workoutKeys.lists(), { filters }] as const,
//   details: () => [...workoutKeys.all, "detail"] as const,
//   detail: (id: string) => [...workoutKeys.details(), id] as const,
// };
//
// // Example of a workout interface (replace with actual types)
// export interface Workout {
//   id: string;
//   name: string;
//   description?: string;
//   exercises: WorkoutExercise[];
//   // Add other fields as needed
// }
//
// export interface WorkoutExercise {
//   id: string;
//   name: string;
//   sets: number;
//   reps: number;
//   // Add other fields as needed
// }
//
// // Example of a workout API service
// export const workoutApi = {
//   /**
//    * Fetches all workouts
//    * @returns A promise that resolves to an array of workouts
//    */
//   getAll: async (): Promise<Workout[]> => {
//     const response = await payloadApiClient.get<Workout[]>("/api/workouts");
//     return response.data;
//   },
//
//   /**
//    * Fetches a workout by ID
//    * @param id - The ID of the workout to fetch
//    * @returns A promise that resolves to a workout
//    */
//   getById: async (id: string): Promise<Workout> => {
//     const response = await payloadApiClient.get<Workout>(`/api/workouts/${id}`);
//     return response.data;
//   },
//
//   /**
//    * Creates a new workout
//    * @param workout - The workout data to create
//    * @returns A promise that resolves to the created workout
//    */
//   create: async (workout: Omit<Workout, "id">): Promise<Workout> => {
//     const response = await payloadApiClient.post<Workout>("/api/workouts", workout);
//     return response.data;
//   },
//
//   /**
//    * Updates an existing workout
//    * @param id - The ID of the workout to update
//    * @param workout - The updated workout data
//    * @returns A promise that resolves to the updated workout
//    */
//   update: async (id: string, workout: Partial<Workout>): Promise<Workout> => {
//     const response = await payloadApiClient.put<Workout>(`/api/workouts/${id}`, workout);
//     return response.data;
//   },
//
//   /**
//    * Deletes a workout
//    * @param id - The ID of the workout to delete
//    * @returns A promise that resolves when the workout is deleted
//    */
//   delete: async (id: string): Promise<void> => {
//     await payloadApiClient.delete<void>(`/api/workouts/${id}`);
//   },
//
//   /**
//    * Query functions for TanStack Query
//    */
//   queryFn: {
//     getAll: async (): Promise<Workout[]> => {
//       return workoutApi.getAll();
//     },
//     getById: async ({ queryKey }: { queryKey: readonly [string, string, string] }): Promise<Workout> => {
//       const [_, __, id] = queryKey;
//       return workoutApi.getById(id);
//     },
//   },
// };
