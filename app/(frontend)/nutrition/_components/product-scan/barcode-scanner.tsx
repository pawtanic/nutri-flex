'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Camera, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Quagga from '@ericblade/quagga2';
import Link from 'next/link';
import { RoutesConfig } from '@/components/common/navigation/navigation';
import { linkAkaBtnStyles } from '@/app/(frontend)/utils/constants';

export const getNutrients = (scannedProduct: any) => {
  // Handle both nutriments and nutriments_estimated
  const nutrients = scannedProduct.nutriments || scannedProduct.nutriments_estimated || {};
  const productName = scannedProduct.product_name || 'Unknown Product';

  console.log('Processing nutrients:', nutrients); // Debug log

  return {
    productName,
    image: scannedProduct.image_url || scannedProduct.image_front_url || '',
    calories: nutrients['energy-kcal_100g'] || nutrients['energy-kcal'] || nutrients['energy'] || 0,
    protein: nutrients['proteins_100g'] || nutrients['proteins'] || 0,
    carbs: nutrients['carbohydrates_100g'] || nutrients['carbohydrates'] || 0,
    fat: nutrients['fat_100g'] || nutrients['fat'] || 0,
  };
};

const BASE_URL = 'https://world.openfoodfacts.org/api/v3/product/';

interface BarcodeScannerProps {
  onScannedProductMacroAction: (value: any | null) => void;
}

export function BarcodeScanner({ onScannedProductMacroAction }: BarcodeScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const videoRef = useRef<HTMLDivElement>(null);

  const handleError = async () => {
    setError(null);
    await stopScanner();
    setIsInitializing(false);
  };

  const searchProduct = async (barcode: string) => {
    setIsSearching(true);
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}${barcode}`);
      const data = await response.json();

      console.log('API Response:', data); // Debug log

      if (!data || data.status === 'failure') {
        console.log('Product not found:', data); // Debug log
        setError('Product not found');
        return;
      }

      if (!data.product) {
        console.log('Invalid product data:', data); // Debug log
        setError('Invalid product data received');
        return;
      }

      try {
        const nutrients = getNutrients(data.product);
        console.log('Parsed nutrients:', nutrients); // Debug log
        onScannedProductMacroAction(nutrients);
      } catch (parseError) {
        console.error('Error parsing nutrients:', parseError); // Debug log
        setError('Failed to parse product nutrition data');
      }
    } catch (error: unknown) {
      console.error('Search error:', error); // Debug log
      if (error instanceof Error) {
        setError(`Failed to search product: ${error.message}`);
      } else {
        setError('Failed to search product');
      }
    } finally {
      setIsSearching(false);
    }
  };

  const startScanner = async () => {
    setError(null);
    setIsInitializing(true);

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        setError('Camera access is not supported by your browser');
      }

      await Quagga.init({
        inputStream: {
          name: 'Live',
          type: 'LiveStream',
          target: videoRef.current!,
          constraints: {
            facingMode: 'environment',
            width: 1280,
            height: 720,
          },
          area: {
            top: '0%',
            right: '0%',
            left: '0%',
            bottom: '0%',
          },
        },
        decoder: {
          readers: ['ean_reader', 'ean_8_reader', 'upc_reader', 'upc_e_reader'],
          debug: {
            drawBoundingBox: true,
            showFrequency: true,
            drawScanline: true,
            showPattern: true,
          },
        },
        locate: true,
      });

      Quagga.onDetected(result => {
        if (result.codeResult.code) {
          const barcode = result.codeResult.code;
          stopScanner();
          searchProduct(barcode);
        }
      });

      Quagga.start();
      setIsInitializing(false);
      setIsScanning(true);
    } catch (err) {
      setIsInitializing(false);
      let errorMessage = 'Failed to start barcode scanner';

      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          errorMessage = 'Camera access was denied. Please grant permission to use your camera.';
        } else if (err.name === 'NotFoundError') {
          errorMessage = 'No camera device was found on your system.';
        } else {
          errorMessage = `Scanner error: ${err.message}`;
        }
      }

      setError(errorMessage);
      setIsScanning(false);
    }
  };

  const stopScanner = async () => {
    try {
      await Quagga.stop();
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message || 'Failed to stop barcode scanner');
      }
    }
    setIsScanning(false);
    setIsInitializing(false);
  };

  useEffect(() => {
    return () => {
      if (isScanning) {
        stopScanner();
      }
    };
  }, [isScanning]);

  if (error) {
    return <BarcodeError error={error} onHandleError={handleError} />;
  }

  return (
    <div className="space-y-4">
      <div
        ref={videoRef}
        className={`relative aspect-video w-full rounded-lg overflow-hidden ${
          isScanning ? 'border-2 border-primary' : 'border-2 border-dashed'
        }`}
      >
        {!isScanning && !isInitializing && <CameraPreview />}
        {isInitializing && <CameraInitializing />}
        {isSearching && <Loader2 />}
      </div>
      <Button
        className="w-full"
        onClick={isScanning ? stopScanner : startScanner}
        disabled={isInitializing}
      >
        {isInitializing ? 'Initializing...' : isScanning ? 'Stop Scanner' : 'Start Scanner'}
      </Button>
    </div>
  );
}

function CameraPreview() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <Camera className="h-10 w-10 mb-4 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">Camera preview will appear here</p>
    </div>
  );
}

function CameraInitializing() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <p className="text-sm text-muted-foreground">Initializing camera...</p>
    </div>
  );
}

interface BarcodeErrorProps {
  error: string;
  onHandleError: () => void;
}

function BarcodeError({ error, onHandleError }: BarcodeErrorProps) {
  return (
    <Alert variant="destructive">
      <XCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
      <Button className="mt-2 mr-2" onClick={onHandleError}>
        Try Again
      </Button>
      <Link href={RoutesConfig.addNutrition} className={linkAkaBtnStyles}>
        Add manually
      </Link>
    </Alert>
  );
}
