'use client';

import { useState } from 'react';
import { BarcodeScanner } from '@/app/(frontend)/nutrition/_components/product-scan/barcode-scanner';
import { BarcodeProductDisplay } from '@/app/(frontend)/nutrition/_components/product-scan/scanned-product-output';
import WarningAlert from '@/components/common/warning-alert/warning-alert';
import Link from 'next/link';
import { Macro } from './meal-types';

export function ScannedProductForm() {
  const [scannedProductMacro, setScannedProductMacro] = useState<Macro | null>(null);

  const handleBack = () => {
    setScannedProductMacro(null);
  };

  const handleSaveProduct = () => {
    console.log('Saving product:');
  };

  return (
    <>
      {scannedProductMacro ? (
        <BarcodeProductDisplay
          nutritionInfo={scannedProductMacro}
          onSave={handleSaveProduct}
          onBack={handleBack}
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
