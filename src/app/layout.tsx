import type { Metadata } from 'next';

import { ReactNode } from 'react';

import { Geist, Geist_Mono } from 'next/font/google';

import { RootProvider } from '@/core/provider/root';
import { PUBLIC_ENV } from '@/core/config/env';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    template: `%s | ${PUBLIC_ENV.APP_NAME}`,
    default: PUBLIC_ENV.APP_NAME,
  },
};

interface Props {
  children: ReactNode;
}

export default function RootLayout({ children }: Readonly<Props>) {
  return (
    <html suppressHydrationWarning lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
