'use client';

import {
  ComponentProps,
  createContext,
  CSSProperties,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { cn } from '@/core/lib/utils';

import { useIsMobile } from '@/core/hooks/use-mobile';

import { PanelLeftIcon } from 'lucide-react';

const SIDEBAR_COOKIE_NAME = 'sidebar_state';
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = '16rem';
const SIDEBAR_WIDTH_MOBILE = '18rem';
const SIDEBAR_WIDTH_ICON = '3rem';
const SIDEBAR_KEYBOARD_SHORTCUT = 'b';

type SidebarContextProps = {
  setOpenMobile: (open: boolean) => void;
  setOpen: (open: boolean) => void;
  state: 'collapsed' | 'expanded';
  toggleSidebar: () => void;
  openMobile: boolean;
  isMobile: boolean;
  open: boolean;
};

const SidebarContext = createContext<SidebarContextProps | null>(null);

function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider.');
  }

  return context;
}

function SidebarProvider({
  onOpenChange: setOpenProp,
  defaultOpen = true,
  open: openProp,
  className,
  children,
  style,
  ...props
}: {
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  open?: boolean;
} & ComponentProps<'div'>) {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = useState(false);

  // This is the internal state of the sidebar.
  // We use openProp and setOpenProp for control from outside the component.
  const [_open, _setOpen] = useState(defaultOpen);
  const open = openProp ?? _open;
  const setOpen = useCallback(
    (value: ((value: boolean) => boolean) | boolean) => {
      const openState = typeof value === 'function' ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }

      // This sets the cookie to keep the sidebar state.
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    },
    [setOpenProp, open],
  );

  // Helper to toggle the sidebar.
  const toggleSidebar = useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open);
  }, [isMobile, setOpen, setOpenMobile]);

  // Adds a keyboard shortcut to toggle the sidebar.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSidebar]);

  // We add a state so that we can do data-state="expanded" or "collapsed".
  // This makes it easier to style the sidebar with Tailwind classes.
  const state = open ? 'expanded' : 'collapsed';

  const contextValue = useMemo<SidebarContextProps>(
    () => ({
      setOpenMobile,
      toggleSidebar,
      openMobile,
      isMobile,
      setOpen,
      state,
      open,
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar],
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <div
          style={
            {
              '--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
              '--sidebar-width': SIDEBAR_WIDTH,
              ...style,
            } as CSSProperties
          }
          className={cn(
            'group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full',
            className,
          )}
          data-slot="sidebar-wrapper"
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  );
}

