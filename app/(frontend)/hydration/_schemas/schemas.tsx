import { z } from 'zod';

export const waterIntakeSchema = z.object({
  waterIntake: z.preprocess(
    val => (val === '' ? undefined : Number(val)),
    z
      .number({
        required_error: 'Water intake is required',
      })
      .min(50, 'Water intake must be greater than 50')
      .max(10000, 'Water intake must be less than 10000')
  ),
  date: z.date({
    required_error: 'Date is required',
    invalid_type_error: 'Invalid date format',
  }),
});

export type WaterIntakeSchema = z.infer<typeof waterIntakeSchema>;
