'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Minus, Check, ArrowLeft } from 'lucide-react';
import Image from 'next/image';

interface NutritionInfo {
  productName: string;
  image: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface BarcodeProductDisplayProps {
  nutritionInfo: NutritionInfo;
  onSave: () => void;
  onBack: () => void;
}

export function BarcodeProductDisplay({
  nutritionInfo,
  onSave,
  onBack,
}: BarcodeProductDisplayProps) {
  const [quantity, setQuantity] = useState(1);

  const increaseQuantity = () => {
    setQuantity(prev => Math.min(prev + 1, 10));
  };

  const decreaseQuantity = () => {
    setQuantity(prev => Math.max(prev - 1, 1));
  };

  // Calculate nutrition values based on quantity
  const calculatedNutrition = {
    calories: Math.round(nutritionInfo.calories * quantity),
    protein: Math.round(nutritionInfo.protein * quantity * 10) / 10,
    carbs: Math.round(nutritionInfo.carbs * quantity * 10) / 10,
    fat: Math.round(nutritionInfo.fat * quantity * 10) / 10,
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center mb-2">
        <Button variant="ghost" size="sm" className="p-0 h-8 w-8 mr-2" onClick={onBack}>
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
            <div className="h-full w-full flex items-center justify-center text-muted-foreground">
              No image
            </div>
          )}
        </div>
        <div className="flex-1 bg-white p-4 border rounded-md">
          <h3 className="font-medium text-xl line-clamp-2">{nutritionInfo.productName}</h3>
          <div className="flex items-center mt-2">
            <span className="mr-2">Quantity:</span>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={decreaseQuantity}
              disabled={quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center font-medium">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={increaseQuantity}
              disabled={quantity >= 10}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium">Nutrition Values</h4>
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

      <Button className="w-full" onClick={onSave}>
        <Check className="h-4 w-4 mr-2" />
        Add to Diary
      </Button>
    </div>
  );
}
