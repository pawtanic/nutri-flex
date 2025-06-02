import {
  fetchUserFitnessData,
  fetchUserMeasurementsUnits,
} from '@/app/(frontend)/settings/_components/fitness-goals';
import WaterIntakeClient from '@/app/(frontend)/hydration/_components/water-intake-client';

export default async function WaterIntakePage() {
  // imitate fetch request
  await new Promise(resolve => setTimeout(resolve, 1000));
  // also fetch added input here and display in circle
  const { hydration } = await fetchUserFitnessData();
  return <WaterIntakeClient hydration={hydration} />;
}
