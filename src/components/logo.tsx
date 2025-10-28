import localFont from 'next/font/local';
import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/core/lib/utils';

import { PUBLIC_ENV } from '@/core/config/env';

const headingFont = localFont({
  src: '../../public/fonts/font.woff2',
});

export function Logo() {
  return (
    <Link href={'/'}>
      <div className="hover:opacity-75 transition items-center hidden md:flex gap-x-2">
        <Image alt={PUBLIC_ENV.APP_NAME} src={'/logo.svg'} height={30} width={30} />

        <p className={cn('text-lg text-neutral-700 pb-1', headingFont.className)}>
          {PUBLIC_ENV.APP_NAME}
        </p>
      </div>
    </Link>
  );
}
