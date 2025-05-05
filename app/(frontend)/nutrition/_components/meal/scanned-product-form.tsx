'use client';

import { useState } from 'react';
import { BarcodeScanner } from '@/app/(frontend)/nutrition/_components/product-scan/barcode-scanner';
import {
  BarcodeProductDisplay,
  NutritionInfo,
} from '@/app/(frontend)/nutrition/_components/product-scan/scanned-product-output';
import WarningAlert from '@/components/common/warning-alert/warning-alert';
import Link from 'next/link';

export function ScannedProductForm() {
  const [scannedProductMacro, setScannedProductMacro] = useState<NutritionInfo | null>(null);

  const handleBack = () => {
    setScannedProductMacro(null);
  };

  return (
    <>
      {scannedProductMacro ? (
        <BarcodeProductDisplay nutritionInfo={scannedProductMacro} onBackAction={handleBack} />
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
