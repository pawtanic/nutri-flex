# API Documentation

This document provides information about the available APIs in the NutriFlex application.

## File Upload API

The File Upload API allows you to upload files and associate them with different entities in the system.

### Upload a File

**Endpoint:** `POST /api/uploads`

**Request:**
- Content-Type: `multipart/form-data`
- Body:
  - `file`: The file to upload
  - `entityType`: The type of entity to associate the file with (e.g., "user", "exercise", "workout")
  - `entityId`: The ID of the entity to associate the file with
  - `description` (optional): A description of the file

**Response:**
```json
{
  "_id": "file_id",
  "filename": "generated_filename.jpg",
  "originalFilename": "original_filename.jpg",
  "mimetype": "image/jpeg",
  "size": 12345,
  "path": "uploads/generated_filename.jpg",
  "type": "image",
  "entityType": "exercise",
  "entityId": "exercise_id",
  "description": "Exercise image"
}
```

### Get Files for an Entity

**Endpoint:** `GET /api/uploads?entityType=exercise&entityId=exercise_id`

**Response:**
```json
[
  {
    "_id": "file_id",
    "filename": "generated_filename.jpg",
    "originalFilename": "original_filename.jpg",
    "mimetype": "image/jpeg",
    "size": 12345,
    "path": "uploads/generated_filename.jpg",
    "type": "image",
    "entityType": "exercise",
    "entityId": "exercise_id",
    "description": "Exercise image"
  }
]
```

### Delete a File

**Endpoint:** `DELETE /api/uploads?id=file_id`

**Response:**
```json
{
  "_id": "file_id",
  "filename": "generated_filename.jpg",
  "originalFilename": "original_filename.jpg",
  "mimetype": "image/jpeg",
  "size": 12345,
  "path": "uploads/generated_filename.jpg",
  "type": "image",
  "entityType": "exercise",
  "entityId": "exercise_id",
  "description": "Exercise image"
}
```

## Exercise API

The Exercise API allows you to manage exercises in the system.

### Get All Exercises

**Endpoint:** `GET /api/exercises`

**Query Parameters:**
- `muscleGroup` (optional): Filter exercises by muscle group
- `difficulty` (optional): Filter exercises by difficulty level
- `equipment` (optional): Filter exercises by equipment type

**Response:**
```json
[
  {
    "_id": "exercise_id",
    "name": "Bench Press",
    "description": "A compound exercise that targets the chest, shoulders, and triceps.",
    "instructions": "Lie on a bench, grip the barbell, lower it to your chest, then push it back up.",
    "image": "uploads/bench_press.jpg",
    "muscleGroups": ["chest", "shoulders", "arms"],
    "difficulty": "intermediate",
    "equipment": ["barbell", "machine"],
    "sets": []
  }
]
```

### Create an Exercise

**Endpoint:** `POST /api/exercises`

**Request:**
```json
{
  "name": "Bench Press",
  "description": "A compound exercise that targets the chest, shoulders, and triceps.",
  "instructions": "Lie on a bench, grip the barbell, lower it to your chest, then push it back up.",
  "muscleGroups": ["chest", "shoulders", "arms"],
  "difficulty": "intermediate",
  "equipment": ["barbell", "machine"],
  "sets": []
}
```

**Response:**
```json
{
  "_id": "exercise_id",
  "name": "Bench Press",
  "description": "A compound exercise that targets the chest, shoulders, and triceps.",
  "instructions": "Lie on a bench, grip the barbell, lower it to your chest, then push it back up.",
  "muscleGroups": ["chest", "shoulders", "arms"],
  "difficulty": "intermediate",
  "equipment": ["barbell", "machine"],
  "sets": []
}
```

### Get an Exercise

**Endpoint:** `GET /api/exercises/{id}`

**Response:**
```json
{
  "_id": "exercise_id",
  "name": "Bench Press",
  "description": "A compound exercise that targets the chest, shoulders, and triceps.",
  "instructions": "Lie on a bench, grip the barbell, lower it to your chest, then push it back up.",
  "image": "uploads/bench_press.jpg",
  "muscleGroups": ["chest", "shoulders", "arms"],
  "difficulty": "intermediate",
  "equipment": ["barbell", "machine"],
  "sets": []
}
```

