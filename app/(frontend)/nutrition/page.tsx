"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { DateHeader } from "@/components/date-header"
import { useDate } from "@/app/(frontend)/context/date-context"

export default function NutritionPage() {
  const { selectedDate } = useDate()

  // Sample nutrition data - in a real app, you'd filter this based on the selected date
  const meals = [
    {
      id: 1,
      name: "Breakfast",
      time: "8:30 AM",
      calories: 450,
      protein: 25,
      carbs: 45,
      fat: 15,
    },
    {
      id: 2,
      name: "Lunch",
      time: "12:30 PM",
      calories: 650,
      protein: 35,
      carbs: 60,
      fat: 20,
    },
  ]

  // Daily totals
  const dailyTotals = {
    calories: { current: 1100, target: 2000 },
    protein: { current: 60, target: 120 },
    carbs: { current: 105, target: 200 },
    fat: { current: 35, target: 65 },
  }

  return (
    <div className="container max-w-md mx-auto pb-20 pt-6 px-4">
      <DateHeader title="Nutrition" />

      <div className="flex justify-end mb-6">
        <Link href="/nutrition/add">
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Add Meal
          </Button>
        </Link>
      </div>

      {/* Daily Summary */}
      <Card className="mb-6 card-shadow border-none overflow-hidden">
        <CardHeader className="pb-2 nutrition-gradient text-white">
          <CardTitle className="text-lg">Daily Summary</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Calories</span>
                <span>
                  {dailyTotals.calories.current} / {dailyTotals.calories.target} kcal
                </span>
              </div>
              <Progress value={(dailyTotals.calories.current / dailyTotals.calories.target) * 100} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Protein</span>
                <span>
                  {dailyTotals.protein.current} / {dailyTotals.protein.target} g
                </span>
              </div>
              <Progress
                value={(dailyTotals.protein.current / dailyTotals.protein.target) * 100}
                className="h-2 bg-green-100"
              />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Carbs</span>
                <span>
                  {dailyTotals.carbs.current} / {dailyTotals.carbs.target} g
                </span>
              </div>
              <Progress
                value={(dailyTotals.carbs.current / dailyTotals.carbs.target) * 100}
                className="h-2 bg-blue-100"
              />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Fat</span>
                <span>
                  {dailyTotals.fat.current} / {dailyTotals.fat.target} g
                </span>
              </div>
              <Progress
                value={(dailyTotals.fat.current / dailyTotals.fat.target) * 100}
                className="h-2 bg-orange-100"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search foods..." className="pl-9" />
      </div>

      {/* Meals */}
      <h2 className="text-lg font-medium mb-3">Today's Meals</h2>
      {meals.map((meal) => (
        <Card
          key={meal.id}
          className="mb-4 card-shadow border-none hover:translate-y-[-2px] transition-all duration-200"
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{meal.name}</h3>
                <p className="text-sm text-muted-foreground">{meal.time}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{meal.calories} kcal</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-3 text-xs bg-muted p-2 rounded-md">
              <div>
                <p className="text-muted-foreground">Protein</p>
                <p className="font-medium">{meal.protein}g</p>
              </div>
              <div>
                <p className="text-muted-foreground">Carbs</p>
                <p className="font-medium">{meal.carbs}g</p>
              </div>
              <div>
                <p className="text-muted-foreground">Fat</p>
                <p className="font-medium">{meal.fat}g</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}