function Sidebar({
  collapsible = 'offcanvas',
  variant = 'sidebar',
  side = 'left',
  className,
  children,
  ...props
}: {
  collapsible?: 'offcanvas' | 'icon' | 'none';
  variant?: 'floating' | 'sidebar' | 'inset';
  side?: 'right' | 'left';
} & ComponentProps<'div'>) {
  const { setOpenMobile, openMobile, isMobile, state } = useSidebar();

  if (collapsible === 'none') {
    return (
      <div
        className={cn(
          'bg-sidebar text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col',
          className,
        )}
        data-slot="sidebar"
        {...props}
      >
        {children}
      </div>
    );
  }

  if (isMobile) {
    return (
      <Sheet onOpenChange={setOpenMobile} open={openMobile} {...props}>
        <SheetContent
          style={
            {
              '--sidebar-width': SIDEBAR_WIDTH_MOBILE,
            } as CSSProperties
          }
          className="bg-sidebar text-sidebar-foreground w-(--sidebar-width) p-0 [&>button]:hidden"
          data-sidebar="sidebar"
          data-slot="sidebar"
          data-mobile="true"
          side={side}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Displays the mobile sidebar.</SheetDescription>
          </SheetHeader>
          <div className="flex h-full w-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div
      className="group peer text-sidebar-foreground hidden md:block"
      data-collapsible={state === 'collapsed' ? collapsible : ''}
      data-variant={variant}
      data-slot="sidebar"
      data-state={state}
      data-side={side}
    >
      {/* This is what handles the sidebar gap on desktop */}
      <div
        className={cn(
          'relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear',
          'group-data-[collapsible=offcanvas]:w-0',
          'group-data-[side=right]:rotate-180',
          variant === 'floating' || variant === 'inset'
            ? 'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]'
            : 'group-data-[collapsible=icon]:w-(--sidebar-width-icon)',
        )}
        data-slot="sidebar-gap"
      />
      <div
        className={cn(
          'fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex',
          side === 'left'
            ? 'left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]'
            : 'right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]',
          // Adjust the padding for floating and inset variants.
          variant === 'floating' || variant === 'inset'
            ? 'p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]'
            : 'group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l',
          className,
        )}
        data-slot="sidebar-container"
        {...props}
      >
        <div
          className="bg-sidebar group-data-[variant=floating]:border-sidebar-border flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm"
          data-slot="sidebar-inner"
          data-sidebar="sidebar"
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function SidebarTrigger({ className, onClick, ...props }: ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      className={cn('size-7', className)}
      data-slot="sidebar-trigger"
      data-sidebar="trigger"
      variant="ghost"
      size="icon"
      {...props}
    >
      <PanelLeftIcon />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
}

function SidebarRail({ className, ...props }: ComponentProps<'button'>) {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      className={cn(
        'hover:after:bg-sidebar-border absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:left-1/2 after:w-0.5 sm:flex',
        'in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize',
        '[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize',
        'hover:group-data-[collapsible=offcanvas]:bg-sidebar group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full',
        '[[data-side=left][data-collapsible=offcanvas]_&]:-right-2',
        '[[data-side=right][data-collapsible=offcanvas]_&]:-left-2',
        className,
      )}
      aria-label="Toggle Sidebar"
      data-slot="sidebar-rail"
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      data-sidebar="rail"
      tabIndex={-1}
      {...props}
    />
  );
}

function SidebarInset({ className, ...props }: ComponentProps<'main'>) {
  return (
    <main
      className={cn(
        'bg-background relative flex w-full flex-1 flex-col',
        'md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2',
        className,
      )}
      data-slot="sidebar-inset"
      {...props}
    />
  );
}

function SidebarInput({ className, ...props }: ComponentProps<typeof Input>) {
  return (
    <Input
      className={cn('bg-background h-8 w-full shadow-none', className)}
      data-slot="sidebar-input"
      data-sidebar="input"
      {...props}
    />
  );
}

function SidebarHeader({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex flex-col gap-2 p-2', className)}
      data-slot="sidebar-header"
      data-sidebar="header"
      {...props}
    />
  );
}

function SidebarFooter({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex flex-col gap-2 p-2', className)}
      data-slot="sidebar-footer"
      data-sidebar="footer"
      {...props}
    />
  );
}

function SidebarSeparator({ className, ...props }: ComponentProps<typeof Separator>) {
  return (
    <Separator
      className={cn('bg-sidebar-border mx-2 w-auto', className)}
      data-slot="sidebar-separator"
      data-sidebar="separator"
      {...props}
    />
  );
}

function SidebarContent({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden',
        className,
      )}
      data-slot="sidebar-content"
      data-sidebar="content"
      {...props}
    />
  );
}

function SidebarGroup({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('relative flex w-full min-w-0 flex-col p-2', className)}
      data-slot="sidebar-group"
      data-sidebar="group"
      {...props}
    />
  );
}

function SidebarGroupLabel({
  asChild = false,
  className,
  ...props
}: { asChild?: boolean } & ComponentProps<'div'>) {
  const Comp = asChild ? Slot : 'div';

  return (
    <Comp
      className={cn(
        'text-sidebar-foreground/70 ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0',
        'group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0',
        className,
      )}
      data-slot="sidebar-group-label"
      data-sidebar="group-label"
      {...props}
    />
  );
}

function SidebarGroupAction({
  asChild = false,
  className,
  ...props
}: ComponentProps<'button'> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      className={cn(
        'text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0',
        // Increases the hit area of the button on mobile.
        'after:absolute after:-inset-2 md:after:hidden',
        'group-data-[collapsible=icon]:hidden',
        className,
      )}
      data-slot="sidebar-group-action"
      data-sidebar="group-action"
      {...props}
    />
  );
}

function SidebarGroupContent({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('w-full text-sm', className)}
      data-slot="sidebar-group-content"
      data-sidebar="group-content"
      {...props}
    />
  );
}

function SidebarMenu({ className, ...props }: ComponentProps<'ul'>) {
  return (
    <ul
      className={cn('flex w-full min-w-0 flex-col gap-1', className)}
      data-slot="sidebar-menu"
      data-sidebar="menu"
      {...props}
    />
  );
}

function SidebarMenuItem({ className, ...props }: ComponentProps<'li'>) {
  return (
    <li
      className={cn('group/menu-item relative', className)}
      data-slot="sidebar-menu-item"
      data-sidebar="menu-item"
      {...props}
    />
  );
}

