'use client';

import { Toaster as Sonner, type ToasterProps } from 'sonner';

import { useTheme } from 'next-themes';

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from 'lucide-react';

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      icons={{
        loading: <Loader2Icon className="size-4 animate-spin" />,
        warning: <TriangleAlertIcon className="size-4" />,
        success: <CircleCheckIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
      }}
      style={
        {
          '--normal-text': 'var(--popover-foreground)',
          '--border-radius': 'var(--radius)',
          '--normal-border': 'var(--border)',
          '--normal-bg': 'var(--popover)',
        } as React.CSSProperties
      }
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      {...props}
    />
  );
};

export { Toaster };
