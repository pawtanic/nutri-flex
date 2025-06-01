import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Droplets, Settings } from 'lucide-react';
import Link from 'next/link';
import { RoutesConfig } from '@/components/common/navigation/navigation';

export function HydrationSetupPrompt() {
  return (
    <Card>
      <CardHeader className="text-center space-y-2">
        <div className="mx-auto rounded-full bg-blue-50 p-3">
          <Droplets className="h-8 w-8 text-blue-600" />
        </div>
        <CardTitle className="text-lg font-semibold">Hydration Goal Not Set</CardTitle>
      </CardHeader>
      <CardContent className="text-center text-muted-foreground px-6 pb-4">
        <p className="mb-4">
          We couldn't find your daily hydration goal. To track your water intake, please set up your
          hydration goal in settings.
        </p>
      </CardContent>
      <CardFooter className="flex justify-center pb-6">
        <Button asChild variant="default" className="gap-2">
          {/*what if user is not auth ?*/}
          <Link href={RoutesConfig.settings}>
            <Settings className="h-4 w-4" />
            Go to Settings
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
