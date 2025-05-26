import React from 'react';
import { LogOut, SettingsIcon } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { RoutesConfig } from '@/components/common/navigation/navigation';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

export function Settings() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const isSettingsPage = pathname === RoutesConfig.settings;

  if (!session?.user) return null;

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
    router.replace('/');
  };

  return (
    <div className="flex justify-between items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
            {session.user.image ? (
              <Image
                width={36}
                height={36}
                src={session.user.image || ''}
                alt={session.user.name || 'User Image'}
                className="h-9 w-9 rounded-full"
              />
            ) : (
              <SettingsIcon style={{ width: '28px', height: '28px' }} aria-hidden="true" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <div className="px-2 py-1.5 font-medium">{session.user.name}</div>
          <div className="px-2 py-1.5 text-muted-foreground">{session.user.email}</div>
          <DropdownMenuSeparator />
          {!isSettingsPage && (
            <DropdownMenuItem asChild>
              <Link
                href={RoutesConfig.settings}
                className="flex items-center cursor-pointer w-full"
              >
                <SettingsIcon aria-hidden="true" className="h-6 w-6" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            onClick={() => handleLogout()}
            className="cursor-pointer text-calories focus:text-calories"
          >
            <LogOut />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
