'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dumbbell, Droplet, Apple, ChevronRight } from 'lucide-react';
import { useAuth } from '@/app/(frontend)/context/auth';

export function GuestWelcome() {
  const { showAuthModal } = useAuth();

  return (
    <Card className="mb-6 overflow-hidden border-none card-shadow">
      <CardContent className="p-0">
        <div className="bg-gradient-to-br from-primary/90 to-primary text-white p-6 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-2">Track your fitness journey</h2>
            <p className="text-white/90 mb-4">
              Log workouts, nutrition, and water intake all in one place
            </p>

            <Button
              onClick={showAuthModal}
              variant="secondary"
              className="font-medium shadow-lg hover:shadow-xl transition-all"
            >
              Get Started <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>

          {/* Decorative elements */}
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-10">
            <Dumbbell className="h-24 w-24" />
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-medium text-lg mb-3">Why track your fitness?</h3>

          <div className="space-y-3">
            <div className="flex items-start">
              <div className="bg-primary/10 p-2 rounded-full mr-3 mt-0.5">
                <Dumbbell className="6-4 6-4 text-primary" />
              </div>
              <div>
                <p className="font-bold text-lg">Track your workouts</p>
                <p>Log exercises, sets, and reps to see your progress</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-nutrition/10 p-2 rounded-full mr-3 mt-0.5">
                <Apple className="h-6 w-6 text-nutrition" />
              </div>
              <div>
                <p className="font-bold text-lg">Monitor nutrition</p>
                <p>Keep track of meals and macros to reach your goals</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-water/10 p-2 rounded-full mr-3 mt-0.5">
                <Droplet className="6-4 6-4 text-water" />
              </div>
              <div>
                <p className="font-bold text-lg">Stay hydrated</p>
                <p>Track water intake for optimal performance</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
