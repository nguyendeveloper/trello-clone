'use client';

import * as React from 'react';

import * as SeparatorPrimitive from '@radix-ui/react-separator';

import { cn } from '@/core/lib/utils';

function Separator({
  orientation = 'horizontal',
  decorative = true,
  className,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      className={cn(
        'bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px',
        className,
      )}
      orientation={orientation}
      decorative={decorative}
      data-slot="separator"
      {...props}
    />
  );
}

export { Separator };
