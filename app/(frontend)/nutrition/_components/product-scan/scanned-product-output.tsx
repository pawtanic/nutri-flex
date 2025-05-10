'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ChefHat } from 'lucide-react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { calculateNutrition } from '@/app/(frontend)/utils/helpers';
import { Label } from '@/components/ui/label';
import { AuthRequiredButton } from '@/components/common/auth-button/auth-button';

export interface NutritionInfo {
  productName: string;
  image: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface BarcodeProductDisplayProps {
  nutritionInfo: NutritionInfo;
  onBackAction: () => void;
}

export function BarcodeProductDisplay({ nutritionInfo, onBackAction }: BarcodeProductDisplayProps) {
  const [amountInGrams, setAmountInGrams] = useState(100);

  const calculatedNutrition = calculateNutrition(nutritionInfo, amountInGrams);

  return (
    <div className="space-y-4">
      <div className="flex items-center mb-2">
        <Button variant="ghost" size="sm" className="p-0 h-8 w-8 mr-2" onClick={onBackAction}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-medium">Scanned Product</h2>
      </div>
      <div className="flex gap-4">
        <div className="relative h-32 w-32 bg-white  border rounded-md flex-shrink-0">
          {nutritionInfo.image ? (
            <Image
              src={nutritionInfo.image || '/placeholder.svg'}
              alt={nutritionInfo.productName}
              fill
              className="object-contain p-2"
              sizes="96px"
            />
          ) : (
            <div className="h-full w-full text-muted-foreground text-center flex items-center p-2">
              This product has no image
            </div>
          )}
        </div>
        <div className="flex-1 bg-white p-3 border rounded-md">
          <h3 className="font-medium text-lg line-clamp-2">{nutritionInfo.productName}</h3>
          <div className="space-y-1">
            <Label htmlFor="amount">Amount (g)</Label>
            <Input
              id="amount"
              type="number"
              value={amountInGrams}
              onChange={e => setAmountInGrams(Number(e.target.value))}
              className="w-1/2"
            />
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium">Nutrition Values per {amountInGrams}g</h4>
            <div className="text-lg font-bold">{calculatedNutrition.calories} kcal</div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-tertiary p-3 rounded-md text-center">
              <div className="text-lg font-bold">{calculatedNutrition.protein}g</div>
              <div className="text-muted-foreground">Protein</div>
            </div>
            <div className="bg-quinary p-3 rounded-md text-center">
              <div className="text-lg font-bold ">{calculatedNutrition.carbs}g</div>
              <div className="text-muted-foreground">Carbs</div>
            </div>
            <div className="bg-quaternary p-3 rounded-md text-center">
              <div className="text-lg font-bold">{calculatedNutrition.fat}g</div>
              <div className="text-muted-foreground">Fat</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <AuthRequiredButton isBusy={false} className="w-full" loadingText="Adding product...">
        <ChefHat className="h-4 w-4 mr-2" />
        Add product to meal
      </AuthRequiredButton>
    </div>
  );
}
