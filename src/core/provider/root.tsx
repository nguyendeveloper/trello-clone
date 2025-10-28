'use client';

import type { ReactNode } from 'react';

import { ThemeProvider } from '@/core/provider/theme';

interface Props {
  children: ReactNode;
}

export function RootProvider({ children }: Props) {
  return (
    <ThemeProvider disableTransitionOnChange defaultTheme="light" attribute="class" enableSystem>
      {children}
    </ThemeProvider>
  );
}