### Update an Exercise

**Endpoint:** `PUT /api/exercises/{id}`

**Request:**
```json
{
  "name": "Bench Press",
  "description": "Updated description",
  "instructions": "Updated instructions",
  "muscleGroups": ["chest", "shoulders"],
  "difficulty": "advanced",
  "equipment": ["barbell"],
  "sets": []
}
```

**Response:**
```json
{
  "_id": "exercise_id",
  "name": "Bench Press",
  "description": "Updated description",
  "instructions": "Updated instructions",
  "image": "uploads/bench_press.jpg",
  "muscleGroups": ["chest", "shoulders"],
  "difficulty": "advanced",
  "equipment": ["barbell"],
  "sets": []
}
```

### Delete an Exercise

**Endpoint:** `DELETE /api/exercises/{id}`

**Response:**
```json
{
  "_id": "exercise_id",
  "name": "Bench Press",
  "description": "A compound exercise that targets the chest, shoulders, and triceps.",
  "instructions": "Lie on a bench, grip the barbell, lower it to your chest, then push it back up.",
  "image": "uploads/bench_press.jpg",
  "muscleGroups": ["chest", "shoulders", "arms"],
  "difficulty": "intermediate",
  "equipment": ["barbell", "machine"],
  "sets": []
}
```

## Workout API

The Workout API allows you to manage workouts in the system.

### Get All Workouts

**Endpoint:** `GET /api/workouts`

**Response:**
```json
[
  {
    "_id": "workout_id",
    "name": "Chest Day",
    "date": "2023-06-01T00:00:00.000Z",
    "image": "uploads/chest_day.jpg",
    "exercises": [
      {
        "exercise": {
          "_id": "exercise_id",
          "name": "Bench Press"
        },
        "sets": [
          {
            "reps": 10,
            "weight": 135
          }
        ],
        "notes": "Focus on form"
      }
    ]
  }
]
```

### Create a Workout

**Endpoint:** `POST /api/workouts`

**Request:**
```json
{
  "name": "Chest Day",
  "date": "2023-06-01T00:00:00.000Z",
  "exercises": [
    {
      "exercise": "exercise_id",
      "sets": [
        {
          "reps": 10,
          "weight": 135
        }
      ],
      "notes": "Focus on form"
    }
  ]
}
```

**Response:**
```json
{
  "_id": "workout_id",
  "name": "Chest Day",
  "date": "2023-06-01T00:00:00.000Z",
  "exercises": [
    {
      "exercise": {
        "_id": "exercise_id",
        "name": "Bench Press"
      },
      "sets": [
        {
          "reps": 10,
          "weight": 135
        }
      ],
      "notes": "Focus on form"
    }
  ]
}
```

## Example: Uploading an Image for an Exercise

1. Create an exercise:
```javascript
const response = await fetch('/api/exercises', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Bench Press',
    description: 'A compound exercise that targets the chest, shoulders, and triceps.',
    instructions: 'Lie on a bench, grip the barbell, lower it to your chest, then push it back up.',
    muscleGroups: ['chest', 'shoulders', 'arms'],
    difficulty: 'intermediate',
    equipment: ['barbell', 'machine'],
  }),
});

const exercise = await response.json();
```

2. Upload an image for the exercise:
```javascript
const formData = new FormData();
formData.append('file', imageFile);
formData.append('entityType', 'exercise');
formData.append('entityId', exercise._id);
formData.append('description', 'Exercise image');

const uploadResponse = await fetch('/api/uploads', {
  method: 'POST',
  body: formData,
});

const uploadedFile = await uploadResponse.json();
```

3. Update the exercise with the image URL:
```javascript
const updateResponse = await fetch(`/api/exercises/${exercise._id}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    ...exercise,
    image: uploadedFile.path,
  }),
});

const updatedExercise = await updateResponse.json();
```
