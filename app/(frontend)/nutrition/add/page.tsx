'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RecipeGenerator } from '@/components/recipe/recipe-generator';
import { useRouter, useSearchParams } from 'next/navigation';
import { PageHeader } from '@/components/common/page-header';
import { ManualMealForm } from '@/components/meal/manual-meal-form';
import { ScannedProductForm } from '@/components/meal/scanned-product-form';

export default function AddMealPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') ?? 'manual';

  const handleTabChange = (value: string) => {
    router.push(`?tab=${value}`);
  };

  return (
    <div className="container max-w-md mx-auto pb-20 pt-6 px-4">
      <PageHeader
        title="Add Meal"
        backHref="/nutrition"
        backAriaLabel="go back to nutrition page"
      />

      <Tabs value={tab} onValueChange={handleTabChange} defaultValue="manual" className="mb-6">
        <TabsList className="grid w-full md:grid-cols-2 grid-cols-3">
          <TabsTrigger value="manual">Manual</TabsTrigger>
          <TabsTrigger value="recipe">AI recipe</TabsTrigger>
          <TabsTrigger className="md:hidden block" value="barcode">
            Barcode scan
          </TabsTrigger>
        </TabsList>

        <TabsContent value="manual" className="space-y-6 mt-4">
          <ManualMealForm />
        </TabsContent>

        <TabsContent value="barcode" className="space-y-6 mt-4">
          <ScannedProductForm />
        </TabsContent>

        <TabsContent value="recipe" className="space-y-6 mt-4">
          <RecipeGenerator />
        </TabsContent>
      </Tabs>
    </div>
  );
}
