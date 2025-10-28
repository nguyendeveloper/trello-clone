import Link from 'next/link';

import { Button } from '@/components/ui/button';

import { Logo } from '@/components/logo';

import { PUBLIC_ENV } from '@/core/config/env';

export function Navbar() {
  return (
    <div className="fixed top-0 w-full h-14 px-4 border-b shadow-sm bg-white flex items-center">
      <div className="md:max-w-(--breakpoint-2xl) mx-auto flex items-center w-full justify-between">
        <Logo />

        <div className="space-x-4 md:block md:w-auto flex items-center justify-between w-full">
          <Button variant={'outline'} size={'sm'} asChild>
            <Link href={'/sign-in'}>Login</Link>
          </Button>
          <Button size={'sm'} asChild>
            <Link href="/sign-up">Get {PUBLIC_ENV.APP_NAME} for free</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
