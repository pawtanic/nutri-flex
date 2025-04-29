'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { BarcodeScanner } from '@/components/product-scan/barcode-scanner';
import { RecipeGenerator } from '@/components/recipe/recipe-generator';
import { BarcodeProductDisplay } from '@/components/product-scan/scanned-product-output';
import { useRouter, useSearchParams } from 'next/navigation';
import WarningAlert from '@/components/common/WarningAlert';
import { AuthRequiredButton } from '@/components/common/auth-button/auth-button';

export default function AddMealPage() {
  const [mealType, setMealType] = useState('breakfast');
  const [macros, setMacros] = useState({
    protein: 20,
    carbs: 30,
    fat: 15,
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') ?? 'manual';

  const handleMacroChange = (type: string, value: number[]) => {
    setMacros({ ...macros, [type]: value[0] });
  };

  return (
    <div className="container max-w-md mx-auto pb-20 pt-6 px-4">
      <div className="flex items-center mb-6">
        <Link aria-label="go back to nutrition page" className="mr-2" href="/nutrition">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold">Add Meal</h1>
      </div>

      <Tabs
        value={tab}
        onValueChange={tab => router.push(`?tab=${tab}`)}
        defaultValue="manual"
        className="mb-6"
      >
        <TabsList className="grid w-full md:grid-cols-2 grid-cols-3">
          <TabsTrigger value="manual">Manual</TabsTrigger>
          <TabsTrigger value="recipe">AI recipe</TabsTrigger>
          <TabsTrigger className="md:hidden block" value="barcode">
            Barcode scan
          </TabsTrigger>
        </TabsList>
        <TabsContent value="manual" className="space-y-6 mt-4">
          <div>
            <Label htmlFor="meal-name">Meal Name</Label>
            <div className="relative mt-1">
              <Input id="meal-name" placeholder="Enter your meal name..." />
            </div>
          </div>

          <div>
            <Label>Meal Type</Label>
            <RadioGroup
              defaultValue="breakfast"
              className="grid grid-cols-3 gap-2 mt-1"
              onValueChange={setMealType}
            >
              <Label
                htmlFor="breakfast"
                className={`flex items-center justify-center border rounded-md p-3 cursor-pointer ${
                  mealType === 'breakfast' ? 'bg-primary text-white' : ''
                }`}
              >
                <RadioGroupItem value="breakfast" id="breakfast" className="sr-only" />
                Breakfast
              </Label>
              <Label
                htmlFor="lunch"
                className={`flex items-center justify-center border rounded-md p-3 cursor-pointer ${
                  mealType === 'lunch' ? 'bg-primary text-white' : ''
                }`}
              >
                <RadioGroupItem value="lunch" id="lunch" className="sr-only" />
                Lunch
              </Label>
              <Label
                htmlFor="dinner"
                className={`flex items-center justify-center border rounded-md p-3 cursor-pointer ${
                  mealType === 'dinner' ? 'bg-primary text-white' : ''
                }`}
              >
                <RadioGroupItem value="dinner" id="dinner" className="sr-only" />
                Dinner
              </Label>
            </RadioGroup>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <Label>Total Protein</Label>
              <span className="text-sm">{macros.protein}g</span>
            </div>
            <Slider
              rangeColor="bg-tertiary"
              defaultValue={[20]}
              max={50}
              step={1}
              className="my-4"
              onValueChange={value => handleMacroChange('protein', value)}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0g</span>
              <span>50g</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <Label>Total Carbs</Label>
              <span className="text-sm">{macros.carbs}g</span>
            </div>
            <Slider
              rangeColor="bg-quinary"
              defaultValue={[30]}
              max={100}
              step={1}
              className="my-4"
              onValueChange={value => handleMacroChange('carbs', value)}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0g</span>
              <span>100g</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <Label>Total Fat</Label>
              <span className="text-sm">{macros.fat}g</span>
            </div>
            <Slider
              rangeColor="bg-quaternary"
              defaultValue={[15]}
              max={50}
              step={1}
              className="my-4"
              onValueChange={value => handleMacroChange('fat', value)}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0g</span>
              <span>50g</span>
            </div>
          </div>

          <AuthRequiredButton
            onAuthenticatedClick={() => console.log('save meal')}
            className="w-full"
          >
            Save Meal
          </AuthRequiredButton>
        </TabsContent>
        <TabsContent value="barcode" className="space-y-6 mt-4">
          <ScannedProductMacro />
        </TabsContent>
        <TabsContent value="recipe" className="space-y-6 mt-4">
          <RecipeGenerator />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export type Macro = {
  productName: string;
  image: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

function ScannedProductMacro() {
  const [scannedProductMacro, setScannedProductMacro] = useState<Macro | null>(null);
  return (
    <>
      {scannedProductMacro ? (
        <BarcodeProductDisplay
          nutritionInfo={scannedProductMacro}
          onSave={() => {}}
          onBack={() => {}}
        />
      ) : (
        <BarcodeScanner onScannedProductMacroAction={setScannedProductMacro} />
      )}
      <WarningAlert description="The results rely on free data from Open Food Facts">
        <Link href="https://world.openfoodfacts.org/" className="ml-2 underline">
          Learn more
        </Link>
      </WarningAlert>
    </>
  );
}
