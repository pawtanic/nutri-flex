export type ActionResponse = {
  success: boolean;
  message: string;
  errors?: any;
  inputs?: any;
  calculatedGoal?: number | null;
};
