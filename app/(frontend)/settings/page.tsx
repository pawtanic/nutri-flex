'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MeasurementUnitSettings } from '@/app/(frontend)/settings/_components/measurement-unit-settings';
import { UserProfileForm } from '@/app/(frontend)/settings/_components/user-profile-form';
import { Settings } from '@/app/(frontend)/settings/_components/settings';
import { useAuth } from '@/app/(frontend)/context/auth';
import { ErrorPage } from '@/components/error-page';
import { FitnessGoalsForm } from '@/app/(frontend)/settings/_components/fitness-goals';

// TODO - protected route !!!

export default function SettingsPage() {
  const { isUserAuthenticated } = useAuth();

  if (!isUserAuthenticated) {
    return <ErrorPage title="Access Restricted" message="Please log in to view this page." />;
  }

  return (
    <div className="container max-w-md mx-auto pb-20 pt-6 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <Settings />
      </div>
      <Tabs defaultValue="profile" className="mb-6 mt-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="units">Units</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4 mt-4">
          <UserProfileForm />
          <FitnessGoalsForm />
        </TabsContent>

        <TabsContent value="units" className="space-y-4 mt-4">
          <MeasurementUnitSettings />
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>App Preferences</CardTitle>
              <CardDescription>Customize your app experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications" className="block">
                    Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">Receive reminders and updates</p>
                </div>
                <Switch id="notifications" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dark-mode" className="block">
                    Dark Mode
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Switch between light and dark themes
                  </p>
                </div>
                <Switch id="dark-mode" />
              </div>

              <Button className="w-full">Save Preferences</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>Manage your app data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>Export Data</Label>
                <p className="text-sm text-muted-foreground">
                  Download all your workout and nutrition data
                </p>
                <Button variant="outline">Export as CSV</Button>
              </div>

              <div className="grid gap-2">
                <Label>Clear Data</Label>
                <p className="text-sm text-muted-foreground">Remove all your saved data</p>
                <Button variant="destructive">Clear All Data</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
