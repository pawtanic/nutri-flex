import {
  fetchUserFitnessData,
  fetchUserMeasurementsUnits,
} from '@/app/(frontend)/settings/_components/fitness-goals';
import { SettingsClient } from './_components/settings-client';

export default async function SettingsPage() {
  const [fitnessData, measurementUnits] = await Promise.all([
    fetchUserFitnessData(),
    // fetchUserData(),
    fetchUserMeasurementsUnits(),
  ]);

  return <SettingsClient fitnessData={fitnessData} measurementUnits={measurementUnits} />;
}
