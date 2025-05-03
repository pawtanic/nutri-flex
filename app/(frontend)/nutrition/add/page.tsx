'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RecipeGenerator } from '@/app/(frontend)/nutrition/_components/recipe/recipe-generator';
import { PageHeader } from '@/components/common/header/page-header';
import { ManualMealForm } from '@/app/(frontend)/nutrition/_components/meal/manual-meal-form';
import { ScannedProductForm } from '@/app/(frontend)/nutrition/_components/meal/scanned-product-form';
import { useTabWithUrl } from '@/hooks/use-tab-with-url';

export default function AddMealPage() {
  const { tab, setTab } = useTabWithUrl({ defaultTab: 'manual' });

  return (
    <div className="container max-w-md mx-auto pb-20 pt-6 px-4">
      <PageHeader
        title="Add Meal"
        backHref="/nutrition"
        backAriaLabel="go back to nutrition page"
      />

      <Tabs value={tab} onValueChange={setTab} defaultValue="manual" className="mb-6">
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