const sidebarMenuButtonVariants = cva(
  'peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0',
  {
    variants: {
      variant: {
        outline:
          'bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]',
        default: 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
      },
      size: {
        lg: 'h-12 text-sm group-data-[collapsible=icon]:p-0!',
        default: 'h-8 text-sm',
        sm: 'h-7 text-xs',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function SidebarMenuButton({
  variant = 'default',
  isActive = false,
  size = 'default',
  asChild = false,
  className,
  tooltip,
  ...props
}: {
  tooltip?: ComponentProps<typeof TooltipContent> | string;
  isActive?: boolean;
  asChild?: boolean;
} & VariantProps<typeof sidebarMenuButtonVariants> &
  ComponentProps<'button'>) {
  const Comp = asChild ? Slot : 'button';
  const { isMobile, state } = useSidebar();

  const button = (
    <Comp
      className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
      data-slot="sidebar-menu-button"
      data-sidebar="menu-button"
      data-active={isActive}
      data-size={size}
      {...props}
    />
  );

  if (!tooltip) {
    return button;
  }

  if (typeof tooltip === 'string') {
    tooltip = {
      children: tooltip,
    };
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent
        hidden={state !== 'collapsed' || isMobile}
        align="center"
        side="right"
        {...tooltip}
      />
    </Tooltip>
  );
}

function SidebarMenuAction({
  showOnHover = false,
  asChild = false,
  className,
  ...props
}: {
  showOnHover?: boolean;
  asChild?: boolean;
} & ComponentProps<'button'>) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      className={cn(
        'text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground peer-hover/menu-button:text-sidebar-accent-foreground absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0',
        // Increases the hit area of the button on mobile.
        'after:absolute after:-inset-2 md:after:hidden',
        'peer-data-[size=sm]/menu-button:top-1',
        'peer-data-[size=default]/menu-button:top-1.5',
        'peer-data-[size=lg]/menu-button:top-2.5',
        'group-data-[collapsible=icon]:hidden',
        showOnHover &&
          'peer-data-[active=true]/menu-button:text-sidebar-accent-foreground group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 md:opacity-0',
        className,
      )}
      data-slot="sidebar-menu-action"
      data-sidebar="menu-action"
      {...props}
    />
  );
}

function SidebarMenuBadge({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'text-sidebar-foreground pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums select-none',
        'peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground',
        'peer-data-[size=sm]/menu-button:top-1',
        'peer-data-[size=default]/menu-button:top-1.5',
        'peer-data-[size=lg]/menu-button:top-2.5',
        'group-data-[collapsible=icon]:hidden',
        className,
      )}
      data-slot="sidebar-menu-badge"
      data-sidebar="menu-badge"
      {...props}
    />
  );
}

function SidebarMenuSkeleton({
  showIcon = false,
  className,
  ...props
}: {
  showIcon?: boolean;
} & ComponentProps<'div'>) {
  // Random width between 50 to 90%.
  const width = useState(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`;
  });

  return (
    <div
      className={cn('flex h-8 items-center gap-2 rounded-md px-2', className)}
      data-slot="sidebar-menu-skeleton"
      data-sidebar="menu-skeleton"
      {...props}
    >
      {showIcon && <Skeleton data-sidebar="menu-skeleton-icon" className="size-4 rounded-md" />}
      <Skeleton
        style={
          {
            '--skeleton-width': width,
          } as CSSProperties
        }
        className="h-4 max-w-(--skeleton-width) flex-1"
        data-sidebar="menu-skeleton-text"
      />
    </div>
  );
}

function SidebarMenuSub({ className, ...props }: ComponentProps<'ul'>) {
  return (
    <ul
      className={cn(
        'border-sidebar-border mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l px-2.5 py-0.5',
        'group-data-[collapsible=icon]:hidden',
        className,
      )}
      data-slot="sidebar-menu-sub"
      data-sidebar="menu-sub"
      {...props}
    />
  );
}

function SidebarMenuSubItem({ className, ...props }: ComponentProps<'li'>) {
  return (
    <li
      className={cn('group/menu-sub-item relative', className)}
      data-slot="sidebar-menu-sub-item"
      data-sidebar="menu-sub-item"
      {...props}
    />
  );
}

function SidebarMenuSubButton({
  isActive = false,
  asChild = false,
  size = 'md',
  className,
  ...props
}: {
  isActive?: boolean;
  size?: 'md' | 'sm';
  asChild?: boolean;
} & ComponentProps<'a'>) {
  const Comp = asChild ? Slot : 'a';

  return (
    <Comp
      className={cn(
        'text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground [&>svg]:text-sidebar-accent-foreground flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 outline-hidden focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0',
        'data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground',
        size === 'sm' && 'text-xs',
        size === 'md' && 'text-sm',
        'group-data-[collapsible=icon]:hidden',
        className,
      )}
      data-slot="sidebar-menu-sub-button"
      data-sidebar="menu-sub-button"
      data-active={isActive}
      data-size={size}
      {...props}
    />
  );
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
};
