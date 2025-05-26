// import React from 'react';
// import { render, screen, waitFor } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
// import { CalculateProteinIntakeModal } from '../_components/calculate-protein-intake-modal';
// import { saveProteinIntakeAction } from '../_actions/protein-intake';
// import { UserFitnessData } from '../_components/fitness-goals';
//
// // Mock the server action
// jest.mock('../_actions/protein-intake', () => ({
//   saveProteinIntakeAction: jest.fn(),
// }));
//
// // Mock the useFocusError hook
// jest.mock('@/hooks/use-focus-error', () => ({
//   useFocusError: jest.fn(),
// }));
//
// describe('CalculateProteinIntakeModal', () => {
//   const mockUpdateFormData = jest.fn();
//   const defaultFitnessData: UserFitnessData = {
//     hydration: 2550,
//     protein: 120,
//     calories: 2000,
//     height: 180,
//     age: 30,
//     activityLevel: 'moderate',
//     sex: 'male',
//     weight: 90,
//     weeklyWorkoutTarget: 4,
//   };
//
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });
//
//   describe('Rendering and UI', () => {
//     test('should render the calculate button correctly', () => {
//       render(
//         <CalculateProteinIntakeModal
//           onUpdateFormDataWithCalculatedProteinValue={mockUpdateFormData}
//           fitnessData={defaultFitnessData}
//         />
//       );
//
//       const calculateButton = screen.getByRole('button', { name: /calculate protein intake/i });
//       expect(calculateButton).toBeInTheDocument();
//     });
//
//     test('should open the modal when calculate button is clicked', async () => {
//       const user = userEvent.setup();
//       render(
//         <CalculateProteinIntakeModal
//           onUpdateFormDataWithCalculatedProteinValue={mockUpdateFormData}
//           fitnessData={defaultFitnessData}
//         />
//       );
//
//       const calculateButton = screen.getByRole('button', { name: /calculate protein intake/i });
//       await user.click(calculateButton);
//
//       expect(screen.getByRole('dialog')).toBeInTheDocument();
//       expect(screen.getByText('Calculate Protein Intake')).toBeInTheDocument();
//     });
//
//     test('should display form fields with default values from fitnessData', async () => {
//       const user = userEvent.setup();
//       render(
//         <CalculateProteinIntakeModal
//           onUpdateFormDataWithCalculatedProteinValue={mockUpdateFormData}
//           fitnessData={defaultFitnessData}
//         />
//       );
//
//       const calculateButton = screen.getByRole('button', { name: /calculate protein intake/i });
//       await user.click(calculateButton);
//
//       // Check sex radio buttons
//       const maleRadio = screen.getByLabelText('Male');
//       const femaleRadio = screen.getByLabelText('Female');
//       expect(maleRadio).toBeChecked();
//       expect(femaleRadio).not.toBeChecked();
//
//       // Check weight input
//       const weightInput = screen.getByLabelText(/your weight/i);
//       expect(weightInput).toHaveValue(90);
//
//       // Check activity level radio buttons
//       const moderateRadio = screen.getByLabelText('Moderate');
//       expect(moderateRadio).toBeChecked();
//     });
//
//     test('should show help text when help icon is clicked', async () => {
//       const user = userEvent.setup();
//       render(
//         <CalculateProteinIntakeModal
//           onUpdateFormDataWithCalculatedProteinValue={mockUpdateFormData}
//           fitnessData={defaultFitnessData}
//         />
//       );
//
//       const calculateButton = screen.getByRole('button', { name: /calculate protein intake/i });
//       await user.click(calculateButton);
//
//       const helpButton = screen.getByRole('button', {
//         name: /learn more about protein calculation/i,
//       });
//       await user.click(helpButton);
//
//       expect(
//         screen.getByText(
//           /protein intake is calculated based on your weight, sex, and activity level/i
//         )
//       ).toBeInTheDocument();
//     });
//   });
//
//   describe('Form Validation', () => {
//     test('should show error when weight is below minimum', async () => {
//       const user = userEvent.setup();
//
//       // Mock the action to return validation error
//       (saveProteinIntakeAction as jest.Mock).mockResolvedValueOnce({
//         success: false,
//         message: 'Please review the errors and try again.',
//         errors: {
//           weight: 'Weight must be at least 20kg',
//         },
//         inputs: {
//           weight: 10,
//           sex: 'male',
//           activity: 'moderate',
//         },
//       });
//
//       render(
//         <CalculateProteinIntakeModal
//           onUpdateFormDataWithCalculatedProteinValue={mockUpdateFormData}
//           fitnessData={{ ...defaultFitnessData, weight: 10 }}
//         />
//       );
//
//       const calculateButton = screen.getByRole('button', { name: /calculate protein intake/i });
//       await user.click(calculateButton);
//
//       const submitButton = screen.getByRole('button', { name: /calculate$/i });
//       await user.click(submitButton);
//
//       await waitFor(() => {
//         expect(screen.getByText('Weight must be at least 20kg')).toBeInTheDocument();
//       });
//     });
//
//     test('should show error when weight is above maximum', async () => {
//       const user = userEvent.setup();
//
//       // Mock the action to return validation error
//       (saveProteinIntakeAction as jest.Mock).mockResolvedValueOnce({
//         success: false,
//         message: 'Please review the errors and try again.',
//         errors: {
//           weight: 'Weight must be less than 200kg',
//         },
//         inputs: {
//           weight: 250,
//           sex: 'male',
//           activity: 'moderate',
//         },
//       });
//
//       render(
//         <CalculateProteinIntakeModal
//           onUpdateFormDataWithCalculatedProteinValue={mockUpdateFormData}
//           fitnessData={{ ...defaultFitnessData, weight: 250 }}
//         />
//       );
//
//       const calculateButton = screen.getByRole('button', { name: /calculate protein intake/i });
//       await user.click(calculateButton);
//
//       const submitButton = screen.getByRole('button', { name: /calculate$/i });
//       await user.click(submitButton);
//
//       await waitFor(() => {
//         expect(screen.getByText('Weight must be less than 200kg')).toBeInTheDocument();
//       });
//     });
//
//     test('should show error when no sex is selected', async () => {
//       const user = userEvent.setup();
//
//       // Mock the action to return validation error
//       (saveProteinIntakeAction as jest.Mock).mockResolvedValueOnce({
//         success: false,
//         message: 'Please review the errors and try again.',
//         errors: {
//           sex: 'Please select your sex',
//         },
//         inputs: {
//           weight: 90,
//           sex: undefined,
//           activity: 'moderate',
//         },
//       });
//
//       // Create a modified fitness data with undefined sex
//       const modifiedFitnessData = { ...defaultFitnessData };
//       // @ts-ignore - intentionally setting to undefined for test
//       modifiedFitnessData.sex = undefined;
//
//       render(
//         <CalculateProteinIntakeModal
//           onUpdateFormDataWithCalculatedProteinValue={mockUpdateFormData}
//           fitnessData={modifiedFitnessData}
//         />
//       );
//
//       const calculateButton = screen.getByRole('button', { name: /calculate protein intake/i });
//       await user.click(calculateButton);
//
//       const submitButton = screen.getByRole('button', { name: /calculate$/i });
//       await user.click(submitButton);
//
//       await waitFor(() => {
//         expect(screen.getByText('Please select your sex')).toBeInTheDocument();
//       });
//     });
//
//     test('should show error when no activity level is selected', async () => {
//       const user = userEvent.setup();
//
//       // Mock the action to return validation error
//       (saveProteinIntakeAction as jest.Mock).mockResolvedValueOnce({
//         success: false,
//         message: 'Please review the errors and try again.',
//         errors: {
//           activity: 'Please select your activity level',
//         },
//         inputs: {
//           weight: 90,
//           sex: 'male',
//           activity: undefined,
//         },
//       });
//
//       // Create a modified fitness data with undefined activity level
//       const modifiedFitnessData = { ...defaultFitnessData };
//       // @ts-ignore - intentionally setting to undefined for test
//       modifiedFitnessData.activityLevel = undefined;
//
//       render(
//         <CalculateProteinIntakeModal
//           onUpdateFormDataWithCalculatedProteinValue={mockUpdateFormData}
//           fitnessData={modifiedFitnessData}
//         />
//       );
//
//       const calculateButton = screen.getByRole('button', { name: /calculate protein intake/i });
//       await user.click(calculateButton);
//
//       const submitButton = screen.getByRole('button', { name: /calculate$/i });
//       await user.click(submitButton);
//
//       await waitFor(() => {
//         expect(screen.getByText('Please select your activity level')).toBeInTheDocument();
//       });
//     });
//   });
//
//   describe('User Journey', () => {
//     test('should calculate protein intake and display result when form is submitted', async () => {
//       const user = userEvent.setup();
//
//       // Mock the action to return success with calculated protein
//       (saveProteinIntakeAction as jest.Mock).mockResolvedValueOnce({
//         success: true,
//         message: 'Protein intake calculated successfully',
//         inputs: {
//           weight: 90,
//           sex: 'male',
//           activity: 'moderate',
//         },
//         calculatedGoal: 153, // 90kg * 1.7 (moderate activity + male)
//       });
//
//       render(
//         <CalculateProteinIntakeModal
//           onUpdateFormDataWithCalculatedProteinValue={mockUpdateFormData}
//           fitnessData={defaultFitnessData}
//         />
//       );
//
//       const calculateButton = screen.getByRole('button', { name: /calculate protein intake/i });
//       await user.click(calculateButton);
//
//       const submitButton = screen.getByRole('button', { name: /calculate$/i });
//       await user.click(submitButton);
//
//       await waitFor(() => {
//         expect(screen.getByText('Your recommended daily protein intake:')).toBeInTheDocument();
//         expect(screen.getByText('153g')).toBeInTheDocument();
//       });
//     });
//
//     test('should update form data and close modal when "Save and Close" is clicked', async () => {
//       const user = userEvent.setup();
//
//       // Mock the action to return success with calculated protein
//       (saveProteinIntakeAction as jest.Mock).mockResolvedValueOnce({
//         success: true,
//         message: 'Protein intake calculated successfully',
//         inputs: {
//           weight: 90,
//           sex: 'male',
//           activity: 'moderate',
//         },
//         calculatedGoal: 153,
//       });
//
//       render(
//         <CalculateProteinIntakeModal
//           onUpdateFormDataWithCalculatedProteinValue={mockUpdateFormData}
//           fitnessData={defaultFitnessData}
//         />
//       );
//
//       const calculateButton = screen.getByRole('button', { name: /calculate protein intake/i });
//       await user.click(calculateButton);
//
//       const submitButton = screen.getByRole('button', { name: /calculate$/i });
//       await user.click(submitButton);
//
//       await waitFor(() => {
//         expect(screen.getByText('153g')).toBeInTheDocument();
//       });
//
//       const saveButton = screen.getByRole('button', { name: /save and close/i });
//       await user.click(saveButton);
//
//       expect(mockUpdateFormData).toHaveBeenCalledWith('153');
//
//       // Modal should be closed
//       expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
//     });
//
//     test('should allow recalculation after initial calculation', async () => {
//       const user = userEvent.setup();
//
//       // First calculation
//       (saveProteinIntakeAction as jest.Mock).mockResolvedValueOnce({
//         success: true,
//         message: 'Protein intake calculated successfully',
//         inputs: {
//           weight: 90,
//           sex: 'male',
//           activity: 'moderate',
//         },
//         calculatedGoal: 153,
//       });
//
//       // Second calculation with different values
//       (saveProteinIntakeAction as jest.Mock).mockResolvedValueOnce({
//         success: true,
//         message: 'Protein intake calculated successfully',
//         inputs: {
//           weight: 75,
//           sex: 'female',
//           activity: 'heavy',
//         },
//         calculatedGoal: 135, // 75kg * 1.8 (heavy activity)
//       });
//
//       render(
//         <CalculateProteinIntakeModal
//           onUpdateFormDataWithCalculatedProteinValue={mockUpdateFormData}
//           fitnessData={defaultFitnessData}
//         />
//       );
//
//       const calculateButton = screen.getByRole('button', { name: /calculate protein intake/i });
//       await user.click(calculateButton);
//
//       const submitButton = screen.getByRole('button', { name: /calculate$/i });
//       await user.click(submitButton);
//
//       await waitFor(() => {
//         expect(screen.getByText('153g')).toBeInTheDocument();
//       });
//
//       // Click recalculate
//       const recalculateButton = screen.getByRole('button', { name: /recalculate/i });
//       await user.click(recalculateButton);
//
//       // Change form values
//       const weightInput = screen.getByLabelText(/your weight/i);
//       await user.clear(weightInput);
//       await user.type(weightInput, '75');
//
//       const femaleRadio = screen.getByLabelText('Female');
//       await user.click(femaleRadio);
//
//       const heavyRadio = screen.getByLabelText('Heavy');
//       await user.click(heavyRadio);
//
//       // Submit again
//       const calculateAgainButton = screen.getByRole('button', { name: /calculate$/i });
//       await user.click(calculateAgainButton);
//
//       await waitFor(() => {
//         expect(screen.getByText('135g')).toBeInTheDocument();
//       });
//     });
//   });
//
//   describe('Edge Cases', () => {
//     test('should handle server errors gracefully', async () => {
//       const user = userEvent.setup();
//
//       // Mock the action to return an error
//       (saveProteinIntakeAction as jest.Mock).mockResolvedValueOnce({
//         success: false,
//         message: 'An unknown error occurred',
//       });
//
//       render(
//         <CalculateProteinIntakeModal
//           onUpdateFormDataWithCalculatedProteinValue={mockUpdateFormData}
//           fitnessData={defaultFitnessData}
//         />
//       );
//
//       const calculateButton = screen.getByRole('button', { name: /calculate protein intake/i });
//       await user.click(calculateButton);
//
//       const submitButton = screen.getByRole('button', { name: /calculate$/i });
//       await user.click(submitButton);
//
//       await waitFor(() => {
//         expect(screen.getByText('An unknown error occurred')).toBeInTheDocument();
//       });
//     });
//
//     test('should handle non-numeric weight input', async () => {
//       const user = userEvent.setup();
//
//       render(
//         <CalculateProteinIntakeModal
//           onUpdateFormDataWithCalculatedProteinValue={mockUpdateFormData}
//           fitnessData={defaultFitnessData}
//         />
//       );
//
//       const calculateButton = screen.getByRole('button', { name: /calculate protein intake/i });
//       await user.click(calculateButton);
//
//       // Try to enter non-numeric value
//       const weightInput = screen.getByLabelText(/your weight/i);
//       await user.clear(weightInput);
//       await user.type(weightInput, 'abc');
//
//       // HTML5 validation should prevent non-numeric input for number fields
//       expect(weightInput).not.toHaveValue('abc');
//     });
//
//     test('should handle decimal weight values correctly', async () => {
//       const user = userEvent.setup();
//
//       // Mock the action to return success with calculated protein for decimal weight
//       (saveProteinIntakeAction as jest.Mock).mockResolvedValueOnce({
//         success: true,
//         message: 'Protein intake calculated successfully',
//         inputs: {
//           weight: 72.5,
//           sex: 'male',
//           activity: 'moderate',
//         },
//         calculatedGoal: 123, // 72.5kg * 1.7 (moderate activity + male)
//       });
//
//       render(
//         <CalculateProteinIntakeModal
//           onUpdateFormDataWithCalculatedProteinValue={mockUpdateFormData}
//           fitnessData={defaultFitnessData}
//         />
//       );
//
//       const calculateButton = screen.getByRole('button', { name: /calculate protein intake/i });
//       await user.click(calculateButton);
//
//       // Enter decimal weight
//       const weightInput = screen.getByLabelText(/your weight/i);
//       await user.clear(weightInput);
//       await user.type(weightInput, '72.5');
//
//       const submitButton = screen.getByRole('button', { name: /calculate$/i });
//       await user.click(submitButton);
//
//       await waitFor(() => {
//         expect(screen.getByText('123g')).toBeInTheDocument();
//       });
//     });
//   });
// });
