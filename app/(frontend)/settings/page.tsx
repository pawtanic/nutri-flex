"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SettingsPage() {
  return (
    <div className="container max-w-md mx-auto pb-20 pt-6 px-4">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <Tabs defaultValue="profile" className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4 mt-4">
          <Card className="card-shadow border-none overflow-hidden">
            <CardHeader className="pb-2 gradient-bg text-white">
              <CardTitle>Personal Information</CardTitle>
              <CardDescription className="text-white/80">Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Your name" className="shadow-sm" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Your email" className="shadow-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input id="height" type="number" placeholder="175" className="shadow-sm" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input id="weight" type="number" placeholder="70" className="shadow-sm" />
                </div>
              </div>
              <Button className="w-full shadow-md">Save Changes</Button>
            </CardContent>
          </Card>

          <Card className="card-shadow border-none overflow-hidden">
            <CardHeader className="pb-2 gradient-bg text-white">
              <CardTitle>Goals</CardTitle>
              <CardDescription className="text-white/80">Set your fitness and nutrition goals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-4">
              <div className="grid gap-2">
                <Label htmlFor="calories">Daily Calorie Target</Label>
                <Input id="calories" type="number" placeholder="2000" className="shadow-sm" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="protein">Daily Protein Target (g)</Label>
                <Input id="protein" type="number" placeholder="120" className="shadow-sm" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="workouts">Weekly Workout Target</Label>
                <Input id="workouts" type="number" placeholder="4" className="shadow-sm" />
              </div>
              <Button className="w-full shadow-md">Save Goals</Button>
            </CardContent>
          </Card>
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
                  <p className="text-sm text-muted-foreground">Switch between light and dark themes</p>
                </div>
                <Switch id="dark-mode" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="units" className="block">
                    Use Metric Units
                  </Label>
                  <p className="text-sm text-muted-foreground">Display measurements in metric</p>
                </div>
                <Switch id="units" defaultChecked />
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
                <p className="text-sm text-muted-foreground">Download all your workout and nutrition data</p>
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
  )
}