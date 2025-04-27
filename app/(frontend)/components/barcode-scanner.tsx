'use client';

import { useState, useRef, useEffect } from 'react';
import { Camera, XCircle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Quagga from '@ericblade/quagga2';

interface BarcodeScannerProps {
  onScannedProductMacro: (barcode: string) => void;
}

export function BarcodeScanner({ onScannedProductMacro }: BarcodeScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [capturedBarcode, setCapturedBarcode] = useState<string | null>(null);
  const videoRef = useRef<HTMLDivElement>(null);

  console.log(isInitializing);

  const searchProduct = async (barcode: string) => {
    setIsSearching(true);
    setError(null);

    try {
      const response = await fetch(`https://world.openfoodfacts.org/api/v3/product/${barcode}`);
      const data = await response.json();

      if (data.status === 'failure') {
        setError(data.result.name || 'Product not found in database');
        return; // Exit early if product not found
      }

      const nutrients = data.product.nutriments;
      const productName = data.product.product_name;
      const nutritionInfo = {
        productName,
        image: data.product.image_url,
        calories: nutrients['energy-kcal'] || 0,
        protein: nutrients.proteins || 0,
        carbs: nutrients.carbohydrates || 0,
        fat: nutrients.fat || 0,
      };
      onScannedProductMacro(nutritionInfo);
    } catch (err: unknown) {
      setError('Failed to search product');
    } finally {
      setIsSearching(false);
      setCapturedBarcode(null);
    }
  };

  const startScanner = async () => {
    setError(null);
    setIsInitializing(true);
    setCapturedBarcode(null);

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
          setCapturedBarcode(barcode);
          // toast({
          //   title: 'Barcode captured',
          //   description: `Barcode value: ${barcode}`,
          // });
        }
      });

      await Quagga.start();
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

  const stopScanner = () => {
    try {
      Quagga.stop();
    } catch (err) {
      console.error('Error stopping scanner:', err);
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
    return (
      <Alert variant="destructive">
        <XCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
        <Button
          variant="outline"
          className="mt-2"
          onClick={() => {
            setError(null);
            stopScanner(); // Ensure scanner is fully stopped before restarting
            setIsInitializing(false);
            // setTimeout(() => {
            //   startScanner();
            // }, 100); // Small delay to ensure cleanup is complete
          }}
        >
          Try Again
        </Button>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div
        ref={videoRef}
        className={`relative aspect-video w-full rounded-lg overflow-hidden ${
          isScanning ? 'border-2 border-primary' : 'border-2 border-dashed'
        }`}
      >
        {!isScanning && !isInitializing && !capturedBarcode && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Camera className="h-10 w-10 mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Camera preview will appear here</p>
          </div>
        )}
        {isInitializing && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-sm text-muted-foreground">Initializing camera...</p>
          </div>
        )}
        {capturedBarcode && !isScanning && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
            <p className="text-lg font-medium mb-4">Barcode: {capturedBarcode}</p>
            <div className="space-x-2">
              <Button onClick={() => searchProduct(capturedBarcode)} disabled={isSearching}>
                <Search className="mr-2 h-4 w-4" />
                {isSearching ? 'Searching...' : 'Search Product'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setCapturedBarcode(null);
                  stopScanner(); // Ensure scanner is fully stopped before restarting
                  setTimeout(() => {
                    startScanner();
                  }, 100); // Small delay to ensure cleanup is complete
                }}
                disabled={isSearching}
              >
                Scan Again
              </Button>
            </div>
          </div>
        )}
      </div>

      {!capturedBarcode && (
        <Button
          className="w-full"
          onClick={isScanning ? stopScanner : startScanner}
          disabled={isInitializing}
        >
          {isInitializing ? 'Initializing...' : isScanning ? 'Stop Scanner' : 'Start Scanner'}
        </Button>
      )}
    </div>
  );
}
