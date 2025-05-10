"use client";

import {useState} from "react";
import {periodValue, tabsValues} from "../../../utils/constants";
import {Label} from "../label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "../select";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "../tabs";
import {WorkoutSummary} from "../../../workouts/_components/workout-summary";
import {ProgressChart} from "../../progress-chart";
import Link from "next/link";
import {RoutesConfig} from "../../common/navigation/navigation";
import {Button} from "../button";
import {ArrowRight} from "lucide-react";
import {NutritionSummary} from "../../../nutrition/_components/nutrition-summary";
import {capitalize} from "../../../utils/helpers";
import {GoalProgress} from "../../goal-progress";

export default function TabContent() {
  const [selectedTab, setSelectedTab] = useState(tabsValues.overview);
  return (
    <Tabs
      onValueChange={setSelectedTab as (value: string) => void}
      defaultValue="overview"
      className="mb-6"
    >
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value={tabsValues.overview}>{capitalize(tabsValues.overview)}</TabsTrigger>
        <TabsTrigger value={tabsValues.workout}>{capitalize(tabsValues.workout)}</TabsTrigger>
        <TabsTrigger value={tabsValues.nutrition}>{capitalize(tabsValues.nutrition)}</TabsTrigger>
      </TabsList>
      {selectedTab !== tabsValues.overview ? (
        <TabContentByPeriod />
      ) : (
        <TabsContent value={tabsValues.overview} className="space-y-4 mt-4">
          <GoalProgress />
        </TabsContent>
      )}
    </Tabs>
  )
}

export function TabContentByPeriod() {
  const [selectedPeriod, setSelectedPeriod] = useState(periodValue.week);

  return (
    <>
      <div className="my-6">
        <Label htmlFor="period" className="mb-1 block text-md">
          View Progress
        </Label>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod as (value: string) => void}>
          <SelectTrigger id="period">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={periodValue.week}>This Week</SelectItem>
            <SelectItem value={periodValue.month}>This Month</SelectItem>
            <SelectItem value={periodValue['3months']}>Last 3 Months</SelectItem>
            <SelectItem value={periodValue.year}>This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <TabsContent value={tabsValues.workout} className="space-y-4 mt-4">
        <WorkoutSummary period={selectedPeriod} />
        <ProgressChart
          title="Workout Frequency"
          period={selectedPeriod}
          type={tabsValues.workout}
        />
        <div className="flex justify-end">
          <Link href={RoutesConfig.workout}>
            <Button variant="outline" size="sm" className="mt-2">
              View All Workouts <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </TabsContent>
      <TabsContent value={tabsValues.nutrition} className="space-y-4 mt-4">
        <NutritionSummary period={selectedPeriod} />
        <ProgressChart title="Calorie Intake" period={selectedPeriod} type={tabsValues.nutrition} />
        <div className="flex justify-end">
          <Link href="/nutrition">
            <Button variant="outline" size="sm" className="mt-2">
              View All Meals <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </TabsContent>
    </>
  );
}
